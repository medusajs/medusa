import { Constructor, Context, DAL } from "@medusajs/framework/types"
import {
  MikroOrmBaseRepository,
  pruneFindOptionsAgainstMetadata,
  toMikroORMEntity,
} from "@medusajs/framework/utils"
import { LoadStrategy, raw } from "@medusajs/framework/mikro-orm/core"
import {
  Order,
  OrderClaim,
  OrderLineItemAdjustment,
  OrderShippingMethodAdjustment,
} from "@models"

import { mapRepositoryToOrderModel } from "."

function ensureOrderItemFieldsSelection(config: any, isRelatedEntity: boolean) {
  const populate = config.options?.populate ?? []
  const fields = config.options?.fields ?? []

  const hasItemsItemPopulate = populate.some(
    (p: string) =>
      p === "items.item" ||
      p.startsWith("items.item.") ||
      p === "order.items.item" ||
      p.startsWith("order.items.item.")
  )

  if (!hasItemsItemPopulate) {
    return
  }

  const hasOrderItemFields = fields.some((field: string) => {
    if (field === "items.*" || field === "order.items.*") {
      return true
    }

    if (field.startsWith("items.") && !field.startsWith("items.item.")) {
      return true
    }

    if (
      field.startsWith("order.items.") &&
      !field.startsWith("order.items.item.")
    ) {
      return true
    }

    return false
  })

  if (!hasOrderItemFields) {
    fields.push(isRelatedEntity ? "order.items.*" : "items.*")
    config.options.fields = fields
  }
}

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

    if (!("strategy" in findOptions_.options)) {
      if (findOptions_.options.limit != null || findOptions_.options.offset) {
        Object.assign(findOptions_.options, {
          strategy: LoadStrategy.SELECT_IN,
        })
      }
    }

    const isRelatedEntity = entity.name !== Order.name

    const config = mapRepositoryToOrderModel(findOptions_, isRelatedEntity)
    config.options ??= {}
    config.options.populate ??= []

    pruneFindOptionsAgainstMetadata(
      manager.getDriver().getMetadata().get(entity.name),
      config.options
    )

    const strategy = findOptions_.options.strategy ?? LoadStrategy.JOINED
    let orderAlias = "o0"
    if (isRelatedEntity) {
      if (entity === OrderClaim) {
        config.options.populate.push("claim_items")
      }

      if (strategy === LoadStrategy.JOINED) {
        config.options.populate.push("order.shipping_methods")
        config.options.populate.push(
          "order.shipping_methods.shipping_method.adjustments"
        )
        config.options.populate.push("order.summary")
        config.options.populate.push("shipping_methods")
      }

      if (!config.options.populate.includes("order.items")) {
        config.options.populate.unshift("order.items")
      }

      // first relation is always order if the entity is not Order
      const index = config.options.populate.findIndex((p) => p === "order")
      if (index > -1) {
        config.options.populate.splice(index, 1)
      }

      config.options.populate.unshift("order")
      orderAlias = "o1"
    }

    let defaultVersion = knex.raw(`"${orderAlias}"."version"`)

    if (strategy === LoadStrategy.SELECT_IN) {
      const sql = manager
        .qb(toMikroORMEntity(Order), "_sub0")
        .select("version")
        .where({ id: knex.raw(`"${orderAlias}"."order_id"`) })
        .getKnexQuery()
        .toString()

      defaultVersion = knex.raw(`(${sql})`)
    }

    const version = config.where?.version ?? defaultVersion
    delete config.where?.version

    configurePopulateWhere(
      config,
      isRelatedEntity,
      version,
      strategy === LoadStrategy.SELECT_IN,
      manager
    )

    let shouldLoadItemAdjustments = false
    let shouldLoadShippingAdjustments = false
    if (config.options.populate.includes("items.item.adjustments")) {
      // TODO: handle if populate is an object
      shouldLoadItemAdjustments = true

      config.options.populate.splice(
        config.options.populate.indexOf("items.item.adjustments"),
        1
      )

      config.options.populate.push("items")
      config.options.populate.push("items.item")

      // make sure version is loaded if adjustments are requested
      if (config.options.fields?.some((f) => f.includes("items.item."))) {
        config.options.fields.push(
          isRelatedEntity ? "order.items.version" : "items.version"
        )
      }
    }

    if (
      config.options.populate.includes(
        "shipping_methods.shipping_method.adjustments"
      )
    ) {
      // TODO: handle if populate is an object
      shouldLoadShippingAdjustments = true

      config.options.populate.splice(
        config.options.populate.indexOf(
          "shipping_methods.shipping_method.adjustments"
        ),
        1
      )

      config.options.populate.push("shipping_methods")
      config.options.populate.push("shipping_methods.shipping_method")

      if (
        config.options.fields?.some((f) =>
          f.includes("shipping_methods.shipping_method.")
        )
      ) {
        config.options.fields.push(
          isRelatedEntity
            ? "order.shipping_methods.version"
            : "shipping_methods.version"
        )
      }
    }

    if (!config.options.orderBy) {
      config.options.orderBy = { id: "ASC" }
    }

    config.where ??= {}

    if (strategy === LoadStrategy.SELECT_IN) {
      ensureOrderItemFieldsSelection(config, isRelatedEntity)
      MikroOrmBaseRepository.compensateRelationFieldsSelectionFromLoadStrategy({
        findOptions: config,
      })
    }

    const result = await manager.find(this.entity, config.where, config.options)

    if (shouldLoadItemAdjustments || shouldLoadShippingAdjustments) {
      const orders = !isRelatedEntity
        ? [...result]
        : [...result].map((r) => r.order).filter(Boolean)

      if (shouldLoadItemAdjustments) {
        await loadItemAdjustments(manager, orders)
      }

      if (shouldLoadShippingAdjustments) {
        await loadShippingAdjustments(manager, orders)
      }
    }

    return result
  }

  klass.prototype.findAndCount = async function findAndCount(
    this: any,
    findOptions: DAL.FindOptions<T> = { where: {} } as DAL.FindOptions<T>,
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

    const isRelatedEntity = entity.name !== Order.name

    const config = mapRepositoryToOrderModel(findOptions_, isRelatedEntity)
    config.options ??= {}
    config.options.populate ??= []

    pruneFindOptionsAgainstMetadata(
      manager.getDriver().getMetadata().get(entity.name),
      config.options
    )

    let orderAlias = "o0"
    if (isRelatedEntity) {
      if (entity === OrderClaim) {
        if (
          config.options.populate.includes("additional_items") &&
          !config.options.populate.includes("claim_items")
        ) {
          config.options.populate.push("claim_items")
        }
      }

      const index = config.options.populate.findIndex((p) => p === "order")
      if (index > -1) {
        config.options.populate.splice(index, 1)
      }

      config.options.populate.unshift("order")
      orderAlias = "o1"
    }

    let defaultVersion = knex.raw(`"${orderAlias}"."version"`)
    const strategy = config.options.strategy ?? LoadStrategy.JOINED
    if (strategy === LoadStrategy.SELECT_IN) {
      defaultVersion = getVersionSubQuery(manager, orderAlias)
    }

    const version = config.where.version ?? defaultVersion
    delete config.where.version

    let loadAdjustments = false
    if (config.options.populate.includes("items.item.adjustments")) {
      loadAdjustments = true
      config.options.populate.splice(
        config.options.populate.indexOf("items.item.adjustments"),
        1
      )

      config.options.populate.push("items")
      config.options.populate.push("items.item")

      // make sure version is loaded if adjustments are requested
      if (config.options.fields?.some((f) => f.includes("items.item."))) {
        config.options.fields.push(
          isRelatedEntity ? "order.items.version" : "items.version"
        )
      }
    }

    configurePopulateWhere(
      config,
      isRelatedEntity,
      version,
      strategy === LoadStrategy.SELECT_IN,
      manager
    )

    if (!config.options.orderBy) {
      config.options.orderBy = { id: "ASC" }
    }

    if (strategy === LoadStrategy.SELECT_IN) {
      ensureOrderItemFieldsSelection(config, isRelatedEntity)
      MikroOrmBaseRepository.compensateRelationFieldsSelectionFromLoadStrategy({
        findOptions: config,
      })
    }

    // The count query uses JOINED strategy internally (MikroORM 6.6+), but
    // populateWhere version subqueries reference SELECT_IN aliases (e.g. "o0")
    // that don't exist in the JOINED count context. Since version filters only
    // control which items to load (not which root entities to count), we run
    // find and count separately with different populateWhere options.
    const countOptions = { ...config.options, populateWhere: undefined }
    const [result, count] = await Promise.all([
      manager.find(this.entity, config.where, config.options),
      manager.count(this.entity, config.where, countOptions),
    ])

    if (loadAdjustments) {
      const orders = !isRelatedEntity
        ? [...result]
        : [...result].map((r) => r.order).filter(Boolean)

      await loadItemAdjustments(manager, orders)
    }

    return [result, count]
  }
}

/**
 * Load adjustment for the latest items/order version
 * @param manager MikroORM manager
 * @param orders Orders to load adjustments for
 */
async function loadItemAdjustments(manager, orders) {
  const items = orders.flatMap((r) => [...(r.items ?? [])])
  const itemsIdMap = new Map<string, any>(items.map((i) => [i.item.id, i.item]))

  if (!items.length) {
    return
  }

  const params = items.map((i) => {
    // preinitialise all items so an empty array is returned for ones without adjustments
    if (!i.item.adjustments.isInitialized()) {
      i.item.adjustments.initialized = true
    }

    if (!i.version) {
      throw new Error("Item version is required to load adjustments")
    }
    return {
      item_id: i.item.id,
      version: i.version,
    }
  })

  const adjustments = await manager.find(OrderLineItemAdjustment, {
    $or: params,
  })

  for (const adjustment of adjustments) {
    const item = itemsIdMap.get(adjustment.item_id)
    if (item) {
      item.adjustments.add(adjustment)
    }
  }
}

/**
 * Load adjustment for the latest shipping methods/order version
 * @param manager MikroORM manager
 * @param orders Orders to load adjustments for
 */
async function loadShippingAdjustments(manager, orders) {
  const shippingMethods = orders.flatMap((r) => [...(r.shipping_methods ?? [])])
  const shippingMethodsIdMap = new Map<string, any>(
    shippingMethods.map((s) => [s.shipping_method.id, s.shipping_method])
  )

  if (!shippingMethods.length) {
    return
  }

  const params = shippingMethods.map((s) => {
    // preinitialise all shipping methods so an empty array is returned for ones without adjustments
    if (!s.shipping_method.adjustments.isInitialized()) {
      s.shipping_method.adjustments.initialized = true
    }

    if (!s.version) {
      throw new Error("Shipping method version is required to load adjustments")
    }
    return {
      shipping_method_id: s.shipping_method.id,
      version: s.version,
    }
  })

  const adjustments = await manager.find(OrderShippingMethodAdjustment, {
    $or: params,
  })

  for (const adjustment of adjustments) {
    const shippingMethod = shippingMethodsIdMap.get(
      adjustment.shipping_method_id
    )
    if (shippingMethod) {
      shippingMethod.adjustments.add(adjustment)
    }
  }
}

function getVersionSubQuery(manager, alias, field = "order_id") {
  const knex = manager.getKnex()
  const sql = manager
    .qb(toMikroORMEntity(Order), "_sub0")
    .select("version")
    .where({ id: knex.raw(`"${alias}"."${field}"`) })
    .getKnexQuery()
    .toString()

  return knex.raw(`(${sql})`)
}

function configurePopulateWhere(
  config: any,
  isRelatedEntity: boolean,
  version: any,
  isSelectIn = false,
  manager?
) {
  const requestedPopulate = config.options?.populate ?? []
  const hasRelation = (relation: string) =>
    requestedPopulate.some(
      (p) => p === relation || p.startsWith(`${relation}.`)
    )

  config.options.populateWhere ??= {}
  const popWhere = config.options.populateWhere

  if (isRelatedEntity) {
    popWhere.order ??= {}

    const popWhereOrder = popWhere.order

    if (!isSelectIn) {
      // For JOINED strategy, version is a reference to the order alias (e.g. "o1"."version")
      // This is trivially true since Order has one row per id, but kept for consistency
      popWhereOrder.version = version
    }
    // For SELECT_IN strategy, the order.version condition is always trivially true
    // (Order has one row per id) so we skip it entirely

    // related entity shipping method
    if (hasRelation("shipping_methods")) {
      popWhere.shipping_methods ??= {}
      if (isSelectIn) {
        // For MikroORM 6.6.x+, populateWhere conditions for force-joined relations are
        // embedded as inline JOIN conditions. Use alias callback so [::alias::] gets
        // replaced with the actual shipping_method alias at query-build time.
        const fragment = raw(
          (alias) =>
            `"${alias}"."version" = (select "_sub0"."version" from "order" as "_sub0" where "_sub0"."id" = "${alias}"."order_id")`
        )
        ;(popWhere.shipping_methods as any)[fragment.toString()] = []
      } else {
        popWhere.shipping_methods.version = version
      }
    }

    if (hasRelation("items") || hasRelation("order.items")) {
      popWhereOrder.items ??= {}
      if (isSelectIn) {
        // In MikroORM 6.6.x+, the global alias counter changed (no longer per-entity-type),
        // so "o0" no longer exists in the query context for related entity queries.
        // Instead, use a self-referential raw fragment: the [::alias::] placeholder is
        // replaced with the order_item's own JOIN alias, and order_item.order_id is used
        // to look up the order's current version.
        const fragment = raw(
          (alias) =>
            `"${alias}"."version" = (select "_sub0"."version" from "order" as "_sub0" where "_sub0"."id" = "${alias}"."order_id")`
        )
        ;(popWhereOrder.items as any)[fragment.toString()] = []
      } else {
        popWhereOrder.items.version = version
      }
    }

    if (hasRelation("shipping_methods")) {
      popWhereOrder.shipping_methods ??= {}
      if (isSelectIn) {
        const fragment = raw(
          (alias) =>
            `"${alias}"."version" = (select "_sub0"."version" from "order" as "_sub0" where "_sub0"."id" = "${alias}"."order_id")`
        )
        ;(popWhereOrder.shipping_methods as any)[fragment.toString()] = []
      } else {
        popWhereOrder.shipping_methods.version = version
      }
    }

    return
  }

  if (isSelectIn) {
    version = getVersionSubQuery(manager, "o0")
  }

  if (hasRelation("summary")) {
    popWhere.summary ??= {}
    popWhere.summary.version = version
  }

  if (hasRelation("credit_lines")) {
    popWhere.credit_lines ??= {}
    popWhere.credit_lines.version = version
  }

  if (hasRelation("items") || hasRelation("order.items")) {
    popWhere.items ??= {}
    popWhere.items.version = version
  }

  if (hasRelation("shipping_methods")) {
    popWhere.shipping_methods ??= {}
    popWhere.shipping_methods.version = version
  }
}
