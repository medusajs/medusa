const path = require("path")

const { bootstrapApp } = require("../../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../helpers/use-db")
const { setPort, useApi } = require("../../../../helpers/use-api")

const {
  ProductVariantInventoryService,
  ProductVariantService,
} = require("@medusajs/medusa")

const adminSeeder = require("../../../helpers/admin-seeder")

jest.setTimeout(30000)

const { simpleProductFactory } = require("../../../factories")
const { simpleSalesChannelFactory } = require("../../../../api/factories")

const adminHeaders = { headers: { Authorization: "Bearer test_token" } }

describe("Get products", () => {
  let appContainer
  let dbConnection
  let express
  const productId = "test-product"
  const variantId = "test-variant"
  let invItem

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

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    const productVariantInventoryService = appContainer.resolve(
      "productVariantInventoryService"
    )
    const inventoryService = appContainer.resolve("inventoryService")

    await simpleProductFactory(
      dbConnection,
      {
        id: productId,
        status: "published",
        variants: [{ id: variantId }],
      },
      100
    )

    invItem = await inventoryService.createInventoryItem({
      sku: "test-sku",
    })

    await productVariantInventoryService.attachInventoryItem(
      variantId,
      invItem.id
    )
  })

  it("Expands inventory items when getting product with expand parameters", async () => {
    const api = useApi()

    const res = await api.get(
      `/store/products/${productId}?expand=variants,variants.inventory_items`,
      adminHeaders
    )

    expect(res.status).toEqual(200)
    expect(res.data.product).toEqual(
      expect.objectContaining({
        id: productId,
        variants: [
          expect.objectContaining({
            id: variantId,
            inventory_items: [
              expect.objectContaining({
                inventory_item_id: invItem.id,
                variant_id: variantId,
              }),
            ],
          }),
        ],
      }),
      expect.objectContaining({})
    )
  })
})
