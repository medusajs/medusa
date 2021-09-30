const path = require("path")
const { Region, ShippingProfile, ShippingOption } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const cartSeeder = require("../../helpers/cart-seeder")
const swapSeeder = require("../../helpers/swap-seeder")

jest.setTimeout(30000)

describe("/store/shipping-options", () => {
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
        type: "default",
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

      const response = await api.get("/store/shipping-options").catch((err) => {
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

    it("given a swap cart, when user retrieves its shipping options, then should return a list of RMA shipping options", async () => {
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
            shipping_option_id: "test-option",
            price: 0,
          }),
        ])
      )
    })
  })
})
