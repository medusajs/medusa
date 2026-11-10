import { prepareInventoryUpdate } from "../confirm-receive-return-request"

const buildReturn = (locationLevels: any[]) => ({
  location_id: "sl_1",
  items: [
    {
      item: {
        variant: {
          id: "pv_1",
          manage_inventory: true,
          inventory_items: [
            {
              inventory_item_id: "ii_1",
              variant_id: "pv_1",
              required_quantity: 2,
              inventory: [
                {
                  location_levels: locationLevels,
                },
              ],
            },
          ],
        },
      },
    },
  ],
})

describe("prepareInventoryUpdate", () => {
  it("should adjust the inventory when the variant is stocked at the return location", () => {
    const adjustments = prepareInventoryUpdate({
      orderReturn: buildReturn([{ location_id: "sl_1" }]),
      returnedQuantityMap: { pv_1: 3 },
    })

    expect(adjustments).toHaveLength(1)
    expect(adjustments[0]).toMatchObject({
      inventory_item_id: "ii_1",
      location_id: "sl_1",
    })
    expect(adjustments[0].adjustment.toString()).toEqual("6")
  })

  it("should throw if a managed variant is not stocked at the return location", () => {
    expect(() =>
      prepareInventoryUpdate({
        orderReturn: buildReturn([{ location_id: "sl_2" }]),
        returnedQuantityMap: { pv_1: 3 },
      })
    ).toThrow(`Cannot receive the Return at location sl_1`)
  })

  it("should throw if a managed variant has no location levels at all", () => {
    expect(() =>
      prepareInventoryUpdate({
        orderReturn: buildReturn([]),
        returnedQuantityMap: { pv_1: 3 },
      })
    ).toThrow(`Cannot receive the Return at location sl_1`)
  })

  it("should not throw for a variant that is not managed", () => {
    const orderReturn = buildReturn([])
    orderReturn.items[0].item.variant.manage_inventory = false

    expect(
      prepareInventoryUpdate({ orderReturn, returnedQuantityMap: {} })
    ).toEqual([])
  })
})
