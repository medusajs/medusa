import { throwIfManagedItemsNotStockedAtReturnLocation } from "../order-validation"

const buildOrder = (locationLevels: any[], manageInventory = true) =>
  ({
    items: [
      {
        id: "item_1",
        variant: {
          id: "pv_1",
          manage_inventory: manageInventory,
          inventory_items: [
            {
              inventory_item_id: "ii_1",
              inventory: [
                {
                  location_levels: locationLevels,
                },
              ],
            },
          ],
        },
      },
    ],
  } as any)

const orderReturn = { location_id: "sl_1" } as any
const inputItems = [{ id: "item_1" }] as any

describe("throwIfManagedItemsNotStockedAtReturnLocation", () => {
  it("should not throw when the item is stocked at the return location", () => {
    expect(() =>
      throwIfManagedItemsNotStockedAtReturnLocation({
        order: buildOrder([{ location_id: "sl_1" }]),
        orderReturn,
        inputItems,
      })
    ).not.toThrow()
  })

  it("should throw when the item is stocked at a different location", () => {
    expect(() =>
      throwIfManagedItemsNotStockedAtReturnLocation({
        order: buildOrder([{ location_id: "sl_2" }]),
        orderReturn,
        inputItems,
      })
    ).toThrow(
      `Cannot request item return at location sl_1 for managed inventory items: item_1`
    )
  })

  it("should throw when the item has no location levels at all", () => {
    expect(() =>
      throwIfManagedItemsNotStockedAtReturnLocation({
        order: buildOrder([]),
        orderReturn,
        inputItems,
      })
    ).toThrow(
      `Cannot request item return at location sl_1 for managed inventory items: item_1`
    )
  })

  it("should not throw for items whose variant is not managed", () => {
    expect(() =>
      throwIfManagedItemsNotStockedAtReturnLocation({
        order: buildOrder([], false),
        orderReturn,
        inputItems,
      })
    ).not.toThrow()
  })
})
