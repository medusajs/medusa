import { pick } from "lodash"
import { FindConfig, QueryConfig, RequestQueryFields } from "../types/common"
import { isDefined, MedusaError } from "medusa-core-utils"
import { BaseEntity } from "../interfaces"

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
  if (isDefined(fields)) {
    includeFields = Array.from(new Set([...fields, "id"])).map((field) => {
      return typeof field === "string" ? field.trim() : field
    }) as (keyof TModel)[]
  }

  let expandFields: string[] = []
  if (isDefined(expand)) {
    expandFields = expand.map((expandRelation) => expandRelation.trim())
  }

  return {
    select: includeFields.length ? includeFields : defaultFields,
    relations: isDefined(expand) ? expandFields : defaultRelations,
  }
}

export function getListConfig<TModel extends BaseEntity>(
  defaultFields: (keyof TModel)[],
  defaultRelations: string[],
  fields?: (keyof TModel)[],
  expand?: string[],
  limit = 50,
  offset = 0,
  order: { [k: string | symbol]: "DESC" | "ASC" } = {}
): FindConfig<TModel> {
  let includeFields: (keyof TModel)[] = []
  if (isDefined(fields)) {
    const fieldSet = new Set(fields)
    // Ensure created_at is included, since we are sorting on this
    fieldSet.add("created_at")
    fieldSet.add("id")
    includeFields = Array.from(fieldSet) as (keyof TModel)[]
  }

  let expandFields: string[] = []
  if (isDefined(expand)) {
    expandFields = expand
  }

  const orderBy = order

  if (!Object.keys(order).length) {
    orderBy["created_at"] = "DESC"
  }

  return {
    select: includeFields.length ? includeFields : defaultFields,
    relations: isDefined(expand) ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
    order: orderBy,
  }
}

export function prepareListQuery<
  T extends RequestQueryFields,
  TEntity extends BaseEntity
>(validated: T, queryConfig?: QueryConfig<TEntity>) {
  const { order, fields, expand, limit, offset } = validated

  let expandRelations: string[] | undefined = undefined
  if (isDefined(expand)) {
    expandRelations = expand.split(",").filter((v) => v)
  }

  let expandFields: (keyof TEntity)[] | undefined = undefined
  if (isDefined(fields)) {
    expandFields = (fields.split(",") as (keyof TEntity)[]).filter((v) => v)
  }

  if (expandFields?.length && queryConfig?.allowedFields?.length) {
    validateFields(expandFields as string[], queryConfig.allowedFields)
  }

  if (expandRelations?.length && queryConfig?.allowedRelations?.length) {
    validateRelations(expandRelations, queryConfig.allowedRelations)
  }

  let orderBy: { [k: symbol]: "DESC" | "ASC" } | undefined
  if (isDefined(order)) {
    let orderField = order
    if (order.startsWith("-")) {
      const [, field] = order.split("-")
      orderField = field
      orderBy = { [field]: "DESC" }
    } else {
      orderBy = { [order]: "ASC" }
    }

    if (
      queryConfig?.allowedFields?.length &&
      !queryConfig?.allowedFields.includes(orderField)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order field ${orderField} is not valid`
      )
    }
  }

  return getListConfig<TEntity>(
    queryConfig?.defaultFields as (keyof TEntity)[],
    (queryConfig?.defaultRelations ?? []) as string[],
    expandFields,
    expandRelations,
    limit ?? queryConfig?.defaultLimit,
    offset ?? 0,
    orderBy
  )
}

export function prepareRetrieveQuery<
  T extends RequestQueryFields,
  TEntity extends BaseEntity
>(validated: T, queryConfig?: QueryConfig<TEntity>) {
  const { fields, expand } = validated

  let expandRelations: string[] | undefined = undefined
  if (isDefined(expand)) {
    expandRelations = expand.split(",").filter((v) => v)
  }

  let expandFields: (keyof TEntity)[] | undefined = undefined
  if (isDefined(fields)) {
    expandFields = (fields.split(",") as (keyof TEntity)[]).filter((v) => v)
  }

  if (expandFields?.length && queryConfig?.allowedFields?.length) {
    validateFields(expandFields as string[], queryConfig.allowedFields)
  }

  if (expandRelations?.length && queryConfig?.allowedRelations?.length) {
    validateRelations(expandRelations, queryConfig.allowedRelations)
  }

  return getRetrieveConfig<TEntity>(
    queryConfig?.defaultFields as (keyof TEntity)[],
    (queryConfig?.defaultRelations ?? []) as string[],
    expandFields,
    expandRelations
  )
}

function validateRelations(
  relations: string[],
  allowed: string[]
): void | never {
  const disallowedRelationsFound: string[] = []
  relations?.forEach((field) => {
    if (!allowed.includes(field as string)) {
      disallowedRelationsFound.push(field)
    }
  })

  if (disallowedRelationsFound.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Relations [${disallowedRelationsFound.join(", ")}] are not valid`
    )
  }
}

function validateFields(fields: string[], allowed: string[]): void | never {
  const disallowedFieldsFound: string[] = []
  fields?.forEach((field) => {
    if (!allowed.includes(field as string)) {
      disallowedFieldsFound.push(field)
    }
  })

  if (disallowedFieldsFound.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Fields [${disallowedFieldsFound.join(", ")}] are not valid`
    )
  }
}
