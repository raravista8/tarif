# Тарифы.онлайн — Полное руководство по развёртыванию

## Структура проекта

```
tarify-online/
├── frontend/          # React + Vite + TypeScript (SPA)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CookieConsent.tsx   # Всплывающее согласие на cookie
│   │   │   └── FeedbackWidget.tsx  # Опросник «Было полезно?»
│   │   ├── lib/
│   │   │   ├── api.ts             # API-клиент для бэкенда
│   │   │   ├── scoring.ts         # Система скоринга тарифов
│   │   │   └── utils.ts
│   │   ├── sections/
│   │   │   ├── AdminSection.tsx    # Админ-панель с аналитикой
│   │   │   ├── FooterSection.tsx   # Подвал с юридической информацией
│   │   │   └── ...
│   │   └── App.tsx                # Главный компонент
│   ├── index.html                 # SEO + Яндекс.Метрика + Schema.org
│   └── vite.config.ts
├── backend/           # Express + SQLite
│   ├── server.js      # API-сервер + раздача статики
│   └── package.json
├── render.yaml        # Конфигурация Render
└── README.md
```

## Что реализовано

### 1. Бэкенд (Express + SQLite)
- **API опросника** (`POST /api/feedback`) — сохраняет ответы «Да / Частично / Нет»
- **API cookie-согласия** (`POST /api/cookie-consent`) — логирует выбор пользователя
- **API просмотров** (`POST /api/pageview`) — отслеживает посещения страниц
- **API поиска** (`POST /api/search-log`) — логирует параметры поиска
- **Админ-авторизация** (`POST /api/admin/login`) — по паролю
- **Админ-статистика** (`GET /api/admin/stats`) — полная аналитика
- Rate limiting, CORS, Helmet, compression
- Раздача статики фронтенда в production

### 2. Cookie-согласие
- Всплывающий баннер при первом визите
- 3 варианта: «Принять все», «Только необходимые»
- Яндекс.Метрика включается только при согласии
- Выбор сохраняется в localStorage и отправляется на сервер

### 3. Опросник «Было полезно?»
- Появляется через 30 сек или при скролле до 60% страницы
- 3 варианта: 👍 Да / 🤔 Частично / 👎 Нет
- Результаты сохраняются в SQLite
- Аналитика доступна в админ-панели

### 4. Админ-панель (/admin)
- Авторизация по паролю
- Дашборд: отзывы, просмотры, поиски, средний бюджет
- Диаграмма распределения ответов
- Последние отзывы
- Популярные профили поиска
- Статистика cookie-согласия

### 5. SEO для Яндекса и Алисы
- `<title>` и `<meta description>` с названиями всех операторов
- `<meta keywords>` со всеми ключевыми словами
- **Schema.org JSON-LD:**
  - `WebApplication` — описание сервиса
  - `FAQPage` — 5 вопросов-ответов (Алиса использует их для ответов)
  - `BreadcrumbList` — навигационная цепочка
- `<noscript>` блок с SEO-текстом для индексации SPA
- Canonical URL
- Open Graph метатеги

### 6. Яндекс.Метрика
- Код счётчика в `<head>` (замените `102345678` на ваш ID)
- Инициализация только при согласии на cookie
- Отправка `hit` при навигации между страницами

### 7. Юридическая корректность (подвал)
- Нет слов «лучший», «самый выгодный» — используются «подходящий», «соответствует профилю»
- Блок «О методике сравнения» со ссылкой на ФЗ о защите прав потребителей
- Отказ от ответственности
- Юридическое примечание (рейтинг формируется автоматически)
- Перечень правовых оснований (ФЗ 2300-1, 126-ФЗ, 38-ФЗ, 152-ФЗ)
- Контактная информация
- Ссылки на Политику конфиденциальности и Пользовательское соглашение

### 8. Упрощённый подбор тарифов
- 3 слайдера: бюджет, интернет, минуты
- Дополнительные опции скрыты в раскрываемый блок на мобильных
- Без сложных профилей — простой и понятный интерфейс

---

## Развёртывание на Render

### Шаг 1: Создайте Git-репозиторий

```bash
cd tarify-online
git init
git add .
git commit -m "Initial commit"
```

### Шаг 2: Загрузите на GitHub

```bash
gh repo create tarify-online --private --push
# или
git remote add origin https://github.com/YOUR_USER/tarify-online.git
git push -u origin main
```

### Шаг 3: Создайте сервис на Render

1. Откройте https://dashboard.render.com
2. Нажмите **New → Web Service**
3. Подключите ваш GitHub репозиторий
4. Настройки:
   - **Name:** `tarify-online`
   - **Region:** Frankfurt (EU)
   - **Runtime:** Node
   - **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command:** `cd backend && node server.js`
5. **Environment Variables:**
   - `ADMIN_PASSWORD` = ваш_пароль_для_админки
   - `NODE_ENV` = production
6. **Disk** (для SQLite):
   - Нажмите **Add Disk**
   - Name: `tarify-data`
   - Mount Path: `/opt/render/project/src/backend/data`
   - Size: 1 GB

### Шаг 4: Настройте Яндекс.Метрику

1. Зарегистрируйте счётчик на https://metrika.yandex.ru
2. Замените `102345678` на ваш реальный ID счётчика в файле `frontend/index.html`
3. Добавьте домен сайта в настройках счётчика

### Шаг 5: Настройте домен (опционально)

Если у вас есть домен tarify.online:
1. В Render → Settings → Custom Domain → добавьте домен
2. Настройте DNS: CNAME запись на `tarify-online.onrender.com`

---

## Локальная разработка

```bash
# Терминал 1: бэкенд
cd backend
npm install
npm run dev

# Терминал 2: фронтенд
cd frontend
npm install
npm run dev
```

Фронтенд запустится на http://localhost:5173, API-запросы будут проксированы на http://localhost:3001.

---

## Пароль админки

По умолчанию: `tarify2026admin`

Можно изменить через переменную окружения `ADMIN_PASSWORD` на Render.

---

## Важные замечания

1. **Render Free tier** — сервис «засыпает» после 15 мин бездействия. Для production рекомендуется план Starter ($7/мес).
2. **Disk** — обязателен для сохранения SQLite базы между перезапусками.
3. **SEO** — после деплоя добавьте сайт в Яндекс.Вебмастер и Google Search Console.
4. **Алиса** — FAQ в Schema.org индексируется автоматически. Ответы появятся через 1-2 недели после индексации.
