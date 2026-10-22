# @medusajs/test-utils

Medusa's integration testing framework: Jest runners that boot a full Medusa app (`medusaIntegrationTestRunner`) or a single module (`moduleIntegrationTestRunner`) against a throwaway Postgres database. Used by Medusa apps/plugins and by every integration suite in this monorepo.

## Using this package

Install as a dev dependency and import from `@medusajs/test-utils`. Both runners wrap your tests in a `describe` and need a reachable Postgres (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`; defaults `localhost`, `5432`, `postgres`, empty). Set `jest.setTimeout(60 * 1000)` in each file.

### HTTP / workflow tests

```ts
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer, dbConnection, dbUtils, utils }) => {
    it("lists products", async () => {
      const res = await api.get("/store/products", {
        headers: { "x-publishable-api-key": "..." },
      })
      expect(res.status).toEqual(200)
    })
  },
})

jest.setTimeout(60 * 1000)
```

- Options: `cwd` / `medusaConfigFile` (dir containing `medusa-config`, default `process.cwd()`), `env` (applied to `process.env` for the suite, then restored), `dbName`, `schema` (`"public"`), `moduleName` (only used in the generated DB name), `debug` (DB logging), `hooks.beforeServerStart(container)`.
- Suite options: `api` (axios bound to `http://localhost:<port>`), `getContainer()`, `getMedusaApp()`, `dbConnection` (knex), `dbConfig`, `dbUtils` (`snapshot`, `restore`, `teardown`, ...), `utils.waitWorkflowExecutions()`.

### Module tests

```ts
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import BlogModuleService from "../service"
import Post from "../models/post"

moduleIntegrationTestRunner<BlogModuleService>({
  moduleName: "blog",
  moduleModels: [Post],
  resolve: "./src/modules/blog",
  testSuite: ({ service, MikroOrmWrapper, medusaApp }) => {
    it("creates a post", async () => {
      const post = await service.createPosts({ title: "Hi" })
      expect(post.id).toBeDefined()
    })
  },
})
```

- Options: `moduleName` (required; for core modules use `Modules.*` so `ModulesDefinition` is found), `resolve`, `moduleModels` (else auto-loaded from `<resolve>/dist/models` or `<resolve>/models`), `moduleOptions`, `moduleDependencies`, `injectedDependencies`, `pathToMigrations` (use migrations instead of model-derived schema, e.g. module + provider), `hooks.beforeModuleInit` / `hooks.afterModuleInit(medusaApp, service)`, `cwd`, `dbName`, `schema`, `debug`.
- Default injections: `PG_CONNECTION`, `LOGGER` (`console`), `CONFIG_MODULE`, and `Modules.EVENT_BUS` as a no-op `MockEventBusService` (events are not delivered).

### Other exports

- `TestEventUtils.waitSubscribersExecution(eventName, eventBus, { timeout?, triggerCount? })`: create the promise before triggering the action, then await it. Works by wrapping listeners on `eventBus.eventEmitter_`, so it needs the local event bus.
- `normalizeBigNumbers(value)`: converts `BigNumber` fields (order/cart totals) to numbers for `toEqual` assertions.
- `setTestLicense(features)` / `testLicense(features)`: register a fake `ContainerRegistrationKeys.LICENSE`.
- `TestDatabaseUtils`, `JestUtils.afterAllHookDropDatabase()`, `initModules`, `MockEventBusService`.

Docs:
- https://docs.medusajs.com/learn/debugging-and-testing/testing-tools.md (Jest config + `test:integration:*` scripts)
- https://docs.medusajs.com/learn/debugging-and-testing/testing-tools/integration-tests.md
- https://docs.medusajs.com/learn/debugging-and-testing/testing-tools/modules-tests.md
- https://docs.medusajs.com/resources/test-tools-reference.md

## Architecture

- `medusa-test-runner.ts`: `beforeAll` loads `medusa-config` via `configLoaderOverride` (forces `databaseUrl` to the test DB, sets `admin.disable: true`, adds SSL options when the URL isn't `localhost`), creates the DB, runs core migrations, syncs links, registers search indexes, then `startApp` (`medusa-test-runner-utils/bootstrap-app.ts`) runs `@medusajs/medusa/loaders/index` on an Express app on a free port (or `PORT`).
- DB isolation (full app): the first `beforeEach` snapshots the DB into a Postgres template DB (`<dbName>-template`); every later `beforeEach` restores from it (`medusa-test-runner-utils/postgres-template.ts`). `afterEach` waits for in-flight workflow executions.
- `module-test-runner.ts`: one pg connection per suite; each test gets a fresh `initModules()` boot, schema setup in `beforeEach`, `clearDatabase()` + shutdown in `afterEach`.
- `database.ts`: `getDatabaseURL`, `getMikroOrmWrapper` (`setupDatabase` / `clearDatabase`), `dbTestUtilFactory`.

## Development

- `yarn build`, `yarn watch`, `yarn test` (jest over `src`). `src/__tests__/module-test-runner.spec.ts` uses the fixture in `src/__fixtures__/test-module` and needs Postgres; the other specs mock their dependencies.
- Single file: `../../node_modules/.bin/jest src/__tests__/events.spec.ts`.
- Changes affect every suite in `integration-tests/http`, `integration-tests/modules`, and `packages/**/integration-tests`; run a representative one (e.g. `packages/modules/product`, `yarn test:integration`).

## Gotchas

- Default DB name is `medusa-<moduleName or ulid>-integration-<JEST_WORKER_ID>`; parallel workers get separate DBs, but two files with the same explicit `dbName` will collide.
- Data created in a suite's own `beforeAll` survives across tests (the snapshot is taken in the first `beforeEach`, after it); data created in `beforeEach`/`it` is wiped before the next test. Calling `dbUtils.snapshot()` inside a suite replaces the template and skips the next restore.
- Suite options are proxies resolved lazily; use `api`, `getContainer()`, `service` inside hooks/tests, not at `testSuite` definition time.
- `moduleIntegrationTestRunner` sets `process.env.LOG_LEVEL = "error"` and the module's `MockEventBusService` drops all events; test event-driven behavior with `medusaIntegrationTestRunner` instead.
- `waitWorkflowExecutions` (also run in every `afterEach`) polls until no execution is outside `not_started`/`done`/`reverted`/`failed`; its 60s timeout throws from a timer (uncaught), not as a rejection.
- `@medusajs/medusa` and `@medusajs/core-flows` are optional peer deps, but the full-app runner `require`s `@medusajs/medusa/loaders/*`, so apps need `@medusajs/medusa` installed.
