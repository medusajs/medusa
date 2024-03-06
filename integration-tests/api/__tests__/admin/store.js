const { Store } = require("@medusajs/medusa")
const path = require("path")

const { useApi } = require("../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../environment-helpers/use-db")
const {
  startBootstrapApp,
} = require("../../../environment-helpers/bootstrap-app")
const {
  createAdminUser,
  adminHeaders,
} = require("../../../helpers/create-admin-user")
const { breaking } = require("../../../helpers/breaking")
const { getContainer } = require("../../../environment-helpers/use-container")
const { ModuleRegistrationName } = require("@medusajs/modules-sdk")

jest.setTimeout(30000)

describe("/admin/store", () => {
  let dbConnection
  let shutdownServer
  let dbStore

  // Note: The tests rely on the loader running and populating clean data before and after the test, so we have to do this in a beforeEach
  beforeEach(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    shutdownServer = await startBootstrapApp({ cwd })

    await createAdminUser(dbConnection, adminHeaders)
    await breaking(
      async () => {
        const manager = dbConnection.manager
        dbStore = await manager.findOne(Store, {
          where: { name: "Medusa Store" },
        })
        await manager.query(
          `INSERT INTO store_currencies (store_id, currency_code) VALUES ('${store.id}', 'dkk')`
        )
      },
      async () => {
        const appContainer = getContainer()
        const service = appContainer.resolve(ModuleRegistrationName.STORE)
        dbStore = await service.create({
          supported_currency_codes: ["usd", "dkk"],
          default_currency_code: "usd",
          default_sales_channel_id: "sc_12345",
        })
      }
    )
  })

  afterEach(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  describe("Store creation", () => {
    it("has created store with default currency", async () => {
      const api = useApi()

      const store = await breaking(
        () => api.get("/admin/store", adminHeaders).then((r) => r.data.store),
        () =>
          api.get("/admin/stores", adminHeaders).then((r) => r.data.stores[0])
      )

      expect(store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "Medusa Store",
          default_currency_code: "usd",
          default_sales_channel_id: expect.any(String),
          ...breaking(
            () => ({
              default_sales_channel: expect.objectContaining({
                id: expect.any(String),
              }),
              currencies: expect.arrayContaining([
                expect.objectContaining({
                  code: "usd",
                }),
              ]),
              modules: expect.any(Array),
              feature_flags: expect.any(Array),
            }),
            () => ({
              supported_currency_codes: ["usd", "dkk"],
            })
          ),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })
  })

  describe("POST /admin/store", () => {
    it("fails to update default currency if not in store currencies", async () => {
      const api = useApi()

      try {
        await api.post(
          breaking(
            () => "/admin/store",
            () => `/admin/stores/${dbStore.id}`
          ),
          {
            default_currency_code: "eur",
          },
          adminHeaders
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
          breaking(
            () => "/admin/store",
            () => `/admin/stores/${dbStore.id}`
          ),
          breaking(
            () => ({
              currencies: ["usd"],
            }),
            () => ({ supported_currency_codes: ["dkk"] })
          ),
          adminHeaders
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
          breaking(
            () => "/admin/store",
            () => `/admin/stores/${dbStore.id}`
          ),
          {
            default_currency_code: "dkk",
          },
          adminHeaders
        )
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "Medusa Store",
          default_currency_code: "dkk",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })

    it("successfully updates default currency and store currencies", async () => {
      const api = useApi()

      const response = await api.post(
        breaking(
          () => "/admin/store",
          () => `/admin/stores/${dbStore.id}`
        ),
        {
          default_currency_code: "jpy",
          ...breaking(
            () => ({ currencies: ["jpy", "usd"] }),
            () => ({ supported_currency_codes: ["jpy", "usd"] })
          ),
        },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "Medusa Store",
          default_sales_channel_id: expect.any(String),
          ...breaking(
            () => ({
              currencies: expect.arrayContaining([
                expect.objectContaining({
                  code: "jpy",
                }),
                expect.objectContaining({
                  code: "usd",
                }),
              ]),
            }),
            () => ({ supported_currency_codes: ["jpy", "usd"] })
          ),
          default_currency_code: "jpy",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })

    it("successfully updates and store currencies", async () => {
      const api = useApi()

      const response = await api.post(
        breaking(
          () => "/admin/store",
          () => `/admin/stores/${dbStore.id}`
        ),
        breaking(
          () => ({
            currencies: ["jpy", "usd"],
          }),
          () => ({ supported_currency_codes: ["jpy", "usd"] })
        ),
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          default_sales_channel_id: expect.any(String),
          name: "Medusa Store",
          ...breaking(
            () => ({
              currencies: expect.arrayContaining([
                expect.objectContaining({
                  code: "jpy",
                }),
                expect.objectContaining({
                  code: "usd",
                }),
              ]),
            }),
            () => ({ supported_currency_codes: ["jpy", "usd"] })
          ),
          default_currency_code: "usd",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })
  })
})
