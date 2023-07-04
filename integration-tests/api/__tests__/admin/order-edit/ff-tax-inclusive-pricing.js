const path = require("path")
const { IdMap } = require("medusa-test-utils")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")

const {
  simpleProductFactory,
  simpleRegionFactory,
  simpleCartFactory,
} = require("../../../factories")

jest.setTimeout(30000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/order-edits", () => {
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

  describe("Items totals", () => {
    let product1
    const prodId1 = IdMap.getId("prodId1")
    const lineItemId1 = IdMap.getId("line-item-1")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      product1 = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("decorates items with (tax-inclusive) totals", async () => {
      const taxInclusiveRegion = await simpleRegionFactory(dbConnection, {
        tax_rate: 25,
        includes_tax: true,
      })

      const taxInclusiveCart = await simpleCartFactory(dbConnection, {
        email: "adrien@test.com",
        region: taxInclusiveRegion.id,
        line_items: [
          {
            id: lineItemId1,
            variant_id: product1.variants[0].id,
            quantity: 2,
            unit_price: 10000,
            includes_tax: true,
          },
        ],
      })

      const api = useApi()

      await api.post(`/store/carts/${taxInclusiveCart.id}/payment-sessions`)

      const completeRes = await api.post(
        `/store/carts/${taxInclusiveCart.id}/complete`
      )

      const order = completeRes.data.data

      const response = await api.post(
        `/admin/order-edits/`,
        {
          order_id: order.id,
          internal_note: "This is an internal note",
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              // 2x items | unit_price: 10000 (tax incl.) | 25% tax
              original_item_id: lineItemId1,
              subtotal: 2 * 8000,
              discount_total: 0,
              total: 2 * 10000,
              unit_price: 10000,
              original_total: 2 * 10000,
              original_tax_total: 2 * 2000,
              tax_total: 2 * 2000,
            }),
          ]),
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 16000,
          tax_total: 4000,
          total: 20000,
          difference_due: 0,
        })
      )
    })

    it("decorates items with (tax-exclusive) totals", async () => {
      const taxInclusiveRegion = await simpleRegionFactory(dbConnection, {
        tax_rate: 25,
      })

      const cart = await simpleCartFactory(dbConnection, {
        email: "adrien@test.com",
        region: taxInclusiveRegion.id,
        line_items: [
          {
            id: lineItemId1,
            variant_id: product1.variants[0].id,
            quantity: 2,
            unit_price: 10000,
          },
        ],
      })

      const api = useApi()

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const order = completeRes.data.data

      const response = await api.post(
        `/admin/order-edits/`,
        {
          order_id: order.id,
          internal_note: "This is an internal note",
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              original_item_id: lineItemId1,
              subtotal: 2 * 10000,
              discount_total: 0,
              unit_price: 10000,
              total: 2 * 10000 + 2 * 2500,
              original_total: 2 * 10000 + 2 * 2500,
              original_tax_total: 2 * 2500,
              tax_total: 2 * 2500,
            }),
          ]),
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 20000,
          tax_total: 5000,
          total: 25000,
          difference_due: 0,
        })
      )
    })
  })
})
