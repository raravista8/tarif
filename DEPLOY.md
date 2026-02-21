# Инструкция по деплою на Render

## Быстрый старт

### 1. Подготовка репозитория

```bash
# Создайте новый репозиторий на GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tarify-online.git
git push -u origin main
```

### 2. Создание сервиса на Render

#### Вариант A: Через Render Dashboard (рекомендуется)

1. Перейдите на [dashboard.render.com](https://dashboard.render.com)
2. Нажмите **"New +"** → **"Static Site"**
3. Подключите свой GitHub репозиторий
4. Настройте:
   - **Name**: `tarify-online` (или любое другое)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Нажмите **"Create Static Site"**

#### Вариант B: Через render.yaml (Blueprint)

1. Убедитесь, что файл `render.yaml` есть в корне репозитория
2. На Render нажмите **"New +"** → **"Blueprint"**
3. Выберите репозиторий
4. Render автоматически создаст сервис по конфигурации

### 3. Настройка переменных окружения (опционально)

В разделе **Environment** добавьте:

```
NODE_VERSION=20.11.0
```

### 4. Настройка кастомного домена (опционально)

1. В настройках сервиса перейдите в **Settings** → **Custom Domain**
2. Добавьте свой домен (например, `tarify.online`)
3. Следуйте инструкциям по настройке DNS

---

## Подробная инструкция

### Требования

- Node.js 20.x или выше
- npm 10.x или выше
- Git

### Локальная сборка (проверка перед деплоем)

```bash
# Установка зависимостей
npm install

# Сборка для продакшена
npm run build

# Проверка сборки
ls -la dist/
```

### Структура проекта

```
tarify-online/
├── dist/                 # Собранное приложение (генерируется)
├── src/                  # Исходный код
│   ├── components/       # React компоненты
│   ├── data/            # Данные (тарифы, операторы)
│   ├── sections/        # Секции страницы
│   └── ...
├── index.html           # Точка входа
├── vite.config.ts       # Конфиг Vite
├── package.json         # Зависимости
├── render.yaml          # Конфиг Render
└── DEPLOY.md           # Эта инструкция
```

### Важные настройки

#### 1. SPA Routing

Проект использует React Router. На Render настроен rewrite rule:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

#### 2. Кэширование

- Статические файлы (JS, CSS) — кэш 1 год
- `index.html` — без кэша (для корректных обновлений)

#### 3. Сжатие

Render автоматически включает gzip/brotli сжатие.

---

## Устранение неполадок

### Ошибка: "Build failed"

```bash
# Проверьте локально
npm run build

# Очистите кэш на Render
# Dashboard → Settings → Clear Build Cache & Deploy
```

### Ошибка: "404 на всех страницах кроме главной"

Проверьте настройку rewrite rules в `render.yaml` или вручную в Dashboard:
- Source: `/*`
- Destination: `/index.html`

### Ошибка: "Старые данные после деплоя"

Очистите кэш браузера или добавьте query-параметр:
```
https://your-site.onrender.com?v=2
```

---

## Обновление сайта

### Автоматический деплой

При каждом push в `main` ветку Render автоматически пересобирает и деплоит сайт.

### Ручной деплой

1. Dashboard → ваш сервис
2. Нажмите **"Manual Deploy"** → **"Deploy latest commit"**

---

## Дополнительные настройки

### Аналитика

Добавьте в `index.html` перед `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### SEO

Для лучшей индексации добавьте:
```html
<meta name="description" content="Сравнение тарифов мобильной связи всех операторов России">
<meta name="keywords" content="тарифы, мобильная связь, мтс, билайн, мегафон">
```

---

## Полезные ссылки

- [Render Docs - Static Sites](https://render.com/docs/static-sites)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)

---

## Контакты

Если возникли проблемы с деплоем, проверьте:
1. Логи сборки в Render Dashboard
2. Локальную сборку: `npm run build`
3. Файл `render.yaml` на корректность
