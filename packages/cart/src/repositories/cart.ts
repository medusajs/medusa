import { Context, DAL } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Cart } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "../types"

export class CartRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<Cart> = { where: {} },
    context: Context = {}
  ): Promise<Cart[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      Cart,
      findOptions_.where as MikroFilterQuery<Cart>,
      findOptions_.options as MikroOptions<Cart>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Cart> = { where: {} },
    context: Context = {}
  ): Promise<[Cart[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      Cart,
      findOptions_.where as MikroFilterQuery<Cart>,
      findOptions_.options as MikroOptions<Cart>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(Cart, { id: { $in: ids } }, {})
  }

  async create(data: CreateCartDTO[], context: Context = {}): Promise<Cart[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const carts = data.map((cartData) => {
      return manager.create(Cart, cartData)
    })

    manager.persist(carts)

    return carts
  }

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
