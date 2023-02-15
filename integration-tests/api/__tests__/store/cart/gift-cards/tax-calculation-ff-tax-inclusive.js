const startServerWithEnvironment =
  require("../../../../../helpers/start-server-with-environment").default
const path = require("path")
const { useApi } = require("../../../../../helpers/use-api")
const { useDb } = require("../../../../../helpers/use-db")
const { GiftCard, TaxRate } = require("@medusajs/medusa")

const {
  simpleRegionFactory,
  simpleProductFactory,
  simpleCartFactory,
  simpleCustomerFactory,
  simpleGiftCardFactory,
} = require("../../../../factories")

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] Gift Card - Tax calculations", () => {
  let medusaProcess
  let dbConnection
  let customerData

  beforeEach(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterEach(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /store/carts/:id", () => {
    let product
    let customer
    let region

    beforeEach(async () => {
      region = await simpleRegionFactory(dbConnection, {
        id: "tax-region",
        currency_code: "usd",
        countries: ["us"],
        tax_rate: 19,
        name: "region test",
        includes_tax: true,
      })

      customer = await simpleCustomerFactory(dbConnection, {
        password: "medusatest",
      })
      customerData = {
        email: customer.email,
        password: "medusatest",
        first_name: customer.first_name,
        last_name: customer.last_name,
      }

      product = await simpleProductFactory(dbConnection, {
        is_giftcard: true,
        discountable: false,
        options: [{ id: "denom", title: "Denomination" }],
        variants: [
          {
            title: "Gift Card",
            prices: [
              {
                amount: 30000,
                currency: "usd",
                region_id: region.id,
              },
            ],
            options: [{ option_id: "denom", value: "Denomination" }],
          },
        ],
      })
    })

    it("adding a gift card purchase to cart treats it like buying a product", async () => {
      const api = useApi()
      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const createCartRes = await api.post("/store/carts", {
        region_id: region.id,
        items: [
          {
            variant_id: product.variants[0].id,
            quantity: 1,
          },
        ],
      })

      expect(createCartRes.status).toEqual(200)

      const cartWithGiftcard = createCartRes.data.cart
      await api.post(`/store/carts/${cartWithGiftcard.id}`, {
        customer_id: customerRes.data.customer.id,
      })

      expect(cartWithGiftcard.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            is_giftcard: true,
            unit_price: 30000,
            quantity: 1,
            subtotal: 25210,
            tax_total: 4790,
            original_tax_total: 4790,
            original_total: 30000,
            total: 30000,
            variant: expect.objectContaining({
              id: product.variants[0].id,
              product: expect.objectContaining({
                is_giftcard: true,
              }),
            }),
          }),
        ])
      )
    })

    it("purchasing a gift card via an order creates a gift card entity", async () => {
      const api = useApi()
      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const cartFactory = await simpleCartFactory(dbConnection, {
        customer,
        region,
      })

      const response = await api.post(
        `/store/carts/${cartFactory.id}/line-items`,
        {
          variant_id: product.variants[0].id,
          quantity: 1,
        },
        { withCredentials: true }
      )

      const getCartResponse = await api.get(`/store/carts/${cartFactory.id}`)
      const cart = getCartResponse.data.cart
      await api.post(`/store/carts/${cart.id}/payment-sessions`)
      const createdOrder = await api.post(
        `/store/carts/${cart.id}/complete-cart`
      )

      const createdGiftCards = await dbConnection.manager.find(GiftCard, {
        where: { order_id: createdOrder.data.data.id },
      })
      const createdGiftCard = createdGiftCards[0]

      expect(createdOrder.data.type).toEqual("order")
      expect(createdOrder.status).toEqual(200)
      expect(createdGiftCards.length).toEqual(1)
      expect(createdGiftCard.tax_rate).toEqual(19)
      expect(createdGiftCard.value).toEqual(25210)
      expect(createdGiftCard.balance).toEqual(25210)
    })

    it("applying a gift card shows correct total values", async () => {
      const api = useApi()
      const giftCard = await simpleGiftCardFactory(dbConnection, {
        region_id: region.id,
        value: 25210,
        balance: 25210,
        tax_rate: region.tax_rate,
      })
      const expensiveProduct = await simpleProductFactory(dbConnection, {
        variants: [
          {
            title: "Product cost higher than gift card balance",
            prices: [
              {
                amount: 50000,
                currency: "usd",
                region_id: region.id,
              },
            ],
          },
        ],
      })

      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const cartFactory = await simpleCartFactory(dbConnection, {
        customer,
        region,
        line_items: [],
      })

      const response = await api.post(
        `/store/carts/${cartFactory.id}/line-items`,
        {
          variant_id: expensiveProduct.variants[0].id,
          quantity: 1,
        },
        { withCredentials: true }
      )

      // Add gift card to cart
      await api.post(`/store/carts/${cartFactory.id}`, {
        gift_cards: [{ code: giftCard.code }],
      })

      const getCartResponse = await api.get(`/store/carts/${cartFactory.id}`)
      const cart = getCartResponse.data.cart
      await api.post(`/store/carts/${cart.id}/payment-sessions`)
      const createdOrder = await api.post(
        `/store/carts/${cart.id}/complete-cart`
      )

      expect(createdOrder.data.data).toEqual(
        expect.objectContaining({
          subtotal: 42017,
          discount_total: 0,
          shipping_total: 0,
          refunded_total: 0,
          paid_total: 20000,
          refundable_amount: 20000,
          gift_card_total: 25210,
          gift_card_tax_total: 4790,
          tax_total: 3193,
          total: 20000,
          items: expect.arrayContaining([
            expect.objectContaining({
              includes_tax: true,
              unit_price: 50000,
              is_giftcard: false,
              quantity: 1,
              subtotal: 42017,
              discount_total: 0,
              total: 50000,
              original_total: 50000,
              original_tax_total: 7983,
              tax_total: 7983,
              refundable: 50000,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 19,
                }),
              ]),
            }),
          ]),
        })
      )
    })
  })
})
