import { pick } from "lodash"
import { FindConfig, QueryConfig, RequestQueryFields } from "../types/common"
import { isDefined, MedusaError } from "medusa-core-utils"
import { BaseEntity } from "../interfaces"
import { getSetDifference, stringToSelectRelationObject } from "@medusajs/utils"

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
  defaultFields: string[] = [],
  defaultRelations: string[] = [],
  fields: string[] = [],
  expand: string[] = [],
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
    select: (includeFields.length
      ? includeFields
      : defaultFields) as (keyof TModel)[],
    relations: isDefined(expand) ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
    order: orderBy,
  }
}

export function prepareListQuery<
  T extends RequestQueryFields,
  TEntity extends BaseEntity
>(validated: T, queryConfig: QueryConfig<TEntity> = {}) {
  const { order, fields, limit, offset } = validated
  const {
    defaultFields = [],
    defaultLimit,
    allowedFields = [],
    allowedRelations = [],
  } = queryConfig

  let allFields = new Set([...defaultFields]) as Set<string>
  if (fields) {
    const customFields = fields.split(",")
    const shouldReplaceDefaultFields = customFields.some(
      (field) => !(field.startsWith("-") || field.startsWith("+"))
    )
    if (shouldReplaceDefaultFields) {
      allFields = new Set(customFields.map((f) => f.replace(/^[+-]/, "")))
    }
  }

  const allAllowedFields = new Set([...allowedFields, ...allowedRelations])
  const notAllowedFields = !allAllowedFields.size
    ? new Set()
    : getSetDifference(allFields, allAllowedFields)

  if (notAllowedFields.size) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Requested fields [${Array.from(notAllowedFields).join(
        ", "
      )}] are not valid`
    )
  }

  let orderBy: { [k: symbol]: "DESC" | "ASC" } | undefined = {}
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
  } else {
    orderBy["created_at"] = "DESC"
    allFields.add("created_at")
  }

  const { select, relations } = stringToSelectRelationObject(
    Array.from(allFields)
  )
  return {
    listConfig: {
      select,
      relations,
      skip: offset,
      take: limit ?? defaultLimit,
      order: orderBy,
    },
    remoteQueryConfig: {
      fields: Array.from(allFields),
      variables: {
        skip: offset,
        limit: limit ?? defaultLimit,
      },
    },
  }
}

export function prepareRetrieveQuery<
  T extends RequestQueryFields,
  TEntity extends BaseEntity
>(validated: T, queryConfig?: QueryConfig<TEntity>) {
  const { listConfig, remoteQueryConfig } = prepareListQuery(
    validated,
    queryConfig
  )

  return {
    retrieveConfig: {
      select: listConfig.select,
      relations: listConfig.relations,
    },
    remoteQueryConfig: {
      fields: remoteQueryConfig.fields,
      variables: {},
    },
  }
}
