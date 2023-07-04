const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleRegionFactory,
  simpleCartFactory,
  simpleGiftCardFactory,
  simpleProductFactory,
} = require("../../factories")

jest.setTimeout(30000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("Order Totals", () => {
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

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  describe("GET /admin/orders/:id/totals", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleProductFactory(dbConnection, {
        variants: [
          { id: "variant_1", prices: [{ currency: "usd", amount: 95600 }] },
          { id: "variant_2", prices: [{ currency: "usd", amount: 79600 }] },
        ],
      })
    })

    it("calculates totals correctly for order with non-taxable gift card", async () => {
      const api = useApi()

      // Seed data
      const region = await simpleRegionFactory(dbConnection, {
        gift_cards_taxable: false,
        tax_rate: 25,
      })

      const cart = await simpleCartFactory(dbConnection, {
        id: "test-cart",
        email: "testnation@medusajs.com",
        region: region.id,
        line_items: [],
      })

      const giftCard = await simpleGiftCardFactory(dbConnection, {
        region_id: region.id,
        value: 160000,
        balance: 160000,
      })

      // Add variant 1 to cart
      await api.post("/store/carts/test-cart/line-items", {
        quantity: 1,
        variant_id: "variant_1",
      })

      // Add variant 2 to cart
      await api.post("/store/carts/test-cart/line-items", {
        quantity: 1,
        variant_id: "variant_2",
      })

      // Add gift card to cart
      await api.post("/store/carts/test-cart", {
        gift_cards: [{ code: giftCard.code }],
      })

      // Init payment sessions
      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      // Complete cart
      const response = await api.post(`/store/carts/test-cart/complete`)

      expect(response.status).toEqual(200)
      expect(response.data.type).toEqual("order")
      const orderId = response.data.data.id

      // Retrieve the completed order
      const { data } = await api.get(`/admin/orders/${orderId}`, adminReqConfig)

      expect(data.order.gift_card_transactions).toHaveLength(1)
      expect(data.order.gift_card_transactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 160000,
            is_taxable: false,
            tax_rate: null,
          }),
        ])
      )
      expect(data.order.gift_card_total).toEqual(160000)
      expect(data.order.gift_card_tax_total).toEqual(0)
      expect(data.order.total).toEqual(59000)
    })

    it("calculates totals correctly for order with taxable gift card", async () => {
      const api = useApi()
      // Seed data
      const region = await simpleRegionFactory(dbConnection, {
        gift_cards_taxable: true,
        tax_rate: 25,
      })

      const cart = await simpleCartFactory(dbConnection, {
        id: "test-cart",
        email: "testnation@medusajs.com",
        region: region.id,
        line_items: [],
      })

      const giftCard = await simpleGiftCardFactory(dbConnection, {
        region_id: region.id,
        value: 160000,
        balance: 160000,
        tax_rate: 25,
      })

      // Add variant 1 to cart
      await api.post("/store/carts/test-cart/line-items", {
        quantity: 1,
        variant_id: "variant_1",
      })

      // Add variant 2 to cart
      await api.post("/store/carts/test-cart/line-items", {
        quantity: 1,
        variant_id: "variant_2",
      })

      // Add gift card to cart
      await api.post("/store/carts/test-cart", {
        gift_cards: [{ code: giftCard.code }],
      })

      // Init payment sessions
      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      // Complete cart
      const response = await api.post(`/store/carts/test-cart/complete`)

      expect(response.status).toEqual(200)
      expect(response.data.type).toEqual("order")
      const orderId = response.data.data.id

      // Retrieve the completed order
      const { data } = await api.get(`/admin/orders/${orderId}`, adminReqConfig)

      expect(data.order.gift_card_transactions).toHaveLength(1)
      expect(data.order.gift_card_transactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 160000,
            is_taxable: true,
            tax_rate: 25,
          }),
        ])
      )
      expect(data.order.gift_card_total).toEqual(160000)
      expect(data.order.gift_card_tax_total).toEqual(40000)
      expect(data.order.tax_total).toEqual(3800)
      expect(data.order.total).toEqual(19000)
    })
  })
})
