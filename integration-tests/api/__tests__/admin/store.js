const { Store } = require("@medusajs/medusa")
const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/store", () => {
  let dbConnection
  const cwd = path.resolve(path.join(__dirname, "..", ".."))

  beforeAll(async () => {
    dbConnection = await initDb({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
  })

  describe("Store creation", () => {
    let medusaProcess

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      medusaProcess = await setupServer({ cwd })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown({ forceDelete: ["store"] })
      await medusaProcess.kill()
    })

    it("has created store with default currency", async () => {
      const api = useApi()

      const response = await api.get("/admin/store", {
        headers: { Authorization: "Bearer test_token " },
      })

      expect(response.status).toEqual(200)
      expect(response.data.store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          default_sales_channel_id: expect.any(String),
          default_sales_channel: expect.objectContaining({
            id: expect.any(String),
          }),
          name: "Medusa Store",
          currencies: expect.arrayContaining([
            expect.objectContaining({
              code: "usd",
            }),
          ]),
          modules: expect.any(Array),
          feature_flags: expect.any(Array),
          default_currency_code: "usd",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })
  })

  describe("POST /admin/store", () => {
    let medusaProcess

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      medusaProcess = await setupServer({ cwd })

      const manager = dbConnection.manager
      const store = await manager.findOne(Store, {
        where: { name: "Medusa Store" },
      })
      await manager.query(
        `INSERT INTO store_currencies (store_id, currency_code) VALUES ('${store.id}', 'dkk')`
      )
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown({ forceDelete: ["store"] })
      await medusaProcess.kill()
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

      const response = await api
        .post(
          "/admin/store",
          {
            default_currency_code: "dkk",
          },
          {
            headers: { Authorization: "Bearer test_token " },
          }
        )
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "Medusa Store",
          default_sales_channel_id: expect.any(String),
          currencies: expect.arrayContaining([
            expect.objectContaining({
              code: "usd",
            }),
            expect.objectContaining({
              code: "dkk",
            }),
          ]),
          default_currency_code: "dkk",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
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
      expect(response.data.store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "Medusa Store",
          default_sales_channel_id: expect.any(String),
          currencies: expect.arrayContaining([
            expect.objectContaining({
              code: "jpy",
            }),
            expect.objectContaining({
              code: "usd",
            }),
          ]),
          default_currency_code: "jpy",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })

    it("successfully updates and store currencies", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/store",
        {
          currencies: ["jpy", "usd"],
        },
        {
          headers: { Authorization: "Bearer test_token " },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          default_sales_channel_id: expect.any(String),
          name: "Medusa Store",
          currencies: expect.arrayContaining([
            expect.objectContaining({
              code: "jpy",
            }),
            expect.objectContaining({
              code: "usd",
            }),
          ]),
          default_currency_code: "usd",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })
  })
})
