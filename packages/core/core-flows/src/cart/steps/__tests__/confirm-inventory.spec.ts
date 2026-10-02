import { MathBN } from "@medusajs/framework/utils"
import { aggregateConfirmInventoryItems } from "../confirm-inventory"

describe("aggregateConfirmInventoryItems", () => {
  it("sums quantities for items sharing an inventory item", () => {
    const requests = aggregateConfirmInventoryItems([
      {
        inventory_item_id: "iitem_1",
        required_quantity: 1,
        allow_backorder: false,
        quantity: 115,
        location_ids: ["loc_1", "loc_2"],
      },
      {
        inventory_item_id: "iitem_1",
        required_quantity: 12,
        allow_backorder: false,
        quantity: 1,
        location_ids: ["loc_2", "loc_3"],
      },
    ])

    expect(requests).toHaveLength(1)
    expect(requests[0].inventory_item_id).toEqual("iitem_1")
    expect(requests[0].location_ids).toEqual(["loc_1", "loc_2", "loc_3"])
    expect(MathBN.eq(requests[0].quantity, 127)).toBe(true)
  })

  it("skips backorder items and keeps separate inventory items separate", () => {
    const requests = aggregateConfirmInventoryItems([
      {
        inventory_item_id: "iitem_1",
        required_quantity: 1,
        allow_backorder: true,
        quantity: 10,
        location_ids: ["loc_1"],
      },
      {
        inventory_item_id: "iitem_2",
        required_quantity: 2,
        allow_backorder: false,
        quantity: 3,
        location_ids: ["loc_1"],
      },
    ])

    expect(requests).toHaveLength(1)
    expect(requests[0].inventory_item_id).toEqual("iitem_2")
    expect(MathBN.eq(requests[0].quantity, 6)).toBe(true)
  })
})
