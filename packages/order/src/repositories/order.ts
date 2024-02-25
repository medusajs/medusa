import { Context, DAL } from "@medusajs/types"
import { DALUtils, isDefined } from "@medusajs/utils"
import { LoadStrategy } from "@mikro-orm/core"
import { EntityManager } from "@mikro-orm/postgresql"
import { Order } from "@models"

export class OrderRepository extends DALUtils.mikroOrmBaseRepositoryFactory<Order>(
  Order
) {
  async find(
    options?: DAL.FindOptions<Order>,
    context?: Context
  ): Promise<Order[]> {
    const manager = this.getActiveManager<EntityManager>(context)
    const knex = manager.getKnex()

    const findOptions_ = { ...options } as any
    findOptions_.options ??= {}
    findOptions_.where ??= {}

    if (!("strategy" in findOptions_.options)) {
      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.JOINED,
      })
    }

    const expandDetails = findOptions_.options.populate?.filter((p) =>
      p.includes("items")
    )?.length

    // If no version is specified, we default to the latest version
    if (expandDetails && !isDefined(findOptions_.where.items?.version)) {
      findOptions_.where.items ??= {}
      findOptions_.where.items.version = knex.raw(`"o0"."version"`)
    }

    return await manager.find(Order, findOptions_.where, findOptions_.options)
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Order> = { where: {} },
    context: Context = {}
  ): Promise<[Order[], number]> {
    const manager = this.getActiveManager<EntityManager>(context)
    const knex = manager.getKnex()

    const findOptions_ = { ...findOptions } as any
    findOptions_.options ??= {}
    findOptions_.where ??= {}

    if (!("strategy" in findOptions_.options)) {
      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.JOINED,
      })
    }

    const expandDetails = findOptions_.options.populate?.filter((p) =>
      p.includes("items")
    )?.length

    // If no version is specified, we default to the latest version
    if (expandDetails && !isDefined(findOptions_.where.items?.version)) {
      findOptions_.where.items ??= {}
      findOptions_.where.items.version = knex.raw(`"o0"."version"`)
    }

    return await manager.findAndCount(
      Order,
      findOptions_.where,
      findOptions_.options
    )
  }
}
