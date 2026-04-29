import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaContainer } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import {
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, api }) => {
    describe("Store Locales API", () => {
      let appContainer: MedusaContainer
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const storeModule = appContainer.resolve(Modules.STORE)
        const [defaultStore] = await storeModule.listStores(
          {},
          {
            select: ["id"],
            take: 1,
          }
        )
        await storeModule.updateStores(defaultStore.id, {
          supported_locales: [
            { locale_code: "en-US" },
            { locale_code: "fr-FR" },
            { locale_code: "de-DE" },
          ],
        })
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      describe("GET /store/locales", () => {
        it("should return store supported locales", async () => {
          const response = await api.get("/store/locales", storeHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.locales).toHaveLength(3)
          expect(response.data.locales).toEqual(
            expect.arrayContaining([
              {
                code: "en-US",
                name: expect.any(String),
              },
              {
                code: "fr-FR",
                name: expect.any(String),
              },
              {
                code: "de-DE",
                name: expect.any(String),
              },
            ])
          )
        })

        it("should return empty array when no locales configured", async () => {
          const storeModule = appContainer.resolve(Modules.STORE)
          const [defaultStore] = await storeModule.listStores(
            {},
            {
              select: ["id"],
              take: 1,
            }
          )
          await storeModule.updateStores(defaultStore.id, {
            supported_locales: [],
          })

          const response = await api.get("/store/locales", storeHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.locales).toEqual([])
        })
      })
    })
  },
})
