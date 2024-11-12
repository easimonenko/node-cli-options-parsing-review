const commander = require('commander')

/**
 * @param {string} values
 * @returns {Array<number>}
 */
function toArray(values) {
  return values.split(',').map((v) => parseInt(v))
}

const cmd = new commander.Command()

cmd
  .name("commander")
  .description("Commander sample.")
  .version('0.2.0')
  .option('-a', 'option a')
  .option('-b', 'option b')
  .option('--camel-case-option', 'camel case option')
  .option('-s, --source <path>', 'source file')
  .option('-l, --list [items...]', 'value list', toArray, [])
  .option('-r, --array [items...]', 'value list')
  .option('--size [size]', 'size', /^(large|medium|small)$/i)
  .command('search <first> [other...]', 'search with query')
  .alias('s')

cmd.on('--help', () => {
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

cmd.parse(process.argv)

console.log(cmd.opts())
