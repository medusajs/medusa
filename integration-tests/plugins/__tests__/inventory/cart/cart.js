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
const cartSeeder = require("../../../../helpers/cart-seeder")
const { simpleProductFactory } = require("../../../../factories")
const { simpleSalesChannelFactory } = require("../../../../factories")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")

jest.setTimeout(60000)

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("/store/carts", () => {
  let shutdownServer
  let appContainer
  let dbConnection

  let variantId
  let inventoryItemId
  let locationId

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

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

  describe("POST /store/carts/:id", () => {
    beforeEach(async () => {
      await simpleSalesChannelFactory(dbConnection, {
        id: "test-channel",
        is_default: true,
      })

      await adminSeeder(dbConnection)
      await cartSeeder(dbConnection, { sales_channel_id: "test-channel" })

      await simpleProductFactory(
        dbConnection,
        {
          id: "product1",
          sales_channels: [{ id: "test-channel" }],
          variants: [],
        },
        100
      )

      const api = useApi()

      // Add payment provider
      await api.post(
        `/admin/regions/test-region/payment-providers`,
        {
          provider_id: "test-pay",
        },
        adminHeaders
      )

      const prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const response = await api.post(
        `/admin/products/product1/variants`,
        {
          title: "Test Variant w. inventory",
          sku: "MY_SKU",
          material: "material",
          origin_country: "UK",
          hs_code: "hs001",
          mid_code: "mids",
          weight: 300,
          length: 100,
          height: 200,
          width: 150,
          options: [
            {
              option_id: "product1-option",
              value: "SS",
            },
          ],
          manage_inventory: true,
          prices: [{ currency_code: "usd", amount: 2300 }],
        },
        adminHeaders
      )

      const variant = response.data.product.variants[0]

      variantId = variant.id

      const inventoryItems =
        await prodVarInventoryService.listInventoryItemsByVariant(variantId)

      inventoryItemId = inventoryItems[0].id

      // Add Stock location
      const stockRes = await api.post(
        `/admin/stock-locations`,
        {
          name: "Fake Warehouse",
        },
        adminHeaders
      )
      locationId = stockRes.data.stock_location.id

      // Add stock level
      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: locationId,
          stocked_quantity: 5,
        },
        adminHeaders
      )

      // Associate Stock Location with sales channel
      await api.post(
        `/admin/sales-channels/test-channel/stock-locations`,
        {
          location_id: locationId,
        },
        adminHeaders
      )
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("reserve quantity when completing the cart", async () => {
      const api = useApi()

      const cartId = "test-cart"

      // Add standard line item to cart
      await api.post(
        `/store/carts/${cartId}/line-items`,
        {
          variant_id: variantId,
          quantity: 3,
        },
        { withCredentials: true }
      )

      await api.post(`/store/carts/${cartId}/payment-sessions`)
      await api.post(`/store/carts/${cartId}/payment-session`, {
        provider_id: "test-pay",
      })

      const getRes = await api.post(`/store/carts/${cartId}/complete`)

      expect(getRes.status).toEqual(200)
      expect(getRes.data.type).toEqual("order")

      const inventoryService = appContainer.resolve("inventoryService")
      const stockLevel = await inventoryService.retrieveInventoryLevel(
        inventoryItemId,
        locationId
      )

      expect(stockLevel.location_id).toEqual(locationId)
      expect(stockLevel.inventory_item_id).toEqual(inventoryItemId)
      expect(stockLevel.reserved_quantity).toEqual(3)
      expect(stockLevel.stocked_quantity).toEqual(5)
    })

    it("removes reserved quantity when failing to complete the cart", async () => {
      const api = useApi()

      const cartRes = await api.post(
        `/store/carts`,
        {
          region_id: "test-region",
          items: [
            {
              variant_id: variantId,
              quantity: 3,
            },
          ],
        },
        { withCredentials: true }
      )

      const cartId = cartRes.data.cart.id

      await api.post(`/store/carts/${cartId}/payment-sessions`)
      await api.post(`/store/carts/${cartId}/payment-session`, {
        provider_id: "test-pay",
      })

      const getRes = await api
        .post(`/store/carts/${cartId}/complete`)
        .catch((err) => err)

      expect(getRes.response.status).toEqual(400)
      expect(getRes.response.data).toEqual({
        type: "invalid_data",
        message: "Cannot create an order from the cart without a customer",
      })

      const inventoryService = appContainer.resolve("inventoryService")
      const [, count] = await inventoryService.listReservationItems({
        line_item_id: cartRes.data.cart.items.map((i) => i.id),
      })
      expect(count).toEqual(0)
    })

    it("should decorate line item variant inventory_quantity when creating a line-item", async () => {
      const api = useApi()

      const cartId = "test-cart"

      // Add standard line item to cart
      const addCart = await api
        .post(
          `/store/carts/${cartId}/line-items`,
          {
            variant_id: variantId,
            quantity: 3,
          },
          { withCredentials: true }
        )
        .catch((e) => e)

      expect(addCart.status).toEqual(200)
      expect(addCart.data.cart.items[0].variant.inventory_quantity).toEqual(5)
    })

    it("should decorate line item variant inventory_quantity when getting cart", async () => {
      const api = useApi()

      const cartId = "test-cart"

      // Add standard line item to cart
      await api
        .post(
          `/store/carts/${cartId}/line-items`,
          {
            variant_id: variantId,
            quantity: 3,
          },
          { withCredentials: true }
        )
        .catch((e) => e)

      const cartResponse = await api
        .get(`/store/carts/${cartId}`, { withCredentials: true })
        .catch((e) => e)

      expect(cartResponse.status).toEqual(200)
      expect(
        cartResponse.data.cart.items[0].variant.inventory_quantity
      ).toEqual(5)
    })

    it("fails to add a item on the cart if the inventory isn't enough", async () => {
      const api = useApi()

      const cartId = "test-cart"

      // Add standard line item to cart
      const addCart = await api
        .post(
          `/store/carts/${cartId}/line-items`,
          {
            variant_id: variantId,
            quantity: 6,
          },
          { withCredentials: true }
        )
        .catch((e) => e)

      expect(addCart.response.status).toEqual(400)
      expect(addCart.response.data.code).toEqual("insufficient_inventory")
      expect(addCart.response.data.message).toEqual(
        `Variant with id: ${variantId} does not have the required inventory`
      )
    })

    it("fails to complete cart with items inventory not covered", async () => {
      const api = useApi()

      const cartId = "test-cart"

      // Add standard line item to cart
      await api.post(
        `/store/carts/${cartId}/line-items`,
        {
          variant_id: variantId,
          quantity: 5,
        },
        { withCredentials: true }
      )

      await api.post(`/store/carts/${cartId}/payment-sessions`)
      await api.post(`/store/carts/${cartId}/payment-session`, {
        provider_id: "test-pay",
      })

      // Another proccess reserves items before the cart is completed
      const inventoryService = appContainer.resolve("inventoryService")
      inventoryService.createReservationItem({
        line_item_id: "line_item_123",
        inventory_item_id: inventoryItemId,
        location_id: locationId,
        quantity: 2,
      })

      const completeCartRes = await api
        .post(`/store/carts/${cartId}/complete`)
        .catch((e) => e)

      expect(completeCartRes.response.status).toEqual(409)
      expect(completeCartRes.response.data.errors[0].code).toEqual(
        "insufficient_inventory"
      )
      expect(completeCartRes.response.data.errors[0].message).toEqual(
        `Variant with id: ${variantId} does not have the required inventory`
      )

      const stockLevel = await inventoryService.retrieveInventoryLevel(
        inventoryItemId,
        locationId
      )

      expect(stockLevel.location_id).toEqual(locationId)
      expect(stockLevel.inventory_item_id).toEqual(inventoryItemId)
      expect(stockLevel.reserved_quantity).toEqual(2)
      expect(stockLevel.stocked_quantity).toEqual(5)
    })
  })
})
