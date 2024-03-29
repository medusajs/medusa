const path = require("path")

const startServerWithEnvironment =
  require("../../../../environment-helpers/start-server-with-environment").default
const { useApi } = require("../../../../environment-helpers/use-api")
const { useDb } = require("../../../../environment-helpers/use-db")

const {
  simpleRegionFactory,
  simpleProductFactory,
} = require("../../../../factories")

jest.setTimeout(30000)

const customerData = {
  email: "medusa@test.dk",
  password: "medusatest",
  first_name: "medusa",
  last_name: "medusa",
}

describe("[MEDUSA_FF_SALES_CHANNELS] /store/carts", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /store/carts/:id", () => {
    let product
    let product2
    let product3

    const salesChannelId = "sales-channel"
    const defaultSalesChannelId = "default-sales-channel"

    beforeEach(async () => {
      await simpleRegionFactory(dbConnection, {
        id: "test-region",
        currency_code: "usd",
        countries: ["us"],
        tax_rate: 20,
        name: "region test",
      })

      product = await simpleProductFactory(dbConnection, {
        sales_channels: [
          {
            id: salesChannelId,
            name: "Sales channel",
            description: "Sales channel",
            is_disabled: false,
          },
          {
            id: defaultSalesChannelId,
            name: "Main sales channel",
            description: "Main sales channel",
            is_default: true,
            is_disabled: false,
          },
        ],
      })

      product2 = await simpleProductFactory(dbConnection)

      product3 = await simpleProductFactory(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("should assign sales channel to order on cart completion", async () => {
      const api = useApi()

      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const createCartRes = await api.post("/store/carts", {
        region_id: "test-region",
        items: [
          {
            variant_id: product.variants[0].id,
            quantity: 1,
          },
        ],
        sales_channel_id: salesChannelId,
      })

      const cart = createCartRes.data.cart

      await api.post(`/store/carts/${cart.id}`, {
        customer_id: customerRes.data.customer.id,
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const createdOrder = await api.post(
        `/store/carts/${cart.id}/complete-cart`
      )

      expect(createdOrder.data.type).toEqual("order")
      expect(createdOrder.status).toEqual(200)
      expect(createdOrder.data.data).toEqual(
        expect.objectContaining({
          sales_channel_id: salesChannelId,
        })
      )
    })

    it("should assign default sales channel to order on cart completion", async () => {
      const api = useApi()

      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const createCartRes = await api.post("/store/carts", {
        region_id: "test-region",
        items: [
          {
            variant_id: product.variants[0].id,
            quantity: 1,
          },
        ],
      })

      const cart = createCartRes.data.cart

      await api.post(`/store/carts/${cart.id}`, {
        customer_id: customerRes.data.customer.id,
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const createdOrder = await api.post(
        `/store/carts/${cart.id}/complete-cart`
      )

      expect(createdOrder.data.type).toEqual("order")
      expect(createdOrder.status).toEqual(200)
      expect(createdOrder.data.data).toEqual(
        expect.objectContaining({
          sales_channel_id: "default-sales-channel",
        })
      )
    })

    it("should remove the line items that does not belong to the new sales channel", async () => {
      const api = useApi()

      let createCartRes = await api.post("/store/carts", {
        region_id: "test-region",
        items: [
          {
            variant_id: product.variants[0].id,
            quantity: 1,
          },
          {
            variant_id: product2.variants[0].id,
            quantity: 1,
          },
          {
            variant_id: product3.variants[0].id,
            quantity: 1,
          },
        ],
        sales_channel_id: defaultSalesChannelId,
      })

      let items = createCartRes.data.cart.items
      expect(items).toHaveLength(3)

      const cartId = createCartRes.data.cart.id
      createCartRes = await api.post(`/store/carts/${cartId}`, {
        sales_channel_id: salesChannelId,
      })

      items = createCartRes.data.cart.items
      expect(items).toHaveLength(1)
      expect(items.map((i) => i.variant.id)).toEqual([product.variants[0].id])
    })
  })
})
