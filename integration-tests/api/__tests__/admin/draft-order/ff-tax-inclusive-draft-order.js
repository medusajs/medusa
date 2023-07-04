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

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/draft-orders", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
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
        id: "taxincl-region",
        includes_tax: true,
        currency_code: "usd",
      })

      await dbConnection.manager.query(
        `update currency
         set includes_tax = true
         where code = 'usd'`
      )

      await simpleDiscountFactory(dbConnection, {
        code: "testytest",
        regions: ["taxincl-region"],
      })
      await simpleShippingOptionFactory(dbConnection, {
        id: "taxincl-option",
        price: 100,
        region_id: "taxincl-region",
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
        region_id: "taxincl-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "taxincl-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )
      expect(response.status).toEqual(200)
    })

    it("creates a draft order with discount and line item", async () => {
      const api = useApi()

      await simpleRegionFactory(dbConnection, {
        id: "taxincl-region",
        includes_tax: true,
        currency_code: "usd",
      })

      await dbConnection.manager.query(
        `update currency
         set includes_tax = true
         where code = 'usd'`
      )

      await simpleDiscountFactory(dbConnection, {
        id: "disc_testytest",
        code: "testytest",
        regions: ["taxincl-region"],
      })
      await simpleShippingOptionFactory(dbConnection, {
        id: "taxincl-option",
        price: 100,
        region_id: "taxincl-region",
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
        region_id: "taxincl-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "taxincl-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )

      const draftOrder = response.data.draft_order
      const lineItemId = draftOrder.cart.items[0].id

      expect(response.status).toEqual(200)
      expect(draftOrder.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            unit_price: 8000,
            quantity: 2,
            adjustments: expect.arrayContaining([
              expect.objectContaining({
                item_id: lineItemId,
                amount: 1600,
                description: "discount",
                discount_id: "disc_testytest",
              }),
            ]),
          }),
        ])
      )
    })
  })
})
