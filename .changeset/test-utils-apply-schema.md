---
"@medusajs/utils": patch
"@medusajs/test-utils": patch
---

fix(utils,test-utils): create module tables in the configured database schema

Module migrations run unqualified SQL, but the connection `mikroOrmCreateConnection` builds for them did not set a `search_path`. With a custom `databaseSchema`, only the `mikro_orm_migrations` table landed in that schema and the module tables were created in `public`. The connection now resolves tables in the requested schema.

`medusaIntegrationTestRunner` exposed a `schema` option but never applied it to the Medusa config. It now sets `projectConfig.databaseSchema` and creates the schema before the migrations run.
