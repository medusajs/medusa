import type { ExtendedLineItem } from "../order-allocate-items-form"

export function buildLineItem(
  id: string,
  inventory = [{ id: `iitem_${id}`, available: 3, required: 1 }]
) {
  return {
    id,
    title: id,
    product_title: id,
    variant_title: id,
    quantity: 10,
    detail: { fulfilled_quantity: 0 },
    variant: {
      manage_inventory: true,
      inventory: inventory.map((item) => ({
        id: item.id,
        title: item.id,
        location_levels: [
          {
            location_id: "sloc_1",
            available_quantity: item.available,
            stocked_quantity: item.available,
          },
          {
            location_id: "sloc_2",
            available_quantity: 10,
            stocked_quantity: 10,
          },
        ],
      })),
      inventory_items: inventory.map((item) => ({
        inventory_item_id: item.id,
        required_quantity: item.required,
      })),
    },
  } as ExtendedLineItem
}
