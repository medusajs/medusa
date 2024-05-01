import {
  LinkModuleUtils,
  ModuleRegistrationName,
  Modules,
  RemoteLink,
} from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IFulfillmentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IPromotionModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  ITaxModuleService,
} from "@medusajs/types"
import {
  PromotionRuleOperator,
  PromotionType,
  RuleOperator,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"
import { setupTaxStructure } from "../../fixtures"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store Carts API", () => {
      let appContainer
      let cartModule: ICartModuleService
      let regionModule: IRegionModuleService
      let scModule: ISalesChannelModuleService
      let customerModule: ICustomerModuleService
      let productModule: IProductModuleService
      let pricingModule: IPricingModuleService
      let remoteLink: RemoteLink
      let promotionModule: IPromotionModuleService
      let taxModule: ITaxModuleService
      let fulfillmentModule: IFulfillmentModuleService

      let defaultRegion

      beforeAll(async () => {
        appContainer = getContainer()
        cartModule = appContainer.resolve(ModuleRegistrationName.CART)
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
        scModule = appContainer.resolve(ModuleRegistrationName.SALES_CHANNEL)
        customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        remoteLink = appContainer.resolve(LinkModuleUtils.REMOTE_LINK)
        promotionModule = appContainer.resolve(ModuleRegistrationName.PROMOTION)
        taxModule = appContainer.resolve(ModuleRegistrationName.TAX)
        fulfillmentModule = appContainer.resolve(
          ModuleRegistrationName.FULFILLMENT
        )
      })

      beforeEach(async () => {
        await adminSeeder(dbConnection)

        // Here, so we don't have to create a region for each test
        defaultRegion = await regionModule.create({
          name: "Default Region",
          currency_code: "dkk",
        })
      })

      describe("POST /store/carts", () => {
        it.skip("should create a cart", async () => {
          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const salesChannel = await scModule.create({
            name: "Webshop",
          })

          const [product] = await productModule.create([
            {
              title: "Test product",
              variants: [
                {
                  manage_inventory: false,
                  title: "Test variant",
                },
                {
                  manage_inventory: false,
                  title: "Test variant 2",
                },
              ],
            },
          ])

          const [priceSet, priceSetTwo] = await pricingModule.create([
            {
              prices: [
                {
                  amount: 3000,
                  currency_code: "usd",
                },
              ],
            },
            {
              prices: [
                {
                  amount: 4000,
                  currency_code: "usd",
                },
              ],
            },
          ])

          await remoteLink.create([
            {
              productService: {
                variant_id: product.variants[0].id,
              },
              pricingService: {
                price_set_id: priceSet.id,
              },
            },
            {
              productService: {
                variant_id: product.variants[1].id,
              },
              pricingService: {
                price_set_id: priceSetTwo.id,
              },
            },
          ])

          const created = await api.post(`/store/carts`, {
            email: "tony@stark.com",
            currency_code: "usd",
            region_id: region.id,
            sales_channel_id: salesChannel.id,
            items: [
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
              {
                variant_id: product.variants[1].id,
                quantity: 2,
              },
            ],
          })

          expect(created.status).toEqual(200)
          expect(created.data.cart).toEqual(
            expect.objectContaining({
              id: created.data.cart.id,
              currency_code: "usd",
              email: "tony@stark.com",
              region: expect.objectContaining({
                id: region.id,
                currency_code: "usd",
              }),
              sales_channel_id: salesChannel.id,
              customer: expect.objectContaining({
                email: "tony@stark.com",
              }),
              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 3000,
                }),
                expect.objectContaining({
                  quantity: 2,
                  unit_price: 4000,
                }),
              ]),
            })
          )
        })

        it("should create cart with customer from email and tax lines", async () => {
          await setupTaxStructure(taxModule)

          const [product] = await productModule.create([
            {
              title: "Test product default tax",
              variants: [
                { title: "Test variant default tax", manage_inventory: false },
              ],
            },
          ])

          const salesChannel = await scModule.create({
            name: "Webshop",
          })

          const [priceSet] = await pricingModule.create([
            { prices: [{ amount: 3000, currency_code: "usd" }] },
          ])

          await remoteLink.create([
            {
              productService: { variant_id: product.variants[0].id },
              pricingService: { price_set_id: priceSet.id },
            },
          ])

          const created = await api.post(`/store/carts`, {
            currency_code: "usd",
            email: "tony@stark-industries.com",
            shipping_address: {
              address_1: "test address 1",
              address_2: "test address 2",
              city: "NY",
              country_code: "US",
              province: "NY",
              postal_code: "94016",
            },
            sales_channel_id: salesChannel.id,
            items: [
              {
                quantity: 1,
                variant_id: product.variants[0].id,
              },
            ],
          })

          expect(created.status).toEqual(200)
          expect(created.data.cart).toEqual(
            expect.objectContaining({
              id: created.data.cart.id,
              currency_code: "usd",
              email: "tony@stark-industries.com",
              customer: expect.objectContaining({
                id: expect.any(String),
                email: "tony@stark-industries.com",
              }),
              items: [
                expect.objectContaining({
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [],
                }),
              ],
            })
          )
        })

        it("should create cart with any region", async () => {
          await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const response = await api.post(`/store/carts`, {
            email: "tony@stark.com",
            currency_code: "usd",
          })

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: response.data.cart.id,
              currency_code: "usd",
              email: "tony@stark.com",
              region: expect.objectContaining({
                id: expect.any(String),
              }),
            })
          )
        })

        it("should create cart with region currency code", async () => {
          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const response = await api.post(`/store/carts`, {
            email: "tony@stark.com",
            region_id: region.id,
          })

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: response.data.cart.id,
              currency_code: "usd",
              email: "tony@stark.com",
              region: expect.objectContaining({
                id: region.id,
              }),
            })
          )
        })

        it("should create cart with logged-in customer", async () => {
          const { customer, jwt } = await createAuthenticatedCustomer(
            appContainer
          )

          const response = await api.post(
            `/store/carts`,
            {},
            {
              headers: { authorization: `Bearer ${jwt}` },
            }
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: response.data.cart.id,
              currency_code: "dkk",
              email: customer.email,
              customer: expect.objectContaining({
                id: customer.id,
                email: customer.email,
              }),
            })
          )
        })

        it("should respond 400 bad request on unknown props", async () => {
          await expect(
            api.post(`/store/carts`, {
              foo: "bar",
            })
          ).rejects.toThrow()
        })
      })

      describe("POST /store/carts/:id", () => {
        it("should update a cart with promo codes with a replace action", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const targetRules = [
            {
              attribute: "product_id",
              operator: PromotionRuleOperator.IN,
              values: ["prod_tshirt"],
            },
          ]

          const appliedPromotion = await promotionModule.create({
            code: "PROMOTION_APPLIED",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              value: 300,
              apply_to_quantity: 1,
              max_quantity: 1,
              target_rules: targetRules,
            },
          })

          const createdPromotion = await promotionModule.create({
            code: "PROMOTION_TEST",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 1000,
              apply_to_quantity: 1,
              target_rules: targetRules,
            },
          })

          const cart = await cartModule.create({
            currency_code: "usd",
            email: "tony@stark.com",
            region_id: region.id,
            shipping_address: {
              address_1: "test address 1",
              address_2: "test address 2",
              city: "NY",
              country_code: "US",
              province: "NY",
              postal_code: "94016",
            },
            items: [
              {
                id: "item-1",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_tshirt",
              } as any,
            ],
          })

          const [adjustment] = await cartModule.addLineItemAdjustments([
            {
              code: appliedPromotion.code!,
              amount: 300,
              item_id: "item-1",
              promotion_id: appliedPromotion.id,
            },
          ])

          await remoteLink.create([
            {
              [Modules.CART]: { cart_id: cart.id },
              [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
            },
          ])

          // Should remove earlier adjustments from other promocodes
          let updated = await api.post(`/store/carts/${cart.id}`, {
            promo_codes: [createdPromotion.code],
          })

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  id: "item-1",
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [
                    expect.objectContaining({
                      id: expect.not.stringContaining(adjustment.id),
                      code: createdPromotion.code,
                    }),
                  ],
                }),
              ],
            })
          )
          // Should remove all adjustments from other promo codes
          updated = await api.post(`/store/carts/${cart.id}`, {
            promo_codes: [],
          })

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  id: "item-1",
                  adjustments: [],
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                }),
              ],
            })
          )
        })

        it("should not generate tax lines if region is not present or automatic taxes is false", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
            automatic_taxes: false,
          })

          const cart = await cartModule.create({
            currency_code: "usd",
            email: "tony@stark.com",
            shipping_address: {
              address_1: "test address 1",
              address_2: "test address 2",
              city: "NY",
              country_code: "US",
              province: "NY",
              postal_code: "94016",
            },
            items: [
              {
                id: "item-1",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_tshirt",
              } as any,
            ],
          })

          let updated = await api.post(`/store/carts/${cart.id}`, {
            email: "another@tax.com",
          })

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  id: "item-1",
                  tax_lines: [],
                  adjustments: [],
                }),
              ],
            })
          )

          await cartModule.update(cart.id, {
            region_id: region.id,
          })

          updated = await api.post(`/store/carts/${cart.id}`, {
            email: "another@tax.com",
          })

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  id: "item-1",
                  adjustments: [],
                  tax_lines: [],
                }),
              ],
            })
          )
        })

        it("should update a cart's region, sales channel, customer data and tax lines", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.create({
            name: "us",
            currency_code: "usd",
          })

          const salesChannel = await scModule.create({
            name: "Webshop",
          })

          const cart = await cartModule.create({
            currency_code: "eur",
            email: "tony@stark.com",
            shipping_address: {
              address_1: "test address 1",
              address_2: "test address 2",
              city: "ny",
              country_code: "us",
              province: "ny",
              postal_code: "94016",
            },
            items: [
              {
                id: "item-1",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_tshirt",
              } as any,
            ],
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.create({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [{ type: "country", country_code: "us" }],
              },
            ],
          })

          const shippingOption = await fulfillmentModule.createShippingOptions({
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
            rules: [
              {
                operator: RuleOperator.EQ,
                attribute: "customer.email",
                value: "tony@stark.com",
              },
            ],
          })

          const shippingOption2 = await fulfillmentModule.createShippingOptions(
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
              rules: [
                {
                  operator: RuleOperator.EQ,
                  attribute: "customer.email",
                  value: "tony@stark.com",
                },
              ],
            }
          )

          // Manually inserting shipping methods here since the cart does not
          // currently support it. Move to API when ready.
          await cartModule.addShippingMethods(cart.id, [
            {
              amount: 500,
              name: "express",
              shipping_option_id: shippingOption.id,
            },
            {
              amount: 500,
              name: "standard",
              shipping_option_id: shippingOption2.id,
            },
          ])

          let updated = await api.post(`/store/carts/${cart.id}`, {
            region_id: region.id,
            email: "tony@stark.com",
            sales_channel_id: salesChannel.id,
          })
          console.log(
            "updated.data.cart --- ",
            JSON.stringify(updated.data.cart, null, 4)
          )
          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              region: expect.objectContaining({
                id: region.id,
                currency_code: "usd",
              }),
              email: "tony@stark.com",
              customer: expect.objectContaining({
                email: "tony@stark.com",
              }),
              sales_channel_id: salesChannel.id,
              shipping_address: expect.objectContaining({
                city: "ny",
                country_code: "us",
                province: "ny",
              }),
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOption2.id,
                  amount: 500,
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [],
                }),
                expect.objectContaining({
                  shipping_option_id: shippingOption.id,
                  amount: 500,
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [],
                }),
              ]),
              items: [
                expect.objectContaining({
                  id: "item-1",
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [],
                }),
              ],
            })
          )

          updated = await api.post(`/store/carts/${cart.id}`, {
            email: null,
            sales_channel_id: null,
          })

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              email: null,
              customer_id: null,
              sales_channel_id: null,
              items: [
                expect.objectContaining({
                  id: "item-1",
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [],
                }),
              ],
            })
          )
        })

        it("should remove invalid shipping methods", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const cart = await cartModule.create({
            region_id: region.id,
            currency_code: "eur",
            email: "tony@stark.com",
            shipping_address: {
              address_1: "test address 1",
              address_2: "test address 2",
              city: "ny",
              country_code: "us",
              province: "ny",
              postal_code: "94016",
            },
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.create({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [{ type: "country", country_code: "us" }],
              },
            ],
          })

          const shippingOptionOldValid =
            await fulfillmentModule.createShippingOptions({
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
              rules: [
                {
                  operator: RuleOperator.EQ,
                  attribute: "customer.email",
                  value: "tony@stark.com",
                },
              ],
            })

          const shippingOptionNewValid =
            await fulfillmentModule.createShippingOptions({
              name: "Test shipping option new",
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              rules: [
                {
                  operator: RuleOperator.EQ,
                  attribute: "customer.email",
                  value: "jon@stark.com",
                },
              ],
            })

          await cartModule.addShippingMethods(cart.id, [
            // should be removed
            {
              amount: 500,
              name: "express",
              shipping_option_id: shippingOptionOldValid.id,
            },
            // should be kept
            {
              amount: 500,
              name: "express-new",
              shipping_option_id: shippingOptionNewValid.id,
            },
            // should be removed
            {
              amount: 500,
              name: "standard",
              shipping_option_id: "does-not-exist",
            },
          ])

          let updated = await api.post(`/store/carts/${cart.id}`, {
            email: "jon@stark.com",
          })

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              email: "jon@stark.com",
              shipping_methods: [
                expect.objectContaining({
                  shipping_option_id: shippingOptionNewValid.id,
                }),
              ],
            })
          )

          updated = await api.post(`/store/carts/${cart.id}`, {
            email: null,
            sales_channel_id: null,
          })

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              email: null,
              shipping_methods: [],
            })
          )
        })
      })

      describe("POST /store/carts/:id", () => {
        it("should create and update a cart", async () => {
          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const salesChannel = await scModule.create({
            name: "Webshop",
          })

          const created = await api.post(`/store/carts`, {
            email: "tony@stark.com",
            currency_code: "usd",
            region_id: region.id,
            sales_channel_id: salesChannel.id,
          })

          expect(created.status).toEqual(200)
          expect(created.data.cart).toEqual(
            expect.objectContaining({
              id: created.data.cart.id,
              currency_code: "usd",
              email: "tony@stark.com",
              region: expect.objectContaining({
                id: region.id,
                currency_code: "usd",
              }),
              sales_channel_id: salesChannel.id,
            })
          )

          const updated = await api.post(
            `/store/carts/${created.data.cart.id}`,
            {
              email: "tony@stark-industries.com",
            }
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: updated.data.cart.id,
              currency_code: "usd",
              email: "tony@stark-industries.com",
            })
          )
        })
      })

      describe("GET /store/carts", () => {
        it("should get cart", async () => {
          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const salesChannel = await scModule.create({
            name: "Webshop",
          })

          const cart = await cartModule.create({
            currency_code: "usd",
            items: [
              {
                unit_price: 1000,
                quantity: 1,
                title: "Test item",
              },
            ],
            region_id: region.id,
            sales_channel_id: salesChannel.id,
          })

          const response = await api.get(`/store/carts/${cart.id}`)

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1000,
                  quantity: 1,
                  title: "Test item",
                }),
              ]),
              region: expect.objectContaining({
                id: region.id,
                currency_code: "usd",
              }),
              sales_channel_id: salesChannel.id,
            })
          )
        })
      })

      describe("POST /store/carts/:id/line-items", () => {
        it.skip("should add item to cart", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const customer = await customerModule.create({
            email: "tony@stark-industries.com",
          })

          const salesChannel = await scModule.create({
            name: "Webshop",
          })

          const [productWithSpecialTax] = await productModule.create([
            {
              // This product ID is setup in the tax structure fixture (setupTaxStructure)
              id: "product_id_1",
              title: "Test product",
              variants: [{ title: "Test variant", manage_inventory: false }],
            } as any,
          ])

          const [productWithDefaultTax] = await productModule.create([
            {
              title: "Test product default tax",
              variants: [
                { title: "Test variant default tax", manage_inventory: false },
              ],
            },
          ])

          const cart = await cartModule.create({
            currency_code: "usd",
            customer_id: customer.id,
            sales_channel_id: salesChannel.id,
            region_id: region.id,
            shipping_address: {
              customer_id: customer.id,
              address_1: "test address 1",
              address_2: "test address 2",
              city: "SF",
              country_code: "US",
              province: "CA",
              postal_code: "94016",
            },
            items: [
              {
                id: "item-1",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_mat",
              } as any,
            ],
          })

          const appliedPromotion = await promotionModule.create({
            code: "PROMOTION_APPLIED",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 300,
              apply_to_quantity: 2,
              target_rules: [
                {
                  attribute: "product_id",
                  operator: "in",
                  values: ["prod_mat", productWithSpecialTax.id],
                },
              ],
            },
          })

          const [lineItemAdjustment] = await cartModule.addLineItemAdjustments([
            {
              code: appliedPromotion.code!,
              amount: 300,
              item_id: "item-1",
              promotion_id: appliedPromotion.id,
            },
          ])

          const [priceSet, priceSetDefaultTax] = await pricingModule.create([
            {
              prices: [{ amount: 3000, currency_code: "usd" }],
            },
            {
              prices: [{ amount: 2000, currency_code: "usd" }],
            },
          ])

          await remoteLink.create([
            {
              productService: {
                variant_id: productWithSpecialTax.variants[0].id,
              },
              pricingService: { price_set_id: priceSet.id },
            },
            {
              productService: {
                variant_id: productWithDefaultTax.variants[0].id,
              },
              pricingService: { price_set_id: priceSetDefaultTax.id },
            },
            {
              [Modules.CART]: { cart_id: cart.id },
              [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
            },
          ])

          let response = await api.post(`/store/carts/${cart.id}/line-items`, {
            variant_id: productWithSpecialTax.variants[0].id,
            quantity: 1,
          })

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 3000,
                  quantity: 1,
                  title: "Test variant",
                  tax_lines: [
                    expect.objectContaining({
                      description: "CA Reduced Rate for Products",
                      code: "CAREDUCE_PROD",
                      rate: 3,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [
                    expect.objectContaining({
                      code: "PROMOTION_APPLIED",
                      amount: 180,
                    }),
                  ],
                }),
                expect.objectContaining({
                  unit_price: 2000,
                  quantity: 1,
                  title: "Test item",
                  tax_lines: [],
                  adjustments: [
                    expect.objectContaining({
                      id: expect.not.stringContaining(lineItemAdjustment.id),
                      code: "PROMOTION_APPLIED",
                      amount: 120,
                    }),
                  ],
                }),
              ]),
            })
          )

          response = await api.post(`/store/carts/${cart.id}/line-items`, {
            variant_id: productWithDefaultTax.variants[0].id,
            quantity: 1,
          })

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 2000,
                  quantity: 1,
                  title: "Test variant default tax",
                  tax_lines: [
                    // Uses the california default rate
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ],
                }),
              ]),
            })
          )
        })
      })

      describe("POST /store/carts/:id/payment-collections", () => {
        it("should create a payment collection for the cart", async () => {
          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
          })

          const cart = await cartModule.create({
            currency_code: "usd",
            region_id: region.id,
          })

          const response = await api.post(
            `/store/carts/${cart.id}/payment-collections`
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              payment_collection: expect.objectContaining({
                id: expect.any(String),
                amount: 0,
              }),
            })
          )
        })
      })

      describe("POST /store/carts/:id/taxes", () => {
        it("should update a carts tax lines when region.automatic_taxes is false", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
            automatic_taxes: false,
          })

          const cart = await cartModule.create({
            currency_code: "usd",
            region_id: region.id,
            shipping_address: {
              address_1: "test address 1",
              address_2: "test address 2",
              city: "NY",
              country_code: "US",
              province: "NY",
              postal_code: "94016",
            },
            items: [
              {
                id: "item-1",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_tshirt",
              } as any,
            ],
          })

          let updated = await api.post(`/store/carts/${cart.id}/taxes`, {})

          expect(updated.status).toEqual(200)

          // TODO: validate tax totals when calculations are ready
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  id: "item-1",
                  tax_lines: [
                    expect.objectContaining({
                      description: "NY Default Rate",
                      code: "NYDEFAULT",
                      rate: 6,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [],
                }),
              ],
            })
          )
        })

        it("should throw error when shipping is not present", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.create({
            name: "US",
            currency_code: "usd",
            automatic_taxes: false,
          })

          const cart = await cartModule.create({
            currency_code: "usd",
            region_id: region.id,
            items: [
              {
                id: "item-1",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_tshirt",
              } as any,
            ],
          })

          let error = await api
            .post(`/store/carts/${cart.id}/taxes`, {})
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            type: "invalid_data",
            message: "country code is required to calculate taxes",
          })
        })
      })

      describe("POST /store/carts/:id/shipping-methods", () => {
        it("should add a shipping methods to a cart", async () => {
          const cart = await cartModule.create({
            currency_code: "usd",
            shipping_address: { country_code: "us" },
            items: [],
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.create({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [{ type: "country", country_code: "us" }],
              },
            ],
          })

          const priceSet = await pricingModule.create({
            prices: [{ amount: 3000, currency_code: "usd" }],
          })

          const shippingOption = await fulfillmentModule.createShippingOptions({
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
            rules: [
              {
                operator: RuleOperator.EQ,
                attribute: "shipping_address.country_code",
                value: "us",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.FULFILLMENT]: { shipping_option_id: shippingOption.id },
              [Modules.PRICING]: { price_set_id: priceSet.id },
            },
          ])

          let response = await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id }
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: [
                {
                  shipping_option_id: shippingOption.id,
                  amount: 3000,
                  id: expect.any(String),
                  tax_lines: [],
                  adjustments: [],
                },
              ],
            })
          )
        })
      })
    })
  },
})
