const path = require("path")
const { ProductVariantInventoryService } = require("@medusajs/medusa")

const {
  bootstrapApp,
} = require("../../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")
const { setPort, useApi } = require("../../../../environment-helpers/use-api")

const adminSeeder = require("../../../../helpers/admin-seeder")

jest.setTimeout(30000)

const {
  simpleProductFactory,
  simpleOrderFactory,
  simpleInventoryItemFactory,
} = require("../../../../factories")
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("Create Product with inventory item association", () => {
  let appContainer
  let dbConnection
  let express

  let variantId
  let inventoryItems
  let locationId
  let location2Id
  let location3Id

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

  beforeEach(async () => {
    await adminSeeder(dbConnection)
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

  describe("Product Creation", () => {
    it("should create variants and associate with inventory items", async () => {
      // Set feature flag
      const flagRouter = appContainer.resolve("featureFlagRouter")
      await flagRouter.setFlag("many_to_many_inventory", true)

      const api = useApi()

      const inventoryItemOne = await simpleInventoryItemFactory(dbConnection)
      const inventoryItemTwo = await simpleInventoryItemFactory(dbConnection)

      const response = await api.post(
        `/admin/products`,
        {
          title: "Test product - 1",
          description: "test-product-description 1",
          images: ["test-image.png", "test-image-2.png"],
          options: [{ title: "size" }, { title: "color" }],
          variants: [
            {
              title: "Test variant 0",
              prices: [{ currency_code: "usd", amount: 100 }],
              options: [{ value: "large" }, { value: "green" }],
              manage_inventory: true,
            },
            {
              title: "Test variant 1",
              prices: [{ currency_code: "usd", amount: 100 }],
              options: [{ value: "large" }, { value: "green" }],
              inventory_items: [
                {
                  inventory_item_id: inventoryItemOne.id,
                  required_quantity: 1,
                },
              ],
            },
            {
              title: "Test variant 2",
              prices: [{ currency_code: "usd", amount: 100 }],
              options: [{ value: "large" }, { value: "green" }],
              inventory_items: [
                {
                  inventory_item_id: inventoryItemOne.id,
                },
                {
                  inventory_item_id: inventoryItemTwo.id,
                  required_quantity: 3,
                },
              ],
            },
          ],
        },
        { headers: { "x-medusa-access-token": "test_token" } }
      )

      expect(response.status).toEqual(200)

      const variantIds = response.data.product.variants.map((v) => v.id)

      const variantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )
      const inventory = await variantInventoryService.listByVariant(variantIds)

      expect(inventory).toHaveLength(4)
      expect(inventory).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: variantIds[0],
            required_quantity: 1,
          }),
          expect.objectContaining({
            variant_id: variantIds[1],
            inventory_item_id: inventoryItemOne.id,
            required_quantity: 1,
          }),
          expect.objectContaining({
            variant_id: variantIds[2],
            inventory_item_id: inventoryItemOne.id,
            required_quantity: 1,
          }),
          expect.objectContaining({
            variant_id: variantIds[2],
            inventory_item_id: inventoryItemTwo.id,
            required_quantity: 3,
          }),
        ])
      )

      // Unset feature flag
      await flagRouter.setFlag("many_to_many_inventory", false)
    })
  })
})
