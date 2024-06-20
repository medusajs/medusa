import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { ModuleRegistrationName } from "@medusajs/utils"
import { IStoreModuleService } from "@medusajs/types"

jest.setTimeout(90000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("/admin/stores", () => {
      let store
      let container

      beforeEach(async () => {
        container = getContainer()
        const storeModule: IStoreModuleService = container.resolve(
          ModuleRegistrationName.STORE
        )
        await createAdminUser(dbConnection, adminHeaders, container)

        // A default store is created when the app is started, so we want to delete that one and create one specifically for our tests.
        const defaultId = (await api.get("/admin/stores", adminHeaders)).data
          .stores?.[0]?.id
        if (defaultId) {
          await storeModule.deleteStores(defaultId)
        }

        store = await storeModule.createStores({
          name: "New store",
          supported_currency_codes: ["usd", "dkk"],
          default_currency_code: "usd",
          default_sales_channel_id: "sc_12345",
        })
      })

      // BREAKING: The URL changed from `GET /admin/store` to `GET /admin/stores`
      describe("Store creation", () => {
        it("has created store with default currency", async () => {
          const resStore = (
            await api.get("/admin/stores", adminHeaders)
          ).data.stores.find((s) => s.id === store.id)

          // BREAKING: The store response contained currencies, modules, and feature flags, which are not present anymore
          expect(resStore).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "New store",
              default_currency_code: "usd",
              default_sales_channel_id: expect.any(String),
              supported_currency_codes: ["usd", "dkk"],
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })
      })

      describe("POST /admin/stores", () => {
        it("fails to update default currency if not in store currencies", async () => {
          const err = await api
            .post(
              `/admin/stores/${store.id}`,
              {
                default_currency_code: "eur",
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(err.response.status).toBe(400)
          expect(err.response.data).toEqual(
            expect.objectContaining({
              type: "invalid_data",
              message: "Store does not have currency: eur",
            })
          )
        })

        // BREAKING: `currencies` was renamed to `supported_currency_codes`
        it("fails to remove default currency from currencies without replacing it", async () => {
          const err = await api
            .post(
              `/admin/stores/${store.id}`,
              { supported_currency_codes: ["dkk"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(err.response.status).toBe(400)
          expect(err.response.data).toEqual(
            expect.objectContaining({
              type: "invalid_data",
              message:
                "You are not allowed to remove default currency from store currencies without replacing it as well",
            })
          )
        })

        it("successfully updates default currency code", async () => {
          const response = await api
            .post(
              `/admin/stores/${store.id}`,
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
              name: "New store",
              default_currency_code: "dkk",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })

        it("successfully updates default currency and store currencies", async () => {
          const response = await api.post(
            `/admin/stores/${store.id}`,
            {
              default_currency_code: "jpy",
              supported_currency_codes: ["jpy", "usd"],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.store).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "New store",
              default_sales_channel_id: expect.any(String),
              supported_currency_codes: ["jpy", "usd"],
              default_currency_code: "jpy",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })

        it("successfully updates and store currencies", async () => {
          const response = await api.post(
            `/admin/stores/${store.id}`,
            {
              supported_currency_codes: ["jpy", "usd"],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.store).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              default_sales_channel_id: expect.any(String),
              name: "New store",
              supported_currency_codes: ["jpy", "usd"],
              default_currency_code: "usd",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })
      })

      describe("GET /admin/stores", () => {
        it("supports searching of stores", async () => {
          const response = await api.get(
            "/admin/stores?q=nonexistent",
            adminHeaders
          )
          expect(response.status).toEqual(200)
          expect(response.data.stores).toHaveLength(0)

          const response2 = await api.get("/admin/stores?q=store", adminHeaders)
          expect(response.status).toEqual(200)
          expect(response2.data.stores).toEqual([
            expect.objectContaining({
              id: store.id,
              name: "New store",
            }),
          ])
        })
      })
    })
  },
})
