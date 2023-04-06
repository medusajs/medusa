const path = require("path")

const { useDb } = require("../../../helpers/use-db")
const { useApi } = require("../../../helpers/use-api")
const { simpleCartFactory, simpleProductFactory } = require("../../factories")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default

jest.setTimeout(30000)

describe("Line Item - Sales Channel", () => {
  let dbConnection
  let medusaProcess

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

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

  beforeEach(async () => {
    await simpleProductFactory(dbConnection, {
      id: "test-product-in-sales-channel",
      title: "test product belonging to a channel",
      sales_channels: [
        {
          id: "main-sales-channel",
          name: "Main sales channel",
          description: "Main sales channel",
          is_disabled: false,
        },
      ],
      variants: [
        {
          id: "test-variant-sales-channel",
          title: "test variant in sales channel",
          product_id: "test-product-in-sales-channel",
          inventory_quantity: 1000,
          prices: [
            {
              currency: "usd",
              amount: 59,
            },
          ],
        },
      ],
    })

    await simpleProductFactory(dbConnection, {
      id: "test-product-no-sales-channel",
      variants: [
        {
          id: "test-variant-no-sales-channel",
        },
      ],
    })

    await simpleCartFactory(dbConnection, {
      id: "test-cart-with-sales-channel",
      sales_channel: {
        id: "main-sales-channel",
      },
    })
  })

  afterEach(async () => {
    await doAfterEach()
  })

  describe("Adding line item with associated sales channel to a cart", () => {
    it("adding line item to a cart with associated sales channel returns 400", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-with-sales-channel/line-items",
          {
            variant_id: "test-variant-no-sales-channel", // variant's product doesn't belong to a sales channel
            quantity: 1,
          },
          { withCredentials: true }
        )
        .catch((err) => err.response)

      expect(response.status).toEqual(400)
      expect(response.data.type).toEqual("invalid_data")
    })

    it("adding line item successfully if product and cart belong to the same sales channel", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-with-sales-channel/line-items",
          {
            variant_id: "test-variant-sales-channel",
            quantity: 1,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.cart).toMatchObject({
        id: "test-cart-with-sales-channel",
        items: [
          expect.objectContaining({
            cart_id: "test-cart-with-sales-channel",
            description: "test variant in sales channel",
            title: "test product belonging to a channel",
            variant_id: "test-variant-sales-channel",
          }),
        ],
        sales_channel_id: "main-sales-channel",
      })
    })
  })
})
