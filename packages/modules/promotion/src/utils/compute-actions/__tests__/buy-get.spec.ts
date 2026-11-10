import {
  ComputedActions,
  MathBN,
  PromotionType,
} from "@medusajs/framework/utils"
import { getComputedActionsForBuyGet } from "../buy-get"

describe("getComputedActionsForBuyGet", () => {
  const buildPromotion = (buyCategory: string, targetCategories: string[]) =>
    ({
      code: "BUYGET",
      type: "buyget",
      application_method: {
        type: "percentage",
        target_type: "items",
        value: 100,
        allocation: "each",
        max_quantity: 1,
        apply_to_quantity: 1,
        buy_rules_min_quantity: 1,
        buy_rules: [
          {
            attribute: "items.product_category.id",
            operator: "eq",
            values: [{ value: buyCategory }],
          },
        ],
        target_rules: [
          {
            attribute: "items.product_category.id",
            operator: "in",
            values: targetCategories.map((value) => ({ value })),
          },
        ],
      },
    }) as any

  const items = [
    {
      id: "item_discountable",
      quantity: 1,
      subtotal: 1000,
      original_total: 1000,
      is_discountable: true,
      product_category: { id: "catg_discountable" },
    },
    {
      id: "item_not_discountable",
      quantity: 1,
      subtotal: 500,
      original_total: 500,
      is_discountable: false,
      product_category: { id: "catg_not_discountable" },
    },
  ] as any

  it("should not discount a target item that is not discountable", () => {
    const result = getComputedActionsForBuyGet(
      buildPromotion("catg_discountable", ["catg_not_discountable"]),
      items,
      new Map(),
      new Map(),
      new Map()
    )

    expect(JSON.parse(JSON.stringify(result))).toEqual([])
  })

  it("should discount a discountable target bought with an item that is not discountable", () => {
    const result = getComputedActionsForBuyGet(
      buildPromotion("catg_not_discountable", [
        "catg_discountable",
        "catg_not_discountable",
      ]),
      items,
      new Map(),
      new Map(),
      new Map()
    )

    expect(JSON.parse(JSON.stringify(result))).toEqual([
      {
        action: "addItemAdjustment",
        item_id: "item_discountable",
        amount: "1000",
        code: "BUYGET",
      },
    ])
  })

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
