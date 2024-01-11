import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { LineItem } from "@models"
import { UpdateLineItemDTO } from "../types"

export class LineItemRepository extends DALUtils.mikroOrmBaseRepositoryFactory<LineItem>(
  LineItem
) {
  async update(
    data: { lineItem: LineItem; update: UpdateLineItemDTO }[],
    context: Context = {}
  ): Promise<LineItem[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const entities = data.map(({ lineItem, update }) => {
      return manager.assign(lineItem, update)
    })

    manager.persist(entities)

    return entities
  }
}
