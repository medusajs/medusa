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
  let {
    allowed = [],
    defaults = [],
    defaultFields = [],
    defaultLimit,
    allowedFields = [],
    allowedRelations = [],
    defaultRelations = [],
  } = queryConfig

  allowedFields = allowedFields.length ? allowedFields : allowed
  defaultFields = defaultFields.length ? defaultFields : defaults

  // Fields such as *variants.options meaning that we want to select all fields
  // from the variants.options relation without specifying them.
  // In that case it needs to be removed from the fields and be part of the relations only
  // TODO: It means that the remote query won't have it as part of the fields
  // unless the properties are specified e.g variants.options.id, variants.options.name
  // This is a limitation of the current implementation as we do not support select * from a
  // relation. Once we add the support for it then we can update this logic
  const starFields = new Set()

  let allFields = new Set(defaultFields) as Set<string>

  if (isDefined(fields)) {
    const customFields = fields.split(",").filter(Boolean)
    const shouldReplaceDefaultFields =
      !customFields.length ||
      customFields.some(
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

    allFields.forEach((field) => {
      if (field.startsWith("*")) {
        starFields.add(field.replace(/^\*/, ""))
        allFields.delete(field)
      }
    })

    // TODO: Maintain backward compatibility, remove in future. the created at was only added in the list query for default order
    if (queryConfig.isList) {
      allFields.add("created_at")
    }
    allFields.add("id")
  }

  const allAllowedFields = new Set(allowedFields) // In case there is no allowedFields, allow all fields
  const notAllowedFields = !allAllowedFields.size
    ? new Set()
    : getSetDifference(allFields, allAllowedFields)

  if (allFields.size && notAllowedFields.size) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Requested fields [${Array.from(notAllowedFields).join(
        ", "
      )}] are not valid`
    )
  }

  const { select, relations } = stringToSelectRelationObject(
    Array.from(allFields)
  )

  // TODO: maintain backward compatibility, remove in the future
  let allRelations = new Set([
    ...relations,
    ...defaultRelations,
    ...Array.from(starFields),
  ])

  if (isDefined(expand)) {
    allRelations = new Set(expand.split(",").filter(Boolean))
  }

  const allAllowedRelations = new Set([
    ...Array.from(allAllowedFields),
    ...allowedRelations,
  ])
  const notAllowedRelations = !allowedRelations.length
    ? new Set()
    : getSetDifference(allRelations, allAllowedRelations)

  if (allRelations.size && notAllowedRelations.size) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Requested fields [${Array.from(notAllowedRelations).join(
        ", "
      )}] are not valid`
    )
  }
  // End of expand compatibility

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

  return {
    listConfig: {
      select: select.length ? select : undefined,
      relations: Array.from(allRelations),
      skip: offset,
      take: limit ?? defaultLimit,
      order: orderBy,
    },
    remoteQueryConfig: {
      fields: Array.from(allFields),
      variables: {
        skip: offset,
        take: limit ?? defaultLimit,
        order: orderBy
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
