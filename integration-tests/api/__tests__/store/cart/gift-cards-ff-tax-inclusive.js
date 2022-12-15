const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default
const path = require("path")
const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")
const { GiftCard, TaxRate } = require("@medusajs/medusa")

const {
  simpleRegionFactory,
  simpleProductFactory,
  simpleCartFactory,
  simpleCustomerFactory,
} = require("../../../factories")

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING=true] /store/carts", () => {
  let medusaProcess
  let dbConnection
  let customerData

  beforeEach(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
      verbose: true
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

      customer = await simpleCustomerFactory(dbConnection, { password: 'medusatest' })
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
        variants: [{
          title: "Gift Card",
          prices: [{
            amount: 30000,
            currency: "usd",
            region_id: region.id,
          }],
          options: [{ option_id: "denom", value: "Denomination" }],
        }]
      })
    })

    it("adding a gift card purchase to cart treats it like buying a product", async () => {
      const api = useApi()
      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const createCartRes = await api.post("/store/carts", {
        region_id: region.id,
        items: [{
          variant_id: product.variants[0].id,
          quantity: 1,
        }],
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
              })
            })
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
      const createdOrder = await api.post(`/store/carts/${cart.id}/complete-cart`)

      const createdGiftCards = await dbConnection.manager.find(GiftCard, {
        where: { order_id: createdOrder.data.data.id }
      })
      const createdGiftCard = createdGiftCards[0]

      expect(createdOrder.data.type).toEqual("order")
      expect(createdOrder.status).toEqual(200)
      expect(createdGiftCards.length).toEqual(1)
      expect(createdGiftCard.tax_rate).toEqual(19)
      expect(createdGiftCard.value).toEqual(25210)
      expect(createdGiftCard.balance).toEqual(25210)
    })
  })
})
