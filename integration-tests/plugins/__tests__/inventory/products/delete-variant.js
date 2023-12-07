const path = require("path")

const {
  startBootstrapApp,
} = require("../../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")
const {
  useApi,
  useExpressServer,
} = require("../../../../environment-helpers/use-api")

const adminSeeder = require("../../../../helpers/admin-seeder")

jest.setTimeout(30000)

const { simpleProductFactory } = require("../../../../factories")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")

describe("Delete Variant", () => {
  let appContainer
  let dbConnection
  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    shutdownServer = await startBootstrapApp({ cwd })
    appContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    const db = useDb()
    return await db.teardown()
  })

  describe("Inventory Items", () => {
    it("When deleting a product variant it removes the inventory items associated to it", async () => {
      await adminSeeder(dbConnection)

      const api = useApi()

      await simpleProductFactory(
        dbConnection,
        {
          id: "test-product",
          variants: [{ id: "test-variant" }],
        },
        100
      )

      const response = await api.post(
        `/admin/products/test-product/variants`,
        {
          title: "Test Variant w. inventory",
          sku: "MY_SKU",
          manage_inventory: true,
          options: [
            {
              option_id: "test-product-option",
              value: "SS",
            },
          ],
          prices: [{ currency_code: "usd", amount: 2300 }],
        },
        { headers: { "x-medusa-access-token": "test_token" } }
      )

      const variantId = response.data.product.variants.find(
        (v) => v.sku === "MY_SKU"
      ).id

      const inventoryService = appContainer.resolve("inventoryService")
      const variantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )
      const variantService = appContainer.resolve("productVariantService")

      const invItem2 = await inventoryService.createInventoryItem({
        sku: "123456",
      })

      await variantInventoryService.attachInventoryItem(
        variantId,
        invItem2.id,
        2
      )

      expect(
        await variantInventoryService.listInventoryItemsByVariant(variantId)
      ).toHaveLength(2)

      await api.delete(`/admin/products/test-product/variants/${variantId}`, {
        headers: { "x-medusa-access-token": "test_token" },
      })

      await expect(variantService.retrieve(variantId)).rejects.toThrow(
        `Variant with id: ${variantId} was not found`
      )

      expect(
        await variantInventoryService.listInventoryItemsByVariant(variantId)
      ).toHaveLength(0)
    })
  })
})
