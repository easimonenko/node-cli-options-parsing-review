# Обзор пакетов Node.js для разбора опций командной строки

Node.js, как и другие среды разработки, предоставляет базовые средства работы с
опциями командной строки. В нашем случае это массив `process.argv`. Но обычно,
кроме простейших случаев типа A + B, обрабатывать опции командной строки
вручную очень неудобно. Для этого есть несколько популярных пакетов. Я написал
небольшую программу, которая построила сводную таблицу по этим пакетам,
выбрал из них три самых популярных и рассмотрел их поближе.

## Сводная таблица

Ниже представлена сводная таблица из самых популярных пакетов для обработки
опций командной строки.

![Сводная таблица](./table.png)

Так как я вынужден был разместить здесь эту таблицу как изображение, то ниже
привожу список соответствующих ссылок:

1. [commander](https://www.npmjs.org/package/commander) | [tj/commander.js](https://github.com/tj/commander.js)
2. [minimist](https://www.npmjs.org/package/minimist) | [substack/minimist](https://github.com/substack/minimist)
3. [yargs](https://www.npmjs.org/package/yargs) | [yargs/yargs](https://github.com/yargs/yargs)
4. [optimist](https://www.npmjs.org/package/optimist) | [substack/node-optimist](https://github.com/substack/node-optimist)
5. [meow](https://www.npmjs.org/package/meow) | [sindresorhus/meow](https://github.com/sindresorhus/meow)
6. [nopt](https://www.npmjs.org/package/nopt) | [npm/nopt](https://github.com/npm/nopt)
7. [nomnom](https://www.npmjs.org/package/nomnom) | [harthur/nomnom](https://github.com/harthur/nomnom)
8. [stdio](https://www.npmjs.org/package/stdio) | [sgmonda/stdio](https://github.com/sgmonda/stdio)
9. [command-line-args](https://www.npmjs.org/package/command-line-args) | [75lb/command-line-args](https://github.com/75lb/command-line-args)

Эта таблица была сгенерирована небольшой программой на JavaScript. Исходные
тексты этого обзора, включая и эту программу, расположены в репозитории на
[GitHub](https://github.com/easimonenko/node-cli-options-parsing-review).
Так как через некоторое время эти данные скорее всего устареют, вы можете,
загрузив себе эти исходники, перегенерировать эту сводную таблицу, а также
пополнить её новыми данными просто добавив соответствующие строки в файл со
списком пакетов.

Пакеты в таблице упорядочены по рейтингу, который считается на основе
количества звёзд на NPM и GitHub по формуле:

```
npmStars * k + githubStars
```

Коэффициент `k` понадобился, так как звёзды на NPM выглядят "весомее" звёзд на
GitHub. Сам коэффициент считается очень просто: суммируем общее количество
звёзд на NPM и на GitHub, затем делим число звёзд на GitHub на число звёзд на
NPM, округляем получившееся число, это и есть наш коэффициент `k`.

Из получившейся таблицы хорошо видно, что главный фаворит, это пакет
*commander*. Далее идут с близким рейтингом пакеты *minimist* и *yargs*.
Хороший рейтинг имеет также пакет *optimist*, но автором он объявлен
устаревшим, а на его место он рекомендует им же написанный пакет *minimist*.
В качестве преемника *optimist* также позиционируется пакет *yargs*. Авторы
объявленного устаревшим *nomnom* рекомендуют *commander*.

Таким образом в первую очередь нужно рассмотреть пакеты *commander*, *minimist*
и *yargs*. Вероятно есть смысл также обратить внимание на пакеты *meow* и
*nopt*, но не в этот раз.

## commander

...

---

(c) 2016 Евгений А. Симоненко <easimonenko@mail.ru>
