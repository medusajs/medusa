import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaContainer } from "@medusajs/types"
import { Modules, ProductStatus } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

jest.setTimeout(300000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Draft Order Translation API", () => {
      let appContainer: MedusaContainer
      let region: { id: string }
      let product: { id: string; variants: { id: string; title: string }[] }
      let salesChannel: { id: string }
      let shippingProfile: { id: string }
      let stockLocation: { id: string }
      let shippingOption: { id: string }
      let taxRate: { id: string }

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        const taxStructure = await setupTaxStructure(
          appContainer.resolve(Modules.TAX)
        )
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const translationModule = appContainer.resolve(Modules.TRANSLATION)
        await translationModule.__hooks?.onApplicationStart?.().catch(() => {})

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        const storeModule = appContainer.resolve(Modules.STORE)
        const [defaultStore] = await storeModule.listStores(
          {},
          { select: ["id"], take: 1 }
        )
        await storeModule.updateStores(defaultStore.id, {
          supported_locales: [
            { locale_code: "en-US" },
            { locale_code: "fr-FR" },
            { locale_code: "de-DE" },
          ],
        })

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Medusa T-Shirt",
              description: "A comfortable cotton t-shirt",
              handle: "t-shirt",
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [
                {
                  title: "Small",
                  sku: "SHIRT-S",
                  options: { Size: "S" },
                  manage_inventory: false,
                  prices: [{ amount: 1500, currency_code: "usd" }],
                },
                {
                  title: "Medium",
                  sku: "SHIRT-M",
                  options: { Size: "M" },
                  manage_inventory: false,
                  prices: [{ amount: 1500, currency_code: "usd" }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const variantSmall = product.variants.find((v) => v.title === "Small")
        const variantMedium = product.variants.find((v) => v.title === "Medium")
        product.variants = [variantSmall!, variantMedium!]

        const fulfillmentSets = (
          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
            { name: "Test", type: "test-type" },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        const fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
            {
              name: "Test",
              geo_zones: [{ type: "country", country_code: "us" }],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        shippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Test shipping option",
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              prices: [{ currency_code: "usd", amount: 1000 }],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        const taxRatesResponse = await api.get(
          `/admin/tax-rates?tax_region_id=${taxStructure.us.children.cal.province.id}`,
          adminHeaders
        )
        taxRate = taxRatesResponse.data.tax_rates.find(
          (rate: { code: string }) => rate.code === "CADEFAULT"
        )

        await api.post(
          "/admin/translations/batch",
          {
            create: [
              {
                reference_id: product.id,
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "T-Shirt Medusa",
                  description: "Un t-shirt en coton confortable",
                },
              },
              {
                reference_id: product.id,
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Medusa T-Shirt DE",
                  description: "Ein bequemes Baumwoll-T-Shirt",
                },
              },
              {
                reference_id: product.variants[0].id,
                reference: "product_variant",
                locale_code: "fr-FR",
                translations: { title: "Petit" },
              },
              {
                reference_id: product.variants[0].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: { title: "Klein" },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "fr-FR",
                translations: { title: "Moyen" },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: { title: "Mittel" },
              },
              {
                reference_id: shippingOption.id,
                reference: "shipping_option",
                locale_code: "fr-FR",
                translations: {
                  name: "Option d'expédition de test",
                },
              },
              {
                reference_id: shippingOption.id,
                reference: "shipping_option",
                locale_code: "de-DE",
                translations: {
                  name: "Test-Versandoption",
                },
              },
              {
                reference_id: taxRate.id,
                reference: "tax_rate",
                locale_code: "fr-FR",
                translations: {
                  name: "Taux par défaut CA",
                },
              },
              {
                reference_id: taxRate.id,
                reference: "tax_rate",
                locale_code: "de-DE",
                translations: {
                  name: "CA Standardsteuersatz",
                },
              },
            ],
          },
          adminHeaders
        )
      })

      describe("POST /admin/draft-orders/:id/edit/items (add items to draft order)", () => {
        it("should translate items when adding to draft order with locale", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                locale: "fr-FR",
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  province: "ca",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/items`,
            {
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          const updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.items[0]).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              product_description: "Un t-shirt en coton confortable",
              variant_title: "Petit",
            })
          )

          expect(updatedDraftOrder.items[0].tax_lines.length).toBeGreaterThan(0)
          const taxLine = updatedDraftOrder.items[0].tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("Taux par défaut CA")
        })

        it("should have original values when draft order has no locale", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  province: "ca",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/items`,
            {
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          const updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.items[0]).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt",
              product_description: "A comfortable cotton t-shirt",
              variant_title: "Small",
            })
          )

          expect(updatedDraftOrder.items[0].tax_lines.length).toBeGreaterThan(0)
          const taxLine = updatedDraftOrder.items[0].tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("CA Default Rate")
        })

        it("should translate multiple items added to draft order", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                locale: "de-DE",
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  province: "ca",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/items`,
            {
              items: [
                { variant_id: product.variants[0].id, quantity: 1 },
                { variant_id: product.variants[1].id, quantity: 2 },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          const updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.items).toHaveLength(2)

          const smallItem = updatedDraftOrder.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          const mediumItem = updatedDraftOrder.items.find(
            (item) => item.variant_id === product.variants[1].id
          )

          expect(smallItem).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt DE",
              variant_title: "Klein",
            })
          )
          expect(mediumItem).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt DE",
              variant_title: "Mittel",
            })
          )

          expect(smallItem.tax_lines.length).toBeGreaterThan(0)
          const smallTaxLine = smallItem.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(smallTaxLine.description).toEqual("CA Standardsteuersatz")

          expect(mediumItem.tax_lines.length).toBeGreaterThan(0)
          const mediumTaxLine = mediumItem.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(mediumTaxLine.description).toEqual("CA Standardsteuersatz")
        })
      })

      describe("POST /admin/draft-orders/:id/edit/shipping-methods (add shipping method to draft order)", () => {
        it("should translate shipping method tax lines when adding to draft order with locale", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                locale: "fr-FR",
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  province: "ca",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/items`,
            {
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/shipping-methods`,
            {
              shipping_option_id: shippingOption.id,
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          const updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.shipping_methods.length).toBeGreaterThan(0)

          const shippingMethod = updatedDraftOrder.shipping_methods[0]
          const taxLine = shippingMethod.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("Taux par défaut CA")
        })

        it("should use original tax line description when draft order has no locale", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  province: "ca",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/items`,
            {
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/shipping-methods`,
            {
              shipping_option_id: shippingOption.id,
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          const updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.shipping_methods.length).toBeGreaterThan(0)

          const shippingMethod = updatedDraftOrder.shipping_methods[0]
          const taxLine = shippingMethod.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine).toBeDefined()
          expect(taxLine.description).toEqual("CA Default Rate")
        })
      })

      describe("POST /admin/draft-orders/:id (update draft order locale)", () => {
        it("should re-translate all items when locale is updated", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                locale: "fr-FR",
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  province: "ca",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/items`,
            {
              items: [
                { variant_id: product.variants[0].id, quantity: 1 },
                { variant_id: product.variants[1].id, quantity: 1 },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/shipping-methods`,
            {
              shipping_option_id: shippingOption.id,
            },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          let updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          const frenchSmallItem = updatedDraftOrder.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          expect(frenchSmallItem.variant_title).toEqual("Petit")

          expect(frenchSmallItem.tax_lines.length).toBeGreaterThan(0)
          const frenchTaxLine = frenchSmallItem.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(frenchTaxLine.description).toEqual("Taux par défaut CA")

          await api.post(
            `/admin/draft-orders/${draftOrder.id}`,
            { locale: "de-DE" },
            adminHeaders
          )

          updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          const germanSmallItem = updatedDraftOrder.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          const germanMediumItem = updatedDraftOrder.items.find(
            (item) => item.variant_id === product.variants[1].id
          )

          expect(germanSmallItem).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt DE",
              product_description: "Ein bequemes Baumwoll-T-Shirt",
              variant_title: "Klein",
            })
          )
          expect(germanMediumItem).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt DE",
              variant_title: "Mittel",
            })
          )

          expect(germanSmallItem.tax_lines.length).toBeGreaterThan(0)
          const germanSmallTaxLine = germanSmallItem.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(germanSmallTaxLine.description).toEqual(
            "CA Standardsteuersatz"
          )

          expect(germanMediumItem.tax_lines.length).toBeGreaterThan(0)
          const germanMediumTaxLine = germanMediumItem.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(germanMediumTaxLine.description).toEqual(
            "CA Standardsteuersatz"
          )

          expect(updatedDraftOrder.shipping_methods.length).toBeGreaterThan(0)

          const shippingMethod = updatedDraftOrder.shipping_methods[0]
          const shippingTaxLine = shippingMethod.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(shippingTaxLine).toBeDefined()
          expect(shippingTaxLine.description).toEqual("CA Standardsteuersatz")
        })
      })

      describe("POST /admin/draft-orders/:id/edit/shipping-methods (add shipping method to draft order)", () => {
        it("should translate shipping method added to draft order using draft order locale", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                locale: "fr-FR",
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          const previewResponse = await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/shipping-methods`,
            { shipping_option_id: shippingOption.id },
            adminHeaders
          )

          expect(
            previewResponse.data.draft_order_preview.shipping_methods
          ).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: shippingOption.id,
                name: "Option d'expédition de test",
              }),
            ])
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          const updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.shipping_methods).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: shippingOption.id,
                name: "Option d'expédition de test",
              }),
            ])
          )
        })

        it("should have original shipping method name when draft order has no locale", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          const previewResponse = await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/shipping-methods`,
            { shipping_option_id: shippingOption.id },
            adminHeaders
          )

          expect(
            previewResponse.data.draft_order_preview.shipping_methods
          ).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: shippingOption.id,
                name: "Test shipping option",
              }),
            ])
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          const updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.shipping_methods).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: shippingOption.id,
                name: "Test shipping option",
              }),
            ])
          )
        })
      })

      describe("POST /admin/draft-orders/:id (update draft order locale)", () => {
        it("should re-translate shipping methods when locale is updated", async () => {
          const draftOrder = (
            await api.post(
              "/admin/draft-orders",
              {
                email: "test@test.com",
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                locale: "fr-FR",
                shipping_address: {
                  address_1: "123 Main St",
                  city: "Anytown",
                  country_code: "us",
                  postal_code: "12345",
                  first_name: "John",
                },
              },
              adminHeaders
            )
          ).data.draft_order

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit`,
            {},
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/shipping-methods`,
            { shipping_option_id: shippingOption.id },
            adminHeaders
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}/edit/confirm`,
            {},
            adminHeaders
          )

          let updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.shipping_methods[0].name).toEqual(
            "Option d'expédition de test"
          )

          await api.post(
            `/admin/draft-orders/${draftOrder.id}`,
            { locale: "de-DE" },
            adminHeaders
          )

          updatedDraftOrder = (
            await api.get(`/admin/draft-orders/${draftOrder.id}`, adminHeaders)
          ).data.draft_order

          expect(updatedDraftOrder.shipping_methods[0]).toEqual(
            expect.objectContaining({
              shipping_option_id: shippingOption.id,
              name: "Test-Versandoption",
            })
          )
        })
      })
    })
  },
})
