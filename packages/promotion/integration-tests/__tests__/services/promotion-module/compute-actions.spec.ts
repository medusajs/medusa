import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Promotion Service: computeActions", () => {
  let service: IPromotionModuleService
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PROMOTION_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("when promotion is for items and allocation is each", () => {
    it("should compute the correct item amendments", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
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
            value: "200",
            max_quantity: 1,
            target_rules: [
              {
                attribute: "product_category.id",
                operator: "eq",
                values: ["catg_cotton"],
              },
            ],
          },
        },
      ])

      const result = await service.computeActions(
        [{ code: "PROMOTION_TEST" }],
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
              unit_price: 100,
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
              unit_price: 150,
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

      expect(result).toEqual([
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
  })

  describe("when promotion is for items and allocation is across", () => {
    it("should compute the correct item amendments", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
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
            value: "200",
            max_quantity: 2,
            target_rules: [
              {
                attribute: "product_category.id",
                operator: "eq",
                values: ["catg_cotton"],
              },
            ],
          },
        },
      ])

      const result = await service.computeActions(
        [{ code: "PROMOTION_TEST" }],
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
              unit_price: 100,
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
              unit_price: 150,
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

      expect(result).toEqual([
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

  describe("when promotion is for shipping_method and allocation is each", () => {
    it("should compute the correct shipping_method amendments", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
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
            value: "200",
            max_quantity: 2,
            target_rules: [
              {
                attribute: "shipping_option.id",
                operator: "in",
                values: ["express", "standard"],
              },
            ],
          },
        },
      ])

      const result = await service.computeActions(
        [{ code: "PROMOTION_TEST" }],
        {
          customer: {
            customer_group: {
              id: "VIP",
            },
          },
          shipping_methods: [
            {
              id: "shipping_method_express",
              unit_price: 250,
              shipping_option: {
                id: "express",
              },
            },
            {
              id: "shipping_method_standard",
              unit_price: 150,
              shipping_option: {
                id: "standard",
              },
            },
            {
              id: "shipping_method_snail",
              unit_price: 200,
              shipping_option: {
                id: "snail",
              },
            },
          ],
        }
      )

      expect(result).toEqual([
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
  })

  describe("when promotion is for shipping_method and allocation is across", () => {
    it("should compute the correct shipping_method amendments", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
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
            value: "200",
            max_quantity: 2,
            target_rules: [
              {
                attribute: "shipping_option.id",
                operator: "in",
                values: ["express", "standard"],
              },
            ],
          },
        },
      ])

      const result = await service.computeActions(
        [{ code: "PROMOTION_TEST" }],
        {
          customer: {
            customer_group: {
              id: "VIP",
            },
          },
          shipping_methods: [
            {
              id: "shipping_method_express",
              unit_price: 500,
              shipping_option: {
                id: "express",
              },
            },
            {
              id: "shipping_method_standard",
              unit_price: 100,
              shipping_option: {
                id: "standard",
              },
            },
            {
              id: "shipping_method_snail",
              unit_price: 200,
              shipping_option: {
                id: "snail",
              },
            },
          ],
        }
      )

      expect(result).toEqual([
        {
          action: "addShippingMethodAdjustment",
          shipping_method_id: "shipping_method_express",
          amount: 167,
          code: "PROMOTION_TEST",
        },
        {
          action: "addShippingMethodAdjustment",
          shipping_method_id: "shipping_method_standard",
          amount: 33,
          code: "PROMOTION_TEST",
        },
      ])
    })
  })

  describe("when promotion is for the entire order", () => {
    it("should compute the correct item amendments", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
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
            value: "200",
            max_quantity: 2,
          },
        },
      ])

      const result = await service.computeActions(
        [{ code: "PROMOTION_TEST" }],
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
              unit_price: 100,
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
              unit_price: 150,
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

      expect(result).toEqual([
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
})
