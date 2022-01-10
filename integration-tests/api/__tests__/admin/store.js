const { Store } = require("@medusajs/medusa")
const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/store", () => {
  let medusaProcess
  let dbConnection
  const cwd = path.resolve(path.join(__dirname, "..", ".."))

  beforeAll(async () => {
    try {
      dbConnection = await initDb({ cwd })
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("Store creation", () => {
    beforeEach(async () => {
      medusaProcess = await setupServer({ cwd })
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("has created store with default currency", async () => {
      const api = useApi()

      const response = await api.get("/admin/store", {
        headers: { Authorization: "Bearer test_token " },
      })

      expect(response.status).toEqual(200)
      expect(response.data.store).toMatchSnapshot({
        id: expect.any(String),
        name: "Medusa Store",
        currencies: [
          {
            code: "usd",
          },
        ],
        default_currency_code: "usd",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/store", () => {
    beforeEach(async () => {
      medusaProcess = await setupServer({ cwd })
      await adminSeeder(dbConnection)

      const manager = dbConnection.manager
      const store = await manager.findOne(Store, { name: "Medusa Store" })
      await manager.query(
        `INSERT INTO store_currencies (store_id, currency_code) VALUES ('${store.id}', 'dkk')`
      )
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("fails to update default currency if not in store currencies", async () => {
      const api = useApi()

      try {
        await api.post(
          "/admin/store",
          {
            default_currency_code: "eur",
          },
          {
            headers: { Authorization: "Bearer test_token " },
          }
        )
      } catch (e) {
        expect(e.response.data).toMatchSnapshot({
          type: "invalid_data",
          message: "Store does not have currency: eur",
        })
        expect(e.response.status).toBe(400)
      }
    })

    it("fails to remove default currency from currencies without replacing it", async () => {
      const api = useApi()

      try {
        await api.post(
          "/admin/store",
          {
            currencies: ["usd"],
          },
          {
            headers: { Authorization: "Bearer test_token " },
          }
        )
      } catch (e) {
        expect(e.response.data).toMatchSnapshot({
          type: "invalid_data",
          message:
            "You are not allowed to remove default currency from store currencies without replacing it as well",
        })
        expect(e.response.status).toBe(400)
      }
    })

    it("successfully updates default currency code", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/store",
        {
          default_currency_code: "dkk",
        },
        {
          headers: { Authorization: "Bearer test_token " },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.store).toMatchSnapshot({
        id: expect.any(String),
        name: "Medusa Store",
        currencies: [
          {
            code: "usd",
          },
          {
            code: "dkk",
          },
        ],
        default_currency_code: "dkk",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("successfully updates default currency and store currencies", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/store",
        {
          default_currency_code: "jpy",
          currencies: ["jpy", "usd"],
        },
        {
          headers: { Authorization: "Bearer test_token " },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.store).toMatchSnapshot({
        id: expect.any(String),
        name: "Medusa Store",
        currencies: [
          {
            code: "jpy",
          },
          {
            code: "usd",
          },
        ],
        default_currency_code: "jpy",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })
})
