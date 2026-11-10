import {
  ComputedActions,
  MathBN,
  PromotionType,
} from "@medusajs/framework/utils"
import { getComputedActionsForBuyGet } from "../buy-get"

describe("getComputedActionsForBuyGet", () => {
  const rules = [
    {
      attribute: "product.id",
      operator: "in",
      values: [{ value: "prod_1" }, { value: "prod_2" }],
    },
  ]

  const promotion = {
    id: "promo_1",
    code: "BUY3GET1",
    type: PromotionType.BUYGET,
    application_method: {
      type: "percentage",
      target_type: "items",
      value: 100,
      allocation: "each",
      max_quantity: 1,
      apply_to_quantity: 1,
      buy_rules_min_quantity: 3,
      buy_rules: rules,
      target_rules: rules,
    },
  } as any

  const expensiveItem = {
    id: "item_expensive",
    quantity: 1,
    subtotal: 379,
    original_total: 379,
    is_discountable: true,
    product: { id: "prod_1" },
  } as any

  const cheapItem = {
    id: "item_cheap",
    quantity: 3,
    subtotal: 597,
    original_total: 597,
    is_discountable: true,
    product: { id: "prod_2" },
  } as any

  it.each([
    ["expensive line first", [expensiveItem, cheapItem]],
    ["cheap line first", [cheapItem, expensiveItem]],
  ])(
    "should rank eligible lines by unit price when they have different quantities (%s)",
    (_, items) => {
      const result = getComputedActionsForBuyGet(
        promotion,
        items,
        new Map(),
        new Map(),
        new Map()
      )

      expect(
        result.map((action: any) => ({
          ...action,
          amount: MathBN.convert(action.amount).toNumber(),
        }))
      ).toEqual([
        {
          action: ComputedActions.ADD_ITEM_ADJUSTMENT,
          item_id: "item_cheap",
          amount: 199,
          code: "BUY3GET1",
        },
      ])
    }
  )
})
