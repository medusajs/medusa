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

export function prepareListQuery<
  T extends RequestQueryFields,
  TEntity extends BaseEntity
>(validated: T, queryConfig: QueryConfig<TEntity> = {}) {
  const { order, fields, limit = 50, expand, offset = 0 } = validated
  const {
    defaultFields = [],
    defaultLimit,
    allowedFields = [],
    allowedRelations = [],
    defaultRelations = [],
  } = queryConfig

  let allFields = new Set([...defaultFields]) as Set<string>

  if (fields) {
    const customFields = fields.split(",")
    const shouldReplaceDefaultFields = customFields.some(
      (field) => !(field.startsWith("-") || field.startsWith("+"))
    )
    if (shouldReplaceDefaultFields) {
      allFields = new Set(customFields.map((f) => f.replace(/^[+-]/, "")))
    } else {
      customFields.forEach((field) => {
        if (field.startsWith("+")) {
          allFields.add(field.replace(/^\+/, ""))
        } else if (field.startsWith("-")) {
          allFields.delete(field.replace(/^-/, ""))
        }
      })
    }

    // TODO: Maintain backward compatibility, remove in future. the created at was only added in the list query for default order
    if (queryConfig.isList) {
      allFields.add("created_at")
    }
    allFields.add("id")
  }

  const allAllowedFields = new Set([
    ...(allowedFields.length ? allowedFields : Array.from(allFields)), // In case there is no allowedFields, allow all fields
    ...allowedRelations,
  ])
  const notAllowedFields = !allAllowedFields.size
    ? new Set()
    : getSetDifference(allFields, allAllowedFields)

  // TODO: maintain backward compatibility, remove in the future
  let allRelations = new Set(defaultRelations)
  if (expand) {
    allRelations = new Set(expand.split(",") ?? [])
    const notAllowedRelations = !allAllowedFields.size
      ? new Set()
      : getSetDifference(allRelations, allAllowedFields)

    if (notAllowedRelations.size) {
      notAllowedRelations.forEach((v) => notAllowedFields.add(v))
    }
  }

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
  }

  let { select, relations } = stringToSelectRelationObject(
    Array.from(allFields)
  )
  relations = Array.from(new Set([...relations, ...Array.from(allRelations)]))

  return {
    listConfig: {
      select: select.length ? select : undefined,
      relations: relations,
      skip: offset,
      take: limit ?? defaultLimit,
      order: orderBy,
    },
    remoteQueryConfig: {
      fields: Array.from(allFields),
      variables: {
        skip: offset,
        take: limit ?? defaultLimit,
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
