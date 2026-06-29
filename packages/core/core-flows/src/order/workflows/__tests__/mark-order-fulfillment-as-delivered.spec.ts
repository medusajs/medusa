import { prepareRegisterDeliveryData } from "../mark-order-fulfillment-as-delivered"

describe("prepareRegisterDeliveryData", () => {
  it("divides the fulfillment-item quantity by its snapshotted required_quantity even when the kit changed (#15868)", () => {
    // Line item qty 1, kit required_quantity 3 -> fulfillment item qty 3, with
    // required_quantity snapshotted at fulfillment creation. The variant's kit
    // was later edited (now points at "iitem_new"), but the snapshot keeps the
    // delivered quantity correct at 1 instead of the raw fulfillment qty (3),
    // which would exceed what was fulfilled and block delivery.
    const order = {
      id: "order_1",
      items: [
        {
          id: "item_1",
          variant: {
            inventory_items: [
              { inventory: { id: "iitem_new" }, required_quantity: 2 },
            ],
          },
        },
      ],
      fulfillments: [
        {
          id: "ful_1",
          items: [
            {
              line_item_id: "item_1",
              inventory_item_id: "iitem_old",
              required_quantity: 3,
              quantity: 3,
            },
          ],
        },
      ],
    } as any

    const result = prepareRegisterDeliveryData({
      fulfillment: { id: "ful_1" } as any,
      order,
    })

    expect(result.items).toHaveLength(1)
    expect(result.items![0].id).toBe("item_1")
    expect(Number(result.items![0].quantity)).toBe(1)
  })

  it("falls back to the current kit's required_quantity for legacy fulfillments without a snapshot", () => {
    // Fulfillment created before the snapshot existed - required_quantity is
    // absent - so the divisor is read from the variant's current kit.
    const order = {
      id: "order_1",
      items: [
        {
          id: "item_1",
          variant: {
            inventory_items: [
              { inventory: { id: "iitem_1" }, required_quantity: 3 },
            ],
          },
        },
      ],
      fulfillments: [
        {
          id: "ful_1",
          items: [
            {
              line_item_id: "item_1",
              inventory_item_id: "iitem_1",
              quantity: 3,
            },
          ],
        },
      ],
    } as any

    const result = prepareRegisterDeliveryData({
      fulfillment: { id: "ful_1" } as any,
      order,
    })

    expect(result.items).toHaveLength(1)
    expect(result.items![0].id).toBe("item_1")
    expect(Number(result.items![0].quantity)).toBe(1)
  })
})
