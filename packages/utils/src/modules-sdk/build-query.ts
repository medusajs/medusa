import { DAL, FindConfig } from "@medusajs/types"

import { deduplicate, isObject } from "../common"
import { SoftDeletableFilterKey } from "../dal"

export function buildQuery<T = any, TDto = any>(
  filters: Record<string, any> = {},
  config: FindConfig<TDto> = {}
): DAL.FindOptions<T> {
  const where: DAL.FilterQuery<T> = {}
  buildWhere(filters, where)

  const findOptions: DAL.OptionsQuery<T, any> = {
    populate: deduplicate(config.relations ?? []),
    fields: config.select as string[],
    limit: config.take ?? 15,
    offset: config.skip ?? 0,
  }

  if (config.order) {
    findOptions.orderBy = config.order as DAL.OptionsQuery<T>["orderBy"]
  }

  if (config.withDeleted) {
    findOptions.filters ??= {}
    findOptions.filters[SoftDeletableFilterKey] = {
      withDeleted: true,
    }
  }

  return { where, options: findOptions }
}

function buildWhere(filters: Record<string, any> = {}, where = {}) {
  for (let [prop, value] of Object.entries(filters)) {
    if (["$or", "$and"].includes(prop)) {
      where[prop] = value.map((val) => {
        const deepWhere = {}
        buildWhere(val, deepWhere)
        return deepWhere
      })
      continue
    }

    if (Array.isArray(value)) {
      value = deduplicate(value)
      where[prop] = ["$in", "$nin"].includes(prop) ? value : { $in: value }
      continue
    }

    if (isObject(value)) {
      where[prop] = {}
      buildWhere(value, where[prop])
      continue
    }

    where[prop] = value
  }
}
