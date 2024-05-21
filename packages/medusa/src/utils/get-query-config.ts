import {
  getSetDifference,
  isPresent,
  stringToSelectRelationObject,
} from "@medusajs/utils"
import { pick } from "lodash"
import { MedusaError, isDefined } from "medusa-core-utils"
import { RequestQueryFields } from "@medusajs/types"
import { FindConfig, QueryConfig } from "../types/common"

export function pickByConfig<TModel>(
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

export function prepareListQuery<T extends RequestQueryFields, TEntity>(
  validated: T,
  queryConfig: QueryConfig<TEntity> = {}
) {
  // TODO: this function will be simplified a lot once we drop support for the old api
  const { order, fields, limit = 50, expand, offset = 0 } = validated
  let {
    allowed = [],
    defaults = [],
    defaultFields = [],
    defaultLimit,
    allowedFields = [],
    allowedRelations = [],
    defaultRelations = [],
    isList,
  } = queryConfig

  allowedFields = allowed.length ? allowed : allowedFields
  defaultFields = defaults.length ? defaults : defaultFields

  // e.g *product.variants meaning that we want all fields from the product.variants
  // in that case it wont be part of the select but it will be part of the relations.
  // For the remote query we will have to add the fields to the fields array as product.variants.*
  const starFields: Set<string> = new Set()

  let allFields = new Set(defaultFields) as Set<string>

  if (isDefined(fields)) {
    const customFields = fields.split(",").filter(Boolean)
    const shouldReplaceDefaultFields =
      !customFields.length ||
      customFields.some((field) => {
        return !(
          field.startsWith("-") ||
          field.startsWith("+") ||
          field.startsWith("*")
        )
      })
    if (shouldReplaceDefaultFields) {
      allFields = new Set(customFields.map((f) => f.replace(/^[+-]/, "")))
    } else {
      customFields.forEach((field) => {
        if (field.startsWith("+")) {
          allFields.add(field.replace(/^\+/, ""))
        } else if (field.startsWith("-")) {
          allFields.delete(field.replace(/^-/, ""))
        } else {
          allFields.add(field)
        }
      })
    }

    // TODO: Maintain backward compatibility, remove in future. the created at was only added in the list query for default order
    if (queryConfig.isList) {
      allFields.add("created_at")
    }
    allFields.add("id")
  }

  allFields.forEach((field) => {
    if (field.startsWith("*")) {
      starFields.add(field.replace(/^\*/, ""))
      allFields.delete(field)
    }
  })

  const notAllowedFields: string[] = []

  if (allowedFields.length) {
    ;[...allFields, ...Array.from(starFields)].forEach((field) => {
      const hasAllowedField = allowedFields.includes(field)

      if (hasAllowedField) {
        return
      }

      // Select full relation in that case it must match an allowed field fully
      // e.g product.variants in that case we must have a product.variants in the allowedFields
      if (starFields.has(field)) {
        if (hasAllowedField) {
          return
        }
        notAllowedFields.push(field)
        return
      }

      const fieldStartsWithAllowedField = allowedFields.some((allowedField) =>
        field.startsWith(allowedField)
      )

      if (!fieldStartsWithAllowedField) {
        notAllowedFields.push(field)
        return
      }
    })
  }

  if (allFields.size && notAllowedFields.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Requested fields [${Array.from(notAllowedFields).join(
        ", "
      )}] are not valid`
    )
  }

  // TODO: maintain backward compatibility, remove in the future
  const { select, relations } = stringToSelectRelationObject(
    Array.from(allFields)
  )

  let allRelations = new Set([
    ...relations,
    ...defaultRelations,
    ...Array.from(starFields),
  ])

  if (isDefined(expand)) {
    allRelations = new Set(expand.split(",").filter(Boolean))
  }

  if (allowedRelations.length && expand) {
    const allAllowedRelations = new Set([...allowedRelations])

    const notAllowedRelations = getSetDifference(
      allRelations,
      allAllowedRelations
    )

    if (allRelations.size && notAllowedRelations.size) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [${Array.from(notAllowedRelations).join(
          ", "
        )}] are not valid`
      )
    }
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
  }

  const finalOrder = isPresent(orderBy) ? orderBy : undefined
  return {
    listConfig: {
      select: select.length ? select : undefined,
      relations: Array.from(allRelations),
      skip: offset,
      take: limit ?? defaultLimit,
      order: finalOrder,
    },
    remoteQueryConfig: {
      // Add starFields that are relations only on which we want all properties with a dedicated format to the remote query
      fields: [
        ...Array.from(allFields),
        ...Array.from(starFields).map((f) => `${f}.*`),
      ],
      pagination: isList
        ? {
            skip: offset,
            take: limit ?? defaultLimit,
            order: finalOrder,
          }
        : {},
    },
  }
}

export function prepareRetrieveQuery<T extends RequestQueryFields, TEntity>(
  validated: T,
  queryConfig?: QueryConfig<TEntity>
) {
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
      pagination: {},
    },
  }
}
