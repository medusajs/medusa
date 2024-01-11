import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ShippingMethod } from "@models"
import { UpdateShippingMethodDTO } from "@types"

export class ShippingMethodRepository extends DALUtils.mikroOrmBaseRepositoryFactory<ShippingMethod>(
  ShippingMethod
) {
  async update(
    data: { method: ShippingMethod; update: UpdateShippingMethodDTO }[],
    context: Context = {}
  ): Promise<ShippingMethod[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const entities = data.map(({ method, update }) => {
      return manager.assign(method, update)
    })

    manager.persist(entities)

    return entities
  }
}
