import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaContainer } from "@medusajs/types"
import { Modules, ProductStatus } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

process.env.MEDUSA_FF_TRANSLATION = "true"

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

const shippingAddressData = {
  address_1: "test address 1",
  address_2: "test address 2",
  city: "SF",
  country_code: "US",
  province: "CA",
  postal_code: "94016",
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store Cart Translation API", () => {
      let appContainer: MedusaContainer
      let storeHeaders: { headers: { [key: string]: string } }
      let region: { id: string }
      let product: { id: string; variants: { id: string; title: string }[] }
      let salesChannel: { id: string }
      let shippingProfile: { id: string }
      let taxRegion: { id: string }
      let taxRate: { id: string; name: string }

      beforeAll(async () => {
        appContainer = getContainer()
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const translationModule = appContainer.resolve(Modules.TRANSLATION)
        await translationModule.__hooks?.onApplicationStart?.().catch(() => {})

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

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

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        // Create tax region and tax rate for tax line translations
        taxRegion = (
          await api.post(
            "/admin/tax-regions",
            {
              country_code: "us",
              provider_id: "tp_system",
            },
            adminHeaders
          )
        ).data.tax_region

        // Create the default tax rate
        taxRate = (
          await api.post(
            "/admin/tax-rates",
            {
              tax_region_id: taxRegion.id,
              name: "US Sales Tax",
              rate: 5,
              code: "US_SALES_TAX",
              is_default: true,
            },
            adminHeaders
          )
        ).data.tax_rate

        // Create translations for tax rate name
        await api.post(
          "/admin/translations/batch",
          {
            create: [
              {
                reference_id: taxRate.id,
                reference: "tax_rate",
                locale_code: "fr-FR",
                translations: {
                  name: "Taxe de vente US",
                },
              },
              {
                reference_id: taxRate.id,
                reference: "tax_rate",
                locale_code: "de-DE",
                translations: {
                  name: "US Umsatzsteuer",
                },
              },
            ],
          },
          adminHeaders
        )

        // Create product with description for translation
        product = (
          await api.post(
            "/admin/products",
            {
              title: "Medusa T-Shirt",
              description: "A comfortable cotton t-shirt",
              handle: "t-shirt",
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [
                {
                  title: "Size",
                  values: ["S", "M"],
                },
              ],
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

        // Maintain predictable variants order
        const variantSmall = product.variants.find((v) => v.title === "Small")
        const variantMedium = product.variants.find((v) => v.title === "Medium")
        product.variants = [variantSmall!, variantMedium!]

        // Create translations for product and variants
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
                translations: {
                  title: "Petit",
                },
              },
              {
                reference_id: product.variants[0].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: {
                  title: "Klein",
                },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "fr-FR",
                translations: {
                  title: "Moyen",
                },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: {
                  title: "Mittel",
                },
              },
            ],
          },
          adminHeaders
        )
      })

      describe("POST /store/carts (create cart with locale)", () => {
        it("should create a cart with translated items when locale is provided", async () => {
          const response = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  product_title: "T-Shirt Medusa",
                  product_description: "Un t-shirt en coton confortable",
                  variant_title: "Petit",
                }),
              ]),
            })
          )
        })

        it("should create a cart with original values when no locale is provided", async () => {
          const response = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt",
              product_description: "A comfortable cotton t-shirt",
              variant_title: "Small",
            })
          )
        })
      })

      describe("POST /store/carts/:id/line-items (add items to cart)", () => {
        it("should translate new items using the cart's locale", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const addItemResponse = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(addItemResponse.status).toEqual(200)
          expect(addItemResponse.data.cart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              product_description: "Un t-shirt en coton confortable",
              variant_title: "Petit",
            })
          )
        })

        it("should translate multiple items added to cart", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          const response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[1].id,
              quantity: 2,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items).toHaveLength(2)

          const smallItem = response.data.cart.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          const mediumItem = response.data.cart.items.find(
            (item) => item.variant_id === product.variants[1].id
          )

          expect(smallItem).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Petit",
            })
          )
          expect(mediumItem).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Moyen",
            })
          )
        })
      })

      describe("POST /store/carts/:id (update cart locale)", () => {
        it("should re-translate all items when locale is updated", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [
                { variant_id: product.variants[0].id, quantity: 1 },
                { variant_id: product.variants[1].id, quantity: 1 },
              ],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const frenchSmallItem = cart.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          expect(frenchSmallItem.variant_title).toEqual("Petit")

          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "de-DE",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          const updatedCart = updatedCartResponse.data.cart

          const germanSmallItem = updatedCart.items.find(
            (item) => item.variant_id === product.variants[0].id
          )
          const germanMediumItem = updatedCart.items.find(
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
        })

        it("should not re-translate items when locale is not changed", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              email: "test@example.com",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          const updatedCart = updatedCartResponse.data.cart
          expect(updatedCart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Petit",
            })
          )
        })

        it("should handle updating to a locale with no translations", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "ja-JP",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          // Fetch updated cart - should have original values since no Japanese translation exists
          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          // no translation means it will revert to default values
          const updatedCart = updatedCartResponse.data.cart
          expect(updatedCart.items[0]).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt",
              variant_title: "Small",
            })
          )
        })
      })

      describe("Cart with items and locale changes", () => {
        it("should maintain translations when adding items to a cart with existing locale", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const addResponse = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[1].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(addResponse.data.cart.items).toHaveLength(2)

          const allItemsTranslated = addResponse.data.cart.items.every(
            (item) => item.product_title === "T-Shirt Medusa"
          )
          expect(allItemsTranslated).toBe(true)
        })
      })

      describe("Tax line translations", () => {
        it("should translate tax line descriptions when creating a cart with locale", async () => {
          const response = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items[0]).toEqual(
            expect.objectContaining({
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  description: "Taxe de vente US",
                  rate: 5,
                }),
              ]),
            })
          )
        })

        it("should use original tax line description when no locale is provided", async () => {
          const response = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items[0]).toEqual(
            expect.objectContaining({
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  description: "US Sales Tax",
                  rate: 5,
                }),
              ]),
            })
          )
        })

        it("should translate tax line descriptions when adding items to cart with locale", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "de-DE",
              shipping_address: shippingAddressData,
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const addItemResponse = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(addItemResponse.status).toEqual(200)
          expect(addItemResponse.data.cart.items[0]).toEqual(
            expect.objectContaining({
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  description: "US Umsatzsteuer",
                  rate: 5,
                }),
              ]),
            })
          )
        })

        it("should re-translate tax line descriptions when cart locale is updated", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          // Verify French translation
          expect(cart.items[0].tax_lines[0].description).toEqual(
            "Taxe de vente US"
          )

          // Update locale to German
          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "de-DE",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          // Fetch updated cart
          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          const updatedCart = updatedCartResponse.data.cart

          // Verify German translation
          expect(updatedCart.items[0]).toEqual(
            expect.objectContaining({
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  description: "US Umsatzsteuer",
                  rate: 5,
                }),
              ]),
            })
          )
        })

        it("should revert to original tax line description when locale has no translation", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          // Verify French translation exists
          expect(cart.items[0].tax_lines[0].description).toEqual(
            "Taxe de vente US"
          )

          // Update to locale without translation
          const updateResponse = await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "ja-JP",
            },
            storeHeaders
          )

          expect(updateResponse.status).toEqual(200)

          // Fetch updated cart
          const updatedCartResponse = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

          const updatedCart = updatedCartResponse.data.cart

          // Should revert to original description
          expect(updatedCart.items[0]).toEqual(
            expect.objectContaining({
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  description: "US Sales Tax",
                  rate: 5,
                }),
              ]),
            })
          )
        })

        it("should translate tax lines for all items when multiple items are added", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          // Add first item
          await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          // Add second item
          const response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[1].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items).toHaveLength(2)

          // Both items should have translated tax lines
          response.data.cart.items.forEach((item: any) => {
            expect(item.tax_lines).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  description: "Taxe de vente US",
                  rate: 5,
                }),
              ])
            )
          })
        })
      })

      describe("POST /store/carts/:id/shipping-methods (shipping method translation)", () => {
        let shippingOption

        beforeEach(async () => {
          const stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "translation test location" },
              adminHeaders
            )
          ).data.stock_location

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          const fulfillmentSets = (
            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
              {
                name: `Translation-Test-${shippingProfile.id}`,
                type: "test-type",
              },
              adminHeaders
            )
          ).data.stock_location.fulfillment_sets

          const fulfillmentSet = (
            await api.post(
              `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
              {
                name: `Translation-Test-${shippingProfile.id}`,
                geo_zones: [{ type: "country", country_code: "US" }],
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
                name: "Standard Shipping",
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: "manual_test-provider",
                price_type: "flat",
                type: {
                  label: "Standard",
                  description: "Standard shipping option",
                  code: "standard",
                },
                prices: [{ currency_code: "usd", amount: 1000 }],
                rules: [],
              },
              adminHeaders
            )
          ).data.shipping_option

          // Create translations for shipping option
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: shippingOption.id,
                  reference: "shipping_option",
                  locale_code: "fr-FR",
                  translations: {
                    name: "Expédition Standard",
                  },
                },
                {
                  reference_id: shippingOption.id,
                  reference: "shipping_option",
                  locale_code: "de-DE",
                  translations: {
                    name: "Standardversand",
                  },
                },
              ],
            },
            adminHeaders
          )
        })

        it("should add shipping method with translated name when cart has locale", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const updatedCart = await api
            .get(
              `/store/carts/${cart.id}?fields=+shipping_methods.name`,
              storeHeaders
            )
            .then((res) => res.data.cart)

          expect(updatedCart.shipping_methods).toHaveLength(1)
          expect(updatedCart.shipping_methods[0]).toEqual(
            expect.objectContaining({
              shipping_option_id: shippingOption.id,
              name: "Expédition Standard",
            })
          )
        })

        it("should update shipping method name when cart locale changes", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "fr-FR",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          // Add shipping method with French locale
          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          // Verify French translation
          let cartResponseAfter = await api.get(
            `/store/carts/${cart.id}?fields=+shipping_methods.name`,
            storeHeaders
          )

          expect(cartResponseAfter.data.cart.shipping_methods[0].name).toEqual(
            "Expédition Standard"
          )

          // Update cart locale to German
          await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "de-DE",
            },
            storeHeaders
          )

          // Verify German translation
          cartResponseAfter = await api.get(
            `/store/carts/${cart.id}?fields=+shipping_methods.name`,
            storeHeaders
          )

          expect(cartResponseAfter.data.cart.shipping_methods[0].name).toEqual(
            "Standardversand"
          )
        })

        it("should use original shipping option name when no translation exists", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              locale: "ja-JP",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const updatedCart = await api
            .get(
              `/store/carts/${cart.id}?fields=+shipping_methods.name`,
              storeHeaders
            )
            .then((res) => res.data.cart)

          expect(updatedCart.shipping_methods[0]).toEqual(
            expect.objectContaining({
              shipping_option_id: shippingOption.id,
              name: "Standard Shipping",
            })
          )
        })
      })
    })
  },
})
