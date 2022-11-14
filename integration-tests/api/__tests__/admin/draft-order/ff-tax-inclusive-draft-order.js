const path = require("path")

const draftOrderSeeder = require("../../../helpers/draft-order-seeder")
const adminSeeder = require("../../../helpers/admin-seeder")
const {
  simpleDiscountFactory,
  simpleRegionFactory,
  simpleShippingOptionFactory,
} = require("../../../factories")
const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default
const { useDb } = require("../../../../helpers/use-db")
const { useApi } = require("../../../../helpers/use-api")

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/draft-orders", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
      verbose: true,
    })

    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /admin/draft-orders", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await draftOrderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a draft order cart", async () => {
      const api = useApi()

      await simpleRegionFactory(dbConnection, {
        id: "tip-region",
        includes_tax: true,
        currency_code: "usd",
      })

      await dbConnection.manager.query(
        `update currency set includes_tax = true where code = 'usd'`
      )

      await simpleDiscountFactory(dbConnection, {
        code: "testytest",
        regions: ["tip-region"],
      })
      await simpleShippingOptionFactory(dbConnection, {
        id: "tip-option",
        price: 100,
        region_id: "tip-region",
      })

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        discounts: [{ code: "testytest" }],
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "tip-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "tip-option",
          },
        ],
      }

      const response = await api
        .post("/admin/draft-orders", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
    })
  })
})
