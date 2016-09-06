# node-cli-options-parsing-review

Review of modules for parsing command line options in Node.js.

First install packages:

``` sh
npm install
```

## Generate Table

To generate table, use the command:

``` sh
cd table
node table.js > table.html
```

## Sample for *commander*

Try:

``` sh
cd samples
node commander.js --help
```

## Sample for *minimist*

Try:

``` sh
cd samples
node mininist.js -abc --help --size=large -- 1 2 3
node mininist-with-settings.js -abc --help --size=large -- 1 2 3
```
