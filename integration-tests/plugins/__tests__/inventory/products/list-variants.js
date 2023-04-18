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

describe("List Variants", () => {
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
    const variantId = "test-variant"

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const salesChannelLocationService = appContainer.resolve(
        "salesChannelLocationService"
      )
      const salesChannelService = appContainer.resolve("salesChannelService")
      const inventoryService = appContainer.resolve("inventoryService")
      const stockLocationService = appContainer.resolve("stockLocationService")
      const prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const location = await stockLocationService.create({
        name: "test-location",
      })

      const salesChannel = await simpleSalesChannelFactory(dbConnection, {})

      const product = await simpleProductFactory(dbConnection, {
        variants: [{ id: variantId }],
      })

      await salesChannelService.addProducts(salesChannel.id, [product.id])
      await salesChannelLocationService.associateLocation(
        salesChannel.id,
        location.id
      )

      const invItem = await inventoryService.createInventoryItem({
        sku: "test-sku",
      })
      const invItemId = invItem.id

      await prodVarInventoryService.attachInventoryItem(variantId, invItem.id)

      await inventoryService.createInventoryLevel({
        inventory_item_id: invItem.id,
        location_id: location.id,
        stocked_quantity: 10,
      })
    })
    it("Decorates inventory quantities when listing variants", async () => {
      const api = useApi()

      const listVariantsRes = await api.get(`/admin/variants`, adminHeaders)

      expect(listVariantsRes.status).toEqual(200)
      expect(listVariantsRes.data.variants.length).toEqual(1)
      expect(listVariantsRes.data.variants[0]).toEqual(
        expect.objectContaining({ id: variantId, inventory_quantity: 10 })
      )
    })
  })
})
