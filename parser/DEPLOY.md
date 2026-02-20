# Парсер тарифов: как запустить и захостить

## 1) Локальный запуск

```bash
python3 parser/run_parser.py --region Москва --out data/tariffs.json
```

После этого фронт будет читать обновленные данные из `data/tariffs.json`.

## 2) Автообновление по cron (VPS)

Откройте crontab:

```bash
crontab -e
```

Пример запуска каждые 6 часов:

```cron
0 */6 * * * cd /opt/tarif && /usr/bin/python3 parser/run_parser.py --region Москва --out data/tariffs.json
```

## 3) Как хостить проект

### Вариант A (самый простой)
- Хостите статический сайт (`index.html`, `styles.css`, `app.js`, `data/`) на Vercel/Netlify/Nginx.
- Парсер запускайте на отдельном VPS по cron.
- После парсинга синкайте `data/tariffs.json` в ваш статический хостинг (git push / rsync / S3 upload).

### Вариант B (production)
- Парсер пишет в БД (PostgreSQL).
- Backend API отдает актуальные тарифы.
- Frontend читает API вместо локального JSON.
- Для фона используйте Celery/Redis или системный cron.

## 4) Где разместить парсер
- Hetzner/Selectel/VDS (Ubuntu + cron).
- GitHub Actions по расписанию (`schedule`) для запуска парсера и автокоммита JSON.

## 5) Важно
- У операторов часто меняется HTML, поэтому парсеры нужно поддерживать.
- Предпочтительно использовать официальные API/партнерские выгрузки, если доступны.
