import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  Modules,
  ProductStatus,
  PromotionStatus,
  PromotionType,
} from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures/tax"
import { medusaTshirtProduct } from "../../../__fixtures__/product"
import {
  updateCampaignsWorkflow,
  updatePromotionRulesWorkflow,
  updatePromotionsWorkflow,
} from "@medusajs/core-flows"

jest.setTimeout(500000)

const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

const standardPromotionPayload = {
  code: "TEST",
  type: PromotionType.STANDARD,
  status: PromotionStatus.ACTIVE,
  is_automatic: true,
  campaign: {
    name: "test",
    campaign_identifier: "test-1",
    budget: {
      type: "usage",
      limit: 100,
    },
  },
  application_method: {
    target_type: "items",
    type: "fixed",
    allocation: "each",
    currency_code: "usd",
    value: 100,
    max_quantity: 100,
    target_rules: [
      {
        attribute: "test.test",
        operator: "eq",
        values: ["test1", "test2"],
      },
    ],
  },
  rules: [
    {
      attribute: "test.test",
      operator: "eq",
      values: ["test1", "test2"],
    },
  ],
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    beforeAll(async () => {
      appContainer = getContainer()
    })

    describe("Admin Promotions API", () => {
      let promotion
      let standardPromotion
      let shippingProfile

      const promotionRule = {
        operator: "eq",
        attribute: "old_attr",
        values: ["old value"],
      }

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await setupTaxStructure(appContainer.resolve(Modules.TAX))

        promotion = standardPromotion = (
          await api.post(
            `/admin/promotions`,
            {
              code: "TEST_ACROSS",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "fixed",
                allocation: "across",
                target_type: "items",
                value: 100,
                target_rules: [promotionRule],
                currency_code: "usd",
              },
              rules: [promotionRule],
            },
            adminHeaders
          )
        ).data.promotion

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile
      })

      describe("GET /admin/promotions/:id", () => {
        it("should throw an error if id does not exist", async () => {
          const { response } = await api
            .get(`/admin/promotions/does-not-exist`, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            "Promotion with id or code: does-not-exist was not found"
          )
        })

        it("should get the requested promotion by id or codde", async () => {
          let response = await api.get(
            `/admin/promotions/${promotion.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: promotion.id,
            })
          )

          response = await api.get(
            `/admin/promotions/${promotion.code}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: promotion.id,
            })
          )
        })

        it("should get the requested promotion with filtered fields and relations", async () => {
          const response = await api.get(
            `/admin/promotions/${promotion.id}?fields=id,code`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual({
            id: promotion.id,
            code: promotion.code,
          })
        })
      })

      describe("GET /admin/promotions", () => {
        it("should get all promotions and its count", async () => {
          const response = await api.get(`/admin/promotions`, adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.promotions).toEqual([
            expect.objectContaining({
              id: expect.any(String),
            }),
          ])
        })

        it("should support search of promotions", async () => {
          await api.post(
            `/admin/promotions`,
            {
              code: "first",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "fixed",
                target_type: "order",
                value: 100,
                currency_code: "usd",
              },
            },
            adminHeaders
          )

          const response = await api.get(
            `/admin/promotions?q=fir`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotions).toEqual([
            expect.objectContaining({
              code: "first",
            }),
          ])
        })

        it("should get all promotions and its count filtered", async () => {
          const response = await api.get(
            `/admin/promotions?fields=code,created_at,application_method.id`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.promotions).toEqual([
            {
              id: expect.any(String),
              code: "TEST_ACROSS",
              created_at: expect.any(String),
              application_method: {
                id: expect.any(String),
              },
            },
          ])
        })
      })

      describe("POST /admin/promotions", () => {
        it("should throw an error if required params are not passed", async () => {
          const { response } = await api
            .post(
              `/admin/promotions`,
              { type: PromotionType.STANDARD },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data.message).toEqual(
            "Invalid request: Field 'code' is required; Field 'application_method' is required"
          )
        })

        it("should throw error when an incorrect status is passed", async () => {
          const { response } = await api
            .post(
              `/admin/promotions`,
              { ...standardPromotionPayload, status: "does-not-exist" },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "Invalid request: Expected: 'draft, active, inactive' for field 'status', but got: 'does-not-exist'",
          })
        })

        it("should create a standard promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions`,
            standardPromotionPayload,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "TEST",
              type: "standard",
              is_automatic: true,
              campaign: expect.objectContaining({
                name: "test",
                campaign_identifier: "test-1",
                budget: expect.objectContaining({
                  currency_code: null,
                  type: "usage",
                  limit: 100,
                }),
              }),
              application_method: expect.objectContaining({
                value: 100,
                max_quantity: 100,
                type: "fixed",
                target_type: "items",
                allocation: "each",
                target_rules: [
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "test.test",
                    values: expect.arrayContaining([
                      expect.objectContaining({ value: "test1" }),
                      expect.objectContaining({ value: "test2" }),
                    ]),
                  }),
                ],
              }),
              rules: [
                expect.objectContaining({
                  operator: "eq",
                  attribute: "test.test",
                  values: expect.arrayContaining([
                    expect.objectContaining({ value: "test1" }),
                    expect.objectContaining({ value: "test2" }),
                  ]),
                }),
              ],
            })
          )
        })

        it("should throw an error if buy_rules params are not passed", async () => {
          const { response } = await api
            .post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.BUYGET,
                status: PromotionStatus.ACTIVE,
                is_automatic: true,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  value: 100,
                  max_quantity: 100,
                  currency_code: "usd",
                  target_rules: [
                    {
                      attribute: "test.test",
                      operator: "eq",
                      values: ["test1", "test2"],
                    },
                  ],
                },
                rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data.message).toEqual(
            "Invalid request: Buyget promotions require at least one buy rule and quantities to be defined"
          )
        })

        it("should throw an error if buy_rules params are not passed", async () => {
          const { response } = await api
            .post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.BUYGET,
                status: PromotionStatus.ACTIVE,
                is_automatic: true,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  value: 100,
                  max_quantity: 100,
                  currency_code: "usd",
                  buy_rules: [
                    {
                      attribute: "test.test",
                      operator: "eq",
                      values: ["test1", "test2"],
                    },
                  ],
                },
                rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          // expect(response.data.message).toEqual(
          //   "Target rules are required for buyget promotion type"
          // )
        })

        it("should create a buyget promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions`,
            {
              code: "TEST",
              type: PromotionType.BUYGET,
              status: PromotionStatus.ACTIVE,
              is_automatic: true,
              campaign: {
                name: "test",
                campaign_identifier: "test-1",
                budget: {
                  type: "usage",
                  limit: 100,
                },
              },
              application_method: {
                target_type: "items",
                type: "fixed",
                allocation: "each",
                value: 100,
                max_quantity: 100,
                apply_to_quantity: 1,
                buy_rules_min_quantity: 1,
                currency_code: "usd",
                target_rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
                buy_rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
              },
              rules: [
                {
                  attribute: "test.test",
                  operator: "eq",
                  values: ["test1", "test2"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "TEST",
              type: "buyget",
              is_automatic: true,
              campaign: expect.objectContaining({
                name: "test",
                campaign_identifier: "test-1",
                budget: expect.objectContaining({
                  type: "usage",
                  limit: 100,
                }),
              }),
              application_method: expect.objectContaining({
                value: 100,
                max_quantity: 100,
                type: "fixed",
                target_type: "items",
                allocation: "each",
                apply_to_quantity: 1,
                buy_rules_min_quantity: 1,
                target_rules: [
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "test.test",
                    values: expect.arrayContaining([
                      expect.objectContaining({ value: "test1" }),
                      expect.objectContaining({ value: "test2" }),
                    ]),
                  }),
                ],
                buy_rules: [
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "test.test",
                    values: expect.arrayContaining([
                      expect.objectContaining({ value: "test1" }),
                      expect.objectContaining({ value: "test2" }),
                    ]),
                  }),
                ],
              }),
              rules: [
                expect.objectContaining({
                  operator: "eq",
                  attribute: "test.test",
                  values: expect.arrayContaining([
                    expect.objectContaining({ value: "test1" }),
                    expect.objectContaining({ value: "test2" }),
                  ]),
                }),
              ],
            })
          )
        })

        describe("with cart", () => {
          it("should add promotion to cart only when gte rule matches", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                  shipping_profile_id: shippingProfile.id,
                },
                adminHeaders
              )
            ).data.product

            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            const response = await api.post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: true,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                rules: [
                  {
                    attribute: "subtotal",
                    operator: "gte",
                    values: "2000",
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.promotion).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                code: "TEST",
                type: "standard",
                is_automatic: true,
                application_method: expect.objectContaining({
                  value: 100,
                  max_quantity: 100,
                  type: "fixed",
                  target_type: "items",
                  allocation: "each",
                  target_rules: [],
                }),
                rules: [
                  expect.objectContaining({
                    operator: "gte",
                    attribute: "subtotal",
                    values: expect.arrayContaining([
                      expect.objectContaining({ value: "2000" }),
                    ]),
                  }),
                ],
              })
            )

            const cartWithPromotion1 = (
              await api.post(
                `/store/carts/${cart.id}`,
                { promo_codes: [promotion.code] },
                storeHeaders
              )
            ).data.cart

            expect(cartWithPromotion1).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [],
                  }),
                ],
                promotions: [],
              })
            )

            const cartWithPromotion2 = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                { variant_id: product.variants[0].id, quantity: 40 },
                storeHeaders
              )
            ).data.cart

            expect(cartWithPromotion2).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: response.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )
          })

          it("should add promotion and remove it from cart using delete", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                  shipping_profile_id: shippingProfile.id,
                },
                adminHeaders
              )
            ).data.product

            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                },
                storeHeaders
              )
            ).data.cart

            const response = await api.post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: false,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                rules: [
                  {
                    attribute: "subtotal",
                    operator: "gte",
                    values: "1",
                  },
                ],
              },
              adminHeaders
            )

            await Promise.all([
              api
                .post(
                  `/store/carts/${cart.id}`,
                  {
                    promo_codes: [response.data.promotion.code],
                  },
                  storeHeaders
                )
                .catch(() => {}),
              api
                .post(
                  `/store/carts/${cart.id}`,
                  {
                    promo_codes: [response.data.promotion.code],
                  },
                  storeHeaders
                )
                .catch(() => {}),
            ])

            const cartAfterPromotion = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartAfterPromotion).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            const cartWithPromotion2 = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                { variant_id: product.variants[0].id, quantity: 40 },
                storeHeaders
              )
            ).data.cart

            expect(cartWithPromotion2).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            await api.delete(`/store/carts/${cart.id}/promotions`, {
              data: {
                promo_codes: [response.data.promotion.code],
              },
              ...storeHeaders,
            })

            const cartWithoutPromotion = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartWithoutPromotion).toEqual(
              expect.objectContaining({
                promotions: [],
              })
            )
          })

          it("should limit usage of promotion per email attribute as defined in campaign budget", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                },
                adminHeaders
              )
            ).data.product

            const campaign = (
              await api.post(
                `/admin/campaigns`,
                {
                  name: "TEST",
                  budget: {
                    type: "use_by_attribute",
                    limit: 2,
                    attribute: "customer_email",
                  },
                  campaign_identifier: "PROMO_CAMPAIGN",
                },
                adminHeaders
              )
            ).data.campaign

            const response = await api.post(
              `/admin/promotions`,
              {
                code: "TEST_PROMO",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: false,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                campaign_id: campaign.id,
              },
              adminHeaders
            )

            let cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  email: "canusethistwice@test.com",
                  promo_codes: [response.data.promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            expect(cart).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            let promotionCampaign = (
              await api.get(
                `/admin/campaigns/${campaign.id}?fields=budget.*,budget.usages.*`,
                adminHeaders
              )
            ).data.campaign

            expect(promotionCampaign).toEqual(
              expect.objectContaining({
                budget: expect.objectContaining({
                  used: 0,
                  limit: 2,
                  attribute: "customer_email",
                  type: "use_by_attribute",
                  usages: [],
                }),
              })
            )

            let paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  email: "canusethistwice@test.com",
                  promo_codes: [response.data.promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            expect(cart).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            promotionCampaign = (
              await api.get(
                `/admin/campaigns/${campaign.id}?fields=budget.*,budget.usages.*`,
                adminHeaders
              )
            ).data.campaign

            expect(promotionCampaign).toEqual(
              expect.objectContaining({
                budget: expect.objectContaining({
                  used: 1,
                  limit: 2,
                  attribute: "customer_email",
                  type: "use_by_attribute",
                  usages: [
                    // usage recorder after first complete
                    expect.objectContaining({
                      attribute_value: "canusethistwice@test.com",
                      used: 1,
                    }),
                  ],
                }),
              })
            )

            paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            // complete for the second time
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)

            promotionCampaign = (
              await api.get(
                `/admin/campaigns/${campaign.id}?fields=budget.*,budget.usages.*`,
                adminHeaders
              )
            ).data.campaign

            expect(promotionCampaign).toEqual(
              expect.objectContaining({
                budget: expect.objectContaining({
                  used: 2,
                  limit: 2,
                  attribute: "customer_email",
                  type: "use_by_attribute",
                  usages: [
                    expect.objectContaining({
                      attribute_value: "canusethistwice@test.com",
                      used: 2,
                    }),
                  ],
                }),
              })
            )

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  email: "canusethistwice@test.com",
                },
                storeHeaders
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}`,
                {
                  promo_codes: [response.data.promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            expect(cart.promotions.length).toEqual(0) // prmotion is not applied

            cart = (
              await api.post(
                `/store/carts/${cart.id}`,
                {
                  email: "canuseit@test.com",
                  promo_codes: [response.data.promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            // promotion is successfully applied with different email
            expect(cart.promotions.length).toEqual(1)
            expect(cart.promotions[0].code).toEqual(
              response.data.promotion.code
            )
          })

          it("should remove promotion after email is replaced by already used email for that promotion", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                },
                adminHeaders
              )
            ).data.product

            const campaign = (
              await api.post(
                `/admin/campaigns`,
                {
                  name: "TEST",
                  budget: {
                    type: "use_by_attribute",
                    limit: 1,
                    attribute: "customer_email",
                  },
                  campaign_identifier: "PROMO_CAMPAIGN",
                },
                adminHeaders
              )
            ).data.campaign

            const response = await api.post(
              `/admin/promotions`,
              {
                code: "TEST_PROMO",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: false,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                campaign_id: campaign.id,
              },
              adminHeaders
            )

            let cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  email: "canuseitonce@test.com",
                  promo_codes: [response.data.promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            expect(cart).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            let promotionCampaign = (
              await api.get(
                `/admin/campaigns/${campaign.id}?fields=budget.*,budget.usages.*`,
                adminHeaders
              )
            ).data.campaign

            expect(promotionCampaign).toEqual(
              expect.objectContaining({
                budget: expect.objectContaining({
                  used: 0,
                  limit: 1,
                  attribute: "customer_email",
                  type: "use_by_attribute",
                  usages: [],
                }),
              })
            )

            let paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [response.data.promotion.code],
                  email: "fakeemail@test.com",
                },
                storeHeaders
              )
            ).data.cart

            expect(cart).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            cart = (
              await api.post(
                `/store/carts/${cart.id}`,
                {
                  email: "canuseitonce@test.com",
                },
                storeHeaders
              )
            ).data.cart

            expect(cart.promotions.length).toEqual(0) // prmotion is removed
          })

          it("should throw if email is not provided when campaign budget type is use_by_attribute", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                },
                adminHeaders
              )
            ).data.product

            const campaign = (
              await api.post(
                `/admin/campaigns`,
                {
                  name: "TEST",
                  budget: {
                    type: "use_by_attribute",
                    limit: 1,
                    attribute: "customer_email",
                  },
                  campaign_identifier: "PROMO_CAMPAIGN",
                },
                adminHeaders
              )
            ).data.campaign

            const response = await api.post(
              `/admin/promotions`,
              {
                code: "TEST_PROMO",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: false,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                campaign_id: campaign.id,
              },
              adminHeaders
            )

            let cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                },
                storeHeaders
              )
            ).data.cart

            const err = await api
              .post(
                `/store/carts/${cart.id}`,
                {
                  promo_codes: [response.data.promotion.code],
                },
                storeHeaders
              )
              .catch((e) => e)

            expect(err.response.status).toEqual(400)
            expect(err.response.data).toEqual({
              type: "invalid_data",
              message: `Attribute value for "customer_email" is required by promotion campaing budget`,
            })
          })

          it("should add promotion and remove it from cart using update", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                  shipping_profile_id: shippingProfile.id,
                },
                adminHeaders
              )
            ).data.product

            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                },
                storeHeaders
              )
            ).data.cart

            const response = await api.post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: false,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                rules: [
                  {
                    attribute: "subtotal",
                    operator: "gte",
                    values: "1",
                  },
                ],
              },
              adminHeaders
            )

            await api.post(
              `/store/carts/${cart.id}`,
              {
                promo_codes: [response.data.promotion.code],
              },
              storeHeaders
            )

            const cartAfterPromotion = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartAfterPromotion).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: response.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            const cartWithPromotion2 = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                { variant_id: product.variants[0].id, quantity: 40 },
                storeHeaders
              )
            ).data.cart

            expect(cartWithPromotion2).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: response.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )

            await api.post(
              `/store/carts/${cart.id}`,
              {
                promo_codes: [],
              },
              storeHeaders
            )

            const cartWithoutPromotion = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartWithoutPromotion).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [],
                  }),
                ],
                promotions: [],
              })
            )
          })

          it("should add an automatic promotion and after cart update, should delete the adjustment and create a new one for the automatic promotion", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                  shipping_profile_id: shippingProfile.id,
                },
                adminHeaders
              )
            ).data.product

            const customer = (
              await api.post(
                "/admin/customers",
                { email: "test@test.com" },
                adminHeaders
              )
            ).data.customer

            const response = await api.post(
              `/admin/promotions`,
              {
                code: "AUTO_TEST",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: true,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                rules: [
                  {
                    attribute: "customer_id",
                    operator: "eq",
                    values: customer.id,
                  },
                ],
              },
              adminHeaders
            )

            // Should apply automatic promotion
            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  email: customer.email,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                },
                storeHeaders
              )
            ).data.cart

            const shippingAddressData = {
              address_1: "test address 1",
              address_2: "test address 2",
              city: "SF",
              country_code: "us",
              province: "CA",
              postal_code: "94016",
            }

            // Should not duplicate an already applied automatic promotion
            await api.post(
              `/store/carts/${cart.id}`,
              {
                shipping_address: shippingAddressData,
              },
              storeHeaders
            )

            const cartAfterPromotion = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            const itemWithPromotion = cartAfterPromotion.items[0]
            const adjustments = itemWithPromotion.adjustments

            expect(adjustments.length).toEqual(1)

            expect(cartAfterPromotion).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: response.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: response.data.promotion.code,
                  }),
                ],
              })
            )
          })

          it.skip("should add two promotions and remove one from cart using delete", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                  shipping_profile_id: shippingProfile.id,
                },
                adminHeaders
              )
            ).data.product

            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                },
                storeHeaders
              )
            ).data.cart

            const promo1 = await api.post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: false,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                rules: [
                  {
                    attribute: "subtotal",
                    operator: "gte",
                    values: "1",
                  },
                ],
              },
              adminHeaders
            )
            const promo2 = await api.post(
              `/admin/promotions`,
              {
                code: "TEST2",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: false,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  currency_code: "usd",
                  value: 100,
                  max_quantity: 100,
                },
                rules: [
                  {
                    attribute: "subtotal",
                    operator: "gte",
                    values: "2000",
                  },
                ],
              },
              adminHeaders
            )
            const cartWithPromotion2 = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                { variant_id: product.variants[0].id, quantity: 40 },
                storeHeaders
              )
            ).data.cart

            expect(cartWithPromotion2).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: promo1.data.promotion.code,
                      }),
                      expect.objectContaining({
                        code: promo2.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: promo1.data.promotion.code,
                  }),
                  expect.objectContaining({
                    code: promo2.data.promotion.code,
                  }),
                ],
              })
            )

            await api.delete(`/store/carts/${cart.id}/promotions`, {
              data: {
                promo_codes: [promo1.data.promotion.code],
              },
              ...storeHeaders,
            })

            const cartWithoutPromotion1 = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartWithoutPromotion1).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: promo2.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: promo2.data.promotion.code,
                  }),
                ],
              })
            )
          })

          it.skip("should add two promotions and remove one from cart using update", async () => {
            const publishableKey = await generatePublishableKey(appContainer)
            const storeHeaders = generateStoreHeaders({ publishableKey })

            const salesChannel = (
              await api.post(
                "/admin/sales-channels",
                { name: "Webshop", description: "channel" },
                adminHeaders
              )
            ).data.sales_channel

            const region = (
              await api.post(
                "/admin/regions",
                { name: "US", currency_code: "usd", countries: ["us"] },
                adminHeaders
              )
            ).data.region

            const product = (
              await api.post(
                "/admin/products",
                {
                  ...medusaTshirtProduct,
                  shipping_profile_id: shippingProfile.id,
                },
                adminHeaders
              )
            ).data.product

            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                },
                storeHeaders
              )
            ).data.cart

            const [promo1, promo2, promoAutomatic] = await Promise.all([
              api.post(
                `/admin/promotions`,
                {
                  code: "TEST",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_automatic: false,
                  application_method: {
                    target_type: "items",
                    type: "fixed",
                    allocation: "each",
                    currency_code: "usd",
                    value: 50,
                    max_quantity: 100,
                  },
                  rules: [
                    {
                      attribute: "subtotal",
                      operator: "gte",
                      values: "1",
                    },
                  ],
                },
                adminHeaders
              ),
              api.post(
                `/admin/promotions`,
                {
                  code: "TEST_CODE_123",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_automatic: false,
                  application_method: {
                    target_type: "items",
                    type: "fixed",
                    allocation: "each",
                    currency_code: "usd",
                    value: 10,
                    max_quantity: 100,
                  },
                  rules: [
                    {
                      attribute: "subtotal",
                      operator: "gte",
                      values: "2000",
                    },
                  ],
                },
                adminHeaders
              ),
              api.post(
                `/admin/promotions`,
                {
                  code: "AUTOMATIC_PROMO",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_automatic: true,
                  application_method: {
                    target_type: "items",
                    type: "fixed",
                    allocation: "each",
                    currency_code: "usd",
                    value: 5,
                    max_quantity: 100,
                  },
                  rules: [
                    {
                      attribute: "subtotal",
                      operator: "gte",
                      values: "500",
                    },
                  ],
                },
                adminHeaders
              ),
            ])

            // apply promotions
            await api.post(
              `/store/carts/${cart.id}`,
              {
                promo_codes: [
                  promo1.data.promotion.code,
                  promo2.data.promotion.code,
                ],
              },
              storeHeaders
            )

            const cartWithPromotion2 = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 40,
                },
                storeHeaders
              )
            ).data.cart

            expect(cartWithPromotion2).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: promo1.data.promotion.code,
                      }),
                      expect.objectContaining({
                        code: promo2.data.promotion.code,
                      }),
                      expect.objectContaining({
                        code: promoAutomatic.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: promo1.data.promotion.code,
                  }),
                  expect.objectContaining({
                    code: promo2.data.promotion.code,
                  }),
                  expect.objectContaining({
                    code: promoAutomatic.data.promotion.code,
                  }),
                ],
              })
            )

            await api.post(
              `/store/carts/${cart.id}`,
              {
                promo_codes: [promo2.data.promotion.code],
              },
              storeHeaders
            )

            const cartWithoutPromotion1 = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartWithoutPromotion1).toEqual(
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    adjustments: [
                      expect.objectContaining({
                        code: promo2.data.promotion.code,
                      }),
                      expect.objectContaining({
                        code: promoAutomatic.data.promotion.code,
                      }),
                    ],
                  }),
                ],
                promotions: [
                  expect.objectContaining({
                    code: promo2.data.promotion.code,
                  }),
                  expect.objectContaining({
                    code: promoAutomatic.data.promotion.code,
                  }),
                ],
              })
            )
          })
        })

        it("should add tax inclusive promotion to cart successfully in a tax inclusive currency", async () => {
          const publishableKey = await generatePublishableKey(appContainer)
          const storeHeaders = generateStoreHeaders({ publishableKey })

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "Webshop", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          await api.post(
            "/admin/price-preferences",
            {
              attribute: "currency_code",
              value: "dkk",
              is_tax_inclusive: true,
            },
            adminHeaders
          )

          const region = (
            await api.post(
              "/admin/regions",
              {
                name: "DK",
                currency_code: "dkk",
                countries: ["dk"],
              },
              adminHeaders
            )
          ).data.region

          const product = (
            await api.post("/admin/products", medusaTshirtProduct, adminHeaders)
          ).data.product

          const response = await api.post(
            `/admin/promotions`,
            {
              code: "FIXED_10",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: true,
              is_automatic: true,
              application_method: {
                target_type: "items",
                type: "fixed",
                allocation: "across",
                currency_code: "dkk",
                value: 100,
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "FIXED_10",
              type: "standard",
              is_tax_inclusive: true,
              is_automatic: true,
              application_method: expect.objectContaining({
                value: 100,
                type: "fixed",
                target_type: "items",
                allocation: "across",
              }),
            })
          )

          const cart = (
            await api.post(
              `/store/carts?fields=*items,*items.adjustments`,
              {
                currency_code: "dkk",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                  },
                ],
                promo_codes: [response.data.promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          /**
           * Orignal total -> 1300 dkk (tax incl.)
           * Tax rate -> 25%
           * Promotion -> FIXED 100 dkk (tax incl.)
           *
           * We want total to be 1300 dkk - 100 dkk = 1200 dkk
           */
          expect(cart).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              subtotal: 1040, // taxable base (item subtotal - discount subtotal) = 1040 - 80 = 960
              total: 1200, // total = taxable base * (1 + tax rate) = 960 * (1 + 0.25) = 1200
              tax_total: 240,

              original_total: 1300,
              original_tax_total: 260,

              discount_total: 100,
              discount_subtotal: 80,
              discount_tax_total: 20,

              item_total: 1200,
              item_subtotal: 1040,
              item_tax_total: 240,

              original_item_total: 1300,
              original_item_subtotal: 1040,
              original_item_tax_total: 260,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1300,

                  subtotal: 1040,
                  tax_total: 240,
                  total: 1200,

                  original_total: 1300,
                  original_tax_total: 260,

                  discount_total: 100,
                  discount_subtotal: 80,
                  discount_tax_total: 20,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                      is_tax_inclusive: true,
                      provider_id: null,
                      code: "FIXED_10",
                    }),
                  ]),
                }),
              ]),
            })
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          const order = (
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          ).data.order

          /**
           * Orignal total -> 1300 dkk (tax incl.)
           * Tax rate -> 25%
           * Promotion -> FIXED 100 dkk (tax incl.)
           *
           * We want total to be 1300 dkk - 100 dkk = 1200 dkk
           */
          expect(order).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              subtotal: 1040, // taxable base (item subtotal - discount subtotal) = 1040 - 80 = 960
              total: 1200, // total = taxable base * (1 + tax rate) = 960 * (1 + 0.25) = 1200
              tax_total: 240,

              original_total: 1300,
              original_tax_total: 260,

              discount_total: 100,
              discount_subtotal: 80,
              discount_tax_total: 20,

              item_total: 1200,
              item_subtotal: 1040,
              item_tax_total: 240,

              original_item_total: 1300,
              original_item_subtotal: 1040,
              original_item_tax_total: 260,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1300,

                  subtotal: 1040,
                  tax_total: 240,
                  total: 1200,

                  original_total: 1300,
                  original_tax_total: 260,

                  discount_total: 100,
                  discount_subtotal: 80,
                  discount_tax_total: 20,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                      is_tax_inclusive: true,
                      provider_id: null,
                      code: "FIXED_10",
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should add tax inclusive promotion to cart successfully in a tax inclusive currency with 2 items and each allocation", async () => {
          const publishableKey = await generatePublishableKey(appContainer)
          const storeHeaders = generateStoreHeaders({ publishableKey })

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "Webshop", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          await api.post(
            "/admin/price-preferences",
            {
              attribute: "currency_code",
              value: "dkk",
              is_tax_inclusive: true,
            },
            adminHeaders
          )

          const region = (
            await api.post(
              "/admin/regions",
              {
                name: "DK",
                currency_code: "dkk",
                countries: ["dk"],
              },
              adminHeaders
            )
          ).data.region

          const product = (
            await api.post(
              "/admin/products",
              {
                title: "Discounted Medusa T-Shirt",
                status: ProductStatus.PUBLISHED,
                handle: "discounted-medusa-t-shirt",
                options: [
                  {
                    title: "Size",
                    values: ["S", "M"],
                  },
                ],
                variants: [
                  {
                    title: "S",
                    sku: "SHIRT-S",
                    options: {
                      Size: "S",
                    },
                    manage_inventory: false,
                    prices: [
                      {
                        amount: 1000,
                        currency_code: "dkk",
                      },
                    ],
                  },
                  {
                    title: "M",
                    sku: "SHIRT-M",
                    options: {
                      Size: "S",
                    },
                    manage_inventory: false,
                    prices: [
                      {
                        amount: 500,
                        currency_code: "dkk",
                      },
                    ],
                  },
                ],
              },
              adminHeaders
            )
          ).data.product

          const response = await api.post(
            `/admin/promotions`,
            {
              code: "FIXED_10",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: true,
              is_automatic: true,
              application_method: {
                target_type: "items",
                type: "fixed",
                allocation: "each",
                currency_code: "dkk",
                value: 100,
                max_quantity: 2,
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "FIXED_10",
              type: "standard",
              is_tax_inclusive: true,
              is_automatic: true,
              application_method: expect.objectContaining({
                value: 100,
                type: "fixed",
                target_type: "items",
                allocation: "each",
                max_quantity: 2,
              }),
            })
          )

          const cart = (
            await api.post(
              `/store/carts?fields=*items,*items.adjustments`,
              {
                currency_code: "dkk",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                  },
                  {
                    variant_id: product.variants[1].id,
                    quantity: 1,
                  },
                ],
                promo_codes: [response.data.promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          /**
           * Orignal total -> 1500 dkk (tax incl.)
           * Promotion -> FIXED 100 dkk per item (tax incl.)
           * Tax rate -> 25%
           *
           * We want total to be 1500 dkk - 100 dkk - 100 dkk = 1300 dkk
           */
          expect(cart).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              total: 1300,
              subtotal: 1200, // taxable base (item subtotal - discount subtotal) = 1200 - 200 = 1000
              tax_total: 260,

              discount_total: 200, // 2 * 100 dkk fixed tax inclusive
              discount_subtotal: 160,
              discount_tax_total: 40,

              original_total: 1500,
              original_tax_total: 300,

              item_total: 1300,
              item_subtotal: 1200,
              item_tax_total: 260,

              original_item_total: 1500,
              original_item_subtotal: 1200,
              original_item_tax_total: 300,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 500,

                  subtotal: 400,
                  total: 400, // 400 - 80 = 320 -> 320 * 1.25 = 400
                  tax_total: 80,

                  original_total: 500,
                  original_tax_total: 100,

                  discount_total: 100,
                  discount_subtotal: 80,
                  discount_tax_total: 20,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                      is_tax_inclusive: true,
                    }),
                  ]),
                }),
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1000,

                  subtotal: 800, // 800 - 80 = 720 -> 720 * 1.25 = 900
                  total: 900,
                  tax_total: 180,

                  original_total: 1000,
                  original_tax_total: 200,

                  discount_total: 100,
                  discount_subtotal: 80,
                  discount_tax_total: 20,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                      is_tax_inclusive: true,
                    }),
                  ]),
                }),
              ]),
            })
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          const order = (
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          ).data.order

          /**
           * Orignal total -> 1500 dkk (tax incl.)
           * Promotion -> FIXED 100 dkk per item (tax incl.)
           * Tax rate -> 25%
           *
           * We want total to be 1500 dkk - 100 dkk - 100 dkk = 1300 dkk
           */
          expect(order).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              total: 1300,
              subtotal: 1200, // taxable base (item subtotal - discount subtotal) = 1200 - 200 = 1000
              tax_total: 260,

              discount_total: 200, // 2 * 100 dkk fixed tax inclusive
              discount_subtotal: 160,
              discount_tax_total: 40,

              original_total: 1500,
              original_tax_total: 300,

              item_total: 1300,
              item_subtotal: 1200,
              item_tax_total: 260,

              original_item_total: 1500,
              original_item_subtotal: 1200,
              original_item_tax_total: 300,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 500,

                  subtotal: 400,
                  total: 400, // 400 - 80 = 320 -> 320 * 1.25 = 400
                  tax_total: 80,

                  original_total: 500,
                  original_tax_total: 100,

                  discount_total: 100,
                  discount_subtotal: 80,
                  discount_tax_total: 20,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                      is_tax_inclusive: true,
                    }),
                  ]),
                }),
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1000,

                  subtotal: 800, // 800 - 80 = 720 -> 720 * 1.25 = 900
                  total: 900,
                  tax_total: 180,

                  original_total: 1000,
                  original_tax_total: 200,

                  discount_total: 100,
                  discount_subtotal: 80,
                  discount_tax_total: 20,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                      is_tax_inclusive: true,
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should add tax exclusive promotion to cart successfully for tax inclusive currency", async () => {
          const publishableKey = await generatePublishableKey(appContainer)
          const storeHeaders = generateStoreHeaders({ publishableKey })

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "Webshop", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          await api.post(
            "/admin/price-preferences",
            {
              attribute: "currency_code",
              value: "dkk",
              is_tax_inclusive: true,
            },
            adminHeaders
          )

          const region = (
            await api.post(
              "/admin/regions",
              {
                name: "DK",
                currency_code: "dkk",
                countries: ["dk"],
              },
              adminHeaders
            )
          ).data.region

          const product = (
            await api.post("/admin/products", medusaTshirtProduct, adminHeaders)
          ).data.product

          const response = await api.post(
            `/admin/promotions`,
            {
              code: "FIXED_10",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              is_automatic: true,
              application_method: {
                target_type: "items",
                type: "fixed",
                allocation: "across",
                currency_code: "dkk",
                value: 100,
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "FIXED_10",
              type: "standard",
              is_tax_inclusive: false, // tax exclusive by default
              is_automatic: true,
              application_method: expect.objectContaining({
                value: 100,
                type: "fixed",
                target_type: "items",
                allocation: "across",
              }),
            })
          )

          const cart = (
            await api.post(
              `/store/carts?fields=*items,*items.adjustments`,
              {
                currency_code: "dkk",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                  },
                ],
                promo_codes: [response.data.promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          /**
           * Orignal total -> 1300 dkk (tax incl.)
           * Tax rate -> 25%
           * Promotion -> FIXED 100 dkk (tax exclusive !)
           */
          expect(cart).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              subtotal: 1040, // taxable base (item subtotal - discount subtotal) = 1040 - 100 = 940
              total: 1175, // total = taxable base * (1 + tax rate) = 940 * (1 + 0.25) = 1175
              tax_total: 235,

              original_total: 1300,
              original_tax_total: 260,

              discount_total: 125,
              discount_subtotal: 100,
              discount_tax_total: 25,

              item_total: 1175,
              item_subtotal: 1040,
              item_tax_total: 235,

              original_item_total: 1300,
              original_item_subtotal: 1040,
              original_item_tax_total: 260,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1300,

                  subtotal: 1040,
                  tax_total: 235,
                  total: 1175,

                  original_total: 1300,
                  original_tax_total: 260,

                  discount_total: 125,
                  discount_subtotal: 100,
                  discount_tax_total: 25,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          const order = (
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          ).data.order

          /**
           * Orignal total -> 1300 dkk (tax incl.)
           * Tax rate -> 25%
           * Promotion -> FIXED 100 dkk (tax exclusive !)
           */
          expect(order).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              subtotal: 1040, // taxable base (item subtotal - discount subtotal) = 1040 - 100 = 940
              total: 1175, // total = taxable base * (1 + tax rate) = 940 * (1 + 0.25) = 1175
              tax_total: 235,

              original_total: 1300,
              original_tax_total: 260,

              discount_total: 125,
              discount_subtotal: 100,
              discount_tax_total: 25,

              item_total: 1175,
              item_subtotal: 1040,
              item_tax_total: 235,

              original_item_total: 1300,
              original_item_subtotal: 1040,
              original_item_tax_total: 260,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1300,

                  subtotal: 1040,
                  tax_total: 235,
                  total: 1175,

                  original_total: 1300,
                  original_tax_total: 260,

                  discount_total: 125,
                  discount_subtotal: 100,
                  discount_tax_total: 25,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should add tax exclusive promotion to cart successfully for tax exclusive currency", async () => {
          const publishableKey = await generatePublishableKey(appContainer)
          const storeHeaders = generateStoreHeaders({ publishableKey })

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "Webshop", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          await api.post(
            "/admin/price-preferences",
            {
              attribute: "currency_code",
              value: "dkk",
              is_tax_inclusive: false,
            },
            adminHeaders
          )

          const region = (
            await api.post(
              "/admin/regions",
              {
                name: "DK",
                currency_code: "dkk",
                countries: ["dk"],
              },
              adminHeaders
            )
          ).data.region

          const product = (
            await api.post("/admin/products", medusaTshirtProduct, adminHeaders)
          ).data.product

          const response = await api.post(
            `/admin/promotions`,
            {
              code: "FIXED_10",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              is_automatic: true,
              application_method: {
                target_type: "items",
                type: "fixed",
                allocation: "across",
                currency_code: "dkk",
                value: 100,
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "FIXED_10",
              type: "standard",
              is_tax_inclusive: false, // tax exclusive by default
              is_automatic: true,
              application_method: expect.objectContaining({
                value: 100,
                type: "fixed",
                target_type: "items",
                allocation: "across",
              }),
            })
          )

          const cart = (
            await api.post(
              `/store/carts?fields=*items,*items.adjustments`,
              {
                currency_code: "dkk",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                  },
                ],
                promo_codes: [response.data.promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          /**
           * Orignal total -> 1300 dkk (tax excl.)
           * Tax rate -> 25%
           * Promotion -> FIXED 100 dkk (tax exclusive !)
           */
          expect(cart).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              subtotal: 1300, // taxable base (item subtotal - discount subtotal) = 1300 - 100 = 1200
              total: 1500, // total = taxable base * (1 + tax rate) = 1200 * (1 + 0.25) = 1500
              tax_total: 300,

              original_total: 1625,
              original_tax_total: 325,

              discount_total: 125,
              discount_subtotal: 100,
              discount_tax_total: 25,

              item_total: 1500,
              item_subtotal: 1300,
              item_tax_total: 300,

              original_item_total: 1625,
              original_item_subtotal: 1300,
              original_item_tax_total: 325,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1300,

                  subtotal: 1300,
                  total: 1500,
                  tax_total: 300,

                  discount_total: 125,
                  discount_subtotal: 100,
                  discount_tax_total: 25,

                  original_total: 1625,
                  original_tax_total: 325,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          const order = (
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          ).data.order

          /**
           * Orignal total -> 1300 dkk (tax excl.)
           * Tax rate -> 25%
           * Promotion -> FIXED 100 dkk (tax exclusive !)
           */
          expect(order).toEqual(
            expect.objectContaining({
              currency_code: "dkk",

              subtotal: 1300, // taxable base (item subtotal - discount subtotal) = 1300 - 100 = 1200
              total: 1500, // total = taxable base * (1 + tax rate) = 1200 * (1 + 0.25) = 1500
              tax_total: 300,

              original_total: 1625,
              original_tax_total: 325,

              discount_total: 125,
              discount_subtotal: 100,
              discount_tax_total: 25,

              item_total: 1500,
              item_subtotal: 1300,
              item_tax_total: 300,

              original_item_total: 1625,
              original_item_subtotal: 1300,
              original_item_tax_total: 325,

              shipping_total: 0,
              shipping_subtotal: 0,
              shipping_tax_total: 0,

              original_shipping_tax_total: 0,
              original_shipping_subtotal: 0,
              original_shipping_total: 0,

              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 1300,

                  subtotal: 1300,
                  total: 1500,
                  tax_total: 300,

                  discount_total: 125,
                  discount_subtotal: 100,
                  discount_tax_total: 25,

                  original_total: 1625,
                  original_tax_total: 325,

                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )
        })
      })

      describe("DELETE /admin/promotions/:id", () => {
        it("should delete promotion successfully", async () => {
          const deleteRes = await api.delete(
            `/admin/promotions/${promotion.id}`,
            adminHeaders
          )

          expect(deleteRes.status).toEqual(200)

          const { response } = await api
            .get(`/admin/promotions/${promotion.id}`, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            `Promotion with id or code: ${promotion.id} was not found`
          )
        })
      })

      describe("POST /admin/promotions/:id", () => {
        it("should throw an error if id does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist`,
              { type: PromotionType.STANDARD },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            `Promotion id not found: does-not-exist`
          )
        })

        it("should update a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${promotion.id}`,
            {
              code: "TEST_TWO",
              application_method: { value: 200 },
              is_tax_inclusive: true,
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "TEST_TWO",
              application_method: expect.objectContaining({
                value: 200,
              }),
              is_tax_inclusive: true,
            })
          )
        })

        it("should update a buyget promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${promotion.id}`,
            {
              code: "TEST_TWO",
              application_method: {
                value: 200,
                buy_rules_min_quantity: 6,
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: promotion.id,
              code: "TEST_TWO",
              application_method: expect.objectContaining({
                value: 200,
                buy_rules_min_quantity: 6,
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch`,
              {
                create: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          // expect(response.data).toEqual({
          //   type: "invalid_data",
          //   message:
          //     "attribute must be a string, attribute should not be empty",
          // })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch`,
              {
                create: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should add rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch`,
            {
              create: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              rules: expect.arrayContaining([
                expect.objectContaining({
                  operator: "eq",
                  attribute: "old_attr",
                  values: [expect.objectContaining({ value: "old value" })],
                }),
                expect.objectContaining({
                  operator: "eq",
                  attribute: "new_attr",
                  values: [expect.objectContaining({ value: "new value" })],
                }),
              ]),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/target-rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/target-rules/batch`,
              {
                create: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          // expect(response.data).toEqual({
          //   type: "invalid_data",
          //   message:
          //     "attribute must be a string, attribute should not be empty",
          // })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch`,
              {
                create: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should add target rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/target-rules/batch`,
            {
              create: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              application_method: expect.objectContaining({
                target_rules: expect.arrayContaining([
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "old_attr",
                    values: [expect.objectContaining({ value: "old value" })],
                  }),
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "new_attr",
                    values: [expect.objectContaining({ value: "new value" })],
                  }),
                ]),
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/buy-rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch`,
              {
                create: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          // expect(response.data).toEqual({
          //   type: "invalid_data",
          //   message:
          //     "attribute must be a string, attribute should not be empty",
          // })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch`,
              {
                create: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should throw an error when trying to add buy rules to a standard promotion", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch`,
              {
                create: [
                  {
                    operator: "eq",
                    attribute: "new_attr",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Can't add buy rules to a standard promotion",
          })
        })

        it("should add buy rules to a buyget promotion successfully", async () => {
          const buyGetPromotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "TEST_BUYGET",
                type: PromotionType.BUYGET,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "each",
                  max_quantity: 1,
                  value: 100,
                  apply_to_quantity: 1,
                  buy_rules_min_quantity: 1,
                  buy_rules: [promotionRule],
                  target_rules: [promotionRule],
                  currency_code: "usd",
                },
                rules: [promotionRule],
              },
              adminHeaders
            )
          ).data.promotion

          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch`,
            {
              create: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          const promotion = (
            await api.get(
              `/admin/promotions/${buyGetPromotion.id}`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
            expect.objectContaining({
              id: buyGetPromotion.id,
              application_method: expect.objectContaining({
                buy_rules: expect.arrayContaining([
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "old_attr",
                    values: [expect.objectContaining({ value: "old value" })],
                  }),
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "new_attr",
                    values: [expect.objectContaining({ value: "new value" })],
                  }),
                ]),
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch`,
              { delete: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove rules from a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch`,
            { delete: [standardPromotion.rules[0].id] },
            adminHeaders
          )
          expect(response.status).toEqual(200)
          expect(response.data.deleted).toEqual({
            ids: [standardPromotion.rules[0].id],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion.rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/target-rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch`,
              { delete: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove target rules from a promotion successfully", async () => {
          const ruleId = standardPromotion.application_method.target_rules[0].id
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/target-rules/batch`,
            { delete: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.deleted).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*application_method.target_rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion.application_method!.target_rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/buy-rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch`,
              { delete: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove buy rules from a promotion successfully", async () => {
          const buyGetPromotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "TEST_BUYGET",
                type: PromotionType.BUYGET,
                application_method: {
                  type: "fixed",
                  currency_code: "usd",
                  target_type: "items",
                  allocation: "each",
                  max_quantity: 1,
                  value: 100,
                  apply_to_quantity: 1,
                  buy_rules_min_quantity: 1,
                  buy_rules: [promotionRule],
                  target_rules: [promotionRule],
                },
                rules: [promotionRule],
              },
              adminHeaders
            )
          ).data.promotion

          const ruleId = buyGetPromotion!.application_method!.buy_rules![0].id
          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch`,
            { delete: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.deleted).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = (
            await api.get(
              `/admin/promotions/${buyGetPromotion.id}?fields=*application_method.buy_rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion.application_method!.buy_rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch`,
              {
                update: [
                  {
                    id: standardPromotion.rules[0].id,
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should throw error when promotion rule id does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch`,
              {
                update: [
                  {
                    id: "does-not-exist",
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Promotion rules with id - does-not-exist not found",
          })
        })

        it("should add rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch`,
            {
              update: [
                {
                  id: standardPromotion.rules[0].id,
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              rules: expect.arrayContaining([
                expect.objectContaining({
                  operator: "eq",
                  attribute: "new_attr",
                  values: [expect.objectContaining({ value: "new value" })],
                }),
              ]),
            })
          )
        })
      })

      describe("GET /admin/promotions/rule-attribute-options/:ruleType", () => {
        it("should throw error when ruleType is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-attribute-options/does-not-exist`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid param rule_type (does-not-exist)",
          })
        })

        it("return all rule attributes for a valid ruleType", async () => {
          const response = await api.get(
            `/admin/promotions/rule-attribute-options/rules`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.attributes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "currency_code",
                value: "currency_code",
                label: "Currency Code",
                field_type: "select",
                required: false,
                disguised: true,
                hydrate: true,
              }),
              expect.objectContaining({
                id: "customer_group",
                value: "customer.groups.id",
                label: "Customer Group",
                required: false,
                field_type: "multiselect",
              }),
              expect.objectContaining({
                id: "region",
                value: "region.id",
                label: "Region",
                required: false,
                field_type: "multiselect",
              }),
              expect.objectContaining({
                id: "country",
                value: "shipping_address.country_code",
                label: "Country",
                required: false,
                field_type: "multiselect",
              }),
              expect.objectContaining({
                id: "sales_channel",
                value: "sales_channel_id",
                label: "Sales Channel",
                required: false,
                field_type: "multiselect",
              }),
            ])
          )
        })

        it("return all product target rule attributes by default", async () => {
          const response = await api.get(
            `/admin/promotions/rule-attribute-options/target-rules`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.attributes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "product",
                value: "items.product.id",
                label: "Product",
                required: false,
                field_type: "multiselect",
                operators: expect.anything(),
              }),
              expect.objectContaining({
                id: "product_category",
                value: "items.product.categories.id",
                label: "Product Category",
                required: false,
                field_type: "multiselect",
                operators: expect.anything(),
              }),
              expect.objectContaining({
                id: "product_collection",
                value: "items.product.collection_id",
                label: "Product Collection",
                required: false,
                field_type: "multiselect",
                operators: expect.anything(),
              }),
              expect.objectContaining({
                id: "product_type",
                value: "items.product.type_id",
                label: "Product Type",
                required: false,
                field_type: "multiselect",
                operators: expect.anything(),
              }),
              expect.objectContaining({
                id: "product_tag",
                value: "items.product.tags.id",
                label: "Product Tag",
                required: false,
                field_type: "multiselect",
                operators: expect.anything(),
              }),
            ])
          )
        })

        it("return all target rule attributes when application method target type is shipping_methods", async () => {
          const response = await api.get(
            `/admin/promotions/rule-attribute-options/target-rules?application_method_target_type=shipping_methods`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.attributes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "shipping_option_type",
                value:
                  "shipping_methods.shipping_option.shipping_option_type_id",
                label: "Shipping Option Type",
                required: false,
                field_type: "multiselect",
                operators: expect.anything(),
              }),
            ])
          )
        })
      })

      describe("GET /admin/promotions/rule-value-options/:ruleType/:ruleAttributeId", () => {
        it("should throw error when ruleType is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-value-options/does-not-exist/region`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid param rule_type (does-not-exist)",
          })
        })

        it("should throw error when ruleAttributeId is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-value-options/rules/does-not-exist`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid rule attribute - does-not-exist",
          })
        })

        it("should return all values based on rule types", async () => {
          const region1 = (
            await api.post(
              "/admin/regions",
              { name: "North America", currency_code: "usd" },
              adminHeaders
            )
          ).data.region

          const region2 = (
            await api.post(
              "/admin/regions",
              { name: "Europe", currency_code: "eur" },
              adminHeaders
            )
          ).data.region

          let response = await api.get(
            `/admin/promotions/rule-value-options/rules/region`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              {
                label: "North America",
                value: region1.id,
              },
              {
                label: "Europe",
                value: region2.id,
              },
            ])
          )

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/currency_code?limit=2&order=name`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Afghan Afghani", value: "afn" },
              { label: "Albanian Lek", value: "all" },
            ])
          )

          const group = (
            await api.post(
              "/admin/customer-groups",
              { name: "VIP" },
              adminHeaders
            )
          ).data.customer_group

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/customer_group`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            {
              label: "VIP",
              value: group.id,
            },
          ])

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "Instagram" },
              adminHeaders
            )
          ).data.sales_channel

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/sales_channel`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          // TODO: This is returning a default sales channel, but very flakily
          // Figure out why this happens and fix
          // expect(response.data.values.length).toEqual(1)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Instagram", value: salesChannel.id },
            ])
          )

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/country?limit=2`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              {
                label: "Andorra",
                value: "ad",
              },
              {
                label: "United Arab Emirates",
                value: "ae",
              },
            ])
          )

          const product1 = (
            await api.post(
              "/admin/products",
              {
                title: "Test product 1",
                options: [{ title: "size", values: ["large", "small"] }],
                shipping_profile_id: shippingProfile.id,
              },
              adminHeaders
            )
          ).data.product

          const product2 = (
            await api.post(
              "/admin/products",
              {
                title: "Test product 2",
                options: [{ title: "size", values: ["large", "small"] }],
                shipping_profile_id: shippingProfile.id,
              },
              adminHeaders
            )
          ).data.product

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Test product 1", value: product1.id },
              { label: "Test product 2", value: product2.id },
            ])
          )

          const category = (
            await api.post(
              "/admin/product-categories",
              { name: "test category 1" },
              adminHeaders
            )
          ).data.product_category

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_category`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test category 1", value: category.id },
          ])

          const collection = (
            await api.post(
              "/admin/collections",
              { title: "test collection 1" },
              adminHeaders
            )
          ).data.collection

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_collection`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test collection 1", value: collection.id },
          ])

          const type = (
            await api.post(
              "/admin/product-types",
              { value: "test type" },
              adminHeaders
            )
          ).data.product_type

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_type`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test type", value: type.id },
          ])

          const tag1 = (
            await api.post(
              "/admin/product-tags",
              { value: "test tag 1" },
              adminHeaders
            )
          ).data.product_tag

          const tag2 = (
            await api.post(
              "/admin/product-tags",
              { value: "test tag 2" },
              adminHeaders
            )
          ).data.product_tag

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_tag`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "test tag 1", value: tag1.id },
              { label: "test tag 2", value: tag2.id },
            ])
          )

          const soType1 = (
            await api.post(
              "/admin/shipping-option-types",
              { label: "Test 1", code: "test_1" },
              adminHeaders
            )
          ).data.shipping_option_type

          const soType2 = (
            await api.post(
              "/admin/shipping-option-types",
              { label: "Test 2", code: "test_2" },
              adminHeaders
            )
          ).data.shipping_option_type

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/shipping_option_type?application_method_target_type=shipping_methods`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Test 1", value: soType1.id },
              { label: "Test 2", value: soType2.id },
            ])
          )
        })
      })
    })

    describe("Promotions Workflows", () => {
      it("updateCampaignsWorkflow - should not call listCampaigns when campaignsData is empty", async () => {
        const promotionService = appContainer.resolve(Modules.PROMOTION)
        const listCampaignsSpy = jest.spyOn(promotionService, "listCampaigns")

        const { result } = await updateCampaignsWorkflow(appContainer).run({
          input: { campaignsData: [] },
        })

        expect(result).toEqual([])
        expect(listCampaignsSpy).not.toHaveBeenCalled()

        listCampaignsSpy.mockRestore()
      })

      it("updatePromotionRulesWorkflow - should not call listPromotionRules when data is empty", async () => {
        const promotionService = appContainer.resolve(Modules.PROMOTION)
        const listPromotionRulesSpy = jest.spyOn(
          promotionService,
          "listPromotionRules"
        )

        const { result } = await updatePromotionRulesWorkflow(appContainer).run(
          {
            input: { data: [] },
          }
        )

        expect(result).toEqual([])
        expect(listPromotionRulesSpy).not.toHaveBeenCalled()

        listPromotionRulesSpy.mockRestore()
      })

      it("updatePromotionsWorkflow - should not call listPromotions when promotionsData is empty", async () => {
        const promotionService = appContainer.resolve(Modules.PROMOTION)
        const listPromotionsSpy = jest.spyOn(promotionService, "listPromotions")

        const { result } = await updatePromotionsWorkflow(appContainer).run({
          input: { promotionsData: [] },
        })

        expect(result).toEqual([])
        expect(listPromotionsSpy).not.toHaveBeenCalled()

        listPromotionsSpy.mockRestore()
      })
    })
  },
})
