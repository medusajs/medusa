import { Modules } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { ApplicationMethodType, PromotionType } from "@medusajs/utils"
import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"
import { createCampaigns } from "../../../__fixtures__/campaigns"
import { createDefaultPromotion } from "../../../__fixtures__/promotion"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PROMOTION,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IPromotionModuleService>) => {
    describe("Promotion Service: computeActions", () => {
      beforeEach(async () => {
        await createCampaigns(MikroOrmWrapper.forkManager())
      })

      describe("when code is not present in database", () => {
        it("should return empty array when promotion does not exist", async () => {
          const response = await service.computeActions(["DOES_NOT_EXIST"], {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 1,
                subtotal: 100,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_tshirt",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 5,
                subtotal: 750,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_sweater",
                },
              },
            ],
          })

          expect(response).toEqual([])
        })

        it("should throw error when code in items adjustment does not exist", async () => {
          await createDefaultPromotion(service, {})

          const error = await service
            .computeActions(["PROMOTION_TEST"], {
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 100,
                  adjustments: [
                    {
                      id: "test-adjustment",
                      code: "DOES_NOT_EXIST",
                    },
                  ],
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 5,
                  subtotal: 750,
                },
              ],
            })
            .catch((e) => e)

          expect(error.message).toContain(
            "Applied Promotion for code (DOES_NOT_EXIST) not found"
          )
        })

        it("should throw error when code in shipping adjustment does not exist", async () => {
          await createDefaultPromotion(service, {})

          const error = await service
            .computeActions(["PROMOTION_TEST"], {
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 100,
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 5,
                  subtotal: 750,
                  adjustments: [
                    {
                      id: "test-adjustment",
                      code: "DOES_NOT_EXIST",
                    },
                  ],
                },
              ],
            })
            .catch((e) => e)

          expect(error.message).toContain(
            "Applied Promotion for code (DOES_NOT_EXIST) not found"
          )
        })
      })

      describe("when promotion is for items and allocation is each", () => {
        describe("when application type is fixed", () => {
          it("should compute the correct item amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 200,
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 100,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 5,
                  subtotal: 750,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 100,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 30,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 50,
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 50,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 30,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 30,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 20,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 50,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 500,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 50,
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 50,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 50,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 500,
                max_quantity: 5,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 5000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 500,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 500,
                max_quantity: 5,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })
            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 5000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })

        describe("when application type is percentage", () => {
          it("should compute the correct item amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 10,
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 100,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 5,
                  subtotal: 750,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 10,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 15,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 30,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 10,
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 3,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 30,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 45,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 2,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 10.5,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 100,
                max_quantity: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 50,
                max_quantity: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 50,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 50,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 100,
                max_quantity: 5,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 10000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 100,
                max_quantity: 5,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 5000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })
      })

      describe("when promotion is for items and allocation is across", () => {
        describe("when application type is fixed", () => {
          it("should compute the correct item amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 400,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 2,
                  subtotal: 200,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 2,
                  subtotal: 600,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 100,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 300,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when promotion is automatic", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 400,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 2,
                  subtotal: 200,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 2,
                  subtotal: 600,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 100,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 300,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 30,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 50,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 50,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 7.5,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 22.5,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 12.5,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 37.5,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 1000,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 50,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 50,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 50,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 1500,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 5000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 500,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 5000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })

        describe("when application type is percentage", () => {
          it("should compute the correct item amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 2,
                  subtotal: 200,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 2,
                  subtotal: 600,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 20,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 60,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when promotion is automatic", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 2,
                  subtotal: 200,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 2,
                  subtotal: 600,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 20,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 60,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 50,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 5,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 15,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 4.5,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 13.5,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 50,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_cotton_sweater",
                    quantity: 1,
                    subtotal: 150,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_sweater",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 5,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 15,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 4.5,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 13.5,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 100,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 5000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 5,
                  subtotal: 5000,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })
      })

      describe("when promotion is for shipping_method and allocation is each", () => {
        describe("when application type is fixed", () => {
          it("should compute the correct shipping_method amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 200,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 150,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct shipping_method amendments when promotion is automatic", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 200,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 150,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct shipping_method amendments when promotion is automatic and prevent_auto_promotions is false", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              [],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              },
              { prevent_auto_promotions: true }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 200,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 150,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 50,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 500,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 250,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 150,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 1200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: "fixed",
                target_type: "shipping_methods",
                allocation: "each",
                value: 1200,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })

        describe("when application type is percentage", () => {
          it("should compute the correct shipping_method amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 25,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 15,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct shipping_method amendments when promotion is automatic", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 25,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 15,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct shipping_method amendments when promotion is automatic and prevent_auto_promotions is false", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              [],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              },
              { prevent_auto_promotions: true }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 25,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 15,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 22.5,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 13.5,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 25,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 15,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 22.5,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 13.5,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 100,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "each",
                value: 10,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })
      })

      describe("when promotion is for shipping_method and allocation is across", () => {
        describe("when application type is fixed", () => {
          it("should compute the correct shipping_method amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 200,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 166.66666666666666,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 33.333333333333336,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct shipping_method amendments when promotion is automatic", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 200,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 166.66666666666666,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 33.333333333333336,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 200,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 200,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 166.66666666666666,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 33.333333333333336,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 166.66666666666666,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 33.333333333333336,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 1000,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 200,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 500,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 100,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 1200,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: ApplicationMethodType.FIXED,
                target_type: "shipping_methods",
                allocation: "across",
                value: 1200,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })

        describe("when application type is percentage", () => {
          it("should compute the correct shipping_method amendments", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 50,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 10,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct shipping_method amendments when promotion is automatic", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              is_automatic: true,
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  shipping_option: {
                    id: "snail",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 50,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 10,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 50,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 10,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 45,
                code: "PROMOTION_TEST_2",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 9,
                code: "PROMOTION_TEST_2",
              },
            ])
          })

          it("should not compute actions when applicable total is 0", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 100,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await createDefaultPromotion(service, {
              code: "PROMOTION_TEST_2",
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 10,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    shipping_option: {
                      id: "snail",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 500,
                code: "PROMOTION_TEST",
              },
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_standard",
                amount: 100,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type spend", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 100,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })

          it("should compute budget exceeded action when applicable total exceeds campaign budget for type usage", async () => {
            await createDefaultPromotion(service, {
              rules: [
                {
                  attribute: "customer.customer_group.id",
                  operator: "in",
                  values: ["VIP", "top100"],
                },
              ],
              campaign_id: "campaign-id-2",
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "shipping_methods",
                allocation: "across",
                value: 100,
                target_rules: [
                  {
                    attribute: "shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            await service.updateCampaigns({
              id: "campaign-id-2",
              budget: { used: 1000 },
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  shipping_option: {
                    id: "express",
                  },
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              { action: "campaignBudgetExceeded", code: "PROMOTION_TEST" },
            ])
          })
        })
      })

      describe("when promotion is for the entire order", () => {
        it("should compute the correct item amendments", async () => {
          await createDefaultPromotion(service, {
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 200,
              max_quantity: 2,
              allocation: undefined,
            } as any,
          })

          const result = await service.computeActions(["PROMOTION_TEST"], {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 1,
                subtotal: 100,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_tshirt",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 300,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_sweater",
                },
              },
            ],
          })

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 50,
              code: "PROMOTION_TEST",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should compute the correct item amendments when promotion is automatic", async () => {
          await createDefaultPromotion(service, {
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            is_automatic: true,
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 200,
              max_quantity: 2,
              allocation: undefined,
            } as any,
          })

          const result = await service.computeActions([], {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 1,
                subtotal: 100,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_tshirt",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 300,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_sweater",
                },
              },
            ],
          })

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 50,
              code: "PROMOTION_TEST",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should compute the correct item amendments when there are multiple promotions to apply", async () => {
          await createDefaultPromotion(service, {
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 30,
              max_quantity: 2,
              allocation: undefined,
            } as any,
          })

          await createDefaultPromotion(service, {
            code: "PROMOTION_TEST_2",
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 50,
              max_quantity: 1,
              allocation: undefined,
            } as any,
          })

          const result = await service.computeActions(
            ["PROMOTION_TEST", "PROMOTION_TEST_2"],
            {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 50,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 1,
                  subtotal: 150,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            }
          )

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 7.5,
              code: "PROMOTION_TEST",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 22.5,
              code: "PROMOTION_TEST",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 12.5,
              code: "PROMOTION_TEST_2",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 37.5,
              code: "PROMOTION_TEST_2",
            },
          ])
        })

        it("should not compute actions when applicable total is 0", async () => {
          await createDefaultPromotion(service, {
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 500,
              max_quantity: 2,
              allocation: undefined,
            } as any,
          })

          await createDefaultPromotion(service, {
            code: "PROMOTION_TEST_2",
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 50,
              max_quantity: 1,
              allocation: undefined,
            } as any,
          })

          const result = await service.computeActions(
            ["PROMOTION_TEST", "PROMOTION_TEST_2"],
            {
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 50,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 1,
                  subtotal: 150,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                },
              ],
            }
          )

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 50,
              code: "PROMOTION_TEST",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
            },
          ])
        })
      })

      describe("when adjustments are present in the context", () => {
        it("should compute the correct item amendments along with removal of applied item adjustment", async () => {
          await createDefaultPromotion(service, {
            code: "ADJUSTMENT_CODE",
          })

          await createDefaultPromotion(service, {
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              value: 200,
              max_quantity: 1,
              target_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_cotton"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(["PROMOTION_TEST"], {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 1,
                subtotal: 100,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_tshirt",
                },
                adjustments: [
                  {
                    id: "test-adjustment",
                    code: "ADJUSTMENT_CODE",
                  },
                ],
              },
              {
                id: "item_cotton_sweater",
                quantity: 5,
                subtotal: 750,
                product_category: {
                  id: "catg_cotton",
                },
                product: {
                  id: "prod_sweater",
                },
              },
            ],
          })

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "removeItemAdjustment",
              adjustment_id: "test-adjustment",
              code: "ADJUSTMENT_CODE",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 100,
              code: "PROMOTION_TEST",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should compute the correct item amendments along with removal of applied shipping adjustment", async () => {
          await createDefaultPromotion(service, {
            code: "ADJUSTMENT_CODE",
          })

          await createDefaultPromotion(service, {
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "shipping_methods",
              allocation: "across",
              value: 200,
              max_quantity: undefined,
              target_rules: [
                {
                  attribute: "shipping_option.id",
                  operator: "in",
                  values: ["express", "standard"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(["PROMOTION_TEST"], {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            shipping_methods: [
              {
                id: "shipping_method_express",
                subtotal: 500,
                shipping_option: {
                  id: "express",
                },
                adjustments: [
                  {
                    id: "test-adjustment",
                    code: "ADJUSTMENT_CODE",
                  },
                ],
              },
              {
                id: "shipping_method_standard",
                subtotal: 100,
                shipping_option: {
                  id: "standard",
                },
              },
              {
                id: "shipping_method_snail",
                subtotal: 200,
                shipping_option: {
                  id: "snail",
                },
              },
            ],
          })

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "removeShippingMethodAdjustment",
              adjustment_id: "test-adjustment",
              code: "ADJUSTMENT_CODE",
            },
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_express",
              amount: 166.66666666666666,
              code: "PROMOTION_TEST",
            },
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_standard",
              amount: 33.333333333333336,
              code: "PROMOTION_TEST",
            },
          ])
        })
      })

      describe("when promotion of type buyget", () => {
        it("should compute adjustment when target and buy rules match", async () => {
          const context = {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 2,
                subtotal: 1000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_1",
                },
              },
              {
                id: "item_cotton_tshirt2",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_2",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_sweater",
                },
                product: {
                  id: "prod_sweater_1",
                },
              },
            ],
          }

          await createDefaultPromotion(service, {
            type: PromotionType.BUYGET,
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "items",
              value: 1000,
              allocation: "each",
              max_quantity: 1,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_sweater"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(
            ["PROMOTION_TEST"],
            context
          )

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt2",
              amount: 1000,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should return empty array when conditions for minimum qty aren't met", async () => {
          const context = {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 2,
                subtotal: 1000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_1",
                },
              },
              {
                id: "item_cotton_tshirt2",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_2",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_sweater",
                },
                product: {
                  id: "prod_sweater_1",
                },
              },
            ],
          }

          await createDefaultPromotion(service, {
            type: PromotionType.BUYGET,
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "items",
              value: 1000,
              allocation: "each",
              max_quantity: 1,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 4,
              target_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_sweater"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(
            ["PROMOTION_TEST"],
            context
          )

          expect(JSON.parse(JSON.stringify(result))).toEqual([])
        })

        it("should compute actions for multiple items when conditions for target qty exceed one item", async () => {
          const context = {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 2,
                subtotal: 1000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_1",
                },
              },
              {
                id: "item_cotton_tshirt2",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_2",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_sweater",
                },
                product: {
                  id: "prod_sweater_1",
                },
              },
            ],
          }

          await createDefaultPromotion(service, {
            type: PromotionType.BUYGET,
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            campaign_id: undefined,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              max_quantity: 1,
              value: 1000,
              apply_to_quantity: 4,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_sweater"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(
            ["PROMOTION_TEST"],
            context
          )

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt2",
              amount: 2000,
              code: "PROMOTION_TEST",
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 1000,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should return empty array when target rules arent met with context", async () => {
          const context = {
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 2,
                subtotal: 1000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_1",
                },
              },
              {
                id: "item_cotton_tshirt2",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_2",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 2000,
                product_category: {
                  id: "catg_sweater",
                },
                product: {
                  id: "prod_sweater_1",
                },
              },
            ],
          }

          await createDefaultPromotion(service, {
            type: PromotionType.BUYGET,
            rules: [
              {
                attribute: "customer.customer_group.id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
            campaign_id: undefined,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              value: 1000,
              max_quantity: 1,
              apply_to_quantity: 4,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_not-found"],
                },
              ],
              buy_rules: [
                {
                  attribute: "product_category.id",
                  operator: "eq",
                  values: ["catg_sweater"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(
            ["PROMOTION_TEST"],
            context
          )

          expect(JSON.parse(JSON.stringify(result))).toEqual([])
        })
      })
    })
  },
})
