import { RemoteLink } from "@medusajs/modules-sdk"
import {
  IApiKeyModuleService,
  ICartModuleService,
  ICustomerModuleService,
  IFulfillmentModuleService,
  IPaymentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IPromotionModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
  ITaxModuleService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
  PromotionType,
  RuleOperator,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { seedStorefrontDefaults } from "../../../../helpers/seed-storefront-defaults"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"
import { setupTaxStructure } from "../../fixtures"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

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
      let apiKeyModule: IApiKeyModuleService
      let taxModule: ITaxModuleService
      let fulfillmentModule: IFulfillmentModuleService
      let remoteLinkService
      let regionService: IRegionModuleService
      let paymentService: IPaymentModuleService
      let storeService: IStoreModuleService

      let region
      let store
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
        cartModule = appContainer.resolve(Modules.CART)
        regionModule = appContainer.resolve(Modules.REGION)
        scModule = appContainer.resolve(Modules.SALES_CHANNEL)
        customerModule = appContainer.resolve(Modules.CUSTOMER)
        productModule = appContainer.resolve(Modules.PRODUCT)
        pricingModule = appContainer.resolve(Modules.PRICING)
        apiKeyModule = appContainer.resolve(Modules.API_KEY)
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
        promotionModule = appContainer.resolve(Modules.PROMOTION)
        taxModule = appContainer.resolve(Modules.TAX)
        regionService = appContainer.resolve(Modules.REGION)
        paymentService = appContainer.resolve(Modules.PAYMENT)
        storeService = appContainer.resolve(Modules.STORE)
        fulfillmentModule = appContainer.resolve(Modules.FULFILLMENT)
        remoteLinkService = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const { store: defaultStore } = await seedStorefrontDefaults(
          appContainer,
          "dkk"
        )

        store = defaultStore
      })

      describe("POST /store/carts", () => {
        it("should create a cart", async () => {
          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })

          const salesChannel = await scModule.createSalesChannels({
            name: "Webshop",
          })

          const [product] = await productModule.createProducts([
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

          const [priceSet, priceSetTwo] = await pricingModule.createPriceSets([
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
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[1].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSetTwo.id,
              },
            },
          ])

          const created = await api.post(
            `/store/carts`,
            {
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
            },
            storeHeaders
          )

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

          const [product] = await productModule.createProducts([
            {
              title: "Test product default tax",
              variants: [
                { title: "Test variant default tax", manage_inventory: false },
              ],
            },
          ])

          const salesChannel = await scModule.createSalesChannels({
            name: "Webshop",
          })

          const [priceSet] = await pricingModule.createPriceSets([
            { prices: [{ amount: 3000, currency_code: "usd" }] },
          ])

          await remoteLink.create([
            {
              [Modules.PRODUCT]: { variant_id: product.variants[0].id },
              [Modules.PRICING]: { price_set_id: priceSet.id },
            },
          ])

          const created = await api.post(
            `/store/carts`,
            {
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
            },
            storeHeaders
          )

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
          await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })

          const response = await api.post(
            `/store/carts`,
            {
              email: "tony@stark.com",
              currency_code: "usd",
            },
            storeHeaders
          )

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

        it("should create cart with shipping address country code when there is only one country assigned to the region", async () => {
          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
            countries: ["us"],
          })

          const response = await api.post(
            `/store/carts`,
            {
              email: "tony@stark.com",
              currency_code: "usd",
              region_id: region.id,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: response.data.cart.id,
              currency_code: "usd",
              email: "tony@stark.com",
              region: expect.objectContaining({
                id: region.id,
              }),
              shipping_address: {
                id: expect.any(String),
                country_code: "us",
                first_name: null,
                last_name: null,
                company: null,
                address_1: null,
                address_2: null,
                city: null,
                province: null,
                postal_code: null,
                phone: null,
              },
            })
          )
        })

        it("should create cart with default store sales channel", async () => {
          const sc = await scModule.createSalesChannels({
            name: "Webshop",
          })

          await storeService.updateStores(store.id, {
            default_sales_channel_id: sc.id,
          })

          const response = await api.post(
            `/store/carts`,
            {
              email: "tony@stark.com",
              currency_code: "usd",
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: response.data.cart.id,
              currency_code: "usd",
              email: "tony@stark.com",
              sales_channel_id: sc.id,
            })
          )
        })

        it("should create cart with region currency code", async () => {
          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })

          const response = await api.post(
            `/store/carts`,
            {
              email: "tony@stark.com",
              region_id: region.id,
            },
            storeHeaders
          )

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
              headers: {
                authorization: `Bearer ${jwt}`,
                ...storeHeaders.headers,
              },
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

        it("throws if publishable key is not associated with sales channel", async () => {
          const salesChannel = await scModule.createSalesChannels({
            name: "Retail Store",
          })

          const salesChannel2 = await scModule.createSalesChannels({
            name: "Webshop",
          })

          const pubKey = await apiKeyModule.createApiKeys({
            title: "Test key",
            type: "publishable",
            created_by: "test",
          })

          await api.post(
            `/admin/api-keys/${pubKey.id}/sales-channels`,
            {
              add: [salesChannel2.id],
            },
            adminHeaders
          )

          const errorRes = await api
            .post(
              "/store/carts",
              {
                sales_channel_id: salesChannel.id,
              },
              {
                headers: { "x-publishable-api-key": pubKey.token },
              }
            )
            .catch((e) => e)

          expect(errorRes.response.status).toEqual(400)
          expect(errorRes.response.data).toEqual({
            errors: expect.arrayContaining([
              `Sales channel ID in payload ${salesChannel.id} is not associated with the Publishable API Key in the header.`,
            ]),
            message:
              "Provided request body contains errors. Please check the data and retry the request",
          })
        })

        it("throws if publishable key has multiple associated sales channels", async () => {
          const salesChannel = await scModule.createSalesChannels({
            name: "Retail Store",
          })

          const salesChannel2 = await scModule.createSalesChannels({
            name: "Webshop",
          })

          const pubKey = await apiKeyModule.createApiKeys({
            title: "Test key",
            type: "publishable",
            created_by: "test",
          })

          await api.post(
            `/admin/api-keys/${pubKey.id}/sales-channels`,
            {
              add: [salesChannel.id, salesChannel2.id],
            },
            adminHeaders
          )

          const errorRes = await api
            .post(
              "/store/carts",
              {},
              {
                headers: { "x-publishable-api-key": pubKey.token },
              }
            )
            .catch((e) => e)

          expect(errorRes.response.status).toEqual(400)
          expect(errorRes.response.data).toEqual({
            errors: expect.arrayContaining([
              `Cannot assign sales channel to cart. The Publishable API Key in the header has multiple associated sales channels. Please provide a sales channel ID in the request body.`,
            ]),
            message:
              "Provided request body contains errors. Please check the data and retry the request",
          })
        })

        it("should create cart with sales channel if pub key does not have any scopes defined", async () => {
          const salesChannel = await scModule.createSalesChannels({
            name: "Retail Store",
          })

          const pubKey = await apiKeyModule.createApiKeys({
            title: "Test key",
            type: "publishable",
            created_by: "test",
          })

          const successRes = await api.post(
            "/store/carts",
            {
              sales_channel_id: salesChannel.id,
            },
            {
              headers: { "x-publishable-api-key": pubKey.token },
            }
          )

          expect(successRes.status).toEqual(200)
          expect(successRes.data.cart).toEqual(
            expect.objectContaining({
              sales_channel_id: salesChannel.id,
            })
          )
        })

        it("should create cart with sales channel associated with pub key", async () => {
          const salesChannel = await scModule.createSalesChannels({
            name: "Retail Store",
          })

          const pubKey = await apiKeyModule.createApiKeys({
            title: "Test key",
            type: "publishable",
            created_by: "test",
          })

          await api.post(
            `/admin/api-keys/${pubKey.id}/sales-channels`,
            {
              add: [salesChannel.id],
            },
            adminHeaders
          )

          const successRes = await api.post(
            "/store/carts",
            {},
            {
              headers: { "x-publishable-api-key": pubKey.token },
            }
          )

          expect(successRes.status).toEqual(200)
          expect(successRes.data.cart).toEqual(
            expect.objectContaining({
              sales_channel_id: salesChannel.id,
            })
          )
        })

        it("should respond 400 bad request on unknown props", async () => {
          await expect(
            api.post(`/store/carts`, { foo: "bar" }, storeHeaders)
          ).rejects.toThrow()
        })
      })

      describe("GET /store/carts", () => {
        it("should get cart", async () => {
          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })

          const salesChannel = await scModule.createSalesChannels({
            name: "Webshop",
          })

          const cart = await cartModule.createCarts({
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

          const response = await api.get(
            `/store/carts/${cart.id}`,
            storeHeaders
          )

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
        let region
        const productData = {
          title: "Medusa T-Shirt",
          handle: "t-shirt",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Size",
              values: ["S"],
            },
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "S / Black",
              sku: "SHIRT-S-BLACK",
              options: {
                Size: "S",
                Color: "Black",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 1500,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "S / White",
              sku: "SHIRT-S-WHITE",
              options: {
                Size: "S",
                Color: "White",
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 1500,
                  currency_code: "usd",
                },
              ],
            },
          ],
        }

        beforeEach(async () => {
          await setupTaxStructure(taxModule)

          region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })
        })

        it("should add item to cart", async () => {
          const customer = await customerModule.createCustomers({
            email: "tony@stark-industries.com",
          })

          const salesChannel = await scModule.createSalesChannels({
            name: "Webshop",
          })

          const [productWithSpecialTax] = await productModule.createProducts([
            {
              // This product ID is setup in the tax structure fixture (setupTaxStructure)
              id: "product_id_1",
              title: "Test product",
              variants: [{ title: "Test variant", manage_inventory: false }],
            } as any,
          ])

          const [productWithDefaultTax] = await productModule.createProducts([
            {
              title: "Test product default tax",
              variants: [
                { title: "Test variant default tax", manage_inventory: false },
              ],
            },
          ])

          await api.post(
            "/admin/price-preferences",
            {
              attribute: "currency_code",
              value: "usd",
              is_tax_inclusive: true,
            },
            adminHeaders
          )

          const cart = await cartModule.createCarts({
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

          const appliedPromotion = await promotionModule.createPromotions({
            code: "PROMOTION_APPLIED",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 300,
              apply_to_quantity: 2,
              currency_code: "usd",
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

          const [priceSet, priceSetDefaultTax] =
            await pricingModule.createPriceSets([
              {
                prices: [{ amount: 3000, currency_code: "usd" }],
              },
              {
                prices: [{ amount: 2000, currency_code: "usd" }],
              },
            ])

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: productWithSpecialTax.variants[0].id,
              },
              [Modules.PRICING]: { price_set_id: priceSet.id },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: productWithDefaultTax.variants[0].id,
              },
              [Modules.PRICING]: { price_set_id: priceSetDefaultTax.id },
            },
            {
              [Modules.CART]: { cart_id: cart.id },
              [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
            },
          ])

          let response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: productWithSpecialTax.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 3000,
                  is_tax_inclusive: true,
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
                      amount: 177.86561264822134,
                    }),
                  ],
                }),
                expect.objectContaining({
                  unit_price: 2000,
                  is_tax_inclusive: false,
                  quantity: 1,
                  title: "Test item",
                  tax_lines: [],
                  adjustments: [
                    expect.objectContaining({
                      id: expect.not.stringContaining(lineItemAdjustment.id),
                      code: "PROMOTION_APPLIED",
                      amount: 122.13438735177866,
                    }),
                  ],
                }),
              ]),
            })
          )

          response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: productWithDefaultTax.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 2000,
                  is_tax_inclusive: true,
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

        it("adding an existing variant should update or create line item depending on metadata", async () => {
          const product = (
            await api.post(`/admin/products`, productData, adminHeaders)
          ).data.product

          const cart = (
            await api.post(
              `/store/carts`,
              {
                email: "tony@stark.com",
                currency_code: region.currency_code,
                region_id: region.id,
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                    metadata: {
                      Size: "S",
                      Color: "Black",
                    },
                  },
                ],
              },
              storeHeaders
            )
          ).data.cart

          let response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
              metadata: {
                Size: "S",
                Color: "Black",
              },
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              items: [
                expect.objectContaining({
                  unit_price: 1500,
                  quantity: 2,
                  title: "S / Black",
                }),
              ],
              subtotal: 3000,
            })
          )

          response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
              metadata: {
                Size: "S",
                Color: "White",
                Special: "attribute",
              },
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart.items).toHaveLength(2)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1500,
                  quantity: 2,
                  title: "S / Black",
                }),
                expect.objectContaining({
                  unit_price: 1500,
                  quantity: 1,
                  title: "S / Black",
                }),
              ]),
              subtotal: 4500,
            })
          )
        })
      })

      describe("POST /store/payment-collections", () => {
        it("should create a payment collection for the cart", async () => {
          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })

          const cart = await cartModule.createCarts({
            currency_code: "usd",
            region_id: region.id,
          })

          const response = await api.post(
            `/store/payment-collections`,
            { cart_id: cart.id },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.payment_collection).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              amount: 0,
            })
          )
        })

        it("should return an existing payment collection for the cart", async () => {
          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })

          const cart = await cartModule.createCarts({
            currency_code: "usd",
            region_id: region.id,
          })

          const firstCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: cart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          const response = await api.post(
            `/store/payment-collections`,
            {
              cart_id: cart.id,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.payment_collection.id).toEqual(
            firstCollection.id
          )
        })

        it("should create a new payment collection for a new cart", async () => {
          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
          })

          const firstCart = await cartModule.createCarts({
            currency_code: "usd",
            region_id: region.id,
          })

          const secondCart = await cartModule.createCarts({
            currency_code: "usd",
            region_id: region.id,
          })

          const firstCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: firstCart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          const secondCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: secondCart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          expect(firstCollection.id).toBeTruthy()
          expect(firstCollection.id).not.toEqual(secondCollection.id)
        })
      })

      describe("POST /store/carts/:id/taxes", () => {
        it("should update a carts tax lines when region.automatic_taxes is false", async () => {
          await setupTaxStructure(taxModule)

          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
            automatic_taxes: false,
            countries: ["us"],
          })

          const cart = await cartModule.createCarts({
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

          let updated = await api.post(
            `/store/carts/${cart.id}/taxes`,
            {},
            storeHeaders
          )

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

          const region = await regionModule.createRegions({
            name: "US",
            currency_code: "usd",
            automatic_taxes: false,
          })

          const cart = await cartModule.createCarts({
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
            .post(`/store/carts/${cart.id}/taxes`, {}, storeHeaders)
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
          const cart = await cartModule.createCarts({
            currency_code: "usd",
            shipping_address: { country_code: "us" },
            items: [],
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [{ type: "country", country_code: "us" }],
              },
            ],
          })

          await api.post(
            "/admin/price-preferences",
            {
              attribute: "currency_code",
              value: "usd",
              is_tax_inclusive: true,
            },
            adminHeaders
          )

          const priceSet = await pricingModule.createPriceSets({
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
                attribute: "is_return",
                value: "false",
              },
              {
                operator: RuleOperator.EQ,
                attribute: "enabled_in_store",
                value: "true",
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
            { option_id: shippingOption.id },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: [
                {
                  shipping_option_id: shippingOption.id,
                  amount: 3000,
                  is_tax_inclusive: true,
                  id: expect.any(String),
                  tax_lines: [],
                  adjustments: [],
                },
              ],
            })
          )
        })
      })

      describe("POST /store/carts/:id/complete", () => {
        let salesChannel
        let product
        let shippingProfile
        let fulfillmentSet
        let shippingOption
        let paymentCollection
        let paymentSession
        let stockLocation
        let inventoryItem
        let promotion

        beforeEach(async () => {
          await setupTaxStructure(taxModule)

          region = await regionService.createRegions({
            name: "Test region",
            countries: ["US"],
            currency_code: "usd",
          })

          salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "first channel", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          inventoryItem = (
            await api.post(
              `/admin/inventory-items`,
              {
                sku: "12345",
              },
              adminHeaders
            )
          ).data.inventory_item

          await api.post(
            `/admin/inventory-items/${inventoryItem.id}/location-levels`,
            {
              location_id: stockLocation.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          shippingProfile = await fulfillmentModule.createShippingProfiles({
            name: "Test",
            type: "default",
          })

          fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [{ type: "country", country_code: "us" }],
              },
            ],
          })

          product = (
            await api.post(
              "/admin/products",
              {
                title: "Test fixture",
                options: [
                  { title: "size", values: ["large", "small"] },
                  { title: "color", values: ["green"] },
                ],
                variants: [
                  {
                    title: "Test variant",
                    inventory_items: [
                      {
                        inventory_item_id: inventoryItem.id,
                        required_quantity: 1,
                      },
                    ],
                    prices: [
                      {
                        currency_code: "usd",
                        amount: 100,
                      },
                    ],
                    options: {
                      size: "large",
                      color: "green",
                    },
                  },
                ],
              },
              adminHeaders
            )
          ).data.product

          await remoteLink.create([
            {
              [Modules.STOCK_LOCATION]: {
                stock_location_id: stockLocation.id,
              },
              [Modules.FULFILLMENT]: {
                fulfillment_set_id: fulfillmentSet.id,
              },
            },
          ])

          promotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.STANDARD,
                is_automatic: true,
                campaign: {
                  campaign_identifier: "test",
                  name: "test",
                  budget: {
                    type: "spend",
                    limit: 1000,
                    currency_code: region.currency_code,
                  },
                },
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: region.currency_code,
                  value: 10,
                  max_quantity: 1,
                  target_rules: [
                    {
                      attribute: "product_id",
                      operator: "eq",
                      values: [product.id],
                    },
                  ],
                },
                rules: [],
              },
              adminHeaders
            )
          ).data.promotion

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
                prices: [
                  { currency_code: "usd", amount: 1000 },
                  { region_id: region.id, amount: 1100 },
                ],
                rules: [],
              },
              adminHeaders
            )
          ).data.shipping_option

          paymentCollection = await paymentService.createPaymentCollections({
            region_id: region.id,
            amount: 1000,
            currency_code: "usd",
          })

          paymentSession = await paymentService.createPaymentSession(
            paymentCollection.id,
            {
              provider_id: "pp_system_default",
              amount: 1000,
              currency_code: "usd",
              data: {},
            }
          )
        })

        afterEach(async () => {
          jest.clearAllMocks()
        })

        it("should create an order and create item reservations", async () => {
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 1, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: cart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          const response = await api.post(
            `/store/carts/${cart.id}/complete`,
            {},
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            type: "order",
            order: expect.objectContaining({
              id: expect.any(String),
              total: 95.4,
              subtotal: 100,
              tax_total: 5.4,
              discount_total: 10.6,
              discount_subtotal: 10,
              discount_tax_total: 0.6,
              original_total: 106,
              original_tax_total: 6,
              item_total: 95.4,
              item_subtotal: 100,
              item_tax_total: 5.4,
              original_item_total: 106,
              original_item_subtotal: 100,
              original_item_tax_total: 6,
              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,
              items: [
                expect.objectContaining({
                  id: expect.stringContaining("ordli_"),
                  product_id: product.id,
                  unit_price: 100,
                  quantity: 1,
                  tax_total: 5.4,
                  total: 95.4,
                  subtotal: 100,
                  original_total: 106,
                  discount_total: 10.6,
                  discount_subtotal: 10,
                  discount_tax_total: 0.6,
                  original_tax_total: 6,
                  tax_lines: [
                    expect.objectContaining({
                      rate: 6,
                    }),
                  ],
                  adjustments: [
                    expect.objectContaining({
                      amount: 10,
                      promotion_id: promotion.id,
                      code: promotion.code,
                      subtotal: 10,
                      total: 10.6,
                    }),
                  ],
                }),
              ],
              shipping_address: expect.objectContaining({
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              }),
            }),
          })

          promotion = (
            await api.get(`/admin/promotions/${promotion.id}`, adminHeaders)
          ).data.promotion

          expect(promotion.campaign.budget.used).toEqual(10)

          const reservation = await api.get(`/admin/reservations`, adminHeaders)
          const reservationItem = reservation.data.reservations[0]

          expect(reservationItem).toEqual(
            expect.objectContaining({
              id: expect.stringContaining("resitem_"),
              location_id: stockLocation.id,
              inventory_item_id: inventoryItem.id,
              quantity: cart.items[0].quantity,
              line_item_id: response.data.order.items[0].id,
            })
          )

          const fullOrder = await api.get(
            `/admin/orders/${response.data.order.id}`,
            adminHeaders
          )
          const fullOrderDetail = fullOrder.data.order

          expect(fullOrderDetail).toEqual(
            expect.objectContaining({
              payment_collections: [
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 95.4,
                  status: "authorized",
                }),
              ],
            })
          )
        })

        it("should throw an error when payment collection isn't created", async () => {
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 1, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          const error = await api
            .post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            type: "invalid_data",
            message: "Payment collection has not been initiated for cart",
          })
        })

        it("should throw an error when payment collection isn't created", async () => {
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 1, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          await api.post(
            `/store/payment-collections`,
            {
              cart_id: cart.id,
            },
            storeHeaders
          )

          const error = await api
            .post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            type: "invalid_data",
            message: "Payment sessions are required to complete cart",
          })
        })

        it("should fail to update cart when it is completed", async () => {
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 1, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: cart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)

          const cartRefetch = (
            await api.get(`/store/carts/${cart.id}`, storeHeaders)
          ).data.cart

          expect(cartRefetch.completed_at).toBeTruthy()

          await expect(
            api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              {
                option_id: shippingOption.id,
              },
              storeHeaders
            )
          ).rejects.toThrow()

          const error = await api
            .post(
              `/store/carts/${cart.id}/line-items`,
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
              storeHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            type: "invalid_data",
            message: `Cart ${cart.id} is already completed.`,
          })
        })

        it("should return order when cart is already completed", async () => {
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 1, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: cart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)

          const cartRefetch = (
            await api.get(`/store/carts/${cart.id}`, storeHeaders)
          ).data.cart

          expect(cartRefetch.completed_at).toBeTruthy()

          const order = await api.post(
            `/store/carts/${cart.id}/complete`,
            {},
            storeHeaders
          )

          expect(order.status).toEqual(200)
          expect(order.data).toEqual({
            type: "order",
            order: expect.objectContaining({
              id: expect.any(String),
            }),
          })
        })

        it("should return cart when payment authorization fails", async () => {
          const paymentModuleService = appContainer.resolve(Modules.PAYMENT)
          const authorizePaymentSessionSpy = jest.spyOn(
            paymentModuleService,
            "authorizePaymentSession"
          )

          // Mock the authorizePaymentSession to throw error
          authorizePaymentSessionSpy.mockImplementation(
            (id, context, sharedContext) => {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Throw a random error`
              )
            }
          )

          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 1, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: cart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          const response = await api.post(
            `/store/carts/${cart.id}/complete`,
            {},
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            type: "cart",
            cart: expect.objectContaining({}),
            error: {
              message: "Payment authorization failed",
              name: "Error",
              type: "payment_authorization_error",
            },
          })
        })
      })
    })
  },
})
