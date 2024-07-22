import { Context } from "@medusajs/types"
import {
  BigNumber,
  MathBN,
  mikroOrmBaseRepositoryFactory,
} from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InventoryLevel } from "@models"

export class InventoryLevelRepository extends mikroOrmBaseRepositoryFactory(
  InventoryLevel
) {
  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<BigNumber> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    const result = await manager
      .getKnex()({ il: "inventory_level" })
      .select("raw_reserved_quantity")
      .whereIn("location_id", locationIds)
      .andWhere("inventory_item_id", inventoryItemId)
      .andWhereRaw("deleted_at IS NULL")

    return new BigNumber(
      MathBN.sum(...result.map((r) => r.raw_reserved_quantity))
    )
  }

  async getAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<BigNumber> {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex()

    const result = await knex({
      il: "inventory_level",
    })
      .select("raw_stocked_quantity", "raw_reserved_quantity")
      .whereIn("location_id", locationIds)
      .andWhere("inventory_item_id", inventoryItemId)
      .andWhereRaw("deleted_at IS NULL")

    return new BigNumber(
      MathBN.sum(
        ...result.map((r) => {
          return MathBN.sub(r.raw_stocked_quantity, r.raw_reserved_quantity)
        })
      )
    )
  }

  async getStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<BigNumber> {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex()

    const result = await knex({
      il: "inventory_level",
    })
      .select("raw_stocked_quantity")
      .whereIn("location_id", locationIds)
      .andWhere("inventory_item_id", inventoryItemId)
      .andWhereRaw("deleted_at IS NULL")

    return new BigNumber(
      MathBN.sum(...result.map((r) => r.raw_stocked_quantity))
    )
  }
}
