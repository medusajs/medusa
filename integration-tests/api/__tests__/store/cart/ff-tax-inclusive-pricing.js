const path = require("path")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const {
  simpleCartFactory,
  simpleRegionFactory,
  simpleShippingOptionFactory,
  simpleCustomShippingOptionFactory,
} = require("../../../factories")

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /store/carts", () => {
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

  describe("POST /store/carts/:id/shipping-methods", () => {
    let includesTaxShippingOption
    let cart
    let customSoCart

    beforeEach(async () => {
      try {
        const shippingAddress = {
          id: "test-shipping-address",
          first_name: "lebron",
          country_code: "us",
        }
        const region = await simpleRegionFactory(dbConnection, {
          id: "test-region"
        })
        cart = await simpleCartFactory(dbConnection, {
          id: "test-cart",
          email: "some-customer1@email.com",
          region: region.id,
          shipping_address: shippingAddress,
          currency_code: "usd",
        })
        customSoCart = await simpleCartFactory(dbConnection, {
          id: "test-cart-with-cso",
          email: "some-customer2@email.com",
          region: region.id,
          shipping_address: shippingAddress,
          currency_code: "usd",
        })
        includesTaxShippingOption = await simpleShippingOptionFactory(dbConnection, {
          includes_tax: true,
          region_id: region.id
        })
        await simpleCustomShippingOptionFactory(dbConnection, {
          id: "another-cso-test",
          cart_id: customSoCart.id,
          shipping_option_id: includesTaxShippingOption.id,
          price: 5,
        })
      } catch (err) {
        console.log(err)
      }
    })

    afterEach(async() => {
      const db = useDb()
      return await db.teardown()
    })

    it("should add a normal shipping method to the cart", async () => {
      const api = useApi()

      const cartWithShippingMethodRes = await api.post(
          `/store/carts/${cart.id}/shipping-methods`,
          {
            option_id: includesTaxShippingOption.id,
          },
          { withCredentials: true }
      )

      expect(cartWithShippingMethodRes.status).toEqual(200)
      expect(cartWithShippingMethodRes.data.cart.shipping_methods)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            shipping_option_id: includesTaxShippingOption.id,
            includes_tax: true,
          })
        ]))
    })

    it("should add a custom shipping method to the cart", async () => {
      const api = useApi()

      const cartWithCustomShippingMethodRes = await api
          .post(
              `/store/carts/${customSoCart.id}/shipping-methods`,
              {
                option_id: includesTaxShippingOption.id,
              },
              { withCredentials: true }
          )
          .catch((err) => err.response)

      expect(cartWithCustomShippingMethodRes.status).toEqual(200)
      expect(
          cartWithCustomShippingMethodRes.data.cart.shipping_methods
      ).toEqual(expect.arrayContaining([
        expect.objectContaining({
          shipping_option_id: includesTaxShippingOption.id,
          includes_tax: true,
          price: 5,
        })
      ]))
    })
  })
})
