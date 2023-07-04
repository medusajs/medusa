const path = require("path")
const {
  Region,
  ShippingProfile,
  ShippingOption,
  ShippingProfileType,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const cartSeeder = require("../../helpers/cart-seeder")
const swapSeeder = require("../../helpers/swap-seeder")
const {
  simpleRegionFactory,
  simpleShippingOptionFactory,
  simpleCartFactory,
  simpleProductFactory,
} = require("../../factories")
const {
  default: startServerWithEnvironment,
} = require("../../../helpers/start-server-with-environment")

jest.setTimeout(30000)

describe("/store/shipping-options", () => {
  let medusaProcess
  let dbConnection

  describe("tax exclusive", () => {
    beforeAll(async () => {
      const cwd = path.resolve(path.join(__dirname, "..", ".."))
      const [process, conn] = await startServerWithEnvironment({
        cwd,
        env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
      })
      medusaProcess = process
      dbConnection = conn
    })

    afterAll(async () => {
      const db = useDb()
      await db.shutdown()
      medusaProcess.kill()
    })

    describe("POST /store/shipping-options", () => {
      beforeEach(async () => {
        const manager = dbConnection.manager
        await manager.query(
          `ALTER SEQUENCE order_display_id_seq RESTART WITH 111`
        )

        await manager.insert(Region, {
          id: "region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        })
        await manager.insert(Region, {
          id: "region2",
          name: "Test Region 2",
          currency_code: "usd",
          tax_rate: 0,
        })

        const defaultProfile = await manager.findOne(ShippingProfile, {
          where: {
            type: ShippingProfileType.DEFAULT,
          },
        })

        await manager.insert(ShippingOption, {
          id: "test-out",
          name: "Test out",
          profile_id: defaultProfile.id,
          region_id: "region",
          provider_id: "test-ful",
          data: {},
          price_type: "flat_rate",
          amount: 2000,
          is_return: false,
        })

        await manager.insert(ShippingOption, {
          id: "test-return",
          name: "Test ret",
          profile_id: defaultProfile.id,
          region_id: "region",
          provider_id: "test-ful",
          data: {},
          price_type: "flat_rate",
          amount: 1000,
          is_return: true,
        })

        await manager.insert(ShippingOption, {
          id: "test-region2",
          name: "Test region 2",
          profile_id: defaultProfile.id,
          region_id: "region2",
          provider_id: "test-ful",
          data: {},
          price_type: "flat_rate",
          amount: 1000,
          is_return: false,
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("retrieves all shipping options", async () => {
        const api = useApi()

        const response = await api
          .get("/store/shipping-options")
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(200)
        expect(response.data.shipping_options.length).toEqual(3)
      })

      it("creates a return with shipping method", async () => {
        const api = useApi()

        const response = await api
          .get("/store/shipping-options?is_return=true")
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(200)
        expect(response.data.shipping_options.length).toEqual(1)
        expect(response.data.shipping_options[0].id).toEqual("test-return")
      })

      it("creates a return with shipping method", async () => {
        const api = useApi()

        const response = await api
          .get("/store/shipping-options?region_id=region2")
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(200)
        expect(response.data.shipping_options.length).toEqual(1)
        expect(response.data.shipping_options[0].id).toEqual("test-region2")
      })
    })

    describe("GET /store/shipping-options/:cart_id", () => {
      beforeEach(async () => {
        await cartSeeder(dbConnection)
        await swapSeeder(dbConnection)
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("given a default cart, when user retrieves its shipping options, then should return a list of shipping options", async () => {
        const api = useApi()

        const response = await api
          .get("/store/shipping-options/test-cart-2")
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(200)
        expect(response.data.shipping_options).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: "test-option", amount: 1000 }),
            expect.objectContaining({ id: "test-option-2", amount: 500 }),
          ])
        )
      })

      it("given a cart with custom shipping options, when user retrieves its shipping options, then should return the list of custom shipping options", async () => {
        const api = useApi()

        const response = await api
          .get("/store/shipping-options/test-cart-rma")
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(200)
        expect(response.data.shipping_options).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "test-option",
              amount: 0,
              name: "test-option",
            }),
          ])
        )
      })
    })
  })

  describe("Tax inclusive GET /store/shipping-options/:cart_id", () => {
    beforeAll(async () => {
      const cwd = path.resolve(path.join(__dirname, "..", ".."))
      const [process, conn] = await startServerWithEnvironment({
        cwd,
        env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
      })
      medusaProcess = process
      dbConnection = conn
    })

    afterAll(async () => {
      const db = useDb()
      await db.shutdown()
      medusaProcess.kill()
    })

    beforeEach(async () => {
      await simpleRegionFactory(dbConnection, {
        id: "region2",
        name: "Test Region 2",
        currency_code: "usd",
        tax_rate: 10,
        includes_tax: true,
      })

      await simpleShippingOptionFactory(dbConnection, {
        region_id: "region2",
        includes_tax: true,
        price: 100,
        requirements: [{ type: "min_subtotal", amount: 100 }],
      })
      await simpleShippingOptionFactory(dbConnection, {
        region_id: "region2",
        includes_tax: true,
        price: 150,
        requirements: [{ type: "max_subtotal", amount: 150 }],
      })

      await simpleProductFactory(dbConnection, {
        variants: [
          { id: "variant-1", prices: [{ currency: "usd", amount: 95 }] },
        ],
      })
      await simpleProductFactory(dbConnection, {
        variants: [
          { id: "variant-2", prices: [{ currency: "usd", amount: 145 }] },
        ],
      })
      const cart = await simpleCartFactory(dbConnection, {
        id: "test-cart",
        region: "region2",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("given a cart with total above min-threshold and subtotal below min-threshold shipping option with tax inclusive pricing is available and can be applied", async () => {
      const api = useApi()

      // create line item
      const { data } = await api.post(`/store/carts/test-cart/line-items`, {
        variant_id: "variant-1",
        quantity: 1,
      })

      expect(data.cart.subtotal).toEqual(95)
      expect(data.cart.total).toEqual(105)

      const res = await api.get(`/store/shipping-options/test-cart`)

      expect(res.data.shipping_options.length).toEqual(2)
      expect(res.data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            requirements: [
              expect.objectContaining({
                type: "min_subtotal",
                amount: 100,
              }),
            ],
          }),
        ])
      )
      expect(res.data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            requirements: [
              expect.objectContaining({
                type: "max_subtotal",
                amount: 150,
              }),
            ],
          }),
        ])
      )

      const shippingOption = res.data.shipping_options.find(
        (so) => !!so.requirements.find((r) => r.type === "min_subtotal")
      )

      const addShippingMethodRes = await api.post(
        `/store/carts/test-cart/shipping-methods`,
        {
          option_id: shippingOption.id,
        }
      )

      expect(addShippingMethodRes.status).toEqual(200)
      expect(addShippingMethodRes.data.cart.shipping_methods.length).toEqual(1)
      expect(
        addShippingMethodRes.data.cart.shipping_methods[0].shipping_option_id
      ).toEqual(shippingOption.id)
    })

    it("given a cart with total above max-threshold and subtotal below max-threshold shipping option with tax inclusive pricing is not available", async () => {
      const api = useApi()

      // create line item
      const { data } = await api.post(`/store/carts/test-cart/line-items`, {
        variant_id: "variant-2",
        quantity: 1,
      })
      expect(data.cart.subtotal).toEqual(145)
      expect(data.cart.total).toEqual(160)

      const res = await api.get(`/store/shipping-options/test-cart`)
      expect(res.data.shipping_options.length).toEqual(1)
      expect(res.data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            requirements: [
              expect.objectContaining({
                type: "min_subtotal",
                amount: 100,
              }),
            ],
          }),
        ])
      )
    })
  })
})
