const commander = require('commander')

commander
  .version('0.2.0')
  .option('-s, --source <path>', 'source file')
  .option('--camel-case-option', 'camel case option')
  .option('-l, --list [items]', 'value list', toArray, [])
  .option('--size [size]', 'size', /^(large|medium|small)$/i)

commander
  .command('search <first> [other...]', 'search with query')
  .alias('s')

commander.parse(process.argv)

/**
 * @param {string} values
 * @returns {Array<number>}
 */
function toArray(values) {
  return values.split(',').map((v) => parseInt(v))
}

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