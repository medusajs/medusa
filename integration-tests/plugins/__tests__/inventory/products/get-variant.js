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

describe("Get variant", () => {
  let appContainer
  let dbConnection
  let shutdownServer
  const productId = "test-product"
  const variantId = "test-variant"
  let invItem
  let salesChannelService
  let salesChannelLocationService
  let location
  let inventoryService

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
    inventoryService = appContainer.resolve("inventoryService")
    salesChannelService = appContainer.resolve("salesChannelService")
    salesChannelLocationService = appContainer.resolve(
      "salesChannelLocationService"
    )
    const stockLocationService = appContainer.resolve("stockLocationService")

    location = await stockLocationService.create({
      name: "test-location",
    })
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

  it("Expands inventory items when getting variant with expand parameters", async () => {
    const api = useApi()

    const res = await api.get(
      `/store/variants/${variantId}?expand=inventory_items`,
      adminHeaders
    )

    expect(res.status).toEqual(200)
    expect(res.data.variant).toEqual(
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
    const salesChannel = await simpleSalesChannelFactory(dbConnection, {
      is_default: true,
    })

    await salesChannelService.addProducts(salesChannel.id, [productId])

    await salesChannelLocationService.associateLocation(
      salesChannel.id,
      location.id
    )

    await inventoryService.createInventoryLevel({
      inventory_item_id: invItem.id,
      location_id: location.id,
      stocked_quantity: 10,
    })

    const api = useApi()

    const response = await api.get(`/store/variants/${variantId}`)

    expect(response.data).toEqual({
      variant: expect.objectContaining({
        purchasable: true,
        inventory_quantity: 10,
      }),
    })
  })
})
