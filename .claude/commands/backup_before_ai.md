# Бэкап БД перед AI-сессией

Перед тем как давать AI-агенту (Claude, Gemini, Jules) доступ к базе или запускать миграции — сделай бэкап.

## Быстрый бэкап (локальный dev)

```bash
# Из корня проекта (использует переменные из .env или дефолты):
./scripts/backup-before-ai.sh

# С кастомными параметрами:
POSTGRES_DB=my_database POSTGRES_PORT=5432 PROJECT_NAME=myapp ./scripts/backup-before-ai.sh

# На прод:
PROD_SSH_HOST=my-server ./scripts/backup-before-ai.sh prod
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `POSTGRES_HOST` | `localhost` | Хост БД |
| `POSTGRES_PORT` | `5433` | Порт БД |
| `POSTGRES_USER` | `admin` | Юзер БД |
| `POSTGRES_PASSWORD` | `admin` | Пароль БД |
| `POSTGRES_DB` | `postgres` | Имя БД |
| `PROJECT_NAME` | `db` | Префикс для файлов бэкапов |
| `PROD_SSH_HOST` | `prod` | SSH алиас для прод-сервера |
| `PROD_DB_CONTAINER` | auto-detect | Имя Docker-контейнера на проде |
| `DB_CONTAINER_FILTER` | `postgres` | Docker image filter для поиска контейнера |
| `BACKUP_DIR` | `./backups/ai-session` | Куда сохранять бэкапы |
| `BACKUP_KEEP` | `10` | Сколько бэкапов хранить |

## Восстановление (если AI наебнул базу)

```bash
# Найти последний бэкап:
ls -lt ./backups/ai-session/

# Восстановить:
pg_restore -h localhost -p 5433 -U admin -d mydb --clean --if-exists ./backups/ai-session/ФАЙЛ.dump
```

## Правила

- **Никогда** не запускай `drizzle-kit push` или миграции без бэкапа
- **Никогда** не давай AI-агенту admin-доступ к проду. Используй `ai_readonly` юзера
- AI генерит `.sql` файл → ты ревьюишь → ты катишь руками
