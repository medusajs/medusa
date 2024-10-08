import { buildEventNamesFromEntityName } from "../utils"

describe("MessageAggregator", function () {
  afterEach(() => {
    jest.resetAllMocks
  })

  it("should create event names from entity", function () {
    const eventBaseNames: ["inventoryItem", "reservationItem"] = [
      "inventoryItem",
      "reservationItem",
    ]

    const InventoryEvents = buildEventNamesFromEntityName(
      eventBaseNames,
      "inventory"
    )

    expect(InventoryEvents).toEqual({
      INVENTORY_ITEM_CREATED: "inventory.inventory-item.created",
      INVENTORY_ITEM_UPDATED: "inventory.inventory-item.updated",
      INVENTORY_ITEM_DELETED: "inventory.inventory-item.deleted",
      INVENTORY_ITEM_RESTORED: "inventory.inventory-item.restored",
      INVENTORY_ITEM_ATTACHED: "inventory.inventory-item.attached",
      INVENTORY_ITEM_DETACHED: "inventory.inventory-item.detached",
      RESERVATION_ITEM_CREATED: "inventory.reservation-item.created",
      RESERVATION_ITEM_UPDATED: "inventory.reservation-item.updated",
      RESERVATION_ITEM_DELETED: "inventory.reservation-item.deleted",
      RESERVATION_ITEM_RESTORED: "inventory.reservation-item.restored",
      RESERVATION_ITEM_ATTACHED: "inventory.reservation-item.attached",
      RESERVATION_ITEM_DETACHED: "inventory.reservation-item.detached",
    })
  })
})
