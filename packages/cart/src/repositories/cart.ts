import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Cart } from "@models"
import { UpdateCartDTO } from "../types"

export class CartRepository extends DALUtils.mikroOrmBaseRepositoryFactory<Cart>(
  Cart
) {
  async update(
    data: { cart: Cart; update: UpdateCartDTO }[],
    context: Context = {}
  ): Promise<Cart[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const entities = data.map(({ cart, update }) => {
      return manager.assign(cart, update)
    })

    manager.persist(entities)

    return entities
  }
}
