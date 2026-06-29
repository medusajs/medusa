import { filterExclusivePromotionActions } from "../exclusive-promotions"

const addItem = (code: string, amount: number, item_id = "item_1") => ({
  action: "addItemAdjustment",
  item_id,
  amount,
  code,
  is_tax_inclusive: false,
})

describe("filterExclusivePromotionActions", () => {
  it("returns actions unchanged when no applied promotion is exclusive", () => {
    const actions = [addItem("A", 20), addItem("B", 50)]
    expect(filterExclusivePromotionActions(actions, new Set())).toEqual(actions)
  })

  it("keeps only the highest-value promotion when an exclusive one is applied", () => {
    const actions = [addItem("A", 20), addItem("B", 50)]
    // A is exclusive, but B yields a bigger discount -> keep B only.
    const result = filterExclusivePromotionActions(actions, new Set(["A"]))
    expect(result).toEqual([addItem("B", 50)])
  })

  it("keeps the exclusive promotion when it is the highest value", () => {
    const actions = [addItem("A", 80), addItem("B", 50)]
    const result = filterExclusivePromotionActions(actions, new Set(["A"]))
    expect(result).toEqual([addItem("A", 80)])
  })

  it("sums a promotion's adjustments across items when comparing", () => {
    const actions = [
      addItem("A", 80, "item_1"), // exclusive, total 80
      addItem("B", 50, "item_1"),
      addItem("B", 50, "item_2"), // B total 100 -> wins
    ]
    const result = filterExclusivePromotionActions(actions, new Set(["A"]))
    expect(result).toEqual([
      addItem("B", 50, "item_1"),
      addItem("B", 50, "item_2"),
    ])
  })

  it("preserves non-adjustment actions (e.g. removals)", () => {
    const removal = { action: "removeItemAdjustment", adjustment_id: "adj_1" }
    const actions = [addItem("A", 20), addItem("B", 50), removal]
    const result = filterExclusivePromotionActions(actions, new Set(["A"]))
    expect(result).toEqual([addItem("B", 50), removal])
  })
})
