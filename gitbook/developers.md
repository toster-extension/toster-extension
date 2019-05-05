{% include "./_header.md" %}

# Разработка

**Получить JWT ключи для подписи расширения для Firefox можно на [этой](https://addons.mozilla.org/en-US/developers/addon/api/key/) странице**

```shell
$ git clone git@github.com:toster-extension/toster-extension.git
$ cd toster-extension
$ cp .env.dist .env
$ yarn
$ yarn tags
$ yarn build
```

**Спарсить все теги с Тостера (используется [toster-tags-parser](https://github.com/toster-extension/toster-tags-parser))**

```shell
$ yarn tags
# Можно указать количество страниц для парсинга. По-умолчанию 62 страницы.
$ yarn tags -p[--pages] 10
# Обязательный аргумент - путь для сохранения тегов.
$ yarn tags -o[--output] assets/tags.json
```

**Собрать проект**

```shell
$ yarn build
```

**Создать подписанный \*.xpi для Firefox**

```shell
$ yarn firefox:sign
```

**Запустить компилятор в режиме разработки**

```shell
$ yarn watch
```

**Проверить на ошибки TypeScript**

```shell
$ yarn lint
```

**Проверить на ошибки TypeScript и попробовать их исправить автоматически**

```shell
$ yarn lint:fix
```

**Проверить на ошибки с помощью web-ext**

```shell
$ yarn lint:ext
```

**Проверить код на копипаст**

```shell
$ yarn cpd
```

**Запустить тесты**

```shell
$ yarn test
```

**Запустить тесты в режиме разработки**

```shell
$ yarn test:watch
```

**Удалить скомпилированные файлы**

```shell
$ yarn clean
```

**Установить зависимости для сборки документации**

```shell
$ yarn docs:install
```

**Собрать документацию с помощью GitBook**

```shell
$ yarn docs:build
```

**Запустить GitBook в режиме разработки. Страница доступна по адресу http://localhost:4000**

```shell
$ yarn docs:watch
```
