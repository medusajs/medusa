const path = require("path")

const { bootstrapApp } = require("../../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../helpers/use-db")
const { setPort, useApi } = require("../../../../helpers/use-api")

const adminSeeder = require("../../../helpers/admin-seeder")

jest.setTimeout(30000)

const { simpleProductFactory } = require("../../../factories")

describe("Delete Variant", () => {
  let appContainer
  let dbConnection
  let express

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    const { container, app, port } = await bootstrapApp({ cwd })
    appContainer = container

    setPort(port)
    express = app.listen(port, (err) => {
      process.send(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    express.close()
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
        { headers: { Authorization: "Bearer test_token" } }
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
        headers: { Authorization: "Bearer test_token" },
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
