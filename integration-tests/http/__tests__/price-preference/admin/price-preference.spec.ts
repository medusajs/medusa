import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let pricePreference1
    let pricePreference2

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      pricePreference1 = (
        await api.post(
          "/admin/price-preferences",
          {
            attribute: "region_id",
            value: "region-1",
            is_tax_inclusive: true,
          },
          adminHeaders
        )
      ).data.price_preference

      pricePreference2 = (
        await api.post(
          "/admin/price-preferences",
          {
            attribute: "currency_code",
            value: "EUR",
            is_tax_inclusive: true,
          },
          adminHeaders
        )
      ).data.price_preference
    })

    describe("/admin/price-preferences", () => {
      describe("POST /admin/price-preferences", () => {
        it("creates a price preference", async () => {
          const newPricePreference = (
            await api.post(
              "/admin/price-preferences",
              {
                attribute: "region_id",
                value: "region-2",
                is_tax_inclusive: true,
              },
              adminHeaders
            )
          ).data.price_preference

          expect(newPricePreference).toEqual(
            expect.objectContaining({
              attribute: "region_id",
              value: "region-2",
              is_tax_inclusive: true,
            })
          )
        })

        it("creates a price preference with false tax inclusivity by default", async () => {
          const newPricePreference = (
            await api.post(
              "/admin/price-preferences",
              {
                attribute: "region_id",
                value: "region-2",
              },
              adminHeaders
            )
          ).data.price_preference

          expect(newPricePreference).toEqual(
            expect.objectContaining({
              attribute: "region_id",
              value: "region-2",
              is_tax_inclusive: false,
            })
          )
        })
      })

      describe("GET /admin/price-preferences", () => {
        it("returns a list of price preferences", async () => {
          const response = (
            await api.get("/admin/price-preferences", adminHeaders)
          ).data.price_preferences

          expect(response).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                attribute: "region_id",
                value: "region-1",
                is_tax_inclusive: true,
              }),
              expect.objectContaining({
                attribute: "currency_code",
                value: "EUR",
                is_tax_inclusive: true,
              }),
            ])
          )
        })
        it("filters price preferences by attribute", async () => {
          const response = (
            await api.get(
              "/admin/price-preferences?attribute=region_id",
              adminHeaders
            )
          ).data.price_preferences

          expect(response).toEqual([
            expect.objectContaining({
              attribute: "region_id",
              value: "region-1",
              is_tax_inclusive: true,
            }),
          ])
        })
      })

      describe("GET /admin/price-preferences/:id", () => {
        it("returns a price preference by :id", async () => {
          const response = (
            await api.get(
              `/admin/price-preferences/${pricePreference1.id}`,
              adminHeaders
            )
          ).data.price_preference

          expect(response).toEqual(
            expect.objectContaining({
              attribute: "region_id",
              value: "region-1",
              is_tax_inclusive: true,
            })
          )
        })
      })

      describe("POST /admin/price-preferences/:id", () => {
        it("updates a price preference", async () => {
          const response = (
            await api.post(
              `/admin/price-preferences/${pricePreference1.id}`,
              {
                attribute: "region_id",
                value: "region-2",
                is_tax_inclusive: false,
              },
              adminHeaders
            )
          ).data.price_preference

          expect(response).toEqual(
            expect.objectContaining({
              attribute: "region_id",
              value: "region-2",
              is_tax_inclusive: false,
            })
          )
        })
        it("updates the tax inclusivity in the price preference", async () => {
          const response = (
            await api.post(
              `/admin/price-preferences/${pricePreference1.id}`,
              {
                is_tax_inclusive: false,
              },
              adminHeaders
            )
          ).data.price_preference

          expect(response).toEqual(
            expect.objectContaining({
              attribute: "region_id",
              value: "region-1",
              is_tax_inclusive: false,
            })
          )
        })
      })

      describe("DELETE /admin/price-preferences/:id", () => {
        it("Deletes a price preference", async () => {
          const deleteResponse = await api.delete(
            `/admin/price-preferences/${pricePreference1.id}`,
            adminHeaders
          )

          const remainingPricePreferences = (
            await api.get("/admin/price-preferences", adminHeaders)
          ).data.price_preferences

          expect(deleteResponse.data).toEqual(
            expect.objectContaining({
              id: pricePreference1.id,
              object: "price_preference",
              deleted: true,
            })
          )

          expect(remainingPricePreferences).toEqual([
            expect.objectContaining({
              attribute: "currency_code",
              value: "EUR",
              is_tax_inclusive: true,
            }),
          ])
        })
      })
    })
  },
})
