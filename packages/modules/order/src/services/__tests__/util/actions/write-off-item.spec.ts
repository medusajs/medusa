import { ChangeActionType } from "@medusajs/framework/utils"
import { VirtualOrder } from "@types"
import { calculateOrderChange } from "../../../../utils"

describe("Action: Write Off Item and Reinstate Item", function () {
  const buildOrder = (writtenOffQuantity: number): VirtualOrder => ({
    id: "order_1",
    items: [
      {
        id: "item_1",
        quantity: 2,
        unit_price: 10,
        compare_at_unit_price: null,
        order_id: "1",

        detail: {
          quantity: 2,
          order_id: "1",
          delivered_quantity: 2,
          shipped_quantity: 2,
          fulfilled_quantity: 2,
          return_requested_quantity: 0,
          return_received_quantity: 0,
          return_dismissed_quantity: 0,
          written_off_quantity: writtenOffQuantity,
        },
      },
    ],
    shipping_methods: [],
    credit_lines: [],
    total: 20,
  })

  const writeOff = (quantity: number) => ({
    action: ChangeActionType.WRITE_OFF_ITEM,
    reference_id: "claim_1",
    details: { reference_id: "item_1", quantity },
  })

  const reinstate = (quantity: number) => ({
    action: ChangeActionType.REINSTATE_ITEM,
    reference_id: "claim_1",
    details: { reference_id: "item_1", quantity },
  })

  it("should write off up to the quantity not yet written off", function () {
    const changes = calculateOrderChange({
      order: buildOrder(1),
      actions: [writeOff(1)],
    })

    expect(
      JSON.parse(JSON.stringify(changes.order.items[0].detail))
    ).toEqual(expect.objectContaining({ written_off_quantity: "2" }))
  })

  it("should not write off an item that was already fully written off", function () {
    expect(() =>
      calculateOrderChange({
        order: buildOrder(2),
        actions: [writeOff(2)],
      })
    ).toThrow("Cannot claim more items than what was ordered.")
  })

  it("should not write off more than the remaining quantity across actions of the same change", function () {
    expect(() =>
      calculateOrderChange({
        order: buildOrder(0),
        actions: [writeOff(2), writeOff(1)],
      })
    ).toThrow("Cannot claim more items than what was ordered.")
  })

  it("should not write off a negative quantity", function () {
    expect(() =>
      calculateOrderChange({
        order: buildOrder(0),
        actions: [writeOff(-3)],
      })
    ).toThrow("Quantity to write-off item item_1 must be greater than 0.")
  })

  it("should not reinstate more than the written off quantity", function () {
    expect(() =>
      calculateOrderChange({
        order: buildOrder(1),
        actions: [reinstate(2)],
      })
    ).toThrow("Cannot unclaim more items than what was claimed.")
  })

  it("should not reinstate a negative quantity", function () {
    expect(() =>
      calculateOrderChange({
        order: buildOrder(2),
        actions: [reinstate(-1)],
      })
    ).toThrow("Quantity to reinstate item item_1 must be greater than 0.")
  })

  it("should reinstate up to the written off quantity", function () {
    const changes = calculateOrderChange({
      order: buildOrder(2),
      actions: [reinstate(2)],
    })

    expect(
      JSON.parse(JSON.stringify(changes.order.items[0].detail))
    ).toEqual(expect.objectContaining({ written_off_quantity: "0" }))
  })
})
