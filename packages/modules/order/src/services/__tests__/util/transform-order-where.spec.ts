import { mapRepositoryToOrderModel } from "../../../utils/transform-order"

describe("mapRepositoryToOrderModel: where remap for order_item fields", () => {
  it("keeps quantity filters on items (order_item) instead of routing to items.item", () => {
    const conf: any = {
      options: { fields: [], populate: [] },
      where: { items: { quantity: { $gt: 5 } } },
    }

    const result = mapRepositoryToOrderModel(conf)

    expect(result.where.items.quantity).toEqual({ $gt: 5 })
    expect(result.where.items.item.quantity).toBeUndefined()
  })

  it.each([
    "fulfilled_quantity",
    "shipped_quantity",
    "delivered_quantity",
    "return_requested_quantity",
    "return_received_quantity",
    "return_dismissed_quantity",
    "written_off_quantity",
  ])(
    "reroutes a filter on items.%s to items (order_item), not items.item",
    (field) => {
      const conf: any = {
        options: { fields: [], populate: [] },
        where: { items: { [field]: 3 } },
      }

      const result = mapRepositoryToOrderModel(conf)

      // the filter must resolve against the order_item join entity, which is
      // where these columns live; leaving it under item targets
      // order_line_item, which has no such column and fails metadata validation
      expect(result.where.items[field]).toBe(3)
      expect(result.where.items.item?.[field]).toBeUndefined()
    }
  )

  it("still routes line-item-only fields like title to items.item", () => {
    const conf: any = {
      options: { fields: [], populate: [] },
      where: { items: { title: "Shirt" } },
    }

    const result = mapRepositoryToOrderModel(conf)

    expect(result.where.items.item.title).toBe("Shirt")
  })

  it("preserves detail handling alongside rerouted order_item fields", () => {
    const conf: any = {
      options: { fields: [], populate: [] },
      where: {
        items: { fulfilled_quantity: 2, detail: { id: "orditem_1" } },
      },
    }

    const result = mapRepositoryToOrderModel(conf)

    expect(result.where.items.fulfilled_quantity).toBe(2)
    expect(result.where.items.id).toBe("orditem_1")
  })
})
