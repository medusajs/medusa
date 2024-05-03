const {
  createAdminUser,
  adminHeaders,
} = require("../../../helpers/create-admin-user")
const { breaking } = require("../../../helpers/breaking")
const { ModuleRegistrationName } = require("@medusajs/modules-sdk")
const { medusaIntegrationTestRunner } = require("medusa-test-utils")

jest.setTimeout(90000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("/admin/store", () => {
      let dbStore
      let container

      // Note: The tests rely on the loader running and populating clean data before and after the test, so we have to do this in a beforeEach
      beforeEach(async () => {
        container = getContainer()

        await createAdminUser(dbConnection, adminHeaders, container)
        await breaking(
          async () => {
            const { Store } = require("@medusajs/medusa/dist/models/store")
            const manager = dbConnection.manager
            dbStore = await manager.findOne(Store, {
              where: { name: "Medusa Store" },
            })
            await manager.query(
              `INSERT INTO store_currencies (store_id, currency_code)
               VALUES ('${dbStore.id}', 'dkk')`
            )
          },
          async () => {
            const service = container.resolve(ModuleRegistrationName.STORE)
            dbStore = await service.create({
              supported_currency_codes: ["usd", "dkk"],
              default_currency_code: "usd",
              default_sales_channel_id: "sc_12345",
            })
          }
        )
      })

      describe("Store creation", () => {
        it("has created store with default currency", async () => {
          const store = await breaking(
            () =>
              api.get("/admin/store", adminHeaders).then((r) => r.data.store),
            () =>
              api
                .get("/admin/stores", adminHeaders)
                .then((r) =>
                  r.data.stores.find(
                    (s) => s.default_sales_channel_id === "sc_12345"
                  )
                )
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
            expect(e.response.data).toEqual(
              expect.objectContaining({
                type: "invalid_data",
                message: "Store does not have currency: eur",
              })
            )
            expect(e.response.status).toBe(400)
          }
        })

        it("fails to remove default currency from currencies without replacing it", async () => {
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
            expect(e.response.data).toEqual(
              expect.objectContaining({
                type: "invalid_data",
                message:
                  "You are not allowed to remove default currency from store currencies without replacing it as well",
              })
            )
            expect(e.response.status).toBe(400)
          }
        })

        it("successfully updates default currency code", async () => {
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
          const response = await api.post(
            breaking(
              () => "/admin/store",
              () => `/admin/stores/${dbStore.id}`
            ),
            breaking(
              () => ({
                currencies: ["jpy", "usd"],
              }),
              () => ({
                supported_currency_codes: ["jpy", "usd"],
              })
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

      describe("GET /admin/store", () => {
        it("supports searching of stores", async () => {
          await breaking(
            () => {},
            async () => {
              const service = container.resolve(ModuleRegistrationName.STORE)
              const secondStore = await service.create({
                name: "Second Store",
                supported_currency_codes: ["eur"],
                default_currency_code: "eur",
              })

              const response = await api.get(
                "/admin/stores?q=second",
                adminHeaders
              )

              expect(response.status).toEqual(200)
              expect(response.data.stores).toEqual([
                expect.objectContaining({
                  id: secondStore.id,
                  name: "Second Store",
                }),
              ])
            }
          )
        })
      })
    })
  },
})
