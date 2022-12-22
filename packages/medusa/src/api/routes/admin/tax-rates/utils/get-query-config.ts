import { pick } from "lodash"
import { defaultAdminTaxRatesFields, defaultAdminTaxRatesRelations } from "../"
import { TaxRate } from "../../../../.."
import { FindConfig } from "../../../../../types/common"
import { isDefined } from "medusa-core-utils"

export function pickByConfig<T>(
  obj: T | T[],
  config: FindConfig<T>
): Partial<T> | Partial<T>[] {
  const fields = [...(config.select ?? []), ...(config.relations ?? [])]

  if (fields.length) {
    if (Array.isArray(obj)) {
      return obj.map((o) => pick(o, fields))
    } else {
      return pick(obj, fields)
    }
  }
  return obj
}

export function getRetrieveConfig(
  fields?: (keyof TaxRate)[],
  expand?: string[]
): FindConfig<TaxRate> {
  let includeFields: (keyof TaxRate)[] = []
  if (isDefined(fields)) {
    const fieldSet = new Set(fields)
    fieldSet.add("id")
    includeFields = Array.from(fieldSet) as (keyof TaxRate)[]
  }

  let expandFields: string[] = []
  if (isDefined(expand)) {
    expandFields = expand
  }

  return {
    select: includeFields.length ? includeFields : defaultAdminTaxRatesFields,
    relations: expandFields.length
      ? expandFields
      : defaultAdminTaxRatesRelations,
  }
}

export function getListConfig(
  fields?: (keyof TaxRate)[],
  expand?: string[],
  limit = 50,
  offset = 0,
  order?: { [k: symbol]: "DESC" | "ASC" }
): FindConfig<TaxRate> {
  let includeFields: (keyof TaxRate)[] = []
  if (isDefined(fields)) {
    const fieldSet = new Set(fields)
    // Ensure created_at is included, since we are sorting on this
    fieldSet.add("created_at")
    fieldSet.add("id")
    includeFields = Array.from(fieldSet) as (keyof TaxRate)[]
  }

  let expandFields: string[] = []
  if (isDefined(expand)) {
    expandFields = expand
  }

  const orderBy: Record<string, "DESC" | "ASC"> = order ?? {
    created_at: "DESC",
  }

  return {
    select: includeFields.length ? includeFields : defaultAdminTaxRatesFields,
    relations: expandFields.length
      ? expandFields
      : defaultAdminTaxRatesRelations,
    skip: offset,
    take: limit,
    order: orderBy,
  }
}
