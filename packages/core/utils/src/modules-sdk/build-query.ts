import { DAL, FindConfig, InferRepositoryReturnType } from "@medusajs/types"
import { deduplicate, isObject } from "../common"

import { SoftDeletableFilterKey } from "../dal/mikro-orm/mikro-orm-soft-deletable-filter"

export function buildQuery<const T = any>(
  filters: Record<string, any> = {},
  config: FindConfig<InferRepositoryReturnType<T>> & {
    primaryKeyFields?: string | string[]
  } = {}
): Required<DAL.FindOptions<T>> {
  const where = {} as DAL.FilterQuery<T>
  buildWhere(filters, where)

  delete config.primaryKeyFields

  const findOptions: DAL.FindOptions<T>["options"] = {
    populate: deduplicate(config.relations ?? []),
    fields: config.select as string[],
    limit:
      Number.isSafeInteger(config.take) && config.take != null
        ? config.take
        : undefined,
    offset:
      Number.isSafeInteger(config.skip) && config.skip != null
        ? config.skip
        : undefined,
    __internal: config.__internal,
  }

  if (config.order) {
    findOptions.orderBy = config.order as Required<
      DAL.FindOptions<T>
    >["options"]["orderBy"]
  }

  if (config.withDeleted) {
    findOptions.filters ??= {}
    findOptions.filters[SoftDeletableFilterKey] = {
      withDeleted: true,
    }
  }

  if (config.filters) {
    findOptions.filters ??= {}

    for (const [key, value] of Object.entries(config.filters)) {
      findOptions.filters[key] = value
    }
  }

  if (config.options) {
    Object.assign(findOptions, config.options)
  }

  return { where, options: findOptions } as Required<DAL.FindOptions<T>>
}

function buildWhere(filters: Record<string, any> = {}, where = {}) {
  for (let [prop, value] of Object.entries(filters)) {
    if (["$or", "$and"].includes(prop)) {
      if (!Array.isArray(value)) {
        throw new Error(`Expected array for ${prop} but got ${value}`)
      }

      where[prop] = value.map((val) => {
        const deepWhere = {}
        buildWhere(val, deepWhere)
        return deepWhere
      })
      continue
    }

    if (Array.isArray(value)) {
      where[prop] = deduplicate(value)
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
