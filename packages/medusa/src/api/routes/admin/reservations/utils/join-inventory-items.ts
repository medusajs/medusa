import { EntityManager } from "typeorm"
import { ExtendedReservationItem } from ".."
import { IInventoryService } from "@medusajs/types"

export const joinInventoryItems = async (
  reservations: ExtendedReservationItem[],
  dependencies: {
    inventoryService: IInventoryService
    manager: EntityManager
  }
): Promise<ExtendedReservationItem[]> => {
  const [inventoryItems] =
    await dependencies.inventoryService.listInventoryItems(
      {
        id: reservations.map((r) => r.inventory_item_id),
      },
      {},
      {
        transactionManager: dependencies.manager,
      }
    )

  const inventoryItemMap = new Map(inventoryItems.map((i) => [i.id, i]))

  return reservations.map((reservation) => {
    reservation.inventory_item = inventoryItemMap.get(
      reservation.inventory_item_id
    )

    return reservation
  })
}
