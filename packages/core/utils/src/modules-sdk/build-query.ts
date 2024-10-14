import { DAL, FindConfig } from "@medusajs/types"
import { deduplicate, isObject } from "../common"

import { SoftDeletableFilterKey } from "../dal/mikro-orm/mikro-orm-soft-deletable-filter"

// Following convention here is fine, we can make it configurable if needed.
const DELETED_AT_FIELD_NAME = "deleted_at"

type FilterFlags = {
  withDeleted?: boolean
}

export function buildQuery<T = any, TDto = any>(
  filters: Record<string, any> = {},
  config: FindConfig<TDto> & { primaryKeyFields?: string | string[] } = {}
): Required<DAL.FindOptions<T>> {
  const where: DAL.FilterQuery<T> = {}
  const filterFlags: FilterFlags = {}
  buildWhere(filters, where, filterFlags)

  delete config.primaryKeyFields

  const findOptions: DAL.OptionsQuery<T, any> = {
    populate: deduplicate(config.relations ?? []),
    fields: config.select as string[],
    limit: (Number.isSafeInteger(config.take) && config.take) || undefined,
    offset: (Number.isSafeInteger(config.skip) && config.skip) || undefined,
  }

  if (config.order) {
    findOptions.orderBy = config.order as DAL.OptionsQuery<T>["orderBy"]
  }

  if (config.withDeleted || filterFlags.withDeleted) {
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

  return { where, options: findOptions }
}

function buildWhere(
  filters: Record<string, any> = {},
  where = {},
  flags: FilterFlags = {}
) {
  for (let [prop, value] of Object.entries(filters)) {
    if (prop === DELETED_AT_FIELD_NAME) {
      flags.withDeleted = true
    }

    if (["$or", "$and"].includes(prop)) {
      where[prop] = value.map((val) => {
        const deepWhere = {}
        buildWhere(val, deepWhere, flags)
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
      buildWhere(value, where[prop], flags)
      continue
    }

    where[prop] = value
  }
}
