const path = require("path")

const {
  startBootstrapApp,
} = require("../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../environment-helpers/use-db")
const { simpleProductFactory } = require("../../../factories")
const { getContainer } = require("../../../environment-helpers/use-container")
const { useExpressServer } = require("../../../environment-helpers/use-api")

jest.setTimeout(50000)

describe("Inventory Module", () => {
  let appContainer
  let dbConnection
  let shutdownServer

  let invItem1
  let invItem2
  let variant1
  let variant2

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    shutdownServer = await startBootstrapApp({ cwd })
    appContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  describe("ProductVariantInventoryService", () => {
    describe("attachInventoryItem", () => {
      afterEach(async () => {
        const db = useDb()
        return await db.teardown()
      })

      beforeEach(async () => {
        const inventoryService = appContainer.resolve("inventoryService")

        const { variants } = await simpleProductFactory(dbConnection, {
          variants: [{}, {}],
        })

        variant1 = variants[0]
        variant2 = variants[1]

        invItem1 = await inventoryService.createInventoryItem({
          sku: "test-sku-1",
        })

        invItem2 = await inventoryService.createInventoryItem({
          sku: "test-sku-2",
        })
      })

      it("should attach the single item with spread params", async () => {
        const pviService = appContainer.resolve(
          "productVariantInventoryService"
        )
        await pviService.attachInventoryItem(variant1.id, invItem1.id)

        const variantItems = await pviService.listByVariant(variant1.id)
        expect(variantItems.length).toEqual(1)
        expect(variantItems[0]).toEqual(
          expect.objectContaining({
            inventory_item_id: invItem1.id,
            variant_id: variant1.id,
          })
        )
      })

      it("should attach multiple inventory items and variants at once", async () => {
        const pviService = appContainer.resolve(
          "productVariantInventoryService"
        )
        await pviService.attachInventoryItem([
          {
            variantId: variant1.id,
            inventoryItemId: invItem1.id,
          },
          {
            variantId: variant2.id,
            inventoryItemId: invItem2.id,
          },
        ])

        const variantItems = await pviService.listByVariant([
          variant1.id,
          variant2.id,
        ])
        expect(variantItems.length).toEqual(2)
        expect(variantItems).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: invItem1.id,
              variant_id: variant1.id,
            }),
            expect.objectContaining({
              variant_id: variant2.id,
              inventory_item_id: invItem2.id,
            }),
          ])
        )
      })

      it("should skip existing attachments when attaching a singular inventory item", async () => {
        const pviService = appContainer.resolve(
          "productVariantInventoryService"
        )
        await pviService.attachInventoryItem(variant1.id, invItem1.id)
        await pviService.attachInventoryItem(variant1.id, invItem1.id)

        const variantItems = await pviService.listByVariant(variant1.id)
        expect(variantItems.length).toEqual(1)
        expect(variantItems[0]).toEqual(
          expect.objectContaining({
            inventory_item_id: invItem1.id,
            variant_id: variant1.id,
          })
        )
      })

      it("should skip existing attachments when attaching multiple inventory items in bulk", async () => {
        const pviService = appContainer.resolve(
          "productVariantInventoryService"
        )
        await pviService.attachInventoryItem(variant1.id, invItem1.id)

        await pviService.attachInventoryItem([
          {
            variantId: variant1.id,
            inventoryItemId: invItem1.id,
          },
          {
            variantId: variant2.id,
            inventoryItemId: invItem2.id,
          },
        ])

        const variantItems = await pviService.listByVariant([
          variant1.id,
          variant2.id,
        ])
        expect(variantItems.length).toEqual(2)
        expect(variantItems).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: invItem1.id,
              variant_id: variant1.id,
            }),
            expect.objectContaining({
              variant_id: variant2.id,
              inventory_item_id: invItem2.id,
            }),
          ])
        )
      })

      it("should fail to attach items when a single item has a required_quantity below 1", async () => {
        const pviService = appContainer.resolve(
          "productVariantInventoryService"
        )

        let e
        try {
          await pviService.attachInventoryItem(variant1.id, invItem1.id, 0)
        } catch (err) {
          e = err
        }

        expect(e.message).toEqual(
          `"requiredQuantity" must be greater than 0, the following entries are invalid: ${JSON.stringify(
            {
              variantId: variant1.id,
              inventoryItemId: invItem1.id,
              requiredQuantity: 0,
            }
          )}`
        )

        try {
          await pviService.attachInventoryItem([
            {
              variantId: variant1.id,
              inventoryItemId: invItem1.id,
            },
            {
              variantId: variant2.id,
              inventoryItemId: invItem2.id,
              requiredQuantity: 0,
            },
          ])
        } catch (err) {
          e = err
        }

        expect(e.message).toEqual(
          `"requiredQuantity" must be greater than 0, the following entries are invalid: ${JSON.stringify(
            {
              variantId: variant2.id,
              inventoryItemId: invItem2.id,
              requiredQuantity: 0,
            }
          )}`
        )
      })

      it("should fail to attach items when attaching to a non-existing variant", async () => {
        const pviService = appContainer.resolve(
          "productVariantInventoryService"
        )

        let e
        try {
          await pviService.attachInventoryItem("variant1.id", invItem1.id)
        } catch (err) {
          e = err
        }

        expect(e.message).toEqual(
          `Variants not found for the following ids: variant1.id`
        )

        try {
          await pviService.attachInventoryItem([
            {
              variantId: "variant1.id",
              inventoryItemId: invItem1.id,
            },
            {
              variantId: variant2.id,
              inventoryItemId: invItem2.id,
            },
          ])
        } catch (err) {
          e = err
        }

        expect(e.message).toEqual(
          `Variants not found for the following ids: variant1.id`
        )
      })
      it("should fail to attach items when attaching to a non-existing inventory item", async () => {
        const pviService = appContainer.resolve(
          "productVariantInventoryService"
        )

        let e
        try {
          await pviService.attachInventoryItem(variant1.id, "invItem1.id")
        } catch (err) {
          e = err
        }

        expect(e.message).toEqual(
          `Inventory items not found for the following ids: invItem1.id`
        )

        try {
          await pviService.attachInventoryItem([
            {
              variantId: variant1.id,
              inventoryItemId: invItem1.id,
            },
            {
              variantId: variant2.id,
              inventoryItemId: "invItem2.id",
            },
          ])
        } catch (err) {
          e = err
        }

        expect(e.message).toEqual(
          `Inventory items not found for the following ids: invItem2.id`
        )
      })
    })
  })
})
