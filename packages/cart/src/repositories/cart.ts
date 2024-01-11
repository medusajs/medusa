import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Cart } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "../types"

export class CartRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Cart,
  {
    create: CreateCartDTO
  }
>(Cart) {
  async update(
    data: { cart: Cart; update: UpdateCartDTO }[],
    context: Context = {}
  ): Promise<Cart[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const entities = data.map(({ cart, update }) => {
      return manager.assign(cart, update)
    })

    return await super.update(entities, context)
  }
}
