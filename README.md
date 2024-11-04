# node-cli-options-parsing-review

Review of modules for parsing command line options in Node.js.

* [Обзор пакетов Node.js для разбора опций командной строки](./article.ru.md)

For generating of table or for trying of samples install packages first:

``` sh
npm install
```

or

``` sh
yarn install
```

## Generating of Table

To generating of table in HTML use the command:

``` sh
cd table
node table.js > table.html
```

To generating of table in Markdown format add option `--markdown` or `-m`:

``` sh
cd table
node table.js --markdown > table.md
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

## Sample for *yargs*

Try:

``` sh
cd samples
node yargs.js --version
node yargs.js -h
node yargs.js --size=middle
node yargs.js --list 1 2 3 --size=large
```

## License

The sources of this project distributed by Expat-like license (see file [LICENSE](./LICENSE)). The text of paper in file [article.ru.md](./article.ru.md) distributed by CC-BY-ND 4.0 license. The sources of samples in folder [samples](./samples) in public domain.

***

(c) 2016, 2019, 2024 Evgeny Simonenko <easimonenko@gmail.com>
