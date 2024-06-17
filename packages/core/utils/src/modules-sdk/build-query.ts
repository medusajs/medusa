import { DAL, FindConfig } from "@medusajs/types"
import { deduplicate, isDefined, isObject } from "../common"

import { SoftDeletableFilterKey } from "../dal"

// Following convention here is fine, we can make it configurable if needed.
const DELETED_AT_FIELD_NAME = "deleted_at"

type FilterFlags = {
  withDeleted?: boolean
}

export function buildQuery<T = any, TDto = any>(
  filters: Record<string, any> = {},
  config: FindConfig<TDto> & { primaryKeyFields?: string | string[] } = {}
): DAL.FindOptions<T> {
  const where: DAL.FilterQuery<T> = {}
  const filterFlags: FilterFlags = {}
  buildWhere(filters, where, filterFlags)

  const primaryKeyFieldArray = isDefined(config.primaryKeyFields)
    ? !Array.isArray(config.primaryKeyFields)
      ? [config.primaryKeyFields]
      : config.primaryKeyFields
    : ["id"]

  const whereHasPrimaryKeyFields = primaryKeyFieldArray.some(
    (pkField) => !!where[pkField]
  )

  const defaultLimit = whereHasPrimaryKeyFields ? undefined : 15

  delete config.primaryKeyFields

  const findOptions: DAL.OptionsQuery<T, any> = {
    populate: deduplicate(config.relations ?? []),
    fields: config.select as string[],
    limit:
      (Number.isSafeInteger(config.take) && config.take! >= 0) ||
      null === config.take
        ? config.take ?? undefined
        : defaultLimit,
    offset:
      (Number.isSafeInteger(config.skip) && config.skip! >= 0) ||
      null === config.skip
        ? config.skip ?? undefined
        : 0,
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
      value = deduplicate(value)
      where[prop] = ["$in", "$nin"].includes(prop) ? value : { $in: value }
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
