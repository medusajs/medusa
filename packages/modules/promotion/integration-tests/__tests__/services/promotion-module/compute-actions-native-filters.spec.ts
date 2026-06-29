import { IPromotionModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "@zjedene-medusa/test-utils"
import { createCampaigns } from "../../../__fixtures__/campaigns"
import { createDefaultPromotion } from "../../../__fixtures__/promotion"

jest.setTimeout(30000)

const itemAdjustments = (result: any[]) =>
  result.filter((a) => a.action === "addItemAdjustment")

const totalAdjustment = (result: any[]) =>
  itemAdjustments(result).reduce((sum, a) => sum + Number(a.amount), 0)

moduleIntegrationTestRunner({
  moduleName: Modules.PROMOTION,
  testSuite: ({ MikroOrmWrapper, service }: SuiteOptions<IPromotionModuleService>) => {
    describe("Promotion Service: computeActions - native filters", () => {
      beforeEach(async () => {
        await createCampaigns(MikroOrmWrapper.forkManager())
      })

      describe("`total` rule with numeric operators", () => {
        const buildContext = (total: number) => ({
          currency_code: "usd",
          total,
          items: [
            {
              id: "item_1",
              quantity: 1,
              subtotal: total,
              original_total: total,
              is_discountable: true,
              product: { id: "prod_1" },
            },
          ],
        })

        it("applies a `total >= 30` rule only when the cart total qualifies", async () => {
          await createDefaultPromotion(service, {
            rules: [{ attribute: "total", operator: "gte", values: ["30"] }],
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 10,
              target_rules: [],
            } as any,
          })

          const lowCart = await service.computeActions(
            ["PROMOTION_TEST"],
            buildContext(20)
          )
          const highCart = await service.computeActions(
            ["PROMOTION_TEST"],
            buildContext(40)
          )

          expect(itemAdjustments(lowCart)).toHaveLength(0)
          expect(itemAdjustments(highCart).length).toBeGreaterThan(0)
        })
      })

      describe("`is_exclusive` flag", () => {
        it("persists is_exclusive on the promotion", async () => {
          await createDefaultPromotion(service, {
            is_exclusive: true,
          } as any)

          const [promotion] = await service.listPromotions({
            code: "PROMOTION_TEST",
          })

          expect(promotion.is_exclusive).toBe(true)
        })
      })

      describe("`max_value` discount cap", () => {
        it("caps the cumulative discount across items at max_value", async () => {
          await createDefaultPromotion(service, {
            application_method: {
              type: "percentage",
              target_type: "items",
              allocation: "each",
              value: 50, // 50% off each item
              max_quantity: 1,
              max_value: 30, // but never more than 30 total
              target_rules: [],
            } as any,
          })

          const result = await service.computeActions(["PROMOTION_TEST"], {
            currency_code: "usd",
            items: [
              {
                id: "item_1",
                quantity: 1,
                subtotal: 100,
                original_total: 100,
                is_discountable: true,
                product: { id: "prod_1" },
              },
              {
                id: "item_2",
                quantity: 1,
                subtotal: 100,
                original_total: 100,
                is_discountable: true,
                product: { id: "prod_2" },
              },
            ],
          })

          // Uncapped this would be 50 + 50 = 100.
          expect(totalAdjustment(result)).toEqual(30)
        })

        it("does not affect discounts below the cap", async () => {
          await createDefaultPromotion(service, {
            application_method: {
              type: "percentage",
              target_type: "items",
              allocation: "each",
              value: 10, // 10% off -> 10 total, under the cap
              max_quantity: 1,
              max_value: 30,
              target_rules: [],
            } as any,
          })

          const result = await service.computeActions(["PROMOTION_TEST"], {
            currency_code: "usd",
            items: [
              {
                id: "item_1",
                quantity: 1,
                subtotal: 100,
                original_total: 100,
                is_discountable: true,
                product: { id: "prod_1" },
              },
            ],
          })

          expect(totalAdjustment(result)).toEqual(10)
        })
      })
    })
  },
})
