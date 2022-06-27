const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")
const {
  simpleRegionFactory,
  simpleProductFactory,
  simpleProductTaxRateFactory,
} = require("../../factories")

const adminSeeder = require("../../helpers/admin-seeder")
const promotionsSeeder = require("../../helpers/price-selection-seeder")

jest.setTimeout(30000)

describe("Cart Totals Calculations", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("Money amount", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await promotionsSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("calculated_price contains lowest price", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)
      await simpleProductTaxRateFactory(dbConnection, {
        product_id: product.id,
        rate: {
          region_id: region.id,
          rate: 10,
        },
      })

      // create cart
      const { cart } = await api
        .post("/store/carts", {
          region_id: region.id,
        })
        .then((res) => res.data)

      // add product to cart
      const res = await api.post(`/store/carts/${cart.id}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })

      expect(res.data.cart.items[0].unit_price).toEqual(100)
      expect(res.data.cart.items[0].quantity).toEqual(1)
      expect(res.data.cart.items[0].subtotal).toEqual(100)
      expect(res.data.cart.items[0].tax_total).toEqual(10)
      expect(res.data.cart.items[0].total).toEqual(110)
      expect(res.data.cart.items[0].original_total).toEqual(110)
      expect(res.data.cart.items[0].original_tax_total).toEqual(10)
      expect(res.data.cart.items[0].discount_total).toEqual(0)
      expect(res.data.cart.items[0].gift_card_total).toEqual(0)
    })
  })
})
