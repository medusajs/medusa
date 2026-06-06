import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
  Migrator,
} from "@zjedene-medusa/framework"
import { asValue } from "@zjedene-medusa/framework/awilix"
import { MedusaAppOutput, MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/framework/utils"
import { initDb, TestDatabaseUtils } from "@zjedene-medusa/test-utils"
import { IndexTypes, ModulesSdkTypes } from "@zjedene-medusa/types"
import { Configuration } from "@utils"
import path from "path"
import { setTimeout } from "timers/promises"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"
import { updateRemovedSchema } from "../__fixtures__/update-removed-schema"
import { updatedSchema } from "../__fixtures__/updated-schema"

const eventBusMock = new EventBusServiceMock()
const queryMock = {
  graph: jest.fn().mockImplementation(async () => ({ data: [] })),
}

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(300000)

let isFirstTime = true
let medusaAppLoader!: MedusaAppLoader
let index: IndexTypes.IIndexService

const beforeAll_ = async () => {
  try {
    await configLoader(
      path.join(__dirname, "./../__fixtures__"),
      "medusa-config"
    )

    console.log(`Creating database ${dbName}`)
    await dbUtils.create(dbName)
    dbUtils.pgConnection_ = await initDb()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(dbUtils.pgConnection_),
    })

    medusaAppLoader = new MedusaAppLoader()

    // Migrations

    const migrator = new Migrator({ container })
    await migrator.ensureMigrationsTable()

    await medusaAppLoader.runModulesMigrations()
    const linkPlanner = await medusaAppLoader.getLinksExecutionPlanner()
    const plan = await linkPlanner.createPlan()
    await linkPlanner.executePlan(plan)

    // Clear partially loaded instances
    MedusaModule.clearInstances()

    // Bootstrap modules
    const globalApp = await medusaAppLoader.load()
    container.register({
      [ContainerRegistrationKeys.QUERY]: asValue(queryMock),
      [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(queryMock),
      [Modules.EVENT_BUS]: asValue(eventBusMock),
    })

    index = container.resolve(Modules.INDEX)

    await globalApp.onApplicationStart()
    await setTimeout(1000)

    return globalApp
  } catch (error) {
    console.error("Error initializing", error?.message)
    throw error
  }
}

const beforeEach_ = async () => {
  jest.clearAllMocks()

  if (isFirstTime) {
    isFirstTime = false
    return
  }

  try {
    await medusaAppLoader.runModulesLoader()
  } catch (error) {
    console.error("Error runner modules loaders", error?.message)
    throw error
  }
}

const afterEach_ = async () => {
  try {
    await dbUtils.teardown({ schema: "public" })
  } catch (error) {
    console.error("Error tearing down database:", error?.message)
    throw error
  }
}

describe("IndexModuleService syncIndexConfig", function () {
  let medusaApp: MedusaAppOutput
  let indexMetadataService: ModulesSdkTypes.IMedusaInternalService<any>
  let indexSyncService: ModulesSdkTypes.IMedusaInternalService<any>
  let dataSynchronizer: ModulesSdkTypes.IMedusaInternalService<any>
  let onApplicationPrepareShutdown!: () => Promise<void>
  let onApplicationShutdown!: () => Promise<void>

  beforeAll(async () => {
    medusaApp = await beforeAll_()
    onApplicationPrepareShutdown = medusaApp.onApplicationPrepareShutdown
    onApplicationShutdown = medusaApp.onApplicationShutdown
  })

  afterAll(async () => {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
    await dbUtils.shutdown(dbName)
  })

  beforeEach(async () => {
    await beforeEach_()

    index = container.resolve(Modules.INDEX)
    indexMetadataService = (index as any).indexMetadataService_
    indexSyncService = (index as any).indexSyncService_
    dataSynchronizer = (index as any).dataSynchronizer_
  })

  afterEach(afterEach_)

  it("should full sync all entities when the config has changed", async () => {
    await setTimeout(1000)

    const currentMetadata = await indexMetadataService.list()

    expect(currentMetadata).toHaveLength(7)
    expect(currentMetadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "InternalObject",
          fields: "b",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Product",
          fields: "created_at,id,title",
          status: "done",
        }),
        expect.objectContaining({
          entity: "InternalNested",
          fields: "a",
          status: "done",
        }),
        expect.objectContaining({
          entity: "PriceSet",
          fields: "id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Price",
          fields: "amount,price_set.id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "id,product.id,product_id,sku",
          status: "done",
        }),
        expect.objectContaining({
          entity: "LinkProductVariantPriceSet",
          fields: "id,price_set_id,variant_id",
          status: "done",
        }),
      ])
    )

    let indexSync = await indexSyncService.list({
      last_key: null,
    })
    expect(indexSync).toHaveLength(7)

    // update config schema
    ;(index as any).schemaObjectRepresentation_ = null
    ;(index as any).moduleOptions_ ??= {}
    ;(index as any).moduleOptions_.schema = updatedSchema
    ;(index as any).buildSchemaObjectRepresentation_()

    let configurationChecker = new Configuration({
      logger,
      schemaObjectRepresentation: (index as any).schemaObjectRepresentation_,
      indexMetadataService,
      indexSyncService,
      dataSynchronizer,
    })

    const syncRequired = await configurationChecker.checkChanges()

    expect(syncRequired).toHaveLength(2)
    expect(syncRequired).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "Product",
          fields: "handle,id,title",
          status: "pending",
        }),
        expect.objectContaining({
          entity: "Price",
          fields: "amount,currency_code,price_set.id",
          status: "pending",
        }),
      ])
    )

    indexSync = await indexSyncService.list({
      last_key: null,
    })
    expect(indexSync).toHaveLength(7)

    const updatedMetadata = await indexMetadataService.list()

    expect(updatedMetadata).toHaveLength(7)
    expect(updatedMetadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "InternalObject",
          fields: "b",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Product",
          fields: "handle,id,title",
          status: "pending",
        }),
        expect.objectContaining({
          entity: "InternalNested",
          fields: "a",
          status: "done",
        }),
        expect.objectContaining({
          entity: "PriceSet",
          fields: "id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Price",
          fields: "amount,currency_code,price_set.id",
          status: "pending",
        }),
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "id,product.id,product_id,sku",
          status: "done",
        }),
        expect.objectContaining({
          entity: "LinkProductVariantPriceSet",
          fields: "id,price_set_id,variant_id",
          status: "done",
        }),
      ])
    )

    await (index as any).dataSynchronizer_.syncEntities(syncRequired)

    // Sync again removing entities not linked
    ;(index as any).schemaObjectRepresentation_ = null
    ;(index as any).moduleOptions_ ??= {}
    ;(index as any).moduleOptions_.schema = updateRemovedSchema
    ;(index as any).buildSchemaObjectRepresentation_()

    const spyDataSynchronizer_ = jest.spyOn(
      (index as any).dataSynchronizer_,
      "removeEntities"
    )

    configurationChecker = new Configuration({
      logger,
      schemaObjectRepresentation: (index as any).schemaObjectRepresentation_,
      indexMetadataService,
      indexSyncService,
      dataSynchronizer,
    })

    const syncRequired2 = await configurationChecker.checkChanges()
    expect(syncRequired2).toHaveLength(1)
    expect(syncRequired2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "description,id,product.id,product_id,sku",
          status: "pending",
        }),
      ])
    )

    const updatedMetadata2 = await indexMetadataService.list()
    expect(updatedMetadata2).toHaveLength(2)
    expect(updatedMetadata2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "Product",
          fields: "handle,id,title",
          status: "done",
        }),
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "description,id,product.id,product_id,sku",
          status: "pending",
        }),
      ])
    )

    expect(spyDataSynchronizer_).toHaveBeenCalledTimes(1)
  })
})
