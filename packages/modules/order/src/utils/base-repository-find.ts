import { Constructor, Context, DAL } from "@medusajs/types"
import { LoadStrategy } from "@mikro-orm/core"
import { Order } from "@models"
import { mapRepositoryToOrderModel } from "."

export function setFindMethods<T>(klass: Constructor<T>, entity: any) {
  klass.prototype.find = async function find(
    this: any,
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<T[]> {
    const manager = this.getActiveManager(context)
    const knex = manager.getKnex()

    const findOptions_ = { ...options } as any
    findOptions_.options ??= {}
    findOptions_.where ??= {}
    findOptions_.populate ??= []

    if (!("strategy" in findOptions_.options)) {
      if (findOptions_.options.limit != null || findOptions_.options.offset) {
        Object.assign(findOptions_.options, {
          strategy: LoadStrategy.SELECT_IN,
        })
      } else {
        Object.assign(findOptions_.options, {
          strategy: LoadStrategy.JOINED,
        })
      }
    }

    const isRelatedEntity = entity !== Order
    const config = mapRepositoryToOrderModel(findOptions_, isRelatedEntity)

    let orderAlias = "o0"
    if (isRelatedEntity) {
      // first relation is always order if the entity is not Order
      config.options.populate.unshift("order")
      orderAlias = "o1"

      config.options.populate.unshift("order.items")
    }

    let defaultVersion = knex.raw(`"${orderAlias}"."version"`)
    const strategy = config.options.strategy ?? LoadStrategy.JOINED
    if (strategy === LoadStrategy.SELECT_IN) {
      const sql = manager
        .qb(Order, "_sub0")
        .select("version")
        .where({ id: knex.raw(`"${orderAlias}"."order_id"`) })
        .getKnexQuery()
        .toString()

      defaultVersion = knex.raw(`(${sql})`)
    }

    const version = config.where.version ?? defaultVersion
    delete config.where?.version

    config.options.populateWhere ??= {}
    const popWhere = config.options.populateWhere

    if (isRelatedEntity) {
      popWhere.order ??= {}
    }

    const orderWhere = isRelatedEntity ? popWhere.order : popWhere

    orderWhere.summary ??= {}
    orderWhere.summary.version = version

    orderWhere.items ??= {}
    orderWhere.items.version = version

    popWhere.shipping_methods ??= {}
    popWhere.shipping_methods.version = version

    if (!config.options.orderBy) {
      config.options.orderBy = { id: "ASC" }
    }

    return await manager.find(entity, config.where, config.options)
  }

  klass.prototype.findAndCount = async function findAndCount(
    this: any,
    findOptions: DAL.FindOptions<T> = { where: {} },
    context: Context = {}
  ): Promise<[T[], number]> {
    const manager = this.getActiveManager(context)
    const knex = manager.getKnex()

    const findOptions_ = { ...findOptions } as any
    findOptions_.options ??= {}
    findOptions_.where ??= {}

    if (!("strategy" in findOptions_.options)) {
      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })
    }

    const isRelatedEntity = entity !== Order
    const config = mapRepositoryToOrderModel(findOptions_, isRelatedEntity)

    let orderAlias = "o0"
    if (isRelatedEntity) {
      // first relation is always order if entity is not Order
      config.options.populate.unshift("order")
      orderAlias = "o1"
    }

    let defaultVersion = knex.raw(`"${orderAlias}"."version"`)
    const strategy = config.options.strategy ?? LoadStrategy.JOINED
    if (strategy === LoadStrategy.SELECT_IN) {
      const sql = manager
        .qb(Order, "_sub0")
        .select("version")
        .where({ id: knex.raw(`"${orderAlias}"."order_id"`) })
        .getKnexQuery()
        .toString()

      defaultVersion = knex.raw(`(${sql})`)
    }

    const version = config.where.version ?? defaultVersion
    delete config.where.version

    config.options.populateWhere ??= {}
    const popWhere = config.options.populateWhere

    if (isRelatedEntity) {
      popWhere.order ??= {}
    }

    const orderWhere = isRelatedEntity ? popWhere.order : popWhere

    orderWhere.summary ??= {}
    orderWhere.summary.version = version

    orderWhere.items ??= {}
    orderWhere.items.version = version

    popWhere.shipping_methods ??= {}
    popWhere.shipping_methods.version = version

    if (!config.options.orderBy) {
      config.options.orderBy = { id: "ASC" }
    }

    return await manager.findAndCount(entity, config.where, config.options)
  }
}
