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

const {
  simpleProductFactory,
  simpleSalesChannelFactory,
} = require("../../../../factories")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("Get products", () => {
  let appContainer
  let dbConnection
  let shutdownServer
  const productId = "test-product"
  const variantId = "test-variant"
  let invItem

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

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    const productVariantInventoryService = appContainer.resolve(
      "productVariantInventoryService"
    )
    const inventoryService = appContainer.resolve("inventoryService")
    const locationService = appContainer.resolve("stockLocationService")
    const salesChannelService = appContainer.resolve("salesChannelService")
    const salesChannelLocationService = appContainer.resolve(
      "salesChannelLocationService"
    )

    const salesChannel = await simpleSalesChannelFactory(dbConnection, {
      is_default: true,
    })

    const location = await locationService.create({ name: "test-location" })
    await simpleProductFactory(
      dbConnection,
      {
        id: productId,
        status: "published",
        variants: [{ id: variantId }],
      },
      100
    )
    await salesChannelService.addProducts(salesChannel.id, [productId])
    await salesChannelLocationService.associateLocation(
      salesChannel.id,
      location.id
    )
    invItem = await inventoryService.createInventoryItem({
      sku: "test-sku",
    })

    await productVariantInventoryService.attachInventoryItem(
      variantId,
      invItem.id
    )

    await inventoryService.createInventoryLevel({
      inventory_item_id: invItem.id,
      location_id: location.id,
      stocked_quantity: 100,
    })
  })

  describe("/store/products/:id", () => {
    it("Expands inventory items when getting product with expand parameters", async () => {
      const api = useApi()

      const res = await api.get(
        `/store/products/${productId}?expand=variants,variants.inventory_items`
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

  describe("/admin/products/:id", () => {
    it("should get inventory quantity for products fetched through the admin api", async () => {
      const api = useApi()

      const res = await api.get(`/admin/products/${productId}`, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.product).toEqual(
        expect.objectContaining({
          id: productId,
          variants: [
            expect.objectContaining({
              id: variantId,
              inventory_quantity: 100,
            }),
          ],
        }),
        expect.objectContaining({})
      )
    })
  })
})
