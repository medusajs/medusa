const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const orderSeeder = require("../../helpers/order-seeder")
const swapSeeder = require("../../helpers/swap-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/swaps", () => {
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

  describe("GET /admin/swaps/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("gets a swap with cart and totals", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/swaps/test-swap", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
      expect(response.data.swap).toEqual(
        expect.objectContaining({
          id: "test-swap",
        })
      )

      expect(response.data.swap.cart).toEqual(
        expect.objectContaining({
          id: "test-cart-w-swap",
          shipping_total: 1000,
          subtotal: 1000,
          total: 2000,
        })
      )
      expect(response.data.swap.cart).toHaveProperty("discount_total")
      expect(response.data.swap.cart).toHaveProperty("gift_card_total")
    })

    it("gets a swap with a discount", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/swaps/disc-swap", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
      expect(response.data.swap).toEqual(
        expect.objectContaining({
          id: "disc-swap",
        })
      )

      expect(response.data.swap.cart).toEqual(
        expect.objectContaining({
          id: "disc-swap-cart",
          discount_total: -800,
          shipping_total: 1000,
          subtotal: -8000,
          total: -6200,
        })
      )
    })
  })

  describe("GET /admin/swaps/", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists all swaps", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/swaps/", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data).toHaveProperty("count")
      expect(response.data.offset).toBe(0)
      expect(response.data.limit).toBe(50)
      expect(response.data.swaps).toContainEqual(
        expect.objectContaining({
          id: "test-swap",
        })
      )
    })
  })
})
