import {
  CreatePromotionDTO,
  IPromotionModuleService,
} from "@medusajs/framework/types"
import {
  ApplicationMethodType,
  CampaignBudgetType,
  MathBN,
  Modules,
  PromotionStatus,
  PromotionType,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "@medusajs/test-utils"
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

      // A non-tax-inclusive promotion records its adjustment excl-tax, but a
      // later tax-inclusive promotion measures the remaining applicable amount
      // against the incl-tax `original_total`. Without reconciling the two tax
      // bases, the stacked discounts can exceed the item value and drive the
      // taxable base negative.
      describe("when mixing tax-inclusive and non-tax-inclusive promotions", () => {
        // Stacks a non-tax-inclusive then a tax-inclusive promotion on a taxed
        // line item and returns the resulting taxable base (excl-tax).
        const computeStackedTaxableBase = async (
          allocation: "each" | "across"
        ) => {
          // 20% VAT: subtotal 3.50 (excl), original_total 4.20 (incl)
          const item = {
            id: "item_taxed",
            quantity: 1,
            subtotal: 3.5,
            original_total: 4.2,
            is_discountable: true,
            product: { id: "prod_taxed" },
          }

          // max_quantity is required for "each" but forbidden for "across".
          const quantityField = allocation === "each" ? { max_quantity: 1 } : {}

          // Higher application_method.value => applied first. 10% of 3.50 = 0.35 excl-tax.
          await createDefaultPromotion(service, {
            code: "PROMO_NON_TAX_INCL",
            is_tax_inclusive: false,
            application_method: {
              type: "percentage",
              target_type: "items",
              allocation,
              value: 10,
              ...quantityField,
            } as any,
          })

          // Applied second. Tax-inclusive fixed promotion.
          await createDefaultPromotion(service, {
            code: "PROMO_TAX_INCL",
            is_tax_inclusive: true,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation,
              value: 5,
              ...quantityField,
            } as any,
          })

          const result = await service.computeActions(
            ["PROMO_NON_TAX_INCL", "PROMO_TAX_INCL"],
            {
              currency_code: "usd",
              items: [item],
            }
          )

          const actions = JSON.parse(JSON.stringify(result)) as any[]

          // Normalize every adjustment to its tax-exclusive equivalent.
          const taxRatio = MathBN.div(item.original_total, item.subtotal)
          const totalDiscountExclTax = actions
            .filter(
              (a) => a.action === "addItemAdjustment" && a.item_id === item.id
            )
            .reduce(
              (acc, a) =>
                MathBN.add(
                  acc,
                  a.is_tax_inclusive
                    ? MathBN.div(a.amount, taxRatio)
                    : a.amount
                ),
              MathBN.convert(0)
            )

          return MathBN.sub(item.subtotal, totalDiscountExclTax)
        }

        it("should not drive the taxable base negative when stacking (each allocation)", async () => {
          const taxableBase = await computeStackedTaxableBase("each")
          expect(MathBN.gte(taxableBase, 0)).toBe(true)
        })

        it("should not drive the taxable base negative when stacking (across allocation)", async () => {
          const taxableBase = await computeStackedTaxableBase("across")
          expect(MathBN.gte(taxableBase, 0)).toBe(true)
        })
      })

      it("edge case: should only return promotions with no rules when context has no attributes", async () => {
        // Create promotions with different rule configurations
        const promotionsToCreate: CreatePromotionDTO[] = [
          // Promotion with no rules - should be returned
          {
            code: "NO_RULES_PROMO",
            is_automatic: true,
            rules: [], // No global rules
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              max_quantity: 100000,
              value: 100,
              target_rules: [], // No target rules
            },
            type: "standard",
            status: PromotionStatus.ACTIVE,
            campaign_id: "campaign-id-1",
          },
          // Promotion with global rules - should NOT be returned
          {
            code: "WITH_GLOBAL_RULES",
            is_automatic: true,
            rules: [
              {
                attribute: "customer.id",
                operator: "eq",
                values: ["some_customer"],
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              max_quantity: 100000,
              value: 100,
              target_rules: [],
            },
            type: "standard",
            status: PromotionStatus.ACTIVE,
            campaign_id: "campaign-id-1",
          },
          // Promotion with target rules - should NOT be returned
          {
            code: "WITH_TARGET_RULES",
            is_automatic: true,
            rules: [],
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              max_quantity: 100000,
              value: 100,
              target_rules: [
                {
                  attribute: "items.product.id",
                  operator: "eq",
                  values: ["some_product"],
                },
              ],
            },
            type: "standard",
            status: PromotionStatus.ACTIVE,
            campaign_id: "campaign-id-1",
          },
        ]

        const promotions = await service.createPromotions(promotionsToCreate)
        const noRulePromotion = promotions.find(
          (p) => p.code === "NO_RULES_PROMO"
        )!

        // Spy on the internal promotion service to verify prefiltering
        let prefilterCallCount = 0
        let prefilteredPromotions: any[] = []
        const originalPromotionServiceList = (service as any).promotionService_
          .list

        ;(service as any).promotionService_.list = async (...args: any[]) => {
          const result = await originalPromotionServiceList.bind(
            (service as any).promotionService_
          )(...args)

          if (prefilterCallCount === 0) {
            prefilteredPromotions = result
          }
          prefilterCallCount++

          // Return nothing to not trigger future context checks
          return []
        }

        // Empty context - no attributes at all, should trigger noRulesSubquery
        const emptyContext = {}

        const actions = await service.computeActions([], emptyContext as any)

        ;(service as any).promotionService_.list = originalPromotionServiceList

        // Should only return the promotion with no rules
        expect(prefilteredPromotions).toHaveLength(1)
        expect(prefilteredPromotions[0].id).toBe(noRulePromotion.id)

        expect(actions).toHaveLength(0) // No items to apply to
      })

      it("should prefilter promotions by applicable rules", async () => {
        // 1. Promotion with NO rules (should always apply if automatic)
        await createDefaultPromotion(service, {
          code: "NO_RULES_PROMO",
          is_automatic: true,
          rules: [], // No global rules - always applicable
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 100,
            target_rules: [
              {
                attribute: "items.product.id",
                operator: "eq",
                values: ["prod_tshirt0"], // Only applies to product 0
              },
            ],
          },
        })

        // 2. Promotion matching customer group VIP1
        await createDefaultPromotion(service, {
          code: "CUSTOMER_GROUP_PROMO",
          is_automatic: true,
          rules: [
            {
              attribute: "customer.customer_group.id",
              operator: "in",
              values: ["VIP1"], // Matches our test customer
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 100,
            target_rules: [
              {
                attribute: "items.product.id",
                operator: "eq",
                values: ["prod_tshirt1"], // Only applies to product 1
              },
            ],
          },
        })

        // 3. Promotion with subtotal rule (should match items with subtotal > 50)
        await createDefaultPromotion(service, {
          code: "SUBTOTAL_PROMO",
          is_automatic: true,
          rules: [
            {
              attribute: "items.subtotal",
              operator: "gt",
              values: ["50"], // All our items have subtotal > 50
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 100,
            target_rules: [], // No target rules - applies to all items
          },
        })

        // 4. Promotion matching customer.id
        await createDefaultPromotion(service, {
          code: "CUSTOMER_ID_PROMO",
          is_automatic: true,
          rules: [
            {
              attribute: "customer.id",
              operator: "in",
              values: ["customer"], // Matches our test customer
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 250, // Different value to distinguish
            target_rules: [
              {
                attribute: "items.product.id",
                operator: "eq",
                values: ["prod_tshirt9"], // Only applies to product 9
              },
            ],
          },
        })

        // 5. Promotion that should NOT match (different customer group)
        await createDefaultPromotion(service, {
          code: "NO_MATCH_PROMO",
          is_automatic: true,
          rules: [
            {
              attribute: "customer.customer_group.id",
              operator: "in",
              values: ["VIP99"], // Different customer group - won't match
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 100,
            target_rules: [
              {
                attribute: "items.product.id",
                operator: "eq",
                values: ["prod_tshirt0"],
              },
            ],
          },
        })

        // 6. Non-automatic promotion (should be excluded from automatic processing)
        await createDefaultPromotion(service, {
          code: "NON_AUTO_PROMO",
          is_automatic: false, // Not automatic
          rules: [
            {
              attribute: "customer.customer_group.id",
              operator: "in",
              values: ["VIP1"], // Would match but not automatic
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 100,
            target_rules: [
              {
                attribute: "items.product.id",
                operator: "eq",
                values: ["prod_tshirt0"],
              },
            ],
          },
        })

        // 6. Non-automatic promotion that do not match any rules (should be excluded from automatic processing and internal pre filtering)
        await createDefaultPromotion(service, {
          code: "NON_AUTO_PROMO_2",
          is_automatic: false, // Not automatic
          rules: [
            {
              attribute: "customer.customer_group.id",
              operator: "in",
              values: ["VIP99"], // Would not match our customer group
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 100,
            target_rules: [
              {
                attribute: "items.product.id",
                operator: "eq",
                values: ["prod_tshirt0"],
              },
            ],
          },
        })

        // Spy on the internal promotion service to verify prefiltering
        let prefilterCallCount = 0
        let prefilteredPromotions: any[] = []
        const originalPromotionServiceList = (service as any).promotionService_
          .list

        ;(service as any).promotionService_.list = async (...args: any[]) => {
          const result = await originalPromotionServiceList.bind(
            (service as any).promotionService_
          )(...args)

          if (prefilterCallCount === 0) {
            prefilteredPromotions = result
          }
          prefilterCallCount++

          return result
        }

        // Test Context: Customer with specific attributes
        const testContext = {
          currency_code: "usd",
          customer: {
            id: "customer", // Matches CUSTOMER_ID_PROMO
            customer_group: {
              id: "VIP1", // Matches CUSTOMER_GROUP_PROMO
            },
          },
          region_id: "region_1",
          items: [
            {
              id: "item_tshirt0",
              quantity: 1,
              subtotal: 100, // > 50, matches SUBTOTAL_PROMO
              product: { id: "prod_tshirt0" }, // Matches NO_RULES_PROMO target
            },
            {
              id: "item_tshirt1",
              quantity: 1,
              subtotal: 100, // > 50, matches SUBTOTAL_PROMO
              product: { id: "prod_tshirt1" }, // Matches CUSTOMER_GROUP_PROMO target
            },
            {
              id: "item_tshirt9",
              quantity: 5,
              subtotal: 750, // > 50, matches SUBTOTAL_PROMO
              product: { id: "prod_tshirt9" }, // Matches CUSTOMER_ID_PROMO target
            },
            {
              id: "item_unknown",
              quantity: 1,
              subtotal: 110, // > 50, matches SUBTOTAL_PROMO
              product: { id: "prod_unknown" }, // No specific target rules match
            },
          ] as any,
        }

        const actions = await service.computeActions([], testContext)

        ;(service as any).promotionService_.list = originalPromotionServiceList

        // 1. Verify prefiltering worked - should include matching promotions
        expect(prefilteredPromotions).toHaveLength(4)
        const prefilteredCodes = prefilteredPromotions.map((p) => p.code)
        expect(prefilteredCodes).toEqual(
          expect.arrayContaining([
            "NO_RULES_PROMO", // No rules - always included
            "CUSTOMER_GROUP_PROMO", // customer.customer_group.id = VIP1
            "SUBTOTAL_PROMO", // items.subtotal > 50
            "CUSTOMER_ID_PROMO", // customer.id = customer
          ])
        )

        expect(actions).toHaveLength(4)

        const actionsByCode = JSON.parse(JSON.stringify(actions)).reduce(
          (acc, action) => {
            if (!acc[action.code]) acc[action.code] = []
            acc[action.code].push(action)
            return acc
          },
          {} as Record<string, any[]>
        )

        // NO_RULES_PROMO: Applies to item_tshirt0 (product.id = prod_tshirt0)
        expect(actionsByCode["NO_RULES_PROMO"]).toEqual([
          expect.objectContaining({
            action: "addItemAdjustment",
            item_id: "item_tshirt0",
            amount: 100,
            code: "NO_RULES_PROMO",
          }),
        ])

        // CUSTOMER_GROUP_PROMO: Applies to item_tshirt1 (product.id = prod_tshirt1)
        expect(actionsByCode["CUSTOMER_GROUP_PROMO"]).toEqual([
          expect.objectContaining({
            action: "addItemAdjustment",
            item_id: "item_tshirt1",
            amount: 100,
            code: "CUSTOMER_GROUP_PROMO",
          }),
        ])

        // SUBTOTAL_PROMO: (no target rules)
        expect(actionsByCode["SUBTOTAL_PROMO"]).toHaveLength(1)
        expect(actionsByCode["SUBTOTAL_PROMO"]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ item_id: "item_unknown", amount: 100 }),
          ])
        )

        // CUSTOMER_ID_PROMO: Applies to item_tshirt9 (product.id = prod_tshirt9)
        expect(actionsByCode["CUSTOMER_ID_PROMO"]).toEqual([
          expect.objectContaining({
            action: "addItemAdjustment",
            item_id: "item_tshirt9",
            amount: 750,
            code: "CUSTOMER_ID_PROMO",
          }),
        ])
      })

      it("should exclude promotions with rules for attributes not in context", async () => {
        // Create promotion with mixed attributes - some in context, some not
        await createDefaultPromotion(service, {
          code: "MIXED_ATTRIBUTES_PROMO",
          is_automatic: true,
          rules: [
            {
              attribute: "customer.id",
              operator: "eq",
              values: ["customer1"], // This matches context
            },
            {
              attribute: "special_flag", // This attribute NOT in context
              operator: "eq",
              values: ["premium"],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 100,
          },
        })

        // Create promotion with only context attributes - should be included
        await createDefaultPromotion(service, {
          code: "CONTEXT_ONLY_PROMO",
          is_automatic: true,
          rules: [
            {
              attribute: "customer.id",
              operator: "eq",
              values: ["customer1"],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            max_quantity: 100000,
            value: 50,
          },
        })

        // Spy on promotion service to capture prefiltered results
        let prefilteredPromotions: any[] = []
        const originalPromotionServiceList = (service as any).promotionService_
          .list

        ;(service as any).promotionService_.list = async (...args: any[]) => {
          const result = await originalPromotionServiceList.bind(
            (service as any).promotionService_
          )(...args)
          prefilteredPromotions = result
          return result
        }

        // Context with limited attributes
        const testContext = {
          customer: { id: "customer1" },
          items: [
            {
              id: "item1",
              quantity: 1,
              subtotal: 100,
              product: { id: "prod1" },
            },
          ],
        }

        await service.computeActions([], testContext as any)

        // Restore original method
        ;(service as any).promotionService_.list = originalPromotionServiceList

        // Should only include promotion with context-only attributes
        expect(prefilteredPromotions).toHaveLength(1)
        expect(prefilteredPromotions[0].code).toBe("CONTEXT_ONLY_PROMO")
      })

      it("should handle prefiltering of many automatic promotions targetting customers and regions with only one that is relevant", async () => {
        const promotionToCreate: CreatePromotionDTO[] = []
        // I ve also tested with 20k and the compute actions takes 200/300ms
        for (let i = 0; i < 100; i++) {
          promotionToCreate.push({
            code: "CUSTOMER_PROMO_" + i,
            is_automatic: true,
            rules: [
              {
                attribute: "customer.id",
                operator: "eq",
                values: ["customer" + i], // Matches our test customer1
              },
              {
                attribute: "region_id",
                operator: "eq",
                values: ["region_1"], // matches our region
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              max_quantity: 100000,
              value: 100,
              target_rules: [
                {
                  attribute: "items.product.id",
                  operator: "eq",
                  values: ["prod_tshirt0"], // Only applies to product 0
                },
              ],
            },
            type: "standard",
            status: PromotionStatus.ACTIVE,
            campaign_id: "campaign-id-1",
          })
        }

        await service.createPromotions(promotionToCreate)

        // Spy on the internal promotion service to verify prefiltering
        let prefilterCallCount = 0
        let prefilteredPromotions: any[] = []
        const originalPromotionServiceList = (service as any).promotionService_
          .list

        ;(service as any).promotionService_.list = async (...args: any[]) => {
          const result = await originalPromotionServiceList.bind(
            (service as any).promotionService_
          )(...args)

          if (prefilterCallCount === 0) {
            prefilteredPromotions = result
          }
          prefilterCallCount++

          return result
        }

        // Test Context: Customer with specific attributes
        const testContext = {
          currency_code: "usd",
          customer: {
            id: "customer1", // Matches CUSTOMER_PROMO_1
          },
          region_id: "region_1",
          items: [
            {
              id: "item_tshirt0",
              quantity: 1,
              subtotal: 100,
              product: { id: "prod_tshirt0" }, // Matches CUSTOMER_PROMO_1 target
            },
            {
              id: "item_tshirt1",
              quantity: 1,
              subtotal: 100,
              product: { id: "prod_tshirt1" },
            },
            {
              id: "item_tshirt9",
              quantity: 5,
              subtotal: 750,
              product: { id: "prod_tshirt9" },
            },
            {
              id: "item_unknown",
              quantity: 1,
              subtotal: 110,
              product: { id: "prod_unknown" },
            },
          ] as any,
        }

        const actions = await service.computeActions([], testContext)

        ;(service as any).promotionService_.list = originalPromotionServiceList

        // 1. Verify prefiltering worked - should include matching promotion
        // We expect the prefilter to have return a single promotion that is being satisfied by the
        // context with the given customer id and region id
        expect(prefilteredPromotions).toHaveLength(1)
        const prefilteredCodes = prefilteredPromotions.map((p) => p.code)
        expect(prefilteredCodes).toEqual(
          expect.arrayContaining([
            "CUSTOMER_PROMO_1", // customer.id = customer1
          ])
        )

        expect(actions).toHaveLength(1)

        const actionsByCode = JSON.parse(JSON.stringify(actions)).reduce(
          (acc, action) => {
            if (!acc[action.code]) acc[action.code] = []
            acc[action.code].push(action)
            return acc
          },
          {} as Record<string, any[]>
        )

        // CUSTOMER_PROMO_1: Applies to item_tshirt0 (product.id = prod_tshirt0)
        expect(actionsByCode["CUSTOMER_PROMO_1"]).toEqual([
          expect.objectContaining({
            action: "addItemAdjustment",
            item_id: "item_tshirt0",
            amount: 100,
            code: "CUSTOMER_PROMO_1",
          }),
        ])
      })

      it("should handle prefiltering of many automatic promotions targetting customers and regions while no context attribute can satisfies any of those rules", async () => {
        const promotionToCreate: CreatePromotionDTO[] = []
        for (let i = 0; i < 100; i++) {
          promotionToCreate.push({
            code: "CUSTOMER_PROMO_" + i,
            is_automatic: true,
            rules: [
              {
                attribute: "customer.id",
                operator: "eq",
                values: ["customer" + i], // Matches our test customer1
              },
              {
                attribute: "region_id",
                operator: "eq",
                values: ["region_1"], // matches our region
              },
            ],
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              max_quantity: 100000,
              value: 100,
              target_rules: [
                {
                  attribute: "items.product.id",
                  operator: "eq",
                  values: ["prod_tshirt0"], // Only applies to product 0
                },
              ],
            },
            type: "standard",
            status: PromotionStatus.ACTIVE,
            campaign_id: "campaign-id-1",
          })
        }

        await service.createPromotions(promotionToCreate)

        // Spy on the internal promotion service to verify prefiltering
        let prefilterCallCount = 0
        let prefilteredPromotions: any[] = []
        const originalPromotionServiceList = (service as any).promotionService_
          .list

        ;(service as any).promotionService_.list = async (...args: any[]) => {
          const result = await originalPromotionServiceList.bind(
            (service as any).promotionService_
          )(...args)

          if (prefilterCallCount === 0) {
            prefilteredPromotions = result
          }
          prefilterCallCount++

          return result
        }

        // Test Context
        const testContext = {
          currency_code: "usd",
          items: [
            {
              id: "item_tshirt0",
              quantity: 1,
              subtotal: 100,
              product: { id: "prod_tshirt0" }, // Matches CUSTOMER_PROMO_1 target
            },
            {
              id: "item_tshirt1",
              quantity: 1,
              subtotal: 100,
              product: { id: "prod_tshirt1" },
            },
            {
              id: "item_tshirt9",
              quantity: 5,
              subtotal: 750,
              product: { id: "prod_tshirt9" },
            },
            {
              id: "item_unknown",
              quantity: 1,
              subtotal: 110,
              product: { id: "prod_unknown" },
            },
          ] as any,
        }

        const actions = await service.computeActions([], testContext)

        ;(service as any).promotionService_.list = originalPromotionServiceList

        // 1. Verify prefiltering worked - should include matching promotion
        // We expect the prefilter to have return 0 promotion that is being satisfied by the
        expect(prefilteredPromotions).toHaveLength(0)

        expect(actions).toHaveLength(0)
      })

      it("should return empty array when promotion is not active (draft or inactive)", async () => {
        const promotion = await createDefaultPromotion(service, {
          status: PromotionStatus.DRAFT,
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
                attribute: "items.product_category.id",
                operator: "eq",
                values: ["catg_cotton"],
              },
            ],
          },
        })

        const result = await service.computeActions([promotion.code!], {
          currency_code: "usd",
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
              original_total: 100,
              is_discountable: true,
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
              original_total: 750,
              is_discountable: true,
              product_category: {
                id: "catg_cotton",
              },
              product: {
                id: "prod_sweater",
              },
            },
          ],
        })

        expect(result).toEqual([])
      })

      describe("when code is not present in database", () => {
        it("should return empty array when promotion does not exist", async () => {
          const response = await service.computeActions(["DOES_NOT_EXIST"], {
            currency_code: "usd",
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
                original_total: 100,
                is_discountable: true,
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
                original_total: 750,
                is_discountable: true,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 100,
                  is_discountable: true,
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
                  original_total: 750,
                  is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
            ])

            const resultWithoutCustomer = await service.computeActions(
              ["PROMOTION_TEST"],
              {
                currency_code: "usd",
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 1,
                    subtotal: 100,
                    original_total: 100,
                    is_discountable: true,
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
                    original_total: 750,
                    is_discountable: true,
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

            expect(JSON.parse(JSON.stringify(resultWithoutCustomer))).toEqual(
              []
            )
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 50,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 50,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 30,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 50,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                value: 100,
                max_quantity: 5,
                target_rules: [
                  {
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 5000,
                  is_discountable: true,
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
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
              currency_code: "usd",
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
                  original_total: 5000,
                  is_discountable: true,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 100,
                  is_discountable: true,
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
                  original_total: 750,
                  is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 15,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 150,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 45,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 10.5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
            ])
          })

          it("should compute actions when 2 percentage promotions are applied to the same item", async () => {
            await createDefaultPromotion(service, {
              code: "PROMO_PERCENTAGE_1",
              rules: [],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 100,
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "items.product.id",
                    operator: "eq",
                    values: ["prod_tshirt"],
                  },
                ],
              },
            })

            await createDefaultPromotion(service, {
              code: "PROMO_PERCENTAGE_2",
              rules: [],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "each",
                value: 100,
                max_quantity: 1,
                target_rules: [
                  {
                    attribute: "items.product.id",
                    operator: "eq",
                    values: ["prod_tshirt"],
                  },
                ],
              },
            })

            const result = await service.computeActions(
              ["PROMO_PERCENTAGE_1", "PROMO_PERCENTAGE_2"],
              {
                currency_code: "usd",
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 4,
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
                    product_category: {
                      id: "catg_cotton",
                    },
                    product: {
                      id: "prod_tshirt",
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
                code: "PROMO_PERCENTAGE_1",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 50,
                code: "PROMO_PERCENTAGE_2",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 50,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 10000,
                  is_discountable: true,
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
                    attribute: "items.product_category.id",
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
              currency_code: "usd",
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
                  original_total: 5000,
                  is_discountable: true,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 200,
                  is_discountable: true,
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
                  original_total: 600,
                  is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 300,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              currency_code: "usd",
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
                  original_total: 200,
                  is_discountable: true,
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
                  original_total: 600,
                  is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 300,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 50,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                amount: 12.5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 37.5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 7.5,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 22.5,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 50,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 150,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 5000,
                  is_discountable: true,
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
                    attribute: "items.product_category.id",
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
              currency_code: "usd",
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
                  original_total: 5000,
                  is_discountable: true,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 200,
                  is_discountable: true,
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
                  original_total: 600,
                  is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 60,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              currency_code: "usd",
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
                  original_total: 200,
                  is_discountable: true,
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
                  original_total: 600,
                  is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 60,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 50,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 15,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 4.5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 13.5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
            ])
          })

          it("should compute actions when 2 percentage promotions are applied to the same item", async () => {
            await createDefaultPromotion(service, {
              code: "PROMO_PERCENTAGE_1",
              rules: [],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 50,
                target_rules: [
                  {
                    attribute: "items.product.id",
                    operator: "eq",
                    values: ["prod_tshirt"],
                  },
                ],
              },
            })

            await createDefaultPromotion(service, {
              code: "PROMO_PERCENTAGE_2",
              rules: [],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 50,
                target_rules: [
                  {
                    attribute: "items.product.id",
                    operator: "eq",
                    values: ["prod_tshirt"],
                  },
                ],
              },
            })

            const result = await service.computeActions(
              ["PROMO_PERCENTAGE_1", "PROMO_PERCENTAGE_2"],
              {
                currency_code: "usd",
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 4,
                    subtotal: 300,
                    original_total: 300,
                    is_discountable: true,
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_wool_tshirt",
                    quantity: 4,
                    subtotal: 100,
                    original_total: 100,
                    is_discountable: true,
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                ],
              }
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 150,
                code: "PROMO_PERCENTAGE_1",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_wool_tshirt",
                amount: 50,
                code: "PROMO_PERCENTAGE_1",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 75,
                code: "PROMO_PERCENTAGE_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_wool_tshirt",
                amount: 25,
                code: "PROMO_PERCENTAGE_2",
                is_tax_inclusive: false,
              },
            ])

            await createDefaultPromotion(service, {
              code: "PROMO_PERCENTAGE_3",
              rules: [],
              application_method: {
                type: ApplicationMethodType.PERCENTAGE,
                target_type: "items",
                allocation: "across",
                value: 100,
                target_rules: [
                  {
                    attribute: "items.product.id",
                    operator: "eq",
                    values: ["prod_tshirt"],
                  },
                ],
              },
            })

            const result2 = await service.computeActions(
              [
                "PROMO_PERCENTAGE_1",
                "PROMO_PERCENTAGE_2",
                "PROMO_PERCENTAGE_3",
              ],
              {
                currency_code: "usd",
                items: [
                  {
                    id: "item_cotton_tshirt",
                    quantity: 4,
                    subtotal: 300,
                    original_total: 300,
                    is_discountable: true,
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                  {
                    id: "item_wool_tshirt",
                    quantity: 4,
                    subtotal: 100,
                    original_total: 100,
                    is_discountable: true,
                    product: {
                      id: "prod_tshirt",
                    },
                  },
                ],
              }
            )

            // Should only apply the most valuable promotion (100% off - PROMO_PERCENTAGE_3) that covers
            // the entire total of the line item
            expect(JSON.parse(JSON.stringify(result2))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 300,
                code: "PROMO_PERCENTAGE_3",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_wool_tshirt",
                amount: 100,
                code: "PROMO_PERCENTAGE_3",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
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
                    original_total: 50,
                    is_discountable: true,
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
                    original_total: 150,
                    is_discountable: true,
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
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 15,
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 4.5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_sweater",
                amount: 13.5,
                code: "PROMOTION_TEST_2",
                is_tax_inclusive: false,
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
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_cotton"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
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
                  original_total: 5000,
                  is_discountable: true,
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
                    attribute: "items.product_category.id",
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
              currency_code: "usd",
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
                  original_total: 5000,
                  is_discountable: true,
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

          it("should compute budget exceeded action when usage by attribute exceeds campaign budget for type use_by_attribute", async () => {
            const testCampaign = await service.createCampaigns({
              name: "test",
              campaign_identifier: "test",
              budget: {
                type: CampaignBudgetType.USE_BY_ATTRIBUTE,
                attribute: "customer_email",
                limit: 2,
              },
            })

            await createDefaultPromotion(service, {
              campaign_id: testCampaign.id,
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

            let result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              email: "test@test.com",
              customer: {
                email: "test@test.com",
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 100,
                  original_total: 100,
                  is_discountable: true,
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
                code: "PROMOTION_TEST",
                amount: 10,
                is_tax_inclusive: false,
                item_id: "item_cotton_tshirt",
              },
            ])

            await service.registerUsage(
              [{ amount: 10, code: "PROMOTION_TEST" }],
              {
                customer_id: null,
                customer_email: "test@test.com",
              }
            )

            await service.registerUsage(
              [{ amount: 10, code: "PROMOTION_TEST" }],
              {
                customer_id: null,
                customer_email: "test@test.com",
              }
            )

            result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              email: "test@test.com",
              customer: {
                email: "test@test.com",
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 100,
                  original_total: 100,
                  is_discountable: true,
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
                action: "campaignBudgetExceeded",
                code: "PROMOTION_TEST",
              },
            ])

            result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              email: "another@test.com", // another email can sucessfully use the promotion
              customer: {
                email: "another@test.com",
              },
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 100,
                  original_total: 100,
                  is_discountable: true,
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
                code: "PROMOTION_TEST",
                amount: 10,
                is_tax_inclusive: false,
                item_id: "item_cotton_tshirt",
              },
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  original_total: 250,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  original_total: 150,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  original_total: 250,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  original_total: 150,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              [],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    original_total: 250,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    original_total: 150,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    original_total: 250,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    original_total: 150,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    original_total: 250,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    original_total: 150,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  original_total: 250,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  original_total: 150,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 250,
                  original_total: 250,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 150,
                  original_total: 150,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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

          it("should compute the correct shipping_method amendments when promotion is automatic and prevent_auto_promotions is true", async () => {
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              [],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    original_total: 250,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    original_total: 150,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    original_total: 250,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    original_total: 150,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 250,
                    original_total: 250,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 150,
                    original_total: 150,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  original_total: 500,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  original_total: 100,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  original_total: 500,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  original_total: 100,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    original_total: 500,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    original_total: 100,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    original_total: 500,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    original_total: 100,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  original_total: 500,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  original_total: 100,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions([], {
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 500,
                  original_total: 500,
                  is_discountable: true,
                  shipping_option: {
                    id: "express",
                  },
                },
                {
                  id: "shipping_method_standard",
                  subtotal: 100,
                  original_total: 100,
                  is_discountable: true,
                  shipping_option: {
                    id: "standard",
                  },
                },
                {
                  id: "shipping_method_snail",
                  subtotal: 200,
                  original_total: 200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    original_total: 500,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    original_total: 100,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
                    attribute: "shipping_methods.shipping_option.id",
                    operator: "in",
                    values: ["express", "standard"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(
              ["PROMOTION_TEST", "PROMOTION_TEST_2"],
              {
                currency_code: "usd",
                customer: {
                  customer_group: {
                    id: "VIP",
                  },
                },
                shipping_methods: [
                  {
                    id: "shipping_method_express",
                    subtotal: 500,
                    original_total: 500,
                    is_discountable: true,
                    shipping_option: {
                      id: "express",
                    },
                  },
                  {
                    id: "shipping_method_standard",
                    subtotal: 100,
                    original_total: 100,
                    is_discountable: true,
                    shipping_option: {
                      id: "standard",
                    },
                  },
                  {
                    id: "shipping_method_snail",
                    subtotal: 200,
                    original_total: 200,
                    is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
                    attribute: "shipping_methods.shipping_option.id",
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
              currency_code: "usd",
              customer: {
                customer_group: {
                  id: "VIP",
                },
              },
              shipping_methods: [
                {
                  id: "shipping_method_express",
                  subtotal: 1200,
                  original_total: 1200,
                  is_discountable: true,
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
            currency_code: "usd",
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
                original_total: 100,
                is_discountable: true,
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
          } as any)

          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 50,
              code: "PROMOTION_TEST",
              is_tax_inclusive: false,
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
              is_tax_inclusive: false,
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
            currency_code: "usd",
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
                original_total: 100,
                is_discountable: true,
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
                original_total: 300,
                is_discountable: true,
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
              is_tax_inclusive: false,
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
              is_tax_inclusive: false,
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
              currency_code: "usd",
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
                  original_total: 50,
                  is_discountable: true,
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
                  original_total: 150,
                  is_discountable: true,
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
              amount: 12.5,
              code: "PROMOTION_TEST_2",
              is_tax_inclusive: false,
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 37.5,
              code: "PROMOTION_TEST_2",
              is_tax_inclusive: false,
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 7.5,
              code: "PROMOTION_TEST",
              is_tax_inclusive: false,
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 22.5,
              code: "PROMOTION_TEST",
              is_tax_inclusive: false,
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
              currency_code: "usd",
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
                  original_total: 50,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_tshirt",
                  },
                  is_discountable: true,
                },
                {
                  id: "item_cotton_sweater",
                  quantity: 1,
                  subtotal: 150,
                  original_total: 150,
                  product_category: {
                    id: "catg_cotton",
                  },
                  product: {
                    id: "prod_sweater",
                  },
                  is_discountable: true,
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
              is_tax_inclusive: false,
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
              is_tax_inclusive: false,
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
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_cotton"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(["PROMOTION_TEST"], {
            currency_code: "usd",
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
                original_total: 100,
                is_discountable: true,
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
                original_total: 750,
                is_discountable: true,
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
              is_tax_inclusive: false,
            },
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_sweater",
              amount: 150,
              code: "PROMOTION_TEST",
              is_tax_inclusive: false,
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
                  attribute: "shipping_methods.shipping_option.id",
                  operator: "in",
                  values: ["express", "standard"],
                },
              ],
            } as any,
          })

          const result = await service.computeActions(["PROMOTION_TEST"], {
            currency_code: "usd",
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            shipping_methods: [
              {
                id: "shipping_method_express",
                subtotal: 500,
                original_total: 500,
                is_discountable: true,
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
                original_total: 100,
                is_discountable: true,
                shipping_option: {
                  id: "standard",
                },
              },
              {
                id: "shipping_method_snail",
                subtotal: 200,
                original_total: 200,
                is_discountable: true,
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
            currency_code: "usd",
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
                original_total: 1000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
              type: "percentage",
              target_type: "items",
              value: 100,
              allocation: "each",
              max_quantity: 100,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "items.product_category.id",
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
          ])
        })

        it("should return empty array when conditions for minimum qty aren't met", async () => {
          const context = {
            currency_code: "usd",
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
                original_total: 1000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "items.product_category.id",
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

        it("should compute fixed amount discount for buyget promotion", async () => {
          const context = {
            currency_code: "usd",
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 1,
                subtotal: 500,
                original_total: 500,
                is_discountable: true,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_1",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 1000,
                original_total: 1000,
                is_discountable: true,
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
              value: 200,
              allocation: "each",
              max_quantity: 1,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "items.product_category.id",
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
              item_id: "item_cotton_tshirt",
              amount: 200,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should cap fixed discount at item price when value exceeds item price", async () => {
          const context = {
            currency_code: "usd",
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 1,
                subtotal: 500,
                original_total: 500,
                is_discountable: true,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_1",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 1000,
                original_total: 1000,
                is_discountable: true,
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
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "items.product_category.id",
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

          // Fixed value 1000 exceeds item price 500, should be capped at 500
          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 500,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should apply fixed discount per unit when apply_to_quantity > 1", async () => {
          const context = {
            currency_code: "usd",
            customer: {
              customer_group: {
                id: "VIP",
              },
            },
            items: [
              {
                id: "item_cotton_tshirt",
                quantity: 3,
                subtotal: 3000,
                original_total: 3000,
                is_discountable: true,
                product_category: {
                  id: "catg_tshirt",
                },
                product: {
                  id: "prod_tshirt_1",
                },
              },
              {
                id: "item_cotton_sweater",
                quantity: 2,
                subtotal: 1000,
                original_total: 1000,
                is_discountable: true,
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
              value: 200,
              allocation: "each",
              max_quantity: 2,
              apply_to_quantity: 2,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "items.product_category.id",
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

          // Fixed value 200 per unit * 2 units = 400 total
          expect(JSON.parse(JSON.stringify(result))).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_cotton_tshirt",
              amount: 400,
              code: "PROMOTION_TEST",
            },
          ])
        })

        it("should compute actions for multiple items when conditions for target qty exceed one item", async () => {
          const context = {
            currency_code: "usd",
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
                original_total: 1000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
              type: "percentage",
              target_type: "items",
              allocation: "each",
              max_quantity: 100,
              value: 100,
              apply_to_quantity: 4,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_tshirt"],
                },
              ],
              buy_rules: [
                {
                  attribute: "items.product_category.id",
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
            currency_code: "usd",
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
                original_total: 1000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
                original_total: 2000,
                is_discountable: true,
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
              max_quantity: 4,
              apply_to_quantity: 4,
              buy_rules_min_quantity: 1,
              target_rules: [
                {
                  attribute: "items.product_category.id",
                  operator: "eq",
                  values: ["catg_not-found"],
                },
              ],
              buy_rules: [
                {
                  attribute: "items.product_category.id",
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

        describe("when scenario is buy x get x", () => {
          let buyXGetXPromotion
          let product1 = "prod_tshirt_1"
          let product2 = "prod_tshirt_2"

          beforeEach(async () => {
            buyXGetXPromotion = await createDefaultPromotion(service, {
              type: PromotionType.BUYGET,
              application_method: {
                type: "percentage",
                target_type: "items",
                value: 100,
                allocation: "each",
                max_quantity: 2,
                apply_to_quantity: 2,
                buy_rules_min_quantity: 2,
                target_rules: [
                  {
                    attribute: "items.product.id",
                    operator: "eq",
                    values: [product1],
                  },
                ],
                buy_rules: [
                  {
                    attribute: "items.product.id",
                    operator: "eq",
                    values: [product1],
                  },
                ],
              } as any,
            })
          })

          it("should compute adjustment accurately for a single item", async () => {
            const context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 4,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
                {
                  id: "item_cotton_tshirt2",
                  quantity: 2,
                  subtotal: 2000,
                  original_total: 2000,
                  is_discountable: true,
                  product: { id: product2 },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 500,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should handle 2+1 free promotion correctly for same product", async () => {
            const twoGetOneFreePromotion = await createDefaultPromotion(
              service,
              {
                code: "2PLUS1FREE",
                type: PromotionType.BUYGET,
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  value: 100,
                  allocation: "each",
                  max_quantity: 10, // Allow multiple applications
                  apply_to_quantity: 1,
                  buy_rules_min_quantity: 2,
                  target_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                  buy_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                } as any,
              }
            )

            // Test with 2 items - should get no promotion (need at least 3 for 2+1)
            let context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 2,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            let result = await service.computeActions(
              [twoGetOneFreePromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([])

            // Test with 3 items - should get 1 free
            context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 3,
                  subtotal: 1500,
                  original_total: 1500,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            result = await service.computeActions(
              [twoGetOneFreePromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 500, // 1 item * (1500/3) = 500
                code: "2PLUS1FREE",
              },
            ])

            // Test with 5 items - should get 1 free (not 2, as you need 6 for 2 free)
            context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 5,
                  subtotal: 2500,
                  original_total: 2500,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            result = await service.computeActions(
              [twoGetOneFreePromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 500, // 1 item * (2500/5) = 500
                code: "2PLUS1FREE",
              },
            ])

            // Test with 6 items - should get 2 free
            context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 6,
                  subtotal: 3000,
                  original_total: 3000,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            result = await service.computeActions(
              [twoGetOneFreePromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 1000, // 2 items * (3000/6) = 1000
                code: "2PLUS1FREE",
              },
            ])
          })

          it("should handle multiple 2+1 free promotions correctly for same product", async () => {
            // Apply 2+1 free promotion on the same product to a maximum of 2 items
            const firstTwoGetOneFreePromotion = await createDefaultPromotion(
              service,
              {
                code: "FIRST2PLUS1FREE",
                type: PromotionType.BUYGET,
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  value: 100,
                  allocation: "each",
                  max_quantity: 2,
                  apply_to_quantity: 1,
                  buy_rules_min_quantity: 2,
                  target_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                  buy_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                } as any,
              }
            )

            // Apply 2+1 free promotion on the same product to a maximum of 1 item
            const secondTwoGetOneFreePromotion = await createDefaultPromotion(
              service,
              {
                code: "SECOND2PLUS1FREE",
                type: PromotionType.BUYGET,
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  value: 100,
                  allocation: "each",
                  max_quantity: 1,
                  apply_to_quantity: 1,
                  buy_rules_min_quantity: 2,
                  target_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                  buy_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                } as any,
              }
            )

            // Test with 3 items - should get 1 free from first promotion (2 buy + 1 target)
            let context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 3,
                  subtotal: 1500,
                  original_total: 1500,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            let result = await service.computeActions(
              [
                firstTwoGetOneFreePromotion.code!,
                secondTwoGetOneFreePromotion.code!,
              ],
              context
            )

            // Only first promotion should apply (3 items: 2 buy + 1 target = 3, no items left for second)
            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 500, // 1 item * (1500/3) = 500
                code: "FIRST2PLUS1FREE",
              },
            ])

            // Test with 6 items - should get 2 free total (2 from first promotion and 1 from second promotion)
            context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 6,
                  subtotal: 3000,
                  original_total: 3000,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            result = await service.computeActions(
              [
                firstTwoGetOneFreePromotion.code!,
                secondTwoGetOneFreePromotion.code!,
              ],
              context
            )

            // Both promotions should apply: 6 items allows for 2 applications from first promotion and 1 from second promotion
            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 1000, // 2 item * (3000/6) = 1000
                code: "FIRST2PLUS1FREE",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 500, // 1 item * (3000/6) = 500
                code: "SECOND2PLUS1FREE",
              },
            ])

            // Test with 7 items - should still get 2 free total (not 3) (2 from first promotion and 1 from second promotion)
            context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 7,
                  subtotal: 3500,
                  original_total: 3500,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            result = await service.computeActions(
              [
                firstTwoGetOneFreePromotion.code!,
                secondTwoGetOneFreePromotion.code!,
              ],
              context
            )

            // 7 items: first promotion uses 3 (2+1), second uses 3 (2+1), 1 item left over (2 from first promotion and 1 from second promotion)
            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 1000, // 2 item * (3500/7) = 1000
                code: "FIRST2PLUS1FREE",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 500, // 1 item * (3500/7) = 500
                code: "SECOND2PLUS1FREE",
              },
            ])

            // Test with 9 items - should get 3 free total (2 from first promotion and 1 from second promotion)
            context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 9,
                  subtotal: 4500,
                  original_total: 4500,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            result = await service.computeActions(
              [
                firstTwoGetOneFreePromotion.code!,
                secondTwoGetOneFreePromotion.code!,
              ],
              context
            )

            // 9 items: first promotion can apply twice (6 items), second once (3 items) (2 from first promotion and 1 from second promotion)
            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 1000, // 2 items * (4500/9) = 1000
                code: "FIRST2PLUS1FREE",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 500, // 1 item * (4500/9) = 500
                code: "SECOND2PLUS1FREE",
              },
            ])

            context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 1000,
                  subtotal: 500000,
                  original_total: 500000,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            result = await service.computeActions(
              [
                firstTwoGetOneFreePromotion.code!,
                secondTwoGetOneFreePromotion.code!,
              ],
              context
            )

            // 1000 items: first promotion can apply twice (6 items), second once (3 items) (2 from first promotion and 1 from second promotion)
            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 1000, // 2 items * (4500/9) = 1000
                code: "FIRST2PLUS1FREE",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 500, // 1 item * (4500/9) = 500
                code: "SECOND2PLUS1FREE",
              },
            ])
          })

          it("should compute adjustment accurately for a single item when multiple buyget promos are applied", async () => {
            const buyXGetXPromotionBulk1 = await createDefaultPromotion(
              service,
              {
                code: "BUY50GET1000",
                type: PromotionType.BUYGET,
                campaign_id: undefined,
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  value: 100,
                  allocation: "each",
                  max_quantity: 1000,
                  apply_to_quantity: 1000,
                  buy_rules_min_quantity: 50,
                  target_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                  buy_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                } as any,
              }
            )

            const buyXGetXPromotionBulk2 = await createDefaultPromotion(
              service,
              {
                code: "BUY10GET200",
                type: PromotionType.BUYGET,
                campaign_id: undefined,
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  value: 20,
                  allocation: "each",
                  max_quantity: 20,
                  apply_to_quantity: 20,
                  buy_rules_min_quantity: 10,
                  target_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                  buy_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                } as any,
              }
            )

            const context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1080,
                  subtotal: 2700,
                  original_total: 2700,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotionBulk1.code!, buyXGetXPromotionBulk2.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 2500,
                code: "BUY50GET1000",
              },
              {
                action: "addItemAdjustment",
                amount: 10,
                code: "BUY10GET200",
                item_id: "item_cotton_tshirt",
              },
            ])
          })

          it("should compute adjustment accurately for multiple items when multiple buyget promos are applied", async () => {
            const buyXGetXPromotionBulk1 = await createDefaultPromotion(
              service,
              {
                code: "BUY50GET1000",
                type: PromotionType.BUYGET,
                campaign_id: undefined,
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  value: 100,
                  allocation: "each",
                  max_quantity: 1000,
                  apply_to_quantity: 1000,
                  buy_rules_min_quantity: 50,
                  target_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                  buy_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                } as any,
              }
            )

            const buyXGetXPromotionBulk2 = await createDefaultPromotion(
              service,
              {
                code: "BUY10GET200",
                type: PromotionType.BUYGET,
                campaign_id: undefined,
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  value: 20,
                  allocation: "each",
                  max_quantity: 20,
                  apply_to_quantity: 20,
                  buy_rules_min_quantity: 10,
                  target_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                  buy_rules: [
                    {
                      attribute: "items.product.id",
                      operator: "eq",
                      values: [product1],
                    },
                  ],
                } as any,
              }
            )

            const context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 540,
                  subtotal: 1350,
                  original_total: 1350,
                  is_discountable: true,
                  product: { id: product1 },
                },
                {
                  id: "item_cotton_tshirt2",
                  quantity: 540,
                  subtotal: 1350,
                  original_total: 1350,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotionBulk1.code!, buyXGetXPromotionBulk2.code!],
              context
            )

            const serializedResult = JSON.parse(JSON.stringify(result))

            expect(serializedResult).toHaveLength(3)
            expect(serializedResult).toEqual(
              expect.arrayContaining([
                {
                  action: "addItemAdjustment",
                  item_id: "item_cotton_tshirt2",
                  amount: 1225,
                  code: "BUY50GET1000",
                },
                {
                  action: "addItemAdjustment",
                  item_id: "item_cotton_tshirt",
                  amount: 1275,
                  code: "BUY50GET1000",
                },
                {
                  action: "addItemAdjustment",
                  item_id: "item_cotton_tshirt2",
                  amount: 10,
                  code: "BUY10GET200",
                },
              ])
            )
          })

          it("should apply buyget promotion multiple times until eligible quantity is exhausted", async () => {
            const buyProductId = "item_cotton_tshirt"
            const getProductId = "item_cotton_tshirt2"

            const buyXGetXPromotion = await createDefaultPromotion(service, {
              code: "TEST_BUYGET_PROMOTION",
              type: PromotionType.BUYGET,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: false,
              is_automatic: false,
              application_method: {
                allocation: "each",
                value: 100,
                max_quantity: 100,
                type: "percentage",
                target_type: "items",
                apply_to_quantity: 1,
                buy_rules_min_quantity: 2,
                target_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [getProductId],
                  },
                ],
                buy_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyProductId],
                  },
                ],
              },
            })

            const buyXGetXPromotion2 = await createDefaultPromotion(service, {
              code: "TEST_BUYGET_PROMOTION_2",
              type: PromotionType.BUYGET,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: false,
              is_automatic: false,
              application_method: {
                allocation: "each",
                value: 100,
                type: "percentage",
                target_type: "items",
                apply_to_quantity: 1,
                max_quantity: 100,
                buy_rules_min_quantity: 1,
                target_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [getProductId],
                  },
                ],
                buy_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyProductId],
                  },
                ],
              },
            })

            const context = {
              currency_code: "usd",
              items: [
                {
                  id: getProductId,
                  quantity: 11,
                  subtotal: 2750,
                  original_total: 2750,
                  is_discountable: true,
                  product: { id: getProductId },
                },
                {
                  id: buyProductId,
                  quantity: 11,
                  subtotal: 2750,
                  original_total: 2750,
                  is_discountable: true,
                  product: { id: buyProductId },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!, buyXGetXPromotion2.code!],
              context
            )

            const serializedResult = JSON.parse(JSON.stringify(result))

            // The first promotion should apply until eligible quantities are exhausted (buy 2 get 1)
            // The second promotion should apply to the remaining quantity (buy 1 get 1)
            expect(serializedResult).toHaveLength(2)
            expect(serializedResult).toEqual(
              expect.arrayContaining([
                {
                  action: "addItemAdjustment",
                  item_id: getProductId,
                  amount: 1250,
                  code: buyXGetXPromotion.code!,
                },
                {
                  action: "addItemAdjustment",
                  item_id: "item_cotton_tshirt2",
                  amount: 250,
                  code: "TEST_BUYGET_PROMOTION_2",
                },
              ])
            )
          })

          it("should apply buyget promotion multiple times until max quantity is reached", async () => {
            const buyProductId = "item_cotton_tshirt"
            const getProductId = "item_cotton_tshirt2"

            const buyXGetXPromotion = await createDefaultPromotion(service, {
              code: "TEST_BUYGET_PROMOTION",
              type: PromotionType.BUYGET,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: false,
              is_automatic: false,
              application_method: {
                allocation: "each",
                value: 100,
                type: "percentage",
                target_type: "items",
                apply_to_quantity: 1,
                max_quantity: 2,
                buy_rules_min_quantity: 2,
                target_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [getProductId],
                  },
                ],
                buy_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyProductId],
                  },
                ],
              },
            })

            const buyXGetXPromotion2 = await createDefaultPromotion(service, {
              code: "TEST_BUYGET_PROMOTION_2",
              type: PromotionType.BUYGET,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: false,
              is_automatic: false,
              application_method: {
                allocation: "each",
                value: 100,
                type: "percentage",
                target_type: "items",
                apply_to_quantity: 1,
                max_quantity: 1,
                buy_rules_min_quantity: 1,
                target_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [getProductId],
                  },
                ],
                buy_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyProductId],
                  },
                ],
              },
            })

            const context = {
              currency_code: "usd",
              items: [
                {
                  id: getProductId,
                  quantity: 11,
                  subtotal: 2750,
                  original_total: 2750,
                  is_discountable: true,
                  product: { id: getProductId },
                },
                {
                  id: buyProductId,
                  quantity: 11,
                  subtotal: 2750,
                  original_total: 2750,
                  is_discountable: true,
                  product: { id: buyProductId },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!, buyXGetXPromotion2.code!],
              context
            )

            const serializedResult = JSON.parse(JSON.stringify(result))

            expect(serializedResult).toHaveLength(2)
            expect(serializedResult).toEqual(
              expect.arrayContaining([
                {
                  action: "addItemAdjustment",
                  item_id: getProductId,
                  amount: 500,
                  code: buyXGetXPromotion.code!,
                },
                {
                  action: "addItemAdjustment",
                  item_id: getProductId,
                  amount: 250,
                  code: "TEST_BUYGET_PROMOTION_2",
                },
              ])
            )
          })

          it("should apply buyget promotion multiple times until eligible quantity is exhausted on a single item", async () => {
            const buyAndGetProductId = "item_cotton_tshirt"

            const buyXGetXPromotion = await createDefaultPromotion(service, {
              code: "TEST_BUYGET_PROMOTION",
              type: PromotionType.BUYGET,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: false,
              is_automatic: false,
              application_method: {
                allocation: "each",
                value: 100,
                max_quantity: 100,
                type: "percentage",
                target_type: "items",
                apply_to_quantity: 1,
                buy_rules_min_quantity: 2,
                target_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyAndGetProductId],
                  },
                ],
                buy_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyAndGetProductId],
                  },
                ],
              },
            })

            const context = {
              currency_code: "usd",
              items: [
                {
                  id: buyAndGetProductId,
                  quantity: 10,
                  subtotal: 2500,
                  original_total: 2500,
                  is_discountable: true,
                  product: { id: buyAndGetProductId },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!],
              context
            )

            const serializedResult = JSON.parse(JSON.stringify(result))

            expect(serializedResult).toHaveLength(1)
            // Should apply buy get promotion 3 times to the same item
            // Total eligible quantity is 10
            // After first application, (10 - 3 [2 buy + 1 get]) = 7 (eligible) - 250
            // After second application, (7 - 3 [2 buy + 1 get]) = 4 (eligible) - 250
            // After third application, (4 - 3 [2 buy + 1 get]) = 1 (eligible) - 250
            // Fourth application, not eligible as it requires atleast 2 eligible items to buy and 1 eligible item to get
            expect(serializedResult).toEqual(
              expect.arrayContaining([
                {
                  action: "addItemAdjustment",
                  item_id: buyAndGetProductId,
                  amount: 750,
                  code: buyXGetXPromotion.code!,
                },
              ])
            )
          })

          it("should apply buyget promotion multiple times until max quantity is reached on a single item", async () => {
            const buyAndGetProductId = "item_cotton_tshirt"

            const buyXGetXPromotion = await createDefaultPromotion(service, {
              code: "TEST_BUYGET_PROMOTION",
              type: PromotionType.BUYGET,
              status: PromotionStatus.ACTIVE,
              is_tax_inclusive: false,
              is_automatic: false,
              application_method: {
                allocation: "each",
                value: 100,
                max_quantity: 2,
                type: "percentage",
                target_type: "items",
                apply_to_quantity: 1,
                buy_rules_min_quantity: 2,
                target_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyAndGetProductId],
                  },
                ],
                buy_rules: [
                  {
                    operator: "eq",
                    attribute: "items.product.id",
                    values: [buyAndGetProductId],
                  },
                ],
              },
            })

            const context = {
              currency_code: "usd",
              items: [
                {
                  id: buyAndGetProductId,
                  quantity: 10,
                  subtotal: 2500,
                  original_total: 2500,
                  is_discountable: true,
                  product: { id: buyAndGetProductId },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!],
              context
            )

            const serializedResult = JSON.parse(JSON.stringify(result))
            expect(serializedResult).toHaveLength(1)
            // Should apply buy get promotion 2 times (max quantity) to the same item
            // Total eligible quantity is 10
            // After first application, (10 - 2 [2 buy + 1 get]) = 8 (eligible) - 250
            // After second application, (8 - 2 [2 buy + 1 get]) = 6 (eligible) - 250
            // Third application, not eligible it exceeds max quantity
            expect(serializedResult).toEqual(
              expect.arrayContaining([
                {
                  action: "addItemAdjustment",
                  item_id: buyAndGetProductId,
                  amount: 500,
                  code: buyXGetXPromotion.code!,
                },
              ])
            )
          })

          it("should compute adjustment accurately across items", async () => {
            const context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 500,
                  original_total: 500,
                  product: { id: product1 },
                  is_discountable: true,
                },
                {
                  id: "item_cotton_tshirt1",
                  quantity: 1,
                  subtotal: 500,
                  original_total: 500,
                  product: { id: product1 },
                  is_discountable: true,
                },
                {
                  id: "item_cotton_tshirt2",
                  quantity: 1,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
                {
                  id: "item_cotton_tshirt3",
                  quantity: 1,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt1",
                amount: 500,
                code: "PROMOTION_TEST",
              },
              {
                action: "addItemAdjustment",
                item_id: "item_cotton_tshirt",
                amount: 500,
                code: "PROMOTION_TEST",
              },
            ])
          })

          it("should not compute adjustment when required quantity for target isn't met", async () => {
            const context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 3,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([])
          })

          it("should not compute adjustment when required quantity for target isn't met across items", async () => {
            const context = {
              currency_code: "usd",
              items: [
                {
                  id: "item_cotton_tshirt",
                  quantity: 1,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
                {
                  id: "item_cotton_tshirt1",
                  quantity: 1,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
                {
                  id: "item_cotton_tshirt2",
                  quantity: 1,
                  subtotal: 1000,
                  original_total: 1000,
                  is_discountable: true,
                  product: { id: product1 },
                },
              ],
            }

            const result = await service.computeActions(
              [buyXGetXPromotion.code!],
              context
            )

            expect(JSON.parse(JSON.stringify(result))).toEqual([])
          })
        })
      })

      describe("when promotion allocation is once", () => {
        describe("when application type is fixed", () => {
          it("should apply promotion to lowest priced items first and respect max_quantity limit across all items", async () => {
            await createDefaultPromotion(service, {
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "once",
                value: 10,
                max_quantity: 2,
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              items: [
                {
                  id: "item_expensive",
                  quantity: 3,
                  subtotal: 300, // $100/unit
                },
                {
                  id: "item_cheap",
                  quantity: 5,
                  subtotal: 250, // $50/unit - lowest price, should get discount first
                },
                {
                  id: "item_medium",
                  quantity: 2,
                  subtotal: 150, // $75/unit
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cheap",
                amount: 20, // 2 units * $10
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
            ])
          })

          it("should distribute across items when max_quantity exceeds first item quantity", async () => {
            await createDefaultPromotion(service, {
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "once",
                value: 5,
                max_quantity: 4,
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              items: [
                {
                  id: "item_a",
                  quantity: 2,
                  subtotal: 100, // $50/unit
                },
                {
                  id: "item_b",
                  quantity: 3,
                  subtotal: 180, // $60/unit
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_a",
                amount: 10, // 2 units * $5
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_b",
                amount: 10, // 2 units * $5 (remaining quota)
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
            ])
          })

          it("should apply to only one item when max_quantity is 1", async () => {
            await createDefaultPromotion(service, {
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "once",
                value: 10,
                max_quantity: 1,
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              items: [
                {
                  id: "item_1",
                  quantity: 3,
                  subtotal: 90, // $30/unit - lowest
                },
                {
                  id: "item_2",
                  quantity: 2,
                  subtotal: 100, // $50/unit
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_1",
                amount: 10, // 1 unit * $10
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
            ])
          })
        })

        describe("when application type is percentage", () => {
          it("should apply percentage discount to lowest priced items first", async () => {
            await createDefaultPromotion(service, {
              application_method: {
                type: "percentage",
                target_type: "items",
                allocation: "once",
                value: 20,
                max_quantity: 3,
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              items: [
                {
                  id: "item_expensive",
                  quantity: 5,
                  subtotal: 500, // $100/unit
                },
                {
                  id: "item_cheap",
                  quantity: 4,
                  subtotal: 200, // $50/unit - lowest price
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_cheap",
                amount: 30, // 3 units * $50 * 20% = $30
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
            ])
          })

          it("should distribute percentage discount across multiple items when max_quantity exceeds first item quantity", async () => {
            await createDefaultPromotion(service, {
              application_method: {
                type: "percentage",
                target_type: "items",
                allocation: "once",
                value: 25,
                max_quantity: 5,
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              items: [
                {
                  id: "item_a",
                  quantity: 2,
                  subtotal: 100, // $50/unit - cheapest
                },
                {
                  id: "item_b",
                  quantity: 3,
                  subtotal: 180, // $60/unit - second cheapest
                },
                {
                  id: "item_c",
                  quantity: 4,
                  subtotal: 400, // $100/unit - most expensive
                },
              ],
            })

            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_a",
                amount: 25, // 2 units * $50 * 25% = $25
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
              {
                action: "addItemAdjustment",
                item_id: "item_b",
                amount: 45, // 3 units * $60 * 25% = $45 (remaining quota)
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
            ])
          })
        })

        describe("with target rules", () => {
          it("should only apply to items matching target rules and respect once allocation", async () => {
            await createDefaultPromotion(service, {
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "once",
                value: 15,
                max_quantity: 2,
                target_rules: [
                  {
                    attribute: "items.product_category.id",
                    operator: "eq",
                    values: ["catg_electronics"],
                  },
                ],
              } as any,
            })

            const result = await service.computeActions(["PROMOTION_TEST"], {
              currency_code: "usd",
              items: [
                {
                  id: "item_phone",
                  quantity: 3,
                  subtotal: 3000,
                  product_category: { id: "catg_electronics" },
                },
                {
                  id: "item_book",
                  quantity: 5,
                  subtotal: 50, // Cheaper but doesn't match rules
                  product_category: { id: "catg_books" },
                },
                {
                  id: "item_tablet",
                  quantity: 2,
                  subtotal: 1000,
                  product_category: { id: "catg_electronics" },
                },
              ],
            })

            // Should only consider electronics items, and apply to cheapest one (tablet at $500/unit vs phone at $1000/unit)
            expect(JSON.parse(JSON.stringify(result))).toEqual([
              {
                action: "addItemAdjustment",
                item_id: "item_tablet",
                amount: 30, // 2 units * $15
                code: "PROMOTION_TEST",
                is_tax_inclusive: false,
              },
            ])
          })
        })
      })
    })
  },
})
