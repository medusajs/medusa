import { ChangeActionType } from "@medusajs/framework/utils"
import { computeReservationChangesForOrderEdit } from "../compute-reservation-changes"

describe("computeReservationChangesForOrderEdit", () => {
  it("should not touch inventory for a price-only edit on a fully fulfilled line", () => {
    // Order originally had quantity 2, fully fulfilled. The edit only
    // changes unit_price, so the preview's quantity for this item is
    // unchanged from what it was before the edit.
    const refreshedOrder = {
      items: [
        {
          id: "item_1",
          variant_id: "variant_1",
          variant: { id: "variant_1" },
          quantity: 2,
          detail: {
            raw_fulfilled_quantity: { value: "2" },
            fulfilled_quantity: 2,
          },
        },
      ],
    }

    const previousOrderItems = [{ id: "item_1", quantity: 2 }]

    const orderPreview = {
      items: [
        {
          id: "item_1",
          quantity: 2,
          actions: [{ action: ChangeActionType.ITEM_UPDATE }],
        },
      ],
    }

    const result = computeReservationChangesForOrderEdit({
      refreshedOrder,
      previousOrderItems,
      orderPreview,
    })

    expect(result.items).toEqual([])
    expect(result.variants).toEqual([])
    expect(result.toRemoveReservationLineItemIds).toEqual([])
  })

  it("should reserve only the unfulfilled remainder when a line's quantity actually increases", () => {
    // Quantity increased from 2 to 5 (3 already fulfilled). Only the
    // unfulfilled remainder (5 - 3 = 2) should be reserved, not the full
    // new quantity of 5.
    const refreshedOrder = {
      items: [
        {
          id: "item_1",
          variant_id: "variant_1",
          variant: { id: "variant_1" },
          quantity: 5,
          detail: {
            raw_fulfilled_quantity: { value: "3" },
            fulfilled_quantity: 3,
          },
        },
      ],
    }

    const previousOrderItems = [{ id: "item_1", quantity: 2 }]

    const orderPreview = {
      items: [
        {
          id: "item_1",
          quantity: 5,
          actions: [{ action: ChangeActionType.ITEM_UPDATE }],
        },
      ],
    }

    const result = computeReservationChangesForOrderEdit({
      refreshedOrder,
      previousOrderItems,
      orderPreview,
    })

    expect(result.items).toHaveLength(1)
    expect(result.items[0].id).toEqual("item_1")
    expect(result.items[0].variant_id).toEqual("variant_1")
    expect(String(result.items[0].quantity)).toEqual("2")
    expect(result.toRemoveReservationLineItemIds).toEqual(["item_1"])
  })

  it("should reserve the full quantity for a newly added, unfulfilled line", () => {
    const refreshedOrder = {
      items: [
        {
          id: "item_new",
          variant_id: "variant_2",
          variant: { id: "variant_2" },
          quantity: 4,
          detail: {
            raw_fulfilled_quantity: { value: "0" },
            fulfilled_quantity: 0,
          },
        },
      ],
    }

    const previousOrderItems: any[] = []

    const orderPreview = {
      items: [
        {
          id: "item_new",
          quantity: 4,
          actions: [{ action: ChangeActionType.ITEM_ADD }],
        },
      ],
    }

    const result = computeReservationChangesForOrderEdit({
      refreshedOrder,
      previousOrderItems,
      orderPreview,
    })

    expect(result.items).toHaveLength(1)
    expect(result.items[0].id).toEqual("item_new")
    expect(result.items[0].variant_id).toEqual("variant_2")
    expect(String(result.items[0].quantity)).toEqual("4")
    expect(result.toRemoveReservationLineItemIds).toEqual([])
  })

  it("should include a removed item's id so its reservation gets released", () => {
    const refreshedOrder = { items: [] }
    const previousOrderItems = [{ id: "item_removed", quantity: 1 }]
    const orderPreview = { items: [] }

    const result = computeReservationChangesForOrderEdit({
      refreshedOrder,
      previousOrderItems,
      orderPreview,
    })

    expect(result.toRemoveReservationLineItemIds).toEqual(["item_removed"])
    expect(result.items).toEqual([])
  })
})
