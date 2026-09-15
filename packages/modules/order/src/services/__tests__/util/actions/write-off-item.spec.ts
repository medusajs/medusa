import { ChangeActionType } from "@medusajs/framework/utils"
import { VirtualOrder } from "@types"
import { calculateOrderChange } from "../../../../utils"

describe("Action: Write Off Item / Reinstate Item", function () {
  const buildOrder = (): VirtualOrder =>
    ({
      id: "order_1",
      items: [
        {
          id: "item_1",
          quantity: 5,
          unit_price: 10,
          compare_at_unit_price: null,
          order_id: "order_1",

          detail: {
            quantity: 5,
            order_id: "order_1",
            delivered_quantity: 5,
            shipped_quantity: 5,
            fulfilled_quantity: 5,
            return_requested_quantity: 0,
            return_received_quantity: 0,
            return_dismissed_quantity: 0,
            written_off_quantity: 0,
          },
        },
      ],
      shipping_methods: [],
      credit_lines: [],
      total: 50,
    } as unknown as VirtualOrder)

  it("should allow writing off up to the ordered quantity across multiple actions, but not beyond it", function () {
    let order = buildOrder()

    // First claim writes off 3 of the 5 ordered units - well within bounds.
    // calculateOrderChange works off a deep clone of the order it's given,
    // so each step's output order is threaded into the next call, the same
    // way separately-confirmed order changes would each load the order fresh.
    let result = calculateOrderChange({
      order,
      actions: [
        {
          action: ChangeActionType.WRITE_OFF_ITEM,
          details: { reference_id: "item_1", quantity: 3 },
        },
      ],
      options: { addActionReferenceToObject: true },
    })
    order = result.order as VirtualOrder

    expect(String(order.items[0].detail.written_off_quantity)).toEqual("3")

    // A second, later claim tries to write off 2 more. Only 2 units remain
    // un-written-off (5 - 3), so this should still be allowed.
    result = calculateOrderChange({
      order,
      actions: [
        {
          action: ChangeActionType.WRITE_OFF_ITEM,
          details: { reference_id: "item_1", quantity: 2 },
        },
      ],
      options: { addActionReferenceToObject: true },
    })
    order = result.order as VirtualOrder

    expect(String(order.items[0].detail.written_off_quantity)).toEqual("5")

    // A third claim for even 1 more unit must fail - the whole line is
    // already written off, even though 1 is still less than the original
    // ordered quantity of 5.
    expect(() =>
      calculateOrderChange({
        order,
        actions: [
          {
            action: ChangeActionType.WRITE_OFF_ITEM,
            details: { reference_id: "item_1", quantity: 1 },
          },
        ],
        options: { addActionReferenceToObject: true },
      })
    ).toThrow("Cannot claim more items than what was ordered.")
  })

  it("should allow reinstating up to the written-off quantity, but not beyond it", function () {
    const order = buildOrder()
    order.items[0].detail.written_off_quantity = 2

    expect(() =>
      calculateOrderChange({
        order,
        actions: [
          {
            action: ChangeActionType.REINSTATE_ITEM,
            details: { reference_id: "item_1", quantity: 3 },
          },
        ],
        options: { addActionReferenceToObject: true },
      })
    ).toThrow("Cannot unclaim more items than what was ordered.")

    const result = calculateOrderChange({
      order,
      actions: [
        {
          action: ChangeActionType.REINSTATE_ITEM,
          details: { reference_id: "item_1", quantity: 2 },
        },
      ],
      options: { addActionReferenceToObject: true },
    })

    expect(
      String((result.order as VirtualOrder).items[0].detail.written_off_quantity)
    ).toEqual("0")
  })
})
