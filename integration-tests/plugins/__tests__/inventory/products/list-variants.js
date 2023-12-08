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
const { simpleSalesChannelFactory } = require("../../../../factories")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("List Variants", () => {
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
    const variantId = "test-variant"
    let invItem

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

      const salesChannel = await simpleSalesChannelFactory(dbConnection, {
        is_default: true,
      })

      const product = await simpleProductFactory(dbConnection, {
        variants: [{ id: variantId }],
      })

      await salesChannelService.addProducts(salesChannel.id, [product.id])
      await salesChannelLocationService.associateLocation(
        salesChannel.id,
        location.id
      )

      invItem = await inventoryService.createInventoryItem({
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

    it("expands inventory_items when querying with expand parameter", async () => {
      const api = useApi()

      const listVariantsRes = await api.get(
        `/admin/variants?expand=inventory_items`,
        adminHeaders
      )

      expect(listVariantsRes.status).toEqual(200)
      expect(listVariantsRes.data.variants.length).toEqual(1)
      expect(listVariantsRes.data.variants[0]).toEqual(
        expect.objectContaining({
          id: variantId,
          inventory_items: [
            expect.objectContaining({
              inventory_item_id: invItem.id,
              variant_id: variantId,
            }),
          ],
        })
      )
    })

    it("sets availability correctly", async () => {
      const api = useApi()

      const response = await api.get(`/store/variants?ids=${variantId}`)

      expect(response.data).toEqual({
        variants: [
          expect.objectContaining({
            purchasable: true,
            inventory_quantity: 10,
          }),
        ],
      })
    })
  })
})
