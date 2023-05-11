import { IInventoryService, ReservationItemDTO } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { ExtendedReservationItem } from "../list-reservations"

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

  return await Promise.all(
    reservations.map(async (reservation) => {
      reservation.inventory_item = inventoryItemMap.get(
        reservation.inventory_item_id
      )

      return reservation
    })
  )
}
