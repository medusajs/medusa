import {
  LinkModuleUtils,
  ModuleRegistrationName,
  Modules,
  RemoteLink,
} from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IPricingModuleService,
  IProductModuleService,
  IPromotionModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { PromotionRuleOperator, PromotionType } from "@medusajs/utils"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store Carts API", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let regionModuleService: IRegionModuleService
      let scModuleService: ISalesChannelModuleService
      let customerModule: ICustomerModuleService
      let productModule: IProductModuleService
      let pricingModule: IPricingModuleService
      let remoteLink: RemoteLink
      let promotionModule: IPromotionModuleService

      let defaultRegion

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
        regionModuleService = appContainer.resolve(
          ModuleRegistrationName.REGION
        )
        scModuleService = appContainer.resolve(
          ModuleRegistrationName.SALES_CHANNEL
        )
        customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        remoteLink = appContainer.resolve(LinkModuleUtils.REMOTE_LINK)
        promotionModule = appContainer.resolve(ModuleRegistrationName.PROMOTION)
      })

      beforeEach(async () => {
        await adminSeeder(dbConnection)

        // Here, so we don't have to create a region for each test
        defaultRegion = await regionModuleService.create({
          name: "Default Region",
          currency_code: "dkk",
        })

        describe("POST /store/carts", () => {
          it("should create a cart", async () => {
            const region = await regionModuleService.create({
              name: "US",
              currency_code: "usd",
            })

            const salesChannel = await scModuleService.create({
              name: "Webshop",
            })

            const [product] = await productModule.create([
              {
                title: "Test product",
                variants: [
                  {
                    title: "Test variant",
                  },
                  {
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

          it("should create cart with customer from email", async () => {
            const created = await api.post(`/store/carts`, {
              currency_code: "usd",
              email: "tony@stark-industries.com",
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
              })
            )
          })

          it("should create cart with any region", async () => {
            await regionModuleService.create({
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
            const region = await regionModuleService.create({
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
                value: "300",
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
                value: "1000",
                apply_to_quantity: 1,
                target_rules: targetRules,
              },
            })

            const cart = await cartModuleService.create({
              currency_code: "usd",
              email: "tony@stark.com",
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

            const [adjustment] = await cartModuleService.addLineItemAdjustments(
              [
                {
                  code: appliedPromotion.code!,
                  amount: 300,
                  item_id: "item-1",
                  promotion_id: appliedPromotion.id,
                },
              ]
            )

            await remoteLink.create({
              [Modules.CART]: { cart_id: cart.id },
              [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
            })

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
                  }),
                ],
              })
            )
          })

          it("should update a cart's region, sales channel and customer data", async () => {
            const region = await regionModuleService.create({
              name: "US",
              currency_code: "usd",
            })

            const salesChannel = await scModuleService.create({
              name: "Webshop",
            })

            const cart = await cartModuleService.create({
              currency_code: "eur",
            })

            let updated = await api.post(`/store/carts/${cart.id}`, {
              region_id: region.id,
              email: "tony@stark.com",
              sales_channel_id: salesChannel.id,
            })

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
                region: expect.objectContaining({
                  id: region.id,
                  currency_code: "usd",
                }),
                sales_channel_id: null,
              })
            )
          })
        })

        describe("GET /store/carts/:id", () => {
          it("should create and update a cart", async () => {
            const region = await regionModuleService.create({
              name: "US",
              currency_code: "usd",
            })

            const salesChannel = await scModuleService.create({
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
            const region = await regionModuleService.create({
              name: "US",
              currency_code: "usd",
            })

            const salesChannel = await scModuleService.create({
              name: "Webshop",
            })

            const cart = await cartModuleService.create({
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
          it("should add item to cart", async () => {
            const [product] = await productModule.create([
              {
                title: "Test product",
                variants: [
                  {
                    title: "Test variant",
                  },
                ],
              },
            ])

            const cart = await cartModuleService.create({
              currency_code: "usd",
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
                value: "300",
                apply_to_quantity: 2,
                target_rules: [
                  {
                    attribute: "product_id",
                    operator: "in",
                    values: ["prod_mat", product.id],
                  },
                ],
              },
            })

            const [lineItemAdjustment] =
              await cartModuleService.addLineItemAdjustments([
                {
                  code: appliedPromotion.code!,
                  amount: 300,
                  item_id: "item-1",
                  promotion_id: appliedPromotion.id,
                },
              ])

            const priceSet = await pricingModule.create({
              prices: [
                {
                  amount: 3000,
                  currency_code: "usd",
                },
              ],
            })

            await remoteLink.create([
              {
                productService: {
                  variant_id: product.variants[0].id,
                },
                pricingService: {
                  price_set_id: priceSet.id,
                },
              },
            ])

            await remoteLink.create({
              [Modules.CART]: { cart_id: cart.id },
              [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
            })

            const response = await api.post(
              `/store/carts/${cart.id}/line-items`,
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              }
            )

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
          })
        })

        describe("POST /store/carts/:id/payment-collections", () => {
          it("should create a payment collection for the cart", async () => {
            const region = await regionModuleService.create({
              name: "US",
              currency_code: "usd",
            })

            const cart = await cartModuleService.create({
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
      })
    })
  },
})
