import { formatOrder } from "../../../utils/transform-order"

// Minimal raw shape that comes back from the ORM before formatOrder transforms it:
// order.items[] are OrderItem records, each with an `item` property (OrderLineItem).
function makeRawOrder({
  orderItemMetadata,
  lineItemMetadata,
}: {
  orderItemMetadata: Record<string, unknown> | null
  lineItemMetadata: Record<string, unknown> | null
}) {
  return {
    id: "order_1",
    items: [
      {
        // OrderItem (order_item table)
        id: "orditem_1",
        version: 1,
        order_id: "order_1",
        item_id: "ordli_1",
        quantity: 1,
        unit_price: 10,
        compare_at_unit_price: null,
        fulfilled_quantity: 0,
        delivered_quantity: 0,
        shipped_quantity: 0,
        return_requested_quantity: 0,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
        metadata: orderItemMetadata,
        // OrderLineItem (order_line_item table)
        item: {
          id: "ordli_1",
          title: "Test Product",
          unit_price: 10,
          compare_at_unit_price: null,
          quantity: 1,
          metadata: lineItemMetadata,
          tax_lines: [],
          adjustments: [],
        },
      },
    ],
    shipping_methods: [],
    summary: null,
  }
}

// Pass a plain object so toMikroORMEntity returns it as-is with name "Order",
// making isRelatedEntity = false (the normal order retrieval path).
const orderEntity = { name: "Order" }

describe("formatOrder: item metadata resolution", function () {
  it("should fall back to order_line_item metadata when order_item metadata is null", function () {
    const lineItemMetadata = { source: "line_item", key: "value" }

    const rawOrder = makeRawOrder({
      orderItemMetadata: null, // default DB value — not explicitly set
      lineItemMetadata,
    })

    const result = formatOrder(rawOrder, { entity: orderEntity }) as any

    expect(result.items[0].metadata).toEqual(lineItemMetadata)
    expect(result.items[0].line_item_metadata).toEqual(lineItemMetadata)
  })

  it("should use order_item metadata when it has been explicitly set", function () {
    const orderItemMetadata = { source: "order_item", updated: true }
    const lineItemMetadata = { source: "line_item", key: "value" }

    const rawOrder = makeRawOrder({ orderItemMetadata, lineItemMetadata })

    const result = formatOrder(rawOrder, { entity: orderEntity }) as any

    expect(result.items[0].metadata).toEqual(orderItemMetadata)
    expect(result.items[0].line_item_metadata).toEqual(lineItemMetadata)
  })

  it("should use null when both order_item and order_line_item metadata are null", function () {
    const rawOrder = makeRawOrder({
      orderItemMetadata: null,
      lineItemMetadata: null,
    })

    const result = formatOrder(rawOrder, { entity: orderEntity }) as any

    expect(result.items[0].metadata).toBeNull()
    expect(result.items[0].line_item_metadata).toBeNull()
  })

  it("should place the OrderItem record in items[].detail", function () {
    const rawOrder = makeRawOrder({
      orderItemMetadata: null,
      lineItemMetadata: null,
    })

    const result = formatOrder(rawOrder, { entity: orderEntity }) as any
    const item = result.items[0]

    expect(item.detail).toBeDefined()
    expect(item.detail.fulfilled_quantity).toBeDefined()
    expect(item.id).toBe("ordli_1") // top-level id is from OrderLineItem
    expect(item.detail.id).toBe("orditem_1") // detail id is from OrderItem
    expect(item.line_item_metadata).toBeNull()
  })
})
