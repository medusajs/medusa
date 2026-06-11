import { asValue } from "@medusajs/framework/awilix"
import {
  defineConfig,
  MikroORM,
  SqlEntityManager,
} from "@medusajs/framework/mikro-orm/postgresql"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  CustomDBMigrator,
  Modules,
  ModulesSdkUtils,
  toMikroOrmEntities,
} from "@medusajs/framework/utils"
import { TestDatabaseUtils } from "@medusajs/test-utils"
import { IndexData, IndexMetadata, IndexRelation, IndexSync } from "@models"
import { IndexModuleService } from "@services"
import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import { DataSynchronizer } from "../../src/services/data-synchronizer"
import { IndexDataService } from "../../src/services/index-data"
import { IndexMetadataService } from "../../src/services/index-metadata"
import { IndexRelationService } from "../../src/services/index-relation"
import { IndexSyncService } from "../../src/services/index-sync"
import { PostgresProvider } from "../../src/services/postgres-provider"
import { FakeEventBus } from "./fake-event-bus"
import { FakeLocking } from "./fake-locking"
import { FakeLogger } from "./fake-logger"
import { FakeQuery } from "./fake-query"
import { remoteModulesJoinerConfigs } from "./joiner-configs"

export type IndexModuleTestBed = {
  module: IndexModuleService
  container: MedusaContainer
  orm: MikroORM
  manager: SqlEntityManager
  query: FakeQuery
  eventBus: FakeEventBus
  locking: FakeLocking
  logger: FakeLogger
  forkManager: () => SqlEntityManager
  truncateTables: () => Promise<void>
  teardown: () => Promise<void>
}

const moduleModels = toMikroOrmEntities([
  IndexData,
  IndexRelation,
  IndexMetadata,
  IndexSync,
])

/**
 * The module's own migrations create the partitioned index tables, so they
 * are replayed instead of generating the schema from the models. They are
 * passed as an explicit list to avoid the migrator's file discovery, which
 * does not go through the jest TypeScript transform.
 */
function loadMigrationsList() {
  const migrationsDir = path.join(__dirname, "..", "..", "src", "migrations")

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => /^Migration\d+\.ts$/.test(file))
    .sort()
    .map((file) => {
      const name = file.replace(/\.ts$/, "")
      const exported = require(path.join(migrationsDir, file))

      return { name, class: exported[name] }
    })
}

/**
 * Boots the index module in isolation: a dedicated database with the
 * module's own migrations, the module's real container (internal services,
 * repositories, data synchronizer, postgres storage provider) and fakes for
 * everything the module receives from the application — query, event bus,
 * locking and logger. The fake remote modules' joiner configs are
 * registered so the schema object representation can be built without
 * loading any other module.
 */
export async function createIndexTestBed({
  schema,
  workerMode = "shared",
}: {
  schema: string
  workerMode?: "shared" | "server"
}): Promise<IndexModuleTestBed> {
  const dbName = `medusa-index-module-${Math.random()
    .toString(36)
    .substring(2, 12)}`

  const logger = new FakeLogger()
  const query = new FakeQuery()
  const eventBus = new FakeEventBus()
  const locking = new FakeLocking()

  const dbUtils = TestDatabaseUtils.dbTestUtilFactory()
  await dbUtils.create(dbName)

  const orm = await MikroORM.init(
    defineConfig({
      clientUrl: TestDatabaseUtils.getDatabaseURL(dbName),
      entities: moduleModels,
      debug: false,
      pool: { min: 2 },
      migrations: {
        migrationsList: loadMigrationsList(),
        silent: true,
        snapshot: false,
      },
      extensions: [CustomDBMigrator],
    })
  )

  try {
    await orm.getMigrator().up()

    for (const joinerConfig of remoteModulesJoinerConfigs) {
      MedusaModule.setJoinerConfig(joinerConfig.serviceName!, joinerConfig)
    }

    const container = createMedusaContainer()
    const manager = orm.em.fork()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger.asLogger()),
      [ContainerRegistrationKeys.QUERY]: asValue(query as any),
      [Modules.EVENT_BUS]: asValue(eventBus),
      [Modules.LOCKING]: asValue(locking),
      manager: asValue(manager),
      storageProviderCtr: asValue(PostgresProvider),
      storageProviderCtrOptions: asValue(undefined),
    })

    const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
      moduleModels: moduleModels.reduce((acc, model) => {
        acc[model.name] = model
        return acc
      }, {}),
      moduleServices: {
        DataSynchronizer,
        IndexDataService,
        IndexMetadataService,
        IndexRelationService,
        IndexSyncService,
      },
    })

    await containerLoader({ container, options: {} } as any)

    const module = new IndexModuleService(
      container.cradle as any,
      { schema } as any,
      { worker_mode: workerMode } as any
    )

    // The module generates entry point types under `<cwd>/.medusa` on
    // startup. Point it at a dedicated temp directory so parallel test
    // suites do not race on the same file and the repo is not polluted.
    const typesDir = fs.mkdtempSync(path.join(os.tmpdir(), "medusa-index-"))
    const previousCwd = process.cwd()
    process.chdir(typesDir)

    try {
      await module.__hooks.onApplicationStart.call(module)
    } finally {
      process.chdir(previousCwd)
    }

    if (logger.errors.length) {
      throw logger.errors[0]
    }

    const teardown = async () => {
      MedusaModule.clearInstances()
      await orm.close(true)
      await dbUtils.shutdown(dbName)
      fs.rmSync(typesDir, { recursive: true, force: true })
    }

    const truncateTables = async () => {
      await orm.em.execute(
        `TRUNCATE TABLE index_data, index_relation, index_metadata, index_sync CASCADE`
      )
    }

    return {
      module,
      container,
      orm,
      manager,
      query,
      eventBus,
      locking,
      logger,
      forkManager: () => manager.fork(),
      truncateTables,
      teardown,
    }
  } catch (error) {
    MedusaModule.clearInstances()
    await orm.close(true).catch(() => void 0)
    await dbUtils.shutdown(dbName).catch(() => void 0)
    throw error
  }
}
