import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Locale API", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        const appContainer = getContainer()
        const translationModule = appContainer.resolve(Modules.TRANSLATION)
        await translationModule.__hooks?.onApplicationStart?.().catch(() => {})
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      describe("GET /admin/locales", () => {
        it("should list all default locales", async () => {
          const response = await api.get("/admin/locales", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.locales.length).toBeGreaterThanOrEqual(45)
          expect(response.data.count).toBeGreaterThanOrEqual(45)
          expect(response.data.locales).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                code: "en-US",
                name: "English (United States)",
              }),
              expect.objectContaining({
                code: "fr-FR",
                name: "French (France)",
              }),
              expect.objectContaining({
                code: "de-DE",
                name: "German (Germany)",
              }),
              expect.objectContaining({
                code: "es-ES",
                name: "Spanish (Spain)",
              }),
              expect.objectContaining({
                code: "ja-JP",
                name: "Japanese (Japan)",
              }),
            ])
          )
        })

        it("should filter locales by code", async () => {
          const response = await api.get(
            "/admin/locales?code=en-US",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.locales).toHaveLength(1)
          expect(response.data.locales[0]).toEqual(
            expect.objectContaining({
              code: "en-US",
              name: "English (United States)",
            })
          )
        })

        it("should filter locales by multiple codes", async () => {
          const response = await api.get(
            "/admin/locales?code[]=en-US&code[]=fr-FR&code[]=de-DE",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.locales).toHaveLength(3)
          expect(response.data.locales).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: "en-US" }),
              expect.objectContaining({ code: "fr-FR" }),
              expect.objectContaining({ code: "de-DE" }),
            ])
          )
        })

        it("should filter locales using q parameter", async () => {
          const response = await api.get(
            "/admin/locales?q=french",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.locales.length).toBeGreaterThanOrEqual(1)
          expect(response.data.locales).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                code: "fr-FR",
                name: "French (France)",
              }),
            ])
          )
        })

        it("should support pagination", async () => {
          const response = await api.get(
            "/admin/locales?limit=5&offset=0",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.locales).toHaveLength(5)
          expect(response.data.limit).toEqual(5)
          expect(response.data.offset).toEqual(0)
          expect(response.data.count).toBeGreaterThanOrEqual(45)

          const response2 = await api.get(
            "/admin/locales?limit=5&offset=5",
            adminHeaders
          )

          expect(response2.status).toEqual(200)
          expect(response2.data.locales).toHaveLength(5)
          expect(response2.data.offset).toEqual(5)

          const firstPageCodes = response.data.locales.map((l) => l.code)
          const secondPageCodes = response2.data.locales.map((l) => l.code)
          const overlap = firstPageCodes.filter((c) =>
            secondPageCodes.includes(c)
          )
          expect(overlap).toHaveLength(0)
        })

        it("should return locales with expected fields", async () => {
          const response = await api.get(
            "/admin/locales?code=en-US",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.locales[0]).toHaveProperty("code")
          expect(response.data.locales[0]).toHaveProperty("name")
        })
      })

      describe("GET /admin/locales/:code", () => {
        it("should retrieve a locale by code", async () => {
          const response = await api.get("/admin/locales/en-US", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.locale).toEqual(
            expect.objectContaining({
              code: "en-US",
              name: "English (United States)",
            })
          )
        })

        it("should retrieve different locales by code", async () => {
          const frResponse = await api.get("/admin/locales/fr-FR", adminHeaders)
          expect(frResponse.status).toEqual(200)
          expect(frResponse.data.locale).toEqual(
            expect.objectContaining({
              code: "fr-FR",
              name: "French (France)",
            })
          )

          const deResponse = await api.get("/admin/locales/de-DE", adminHeaders)
          expect(deResponse.status).toEqual(200)
          expect(deResponse.data.locale).toEqual(
            expect.objectContaining({
              code: "de-DE",
              name: "German (Germany)",
            })
          )

          const jaResponse = await api.get("/admin/locales/ja-JP", adminHeaders)
          expect(jaResponse.status).toEqual(200)
          expect(jaResponse.data.locale).toEqual(
            expect.objectContaining({
              code: "ja-JP",
              name: "Japanese (Japan)",
            })
          )
        })

        it("should return 404 for non-existent locale", async () => {
          const response = await api
            .get("/admin/locales/xx-XX", adminHeaders)
            .catch((e) => e.response)

          expect(response.status).toEqual(404)
        })
      })
    })
  },
})
