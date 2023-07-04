const startServerWithEnvironment =
  require("../../../../../helpers/start-server-with-environment").default
const path = require("path")
const { useApi } = require("../../../../../helpers/use-api")
const { useDb } = require("../../../../../helpers/use-db")
const { GiftCard } = require("@medusajs/medusa")

const {
  simpleRegionFactory,
  simpleProductFactory,
  simpleCartFactory,
  simpleCustomerFactory,
  simpleGiftCardFactory,
} = require("../../../../factories")

jest.setTimeout(30000)

describe("Gift Card - Tax calculations", () => {
  let medusaProcess
  let dbConnection
  let customerData

  beforeEach(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: {},
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
        id: "tax-region-1",
        currency_code: "usd",
        countries: ["us"],
        tax_rate: 19,
        name: "region test",
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
            prices: [{ currency: "usd", amount: 30000, region_id: region.id }],
            options: [{ option_id: "denom", value: "Denomination" }],
          },
        ],
      })
    })

    it("adding a gift card purchase to cart treats it like buying a product", async () => {
      const api = useApi()
      const customerResponse = await api.post(
        "/store/customers",
        customerData,
        {
          withCredentials: true,
        }
      )

      const createCartResponse = await api.post("/store/carts", {
        region_id: region.id,
        items: [
          {
            variant_id: product.variants[0].id,
            quantity: 1,
          },
        ],
      })

      expect(createCartResponse.status).toEqual(200)

      const cartWithGiftcard = createCartResponse.data.cart
      await api.post(`/store/carts/${cartWithGiftcard.id}`, {
        customer_id: customerResponse.data.customer.id,
      })

      expect(cartWithGiftcard.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            is_giftcard: true,
            unit_price: 30000,
            quantity: 1,
            subtotal: 30000,
            tax_total: 5700,
            original_tax_total: 5700,
            original_total: 35700,
            total: 35700,
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
      const customerResponse = await api.post(
        "/store/customers",
        customerData,
        {
          withCredentials: true,
        }
      )

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

      const cartResponse = await api.get(`/store/carts/${cartFactory.id}`)

      const cart = cartResponse.data.cart

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const createdOrderResponse = await api.post(
        `/store/carts/${cart.id}/complete-cart`
      )
      const createdGiftCards = await dbConnection.manager.find(GiftCard, {
        where: { order_id: createdOrderResponse.data.data.id },
      })
      const createdGiftCard = createdGiftCards[0]

      expect(createdOrderResponse.data.type).toEqual("order")
      expect(createdOrderResponse.status).toEqual(200)
      expect(createdGiftCards.length).toEqual(1)
      expect(createdGiftCard.tax_rate).toEqual(19)
      expect(createdGiftCard.value).toEqual(30000)
      expect(createdGiftCard.balance).toEqual(30000)
    })

    it("applying a gift card shows correct total values", async () => {
      const api = useApi()
      const giftCard = await simpleGiftCardFactory(dbConnection, {
        region_id: region.id,
        value: 30000,
        balance: 30000,
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
          subtotal: 50000,
          discount_total: 0,
          shipping_total: 0,
          refunded_total: 0,
          paid_total: 23800,
          refundable_amount: 23800,
          gift_card_total: 30000,
          gift_card_tax_total: 5700,
          tax_total: 3800,
          total: 23800,
          items: expect.arrayContaining([
            expect.objectContaining({
              unit_price: 50000,
              is_giftcard: false,
              quantity: 1,
              subtotal: 50000,
              discount_total: 0,
              total: 59500,
              original_total: 59500,
              original_tax_total: 9500,
              tax_total: 9500,
              refundable: 59500,
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
