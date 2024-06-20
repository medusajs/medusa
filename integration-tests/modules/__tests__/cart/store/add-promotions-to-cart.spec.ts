import {
  LinkModuleUtils,
  ModuleRegistrationName,
  RemoteLink,
} from "@medusajs/modules-sdk"
import { ICartModuleService, IPromotionModuleService } from "@medusajs/types"
import { Modules, PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store Carts API: Add promotions to cart", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let promotionModuleService: IPromotionModuleService
      let remoteLinkService: RemoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
        promotionModuleService = appContainer.resolve(
          ModuleRegistrationName.PROMOTION
        )
        remoteLinkService = appContainer.resolve(LinkModuleUtils.REMOTE_LINK)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      describe("POST /store/carts/:id/promotions", () => {
        it("should add line item adjustments to a cart based on promotions", async () => {
          const appliedPromotion =
            await promotionModuleService.createPromotions({
              code: "PROMOTION_APPLIED",
              type: PromotionType.STANDARD,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: "300",
                apply_to_quantity: 1,
                currency_code: "usd",
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "product_id",
                    operator: "eq",
                    values: "prod_tshirt",
                  },
                ],
              },
            })

          const createdPromotion =
            await promotionModuleService.createPromotions({
              code: "PROMOTION_TEST",
              type: PromotionType.STANDARD,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: "1000",
                apply_to_quantity: 1,
                currency_code: "usd",
                target_rules: [
                  {
                    attribute: "product_id",
                    operator: "eq",
                    values: "prod_mat",
                  },
                ],
              },
            })

          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            items: [
              // Adjustment to add
              {
                id: "item-1",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_mat",
              } as any,
              // This adjustment will be removed and recreated
              {
                id: "item-2",
                unit_price: 1000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_tshirt",
              } as any,
            ],
          })

          // Adjustment to keep
          const [lineItemAdjustment] =
            await cartModuleService.addLineItemAdjustments([
              {
                code: appliedPromotion.code!,
                amount: 300,
                item_id: "item-2",
                promotion_id: appliedPromotion.id,
              },
            ])

          await remoteLinkService.create({
            [Modules.CART]: { cart_id: cart.id },
            [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
          })

          const created = await api.post(`/store/carts/${cart.id}/promotions`, {
            promo_codes: [createdPromotion.code],
          })

          expect(created.status).toEqual(200)
          expect(created.data.cart).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              items: expect.arrayContaining([
                expect.objectContaining({
                  id: "item-1",
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      code: createdPromotion.code,
                      amount: 1000,
                    }),
                  ]),
                }),
                expect.objectContaining({
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.not.stringContaining(lineItemAdjustment.id),
                      code: appliedPromotion.code,
                      amount: 300,
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should add shipping method adjustments to a cart based on promotions", async () => {
          const [appliedPromotion] =
            await promotionModuleService.createPromotions([
              {
                code: "PROMOTION_APPLIED",
                type: PromotionType.STANDARD,
                rules: [
                  {
                    attribute: "customer_id",
                    operator: "in",
                    values: ["cus_test"],
                  },
                  {
                    attribute: "currency_code",
                    operator: "in",
                    values: ["eur"],
                  },
                ],
                application_method: {
                  type: "fixed",
                  target_type: "shipping_methods",
                  allocation: "each",
                  value: "100",
                  max_quantity: 1,
                  currency_code: "usd",
                  target_rules: [
                    {
                      attribute: "name",
                      operator: "in",
                      values: ["express"],
                    },
                  ],
                },
              },
            ])

          const [newPromotion] = await promotionModuleService.createPromotions([
            {
              code: "PROMOTION_NEW",
              type: PromotionType.STANDARD,
              rules: [
                {
                  attribute: "customer_id",
                  operator: "in",
                  values: ["cus_test"],
                },
                {
                  attribute: "currency_code",
                  operator: "in",
                  values: ["eur"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: "200",
                max_quantity: 1,
                currency_code: "usd",
                target_rules: [
                  {
                    attribute: "name",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              },
            },
          ])

          const cart = await cartModuleService.createCarts({
            currency_code: "eur",
            customer_id: "cus_test",
            items: [
              {
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_mat",
              } as any,
            ],
          })

          const [express, standard] =
            await cartModuleService.addShippingMethods(cart.id, [
              {
                amount: 500,
                name: "express",
              },
              {
                amount: 500,
                name: "standard",
              },
            ])

          await remoteLinkService.create({
            [Modules.CART]: { cart_id: cart.id },
            [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
          })

          const [adjustment] =
            await cartModuleService.addShippingMethodAdjustments(cart.id, [
              {
                shipping_method_id: express.id,
                amount: 100,
                code: appliedPromotion.code!,
              },
            ])

          const created = await api.post(`/store/carts/${cart.id}/promotions`, {
            promo_codes: [newPromotion.code],
          })

          expect(created.status).toEqual(200)
          expect(created.data.cart).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              items: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                }),
              ]),
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  id: express.id,
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      amount: 200,
                      code: newPromotion.code,
                    }),
                    expect.objectContaining({
                      id: expect.not.stringContaining(adjustment.id),
                      amount: 100,
                      code: appliedPromotion.code,
                    }),
                  ]),
                }),
                expect.objectContaining({
                  id: standard.id,
                  adjustments: [
                    expect.objectContaining({
                      id: expect.any(String),
                      amount: 200,
                      code: newPromotion.code,
                    }),
                  ],
                }),
              ]),
            })
          )
        })
      })
    })
  },
})
