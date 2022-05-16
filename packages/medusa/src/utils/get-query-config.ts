import { pick } from "lodash"
import { FindConfig } from "../types/common"

type BaseEntity = {
  id: string
  created_at: Date
}

export function pickByConfig<TModel extends BaseEntity>(
  obj: TModel | TModel[],
  config: FindConfig<TModel>
): Partial<TModel> | Partial<TModel>[] {
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

export function getRetrieveConfig<TModel extends BaseEntity>(
  defaultFields: (keyof TModel)[],
  defaultRelations: string[],
  fields?: (keyof TModel)[],
  expand?: string[]
): FindConfig<TModel> {
  let includeFields: (keyof TModel)[] = []
  if (typeof fields !== "undefined") {
    includeFields = Array
      .from(new Set([...fields, "id"]))
      .map(field => (typeof field === "string") ? field.trim() : field) as (keyof TModel)[]
  }

  let expandFields: string[] = []
  if (typeof expand !== "undefined") {
    expandFields = expand.map(expandRelation => expandRelation.trim())
  }

  return {
    select: includeFields.length ? includeFields : defaultFields,
    relations: expandFields.length ? expandFields : defaultRelations,
  }
}

export function getListConfig<TModel extends BaseEntity>(
  defaultFields: (keyof TModel)[],
  defaultRelations: string[],
  fields?: (keyof TModel)[],
  expand?: string[],
  limit = 50,
  offset = 0,
  order?: { [k: symbol]: "DESC" | "ASC" }
): FindConfig<TModel> {
  let includeFields: (keyof TModel)[] = []
  if (typeof fields !== "undefined") {
    const fieldSet = new Set(fields)
    // Ensure created_at is included, since we are sorting on this
    fieldSet.add("created_at")
    fieldSet.add("id")
    includeFields = Array.from(fieldSet) as (keyof TModel)[]
  }

  let expandFields: string[] = []
  if (typeof expand !== "undefined") {
    expandFields = expand
  }

  const orderBy: Record<string, "DESC" | "ASC"> = order ?? {
    created_at: "DESC",
  }

  return {
    select: includeFields.length ? includeFields : defaultFields,
    relations: expandFields.length ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
    order: orderBy,
  }
}
