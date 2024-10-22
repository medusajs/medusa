import { pick } from "lodash"
import { FindConfig, QueryConfig, RequestQueryFields } from "@medusajs/types"
import {
  isDefined,
  isPresent,
  MedusaError,
  stringToSelectRelationObject,
} from "@medusajs/utils"

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

function checkRestrictedFields({
  fields,
  restricted,
}: {
  fields: string[]
  restricted: string[]
}): string[] {
  const notAllowedFields: string[] = []

  fields.forEach((field) => {
    const fieldSegments = field.split(".")
    const hasRestrictedField = restricted.some((restrictedField) =>
      fieldSegments.includes(restrictedField)
    )
    if (hasRestrictedField) {
      notAllowedFields.push(field)
      return
    }

    return
  })

  return notAllowedFields
}

function checkAllowedFields({
  fields,
  allowed,
  starFields,
}: {
  fields: string[]
  starFields: Set<string>
  allowed: string[]
}): string[] {
  const notAllowedFields: string[] = []

  fields.forEach((field) => {
    const hasAllowedField = allowed.includes(field)

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

    const fieldStartsWithAllowedField = allowed.some((allowedField) =>
      field.startsWith(allowedField)
    )

    if (!fieldStartsWithAllowedField) {
      notAllowedFields.push(field)
      return
    }
  })

  return notAllowedFields
}

export function prepareListQuery<T extends RequestQueryFields, TEntity>(
  validated: T,
  queryConfig: QueryConfig<TEntity> & { restricted?: string[] } = {}
) {
  let {
    allowed = [],
    restricted = [],
    defaults = [],
    defaultLimit = 50,
    isList,
  } = queryConfig
  const { order, fields, limit = defaultLimit, offset = 0 } = validated

  // e.g *product.variants meaning that we want all fields from the product.variants
  // in that case it wont be part of the select but it will be part of the relations.
  // For the remote query we will have to add the fields to the fields array as product.variants.*
  const starFields: Set<string> = new Set()

  let allFields = new Set(defaults) as Set<string>

  if (isDefined(fields)) {
    const customFields = fields.split(",").filter(Boolean)
    const shouldReplaceDefaultFields =
      !customFields.length ||
      customFields.some((field) => {
        return !(
          field.startsWith("-") ||
          field.startsWith("+") ||
          field.startsWith(" ") ||
          field.startsWith("*") ||
          field.endsWith(".*")
        )
      })

    if (shouldReplaceDefaultFields) {
      allFields = new Set(customFields.map((f) => f.replace(/^[+ -]/, "")))
    } else {
      customFields.forEach((field) => {
        if (field.startsWith("+") || field.startsWith(" ")) {
          allFields.add(field.trim().replace(/^\+/, ""))
        } else if (field.startsWith("-")) {
          allFields.delete(field.replace(/^-/, ""))
        } else {
          allFields.add(field)
        }
      })
    }

    allFields.add("id")
  }

  allFields.forEach((field) => {
    if (field.startsWith("*") || field.endsWith(".*")) {
      starFields.add(field.replace(/(^\*|\.\*$)/, ""))
      allFields.delete(field)
    }
  })

  let notAllowedFields: string[] = []

  if (allowed.length || restricted.length) {
    const fieldsToCheck = [...allFields, ...Array.from(starFields)]

    if (allowed.length) {
      notAllowedFields = checkAllowedFields({
        fields: fieldsToCheck,
        starFields,
        allowed,
      })
    } else if (restricted.length) {
      notAllowedFields = checkRestrictedFields({
        fields: fieldsToCheck,
        restricted,
      })
    }
  }

  if (notAllowedFields.length) {
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

  let allRelations = new Set([...relations, ...Array.from(starFields)])

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

    if (allowed.length && !allowed.includes(orderField)) {
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
      take: limit,
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
            take: limit,
            order: finalOrder,
          }
        : {},
    },
  }
}

export function prepareRetrieveQuery<T extends RequestQueryFields, TEntity>(
  validated: T,
  queryConfig?: QueryConfig<TEntity> & { restricted?: string[] }
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
