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

describe("Create Variant", () => {
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

  describe("list-products", () => {
    const productId = "test-product"
    const variantId = "test-variant"
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const stockLocationService = appContainer.resolve("stockLocationService")
      const productVariantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )
      const inventoryService = appContainer.resolve("inventoryService")
      const salesChannelLocationService = appContainer.resolve(
        "salesChannelLocationService"
      )

      await simpleProductFactory(
        dbConnection,
        {
          id: productId,
          variants: [{ id: variantId }],
        },
        100
      )

      const sc1 = await simpleSalesChannelFactory(dbConnection, {})
      const sc2 = await simpleSalesChannelFactory(dbConnection, {})
      const sc3 = await simpleSalesChannelFactory(dbConnection, {})

      const sl1 = await stockLocationService.create({ name: "sl1" })
      const sl2 = await stockLocationService.create({ name: "sl2" })

      await salesChannelLocationService.associateLocation(sc1.id, sl1.id)
      await salesChannelLocationService.associateLocation(sc2.id, sl1.id)
      await salesChannelLocationService.associateLocation(sc2.id, sl2.id)

      const invItem = await inventoryService.createInventoryItem({
        sku: "test-sku",
      })
      await productVariantInventoryService.attachInventoryItem(
        variantId,
        invItem.id
      )

      await inventoryService.createInventoryLevel({
        inventory_item_id: invItem.id,
        location_id: sl1.id,
        stocked_quantity: 3,
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: invItem.id,
        location_id: sl2.id,
        stocked_quantity: 1,
      })
    })

    it("lists location availability correctly", async () => {
      const api = useApi()

      const res = await api.get(`/admin/products`, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.products).toEqual([
        expect.objectContaining({
          id: productId,
          variants: [
            expect.objectContaining({
              inventory_quantity: 4,
            }),
          ],
        }),
      ])
    })
  })
})
