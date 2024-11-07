'use strict'

/**
 * table/table-npm.js
 * License: MIT
 * (c) 2016, 2019, 2024, Evgeny Simonenko <easimonenko@gmail.com>
 */

const commander = require('commander')
const fs = require('fs')
const handlebars = require('handlebars')
const https = require('https')

const packageNames = require('./package-list.json')

commander
  .option('--html', 'Generating table in HTML format (instead of Markdown).', false)
  .parse(process.argv)

const GENERATING_HTML = commander['html']

const packages = []

let syncCounter = packageNames.length

function makeDate(date) {
  const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
  const day = (date.getDate() < 10 ? '0' : '') + date.getDate()
  return date.getFullYear() + '-' + month + '-' + day
}

packageNames.forEach(
  (m) => {
    let packageInfo = {
      'npmName': m['npm-name'],
      'githubName': m['github-name'],
      'deprecated': m['deprecated']
    }


    const chunks = []
    const req = https.request(
      {
        hostname: 'registry.npmjs.org',
        port: 443,
        path: '/' + m['npm-name'],
        method: 'GET'
      },
      (res) => {
        res.on(
          'data',
          (data) => {
            chunks.push(data)
          }
        )

        res.on(
          'end',
          () => {
            const data = JSON.parse(chunks.join(''))
            console.error(m['npm-name'] + ': NPM Ok')
            let stars = 0
            for (let key in data['users']) {
              if (data['users'][key]) {
                stars += 1
              }
            }
            packageInfo['npmStars'] = stars
            packageInfo['lastUpdate'] = makeDate(new Date(data['time']['modified']))
            packageInfo['created'] = makeDate(new Date(data['time']['created']))
            const lastVersion = data['dist-tags']['latest']
            packageInfo['lastVersion'] = lastVersion
            let dependencies = 0
            for (let key in data['versions'][lastVersion]['dependencies']) {
              dependencies += 1
            }
            packageInfo['dependencies'] = dependencies

            syncCounter -= 1
          }
        )
      }
    )

    req.on(
      'error',
      (e) => {
        console.error(e)
      }
    )

    req.end()

    packages.push(packageInfo)
  }
)

function makeTable() {
  if (syncCounter == 0) {
    const npmStarsSum = packages.reduce(
      (previousValue, currentValue, currentIndex, array) => {
        return previousValue[0] + currentValue['npmStars']
      }, 0)

    for (let i = 0; i < packages.length; i++) {
      packages[i]['rating'] = packages[i]['npmStars']
    }

    packages.sort((a, b) => {
      return b['rating'] - a['rating']
    })
    
    packages.forEach((p, i) => {
      p['number'] = i + 1
    })

    if (!GENERATING_HTML) { // Markdown
      const tTable = fs.readFileSync('./templates/table-npm.md')
      process.stdout.write(handlebars.compile(tTable.toString())({
        packages: packages
      }))
    } else { // HTML
      const tHtml = fs.readFileSync('./templates/html.handlebars')
      const ctHtml = handlebars.compile(tHtml.toString())
      const tTable = fs.readFileSync('./templates/table.handlebars')
      const ctTable = handlebars.compile(tTable.toString())
      process.stdout.write(ctHtml({
        table: ctTable({
          packages: packages
        })
      }))
    }
  } else {
    setTimeout(makeTable, 500)
  }
}

makeTable()
