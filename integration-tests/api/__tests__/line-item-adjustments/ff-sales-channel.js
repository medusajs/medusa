const path = require("path")

const { useDb } = require("../../../helpers/use-db")
const cartSeeder = require("../../helpers/cart-seeder")
const { useApi } = require("../../../helpers/use-api")

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
    try {
      const [process, connection] = await startServerWithEnvironment({
        cwd,
        env: { MEDUSA_FF_SALES_CHANNELS: true },
        verbose: false,
      })
      dbConnection = connection
      medusaProcess = process
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  beforeEach(async () => {
    try {
      await cartSeeder(dbConnection)
    } catch (err) {
      console.log(err)
      throw err
    }
  })

  afterEach(async () => {
    await doAfterEach()
  })

  describe("Adding line item with associated sales channel", () => {
    it("adding line item to a cart with associated sales channel returns 400", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-with-sales-channel/line-items",
          {
            variant_id: "test-variant-quantity", // variant's product doesn't belong to a sales channel
            validate_sales_channels: true,
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
            validate_sales_channels: true,
            quantity: 1,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.cart).toEqual(
        expect.objectContaining({
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
      )
    })
  })
})
