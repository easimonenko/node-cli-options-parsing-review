const commander = require('commander')

commander.allowUnknownOption()
commander.parse(process.argv)
console.dir(commander)
