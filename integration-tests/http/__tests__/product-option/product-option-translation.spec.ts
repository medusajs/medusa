import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store: Product Option API (with translations)", () => {
      let option
      let storeHeaders

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      beforeEach(async () => {
        const container = getContainer()
        await createAdminUser(dbConnection, adminHeaders, container)

        const publishableKey = await generatePublishableKey(container)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const translationModule = container.resolve(Modules.TRANSLATION)
        await translationModule.__hooks?.onApplicationStart?.().catch(() => {})

        const storeModule = container.resolve(Modules.STORE)
        const [defaultStore] = await storeModule.listStores(
          {},
          { select: ["id"], take: 1 }
        )
        await storeModule.updateStores(defaultStore.id, {
          supported_locales: [{ locale_code: "en-US" }, { locale_code: "de-DE" }],
        })

        option = (
          await api.post(
            "/admin/product-options",
            { title: "Colour", values: ["Black"] },
            adminHeaders
          )
        ).data.product_option

        await api.post(
          "/admin/translations/batch",
          {
            create: [
              {
                reference_id: option.id,
                reference: "product_option",
                locale_code: "de-DE",
                translations: { title: "Farbe" },
              },
              {
                reference_id: option.values[0].id,
                reference: "product_option_value",
                locale_code: "de-DE",
                translations: { value: "Schwarz" },
              },
            ],
          },
          adminHeaders
        )
      })

      it("should return translated product options when listing with a locale", async () => {
        const res = await api.get(
          "/store/product-options?locale=de-DE",
          storeHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_options).toEqual([
          expect.objectContaining({
            id: option.id,
            title: "Farbe",
            values: [expect.objectContaining({ value: "Schwarz" })],
          }),
        ])
      })

      it("should return a translated product option when retrieving with a locale", async () => {
        const res = await api.get(`/store/product-options/${option.id}`, {
          headers: {
            ...storeHeaders.headers,
            "x-medusa-locale": "de-DE",
          },
        })

        expect(res.status).toEqual(200)
        expect(res.data.product_option).toEqual(
          expect.objectContaining({
            id: option.id,
            title: "Farbe",
            values: [expect.objectContaining({ value: "Schwarz" })],
          })
        )
      })

      it("should return the original product option when no locale is set", async () => {
        const res = await api.get(`/store/product-options/${option.id}`, {
          headers: storeHeaders.headers,
        })

        expect(res.status).toEqual(200)
        expect(res.data.product_option).toEqual(
          expect.objectContaining({
            title: "Colour",
            values: [expect.objectContaining({ value: "Black" })],
          })
        )
      })
    })
  },
})
