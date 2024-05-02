import { Context } from "@medusajs/types"
import { InventoryLevel } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { mikroOrmBaseRepositoryFactory } from "@medusajs/utils"

export class InventoryLevelRepository extends mikroOrmBaseRepositoryFactory(
  InventoryLevel
) {
  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<number> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    const [result] = (await manager
      .getKnex()({ il: "inventory_level" })
      .sum("reserved_quantity")
      .whereIn("location_id", locationIds)
      .andWhere("inventory_item_id", inventoryItemId)) as {
      sum: string
    }[]

    return parseInt(result.sum)
  }

  async getAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<number> {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex()

    const [result] = (await knex({
      il: "inventory_level",
    })
      .sum({
        stocked_quantity: "stocked_quantity",
        reserved_quantity: "reserved_quantity",
      })
      .whereIn("location_id", locationIds)
      .andWhere("inventory_item_id", inventoryItemId)) as {
      reserved_quantity: string
      stocked_quantity: string
    }[]

    return (
      parseInt(result.stocked_quantity) - parseInt(result.reserved_quantity)
    )
  }

  async getStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<number> {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex()

    const [result] = (await knex({
      il: "inventory_level",
    })
      .sum({
        stocked_quantity: "stocked_quantity",
      })
      .whereIn("location_id", locationIds)
      .andWhere("inventory_item_id", inventoryItemId)) as {
      stocked_quantity: string
    }[]

    return parseInt(result.stocked_quantity)
  }
}
