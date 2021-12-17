const path = require("path")
const {
  Region,
  Order,
  Customer,
  ShippingProfile,
  Product,
  ProductVariant,
  MoneyAmount,
  LineItem,
  Payment,
  Cart,
  ShippingMethod,
  Swap,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const swapSeeder = require("../../helpers/swap-seeder")
const cartSeeder = require("../../helpers/cart-seeder")

jest.setTimeout(30000)

describe("/store/carts", () => {
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

  describe("GET /store/orders", () => {
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
      await manager.insert(Customer, {
        id: "cus_1234",
        email: "test@email.com",
      })
      await manager.insert(Order, {
        id: "order_test",
        email: "test@email.com",
        display_id: 111,
        customer_id: "cus_1234",
        region_id: "region",
        tax_rate: 0,
        currency_code: "usd",
      })

      const defaultProfile = await manager.findOne(ShippingProfile, {
        type: "default",
      })
      await manager.insert(Product, {
        id: "test-product",
        title: "test product",
        profile_id: defaultProfile.id,
        options: [{ id: "test-option", title: "Size" }],
      })

      await manager.insert(ProductVariant, {
        id: "test-variant",
        title: "test variant",
        product_id: "test-product",
        inventory_quantity: 1,
        options: [
          {
            option_id: "test-option",
            value: "Size",
          },
        ],
      })

      await manager.insert(LineItem, {
        id: "test-item",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("looks up order", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?display_id=111&email=test@email.com")
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(200)
      expect(response.data.order.display_id).toEqual(111)
      expect(response.data.order.email).toEqual("test@email.com")
    })

    it("fails if display_id + email not provided", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?display_id=111")
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(400)
    })

    it("fails if display_id + email not provided", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?email=test@email.com")
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(400)
    })

    it("fails if email not correct", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?display_id=111&email=test1@email.com")
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(404)
    })
  })
})
