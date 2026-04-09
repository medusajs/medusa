import { FindConfig, QueryConfig, RequestQueryFields } from "@medusajs/types"
import {
  buildOrder,
  FeatureFlag,
  isDefined,
  isPresent,
  MedusaError,
  pickDeep,
  PolicyDefinition,
  promiseAll,
  stringToSelectRelationObject,
} from "@medusajs/utils"
import { AuthContext, MedusaRequest } from "../types"
import {
  AllowedFieldFilter,
  FieldParser,
  IFieldFilter,
  RestrictedFieldFilter,
} from "./field-filtering"
import { RBACFieldFilter } from "./policies/rbac-field-filter"

export function pickByConfig<TModel>(
  obj: TModel | TModel[],
  config: FindConfig<TModel>
): Partial<TModel> | Partial<TModel>[] {
  const fields = [...(config.select ?? []), ...(config.relations ?? [])]

  if (fields.length) {
    if (Array.isArray(obj)) {
      return obj.map((o) => pickDeep(o as object, fields as string[]))
    } else {
      return pickDeep(obj as object, fields as string[])
    }
  }
  return obj
}

export async function prepareListQuery<T extends RequestQueryFields, TEntity>(
  validated: T,
  queryConfig: QueryConfig<TEntity> & { restricted?: string[] } = {},
  req?: MedusaRequest & {
    policies?: PolicyDefinition[]
    auth_context?: AuthContext
  }
) {
  let {
    allowed = [],
    restricted = [],
    defaults = [],
    defaultLimit = 50,
    isList,
    entity,
  } = queryConfig
  const {
    order,
    fields,
    limit = defaultLimit,
    offset = 0,
    with_deleted,
  } = validated

  const parsedFields = FieldParser.parse(fields, defaults as string[])
  const { fields: allFields, starFields } = parsedFields

  const rbacFilterFieldsFeatureFlag =
    FeatureFlag.isFeatureEnabled("rbac_filter_fields")

  const filters: IFieldFilter[] = []

  if (req?.policies && entity && rbacFilterFieldsFeatureFlag) {
    filters.push(
      new RBACFieldFilter({
        policies: req.policies,
        userRoles: (req.auth_context?.app_metadata?.roles as string[]) || [],
        container: req.scope,
      })
    )
  }

  if (allowed.length) {
    filters.push(new AllowedFieldFilter({ allowed }))
  } else if (restricted.length) {
    filters.push(new RestrictedFieldFilter({ restricted }))
  }

  const notAllowedArrays = await promiseAll(
    filters.map((f) =>
      f.getNotAllowedFields({ entity: entity as string, parsedFields })
    )
  )
  const notAllowedFields = [...new Set(notAllowedArrays.flat())]

  if (notAllowedFields.length && rbacFilterFieldsFeatureFlag) {
    notAllowedFields.forEach((field) => {
      allFields.delete(field)
      starFields.delete(field)
    })
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
      orderField = order.slice(1)
      orderBy = { [orderField]: "DESC" }
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

  const finalOrder = isPresent(orderBy) ? buildOrder(orderBy) : undefined
  return {
    listConfig: {
      select: select.length ? select : undefined,
      relations: Array.from(allRelations),
      skip: offset,
      take: limit,
      order: finalOrder,
      withDeleted: with_deleted,
    },
    remoteQueryConfig: {
      ...(!!entity ? { entity } : {}),
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
      withDeleted: with_deleted,
    },
  }
}

export async function prepareRetrieveQuery<
  T extends RequestQueryFields,
  TEntity
>(
  validated: T,
  queryConfig?: QueryConfig<TEntity> & { restricted?: string[] },
  req?: MedusaRequest & {
    policies?: PolicyDefinition[]
    auth_context?: AuthContext
  }
) {
  const { listConfig, remoteQueryConfig } = await prepareListQuery(
    validated,
    queryConfig,
    req
  )

  return {
    retrieveConfig: {
      select: listConfig.select,
      relations: listConfig.relations,
    },
    remoteQueryConfig: {
      fields: remoteQueryConfig.fields,
      pagination: {},
      withDeleted: remoteQueryConfig.withDeleted,
    },
  }
}
