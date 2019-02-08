'use strict'

/**
 * table/table.js
 * License: MIT
 * (c) 2016, 2019, Evgeny Simonenko <easimonenko@gmail.com>
 */

const commander = require('commander')
const fs = require('fs')
const handlebars = require('handlebars')
const http = require('http')
const https = require('https')

const packageNames = require('./package-list.json')

commander.option('--no-github', 'Do not usage of GitHub.', false)
  .option('--no-npm', 'Do not usage of NPM.', false)
  .option('--markdown', 'Generating of markdown table.', false)
  .alias('-m')
  .parse(process.argv)

const USE_GITHUB = commander['github']
const USE_NPM = commander['npm']
const GENERATING_MARKDOWN = commander['markdown']

const packages = []

let syncCounter = ((USE_GITHUB ? 1 : 0) + (USE_NPM ? 1 : 0)) * packageNames.length

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

    if (USE_NPM) {
      const chunks = []
      const req = http.request({
          hostname: 'registry.npmjs.org',
          port: 80,
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
          console.error(e.message())
        }
      )

      req.end()
    }

    if (USE_GITHUB) {
      const chunks = []
      const req = https.request({
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
              const data = JSON.parse(chunks.join(''))
              packageInfo['githubStars'] = data['stargazers_count']

              const commitsChunks = []
              const commitsReq = https.request({
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
    }

    packages.push(packageInfo)
  }
)

function makeHtml() {
  if (syncCounter == 0) {
    const [npmStarsSum, githubStarsSum] = packages.reduce(
      (previousValue, currentValue, currentIndex, array) => {
        return [previousValue[0] + currentValue['npmStars'], previousValue[1] + currentValue['githubStars']]
      },
      [0, 0])
    const ratingK = Math.floor(githubStarsSum / npmStarsSum)
    for (let i = 0; i < packages.length; i++) {
      packages[i]['rating'] = packages[i]['npmStars'] * ratingK + packages[i]['githubStars']
    }
    packages.sort((a, b) => {
      return b['rating'] - a['rating']
    })
    packages.forEach((p, i) => {
      p['number'] = i + 1
    })

    if (GENERATING_MARKDOWN) {
      const tTable = fs.readFileSync('./templates/table.md')
      process.stdout.write(handlebars.compile(tTable.toString())({
        packages: packages
      }))
    } else {
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
