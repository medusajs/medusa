const path = require("path")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")

const {
  simpleRegionFactory,
  simpleShippingOptionFactory,
  simpleOrderFactory
} = require("../../../factories");

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/orders", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
      verbose: false,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /admin/orders/:id/shipping-methods", () => {
    let includesTaxShippingOption
    let order

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        const shippingAddress = {
          id: "test-shipping-address",
          first_name: "lebron",
          country_code: "us",
        }
        const region = await simpleRegionFactory(dbConnection, {
          id: "test-region"
        })
        order = await simpleOrderFactory(dbConnection, {
          id: "test-order",
          region: region.id,
          shipping_address: shippingAddress,
          currency_code: "usd",
        })
        includesTaxShippingOption = await simpleShippingOptionFactory(dbConnection, {
          includes_tax: true,
          region_id: region.id
        })
      } catch (err) {
        console.log(err)
      }
    })

    afterEach(async() => {
      const db = useDb()
      return await db.teardown()
    })

    it("should add a normal shipping method to the order", async () => {
      const api = useApi()

      const orderWithShippingMethodRes = await api.post(
          `/admin/orders/${order.id}/shipping-methods`,
          {
            option_id: includesTaxShippingOption.id,
            price: 10,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
      )

      expect(orderWithShippingMethodRes.status).toEqual(200)
      expect(orderWithShippingMethodRes.data.order.shipping_methods)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            shipping_option_id: includesTaxShippingOption.id,
            includes_tax: true,
          })
        ]))
    })
  })
})
