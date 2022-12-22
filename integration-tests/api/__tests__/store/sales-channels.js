const path = require("path")

const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const {
  simpleSalesChannelFactory,
  simpleCartFactory,
  simpleRegionFactory,
  simpleProductFactory,
} = require("../../factories")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(50000)

describe("sales channels", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
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

  describe("POST /store/cart/", () => {
    let salesChannel
    let disabledSalesChannel

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await simpleRegionFactory(dbConnection, {
        name: "Test region",
        tax_rate: 0,
      })
      await simpleSalesChannelFactory(dbConnection, {
        name: "Default Sales Channel",
        description: "Created by Medusa",
        is_default: true,
      })
      disabledSalesChannel = await simpleSalesChannelFactory(dbConnection, {
        name: "disabled cart sales channel",
        description: "disabled cart sales channel description",
        is_disabled: true,
      })
      salesChannel = await simpleSalesChannelFactory(dbConnection, {
        name: "cart sales channel",
        description: "cart sales channel description",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a cart with the default sales channel", async () => {
      const api = useApi()

      const response = await api.post(`/store/carts`, {}, adminReqConfig)

      expect(response.data.cart.sales_channel).toBeTruthy()
      expect(response.data.cart.sales_channel).toEqual(
        expect.objectContaining({
          name: "Default Sales Channel",
          description: "Created by Medusa",
        })
      )
    })

    it("returns a cart with the given sales channel", async () => {
      const api = useApi()

      const response = await api.post(
        `/store/carts`,
        { sales_channel_id: salesChannel.id },
        adminReqConfig
      )

      expect(response.data.cart.sales_channel).toBeTruthy()
      expect(response.data.cart.sales_channel).toEqual(
        expect.objectContaining({
          name: salesChannel.name,
          description: salesChannel.description,
        })
      )
    })

    it("throw if the given sales channel is disabled", async () => {
      const api = useApi()

      const err = await api
        .post(
          `/store/carts`,
          { sales_channel_id: disabledSalesChannel.id },
          adminReqConfig
        )
        .catch((err) => err)

      expect(err.response.status).toEqual(400)
      expect(err.response.data.message).toBe(
        `Unable to assign the cart to a disabled Sales Channel "disabled cart sales channel"`
      )
    })
  })

  describe("POST /store/cart/:id", () => {
    let salesChannel1
    let salesChannel2
    let disabledSalesChannel
    let product1
    let product2
    let cart

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await simpleRegionFactory(dbConnection, {
        name: "Test region",
        currency_code: "usd",
        tax_rate: 0,
      })

      salesChannel1 = await simpleSalesChannelFactory(dbConnection, {
        name: "salesChannel1",
        description: "salesChannel1",
      })
      salesChannel2 = await simpleSalesChannelFactory(dbConnection, {
        name: "salesChannel2",
        description: "salesChannel2",
      })
      disabledSalesChannel = await simpleSalesChannelFactory(dbConnection, {
        name: "disabled cart sales channel",
        description: "disabled cart sales channel description",
        is_disabled: true,
      })

      product1 = await simpleProductFactory(dbConnection, {
        title: "prod 1",
        sales_channels: [salesChannel1],
        variants: [
          {
            id: "test-variant",
            prices: [
              {
                amount: 50,
                currency: "usd",
                variant_id: "test-variant",
              },
            ],
          },
        ],
      })
      product2 = await simpleProductFactory(dbConnection, {
        sales_channels: [salesChannel2],
        variants: [
          {
            id: "test-variant-2",
            prices: [
              {
                amount: 100,
                currency: "usd",
                variant_id: "test-variant-2",
              },
            ],
          },
        ],
      })

      cart = await simpleCartFactory(dbConnection, {
        sales_channel: salesChannel1,
        line_items: [
          {
            variant_id: "test-variant",
            unit_price: 50,
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates a cart sales channels should remove the items that does not belongs to the new sales channel", async () => {
      const api = useApi()

      let response = await api.get(`/store/carts/${cart.id}`, adminReqConfig)

      expect(response.data.cart.sales_channel).toBeTruthy()
      expect(response.data.cart.sales_channel).toEqual(
        expect.objectContaining({
          name: salesChannel1.name,
          description: salesChannel1.description,
        })
      )
      expect(response.data.cart.items.length).toBe(1)
      expect(response.data.cart.items[0].variant.product).toEqual(
        expect.objectContaining({
          id: product1.id,
          title: product1.title,
        })
      )

      response = await api.post(
        `/store/carts/${cart.id}`,
        { sales_channel_id: salesChannel2.id },
        adminReqConfig
      )

      expect(response.data.cart.sales_channel).toBeTruthy()
      expect(response.data.cart.sales_channel).toEqual(
        expect.objectContaining({
          name: salesChannel2.name,
          description: salesChannel2.description,
        })
      )
      expect(response.data.cart.items.length).toBe(0)
    })

    it("throw if the given sales channel is disabled", async () => {
      const api = useApi()

      const err = await api
        .post(
          `/store/carts/${cart.id}`,
          { sales_channel_id: disabledSalesChannel.id },
          adminReqConfig
        )
        .catch((err) => err)

      expect(err.response.status).toEqual(400)
      expect(err.response.data.message).toBe(
        `Unable to assign the cart to a disabled Sales Channel "disabled cart sales channel"`
      )
    })
  })

  describe("GET /store/cart/:id", () => {
    let cart

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      cart = await simpleCartFactory(dbConnection, {
        sales_channel: {
          name: "test name",
          description: "test description",
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns cart with sales channel for single cart", async () => {
      const api = useApi()

      const response = await api.get(`/store/carts/${cart.id}`, adminReqConfig)

      expect(response.data.cart.sales_channel).toBeTruthy()
      expect(response.data.cart.sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: "test name",
        description: "test description",
        is_disabled: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("GET /store/products", () => {
    let salesChannel1
    let salesChannel2
    let product1
    let product2
    beforeEach(async () => {
      salesChannel1 = await simpleSalesChannelFactory(dbConnection, {
        name: "salesChannel1",
        description: "salesChannel1",
      })

      salesChannel2 = await simpleSalesChannelFactory(dbConnection, {
        name: "salesChannel2",
        description: "salesChannel2",
      })

      product1 = await simpleProductFactory(dbConnection, {
        title: "prod 1",
        status: "published",
        sales_channels: [salesChannel1],
      })

      product2 = await simpleProductFactory(dbConnection, {
        title: "prod 2",
        status: "published",
        sales_channels: [salesChannel2],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns products from a specific sales channel", async () => {
      const api = useApi()

      const response = await api.get(
        `/store/products?sales_channel_id[]=${salesChannel1.id}`
      )

      expect(response.data.products.length).toBe(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
          }),
        ])
      )
    })

    it("returns products from multiples sales channels", async () => {
      const api = useApi()

      const response = await api.get(
        `/store/products?sales_channel_id[]=${salesChannel1.id}&sales_channel_id[]=${salesChannel2.id}`
      )

      expect(response.data.products.length).toBe(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
          }),
        ])
      )
    })

    it("returns all products by default", async () => {
      const api = useApi()

      const response = await api.get(`/store/products`)

      expect(response.data.products.length).toBe(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
          }),
        ])
      )
    })
  })
})
