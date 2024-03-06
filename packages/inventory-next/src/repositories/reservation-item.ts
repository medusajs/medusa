import { Context } from "@medusajs/types"
import { ReservationItem } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { mikroOrmBaseRepositoryFactory } from "@medusajs/utils"

export class ReservationItemRepository extends mikroOrmBaseRepositoryFactory(
  ReservationItem
) {
  // async deleteByLineItemIds(lineItemId: string | string[], context: Context) {
  //   return super
  //   // return manager.getKnex().update({ deleted_at: new Date() })
  //   // console.warn("testing")
  // }

  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<number> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    const result = manager
      .getKnex()({ il: "inventory_level" })
      .sum("il.reserved_quantity")
      .where((q) => {
        q.orWhere("il.inventory_item_id", "=", inventoryItemId)
        q.orWhereIn("il.location_id", locationIds)
      })

    return 0
  }
}
