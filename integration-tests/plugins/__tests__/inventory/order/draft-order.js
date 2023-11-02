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
const {
  simpleProductFactory,
  simpleCustomerFactory,
} = require("../../../../factories")
const {
  simpleRegionFactory,
  simpleShippingOptionFactory,
} = require("../../../../factories")
const {
  simpleAddressFactory,
} = require("../../../../factories/simple-address-factory")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")

jest.setTimeout(30000)

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("/store/carts", () => {
  let shutdownServer
  let appContainer
  let dbConnection

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

  beforeEach(async () => {})

  describe("POST /store/carts", () => {
    const variantId = "test-variant"

    let region
    let invItemId
    let prodVarInventoryService
    let inventoryService
    let lineItemService
    let stockLocationService
    let salesChannelLocationService

    let address
    let shippingOption
    let customer

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      const api = useApi()

      prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )
      lineItemService = appContainer.resolve("lineItemService")
      inventoryService = appContainer.resolve("inventoryService")
      stockLocationService = appContainer.resolve("stockLocationService")
      salesChannelLocationService = appContainer.resolve(
        "salesChannelLocationService"
      )

      // create region
      region = await simpleRegionFactory(dbConnection, {})

      // create product
      const product = await simpleProductFactory(dbConnection, {
        variants: [{ id: variantId }],
      })

      const location = await stockLocationService.create({
        name: "test-location",
      })

      const invItem = await inventoryService.createInventoryItem({
        sku: "test-sku",
      })
      invItemId = invItem.id

      await inventoryService.createInventoryLevel({
        inventory_item_id: invItem.id,
        location_id: location.id,
        stocked_quantity: 10,
      })

      await prodVarInventoryService.attachInventoryItem(variantId, invItem.id)

      // create customer
      customer = await simpleCustomerFactory(dbConnection, {})

      address = await simpleAddressFactory(dbConnection, {})

      // create shipping option
      shippingOption = await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
      })
    })

    it("should create the order from a draft order and shouldn't adjust reservations", async () => {
      const api = useApi()
      let inventoryItem = await api.get(
        `/admin/inventory-items/${invItemId}`,
        adminHeaders
      )

      expect(inventoryItem.data.inventory_item.location_levels.length).toEqual(
        1
      )
      let locationLevel = inventoryItem.data.inventory_item.location_levels[0]

      expect(locationLevel.stocked_quantity).toEqual(10)
      expect(locationLevel.reserved_quantity).toEqual(0)

      const payload = {
        email: "test@test.dk",
        shipping_address: address.id,
        discounts: [],
        items: [
          {
            variant_id: variantId,
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: region.id,
        customer_id: customer.id,
        shipping_methods: [
          {
            option_id: shippingOption.id,
          },
        ],
      }

      const createResponse = await api.post(
        "/admin/draft-orders",
        payload,
        adminHeaders
      )
      expect(createResponse.status).toEqual(200)

      const registerPaymentResponse = await api.post(
        `/admin/draft-orders/${createResponse.data.draft_order.id}/pay`,
        payload,
        adminHeaders
      )
      expect(registerPaymentResponse.status).toEqual(200)

      inventoryItem = await api.get(
        `/admin/inventory-items/${invItemId}`,
        adminHeaders
      )

      expect(inventoryItem.data.inventory_item.location_levels.length).toEqual(
        1
      )
      locationLevel = inventoryItem.data.inventory_item.location_levels[0]

      expect(locationLevel.stocked_quantity).toEqual(10)
      expect(locationLevel.reserved_quantity).toEqual(0)
    })
  })
})
