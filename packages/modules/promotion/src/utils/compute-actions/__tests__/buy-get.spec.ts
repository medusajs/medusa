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
    } as any)

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
})
