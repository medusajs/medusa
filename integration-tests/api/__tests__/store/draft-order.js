const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const draftOrderSeeder = require("../../helpers/draft-order-seeder")

jest.setTimeout(30000)

describe("/store/carts (draft-orders)", () => {
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

  describe("POST /admin/draft-order", () => {
    beforeEach(async () => {
      await draftOrderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("completes a cart for a draft order thereby creating an order for the draft order", async () => {
      const api = useApi()

      const response = await api
        .post("/store/carts/test-cart/complete-cart", {})
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      const createdOrder = await api
        .get(`/store/orders/${response.data.data.id}`, {})
        .catch((err) => {
          console.log(err)
        })

      expect(createdOrder.data.order.cart_id).toEqual("test-cart")
    })
  })
})
