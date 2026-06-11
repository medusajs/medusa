import { ModulesSdkTypes } from "@medusajs/framework/types"
import { toMikroORMEntity } from "@medusajs/framework/utils"
import { IndexData } from "@models"
import { buildSchemaObjectRepresentation, Configuration } from "@utils"
import { baseGraphqlSchema } from "../../src/utils/base-graphql-schema"
import { DataSynchronizer } from "../../src/services/data-synchronizer"
import {
  createIndexTestBed,
  IndexModuleTestBed,
  schema,
} from "../__fixtures__"
import { updateRemovedSchema } from "../__fixtures__/update-removed-schema"
import { updatedSchema } from "../__fixtures__/updated-schema"

jest.setTimeout(300000)

const buildRepresentation = (moduleSchema: string) => {
  return buildSchemaObjectRepresentation(baseGraphqlSchema + moduleSchema)
    .objectRepresentation
}

describe("IndexModuleService syncIndexConfig", function () {
  let testBed: IndexModuleTestBed
  let indexMetadataService: ModulesSdkTypes.IMedusaInternalService<any>
  let indexSyncService: ModulesSdkTypes.IMedusaInternalService<any>
  let dataSynchronizer: DataSynchronizer

  beforeAll(async () => {
    // Starting the module in worker mode runs the initial configuration
    // sync against the configured schema
    testBed = await createIndexTestBed({ schema })

    indexMetadataService = testBed.container.resolve("indexMetadataService")
    indexSyncService = testBed.container.resolve("indexSyncService")
    dataSynchronizer = testBed.container.resolve("dataSynchronizer")
  })

  afterAll(async () => {
    await testBed.teardown()
  })

  it("should full sync all entities when the config has changed", async () => {
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

    // The module restarts with an updated schema config
    let configurationChecker = new Configuration({
      logger: testBed.logger.asLogger(),
      schemaObjectRepresentation: buildRepresentation(updatedSchema),
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

    await dataSynchronizer.syncEntities(syncRequired)

    // Seed an index entry for an entity that is about to be removed from
    // the schema to assert its data is cleaned up
    const manager = testBed.forkManager()
    await manager
      .getRepository(toMikroORMEntity(IndexData))
      .upsertMany([
        { id: "price_set_1", name: "PriceSet", data: { id: "price_set_1" } },
      ])

    // Sync again removing entities not linked
    configurationChecker = new Configuration({
      logger: testBed.logger.asLogger(),
      schemaObjectRepresentation: buildRepresentation(updateRemovedSchema),
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

    // The index data of the removed entities has been deleted
    const priceSetEntries = await testBed
      .forkManager()
      .find(toMikroORMEntity(IndexData), { name: "PriceSet" })
    expect(priceSetEntries).toHaveLength(0)
  })
})
