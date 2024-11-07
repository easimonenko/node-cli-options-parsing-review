'use strict'

/**
 * table/table-github.js
 * License: MIT
 * (c) 2016, 2019, 2024, Evgeny Simonenko <easimonenko@gmail.com>
 */

const commander = require('commander')
const fs = require('fs')
const handlebars = require('handlebars')
const https = require('https')

const packageNames = require('./package-list.json')

commander.option('--html', 'Generating table in HTML format (instead of Markdown).', false)
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
        hostname: 'api.github.com',
        port: 443,
        path: '/repos/' + m['github-name'],
        method: 'GET',
        headers: {
          'User-Agent': 'Node-CLI-Options-Parsing-Review'
        }
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
            if (res.statusCode == 200) {
              const data = JSON.parse(chunks.join(''))

              if (data["status"] != "404") {
                packageInfo['githubStars'] = data['stargazers_count']

                const commitsChunks = []
                const commitsReq = https.request(
                  {
                    hostname: 'api.github.com',
                    port: 443,
                    path: '/repos/' + m['github-name'] + '/commits',
                    method: 'GET',
                    headers: {
                      'User-Agent': 'Node-CLI-Options-Parsing-Review'
                    }
                  },
                  (commitsRes) => {
                    commitsRes.on(
                      'data',
                      (commitsData) => {
                        commitsChunks.push(commitsData)
                      }
                    )

                    commitsRes.on(
                      'end',
                      () => {
                        const commitsData = JSON.parse(commitsChunks.join(''))
                        console.error(m['github-name'] + ': GitHub Ok')
                        packageInfo['lastCommit'] = makeDate(new Date(commitsData[0]['commit']['author']['date']))

                        syncCounter -= 1
                      }
                    )
                  }
                )

                commitsReq.on(
                  'error',
                  (e) => {
                    console.error(e.message)
                  }
                )

                commitsReq.end()
              } else {
                console.error(m['github-name'] + ': GitHub 404')
                syncCounter -= 1
              }
            } else {
              packageInfo['githubStars'] = -1
              console.error(m['github-name'] + ': GitHub ' + res.statusCode)
              syncCounter -= 1
            }
          }
        )
      }
    )

    req.on(
      'error',
      (e) => {
        console.error(e.message())
      }
    )

    req.end()

    packages.push(packageInfo)
  }
)

function makeHtml() {
  if (syncCounter == 0) {
    for (let i = 0; i < packages.length; i++) {
      packages[i]['rating'] = packages[i]['githubStars']
    }
    
    packages.sort((a, b) => {
      return b['rating'] - a['rating']
    })
    
    packages.forEach((p, i) => {
      p['number'] = i + 1
    })

    if (!GENERATING_HTML) { // Markdown
      const tTable = fs.readFileSync('./templates/table-github.md')
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
    setTimeout(makeHtml, 500)
  }
}

makeHtml()
