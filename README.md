# ДомГость — Сайт бронирования жилья

Демонстрационный сайт бронирования жилья. Аналог forento.ru с оригинальным дизайном (Navy + Coral, шрифты Manrope + Unbounded).

## Технологии

- Чистый HTML + CSS + Vanilla JS
- Без фреймворков и сборки
- Данные: mock-массив в `assets/js/data.js`
- Состояние (избранное, заявки): `localStorage`

## Запуск локально

Просто откройте `index.html` двойным кликом в браузере — сайт работает без сервера.

> Для корректной работы в Chrome лучше запускать через локальный сервер:
> ```
> npx serve .
> ```
> или расширение VS Code «Live Server».

## Деплой на Netlify

### Способ 1 — Drag & Drop (быстро)

1. Откройте [netlify.com/drop](https://app.netlify.com/drop)
2. Перетащите папку `forento/` в окно браузера
3. Сайт опубликован! Скопируйте ссылку.

### Способ 2 — через Git

1. Создайте репозиторий на GitHub и загрузите папку
2. Зайдите в [app.netlify.com](https://app.netlify.com)
3. «Add new site» → «Import an existing project» → выберите репозиторий
4. Build command: *(оставить пустым)*
5. Publish directory: `.` (точка — корень)
6. Нажмите «Deploy»

## Страницы

| Файл | Описание |
|---|---|
| `index.html` | Главная: поиск, категории, топ-объекты, отзывы |
| `catalog.html` | Каталог с фильтрами и сортировкой |
| `property.html` | Страница объекта с галереей и формой бронирования |
| `favorites.html` | Избранные объекты (из localStorage) |
| `owners.html` | Форма для хозяев жилья |
| `about.html` | О сервисе, FAQ, контакты |
| `404.html` | Страница ошибки |

## Структура файлов

```
forento/
├── index.html
├── catalog.html
├── property.html
├── favorites.html
├── owners.html
├── about.html
├── 404.html
├── netlify.toml
├── robots.txt
└── assets/
    ├── css/styles.css
    └── js/
        ├── data.js    — mock-данные (18 объектов)
        ├── ui.js      — шапка, футер, избранное, карточки
        ├── home.js    — главная страница
        ├── catalog.js — фильтры и сортировка
        ├── property.js — страница объекта
        ├── favorites.js — избранное
        └── owners.js  — форма хозяина
```
