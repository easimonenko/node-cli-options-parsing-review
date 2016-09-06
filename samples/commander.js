const commander = require('commander')

/**
 * @param {string} values
 * @returns {Array<number>}
 */
function toArray(values) {
  return values.split(',').map((v) => parseInt(v))
}

commander
  .version('0.2.0')
  .option('-a', 'option a')
  .option('-b', 'option b')
  .option('--camel-case-option', 'camel case option')
  .option('-s, --source <path>', 'source file')
  .option('-l, --list [items]', 'value list', toArray, [])
  .option('--size [size]', 'size', /^(large|medium|small)$/i)

commander
  .command('search <first> [other...]', 'search with query')
  .alias('s')

commander.on('--help', () => {
  console.log('  Examples:')
  console.log('')
  console.log('    node commander.js')
  console.log('    node commander.js --help')
  console.log('    node commander.js -h')
  console.log('    node commander.js --version')
  console.log('    node commander.js -V')
  console.log('    node commander.js -s')
  console.log('    node commander.js -s abc')
  console.log('    node commander.js --camel-case-option')
  console.log('    node commander.js --list 1,2,3')
  console.log('    node commander.js -l 1,2,3')
  console.log('    node commander.js --size=large')
  console.log('    node commander.js --size large')
  console.log('    node commander.js search a b c')
  console.log('    node commander.js -ab')
})

commander.parse(process.argv)

if (commander.source) {
  console.log('source: ', commander.source)
}

if (commander.camelCaseOption) {
  console.log('camelCaseOption: ', commander.camelCaseOption)
}

if (commander.list) {
  console.log('list: ', commander.list)
}

if (commander.size) {
  console.log('size: ', commander.size)
}

if (commander.search) {
  console.log('query: ', commander.search)
}

if (commander.a) {
  console.log('a: ', commander.a)
}

if (commander.b) {
  console.log('b: ', commander.b)
}

if (commander.c) {
  console.log('c: ', commander.c)
}