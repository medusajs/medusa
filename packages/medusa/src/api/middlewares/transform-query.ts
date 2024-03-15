import {
  buildSelects,
  objectToStringPath,
  stringToSelectRelationObject,
} from "@medusajs/utils"
import { ValidatorOptions } from "class-validator"
import { NextFunction, Request, Response } from "express"
import { omit } from "lodash"
import { BaseEntity } from "../../interfaces"
import { FindConfig, QueryConfig, RequestQueryFields } from "../../types/common"
import { ClassConstructor } from "../../types/global"
import { removeUndefinedProperties } from "../../utils"
import {
  prepareListQuery,
  prepareRetrieveQuery,
} from "../../utils/get-query-config"
import { validator } from "../../utils/validator"
import { default as normalizeQuery } from "./normalized-query"

/**
 * Middleware that transform the query input for the admin end points
 * @param plainToClass
 * @param queryConfig
 * @param config
 */
export function transformQuery<
  T extends RequestQueryFields,
  TEntity extends BaseEntity
>(
  plainToClass: ClassConstructor<T>,
  queryConfig?: Omit<
    QueryConfig<TEntity>,
    "allowedRelations" | "allowedFields" | "allowed"
  >,
  config: ValidatorOptions = {}
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      normalizeQuery()(req, res, () => void 0)
      const validated: T = await validator<T, Record<string, unknown>>(
        plainToClass,
        req.query,
        config
      )
      req.validatedQuery = validated
      req.filterableFields = getFilterableFields(validated)
      attachListOrRetrieveConfig<TEntity>(req, queryConfig)
      /**
       * TODO: shouldn't this correspond to returnable fields instead of allowed fields? also it is used by the cleanResponseData util and is supposed to
       * only return the fields that are allowed to be queried either from the default of from what the user requested.
       * The validation occurred above and the fields are already validated and should be used to filter the response.
       */
      const queryConfigRes = req.retrieveConfig ?? req.listConfig
      const includesRelations = Object.keys(req.includes ?? {})
      req.allowedProperties = Array.from(
        new Set(
          [
            ...(queryConfigRes.select ?? []),
            ...(includesRelations.length
              ? includesRelations // For backward compatibility, the includes takes precedence over the relations for the returnable fields
              : queryConfigRes.relations ?? []),
          ].filter(Boolean)
        )
      )

      next()
    } catch (e) {
      next(e)
    }
  }
}

/**
 * Middleware that transform the query input for the store endpoints
 * @param plainToClass
 * @param queryConfig
 * @param config
 */
export function transformStoreQuery<
  T extends RequestQueryFields,
  TEntity extends BaseEntity
>(
  plainToClass: ClassConstructor<T>,
  queryConfig?: QueryConfig<TEntity>,
  config: ValidatorOptions = {}
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return transformQuery(plainToClass, queryConfig, config)
}

/**
 * Omit the non filterable config from the validated object
 * @param obj
 */
function getFilterableFields<T extends RequestQueryFields>(obj: T): T {
  const result = omit(obj, [
    "limit",
    "offset",
    /**
     * @deprecated
     */
    "expand",
    "fields",
    "order",
  ]) as T
  return removeUndefinedProperties(result)
}

/**
 * build and attach the `retrieveConfig` or `listConfig` and remoteQueryConfig to the request object
 * @param req
 * @param queryConfig
 */
function attachListOrRetrieveConfig<TEntity extends BaseEntity>(
  req: Request,
  queryConfig: QueryConfig<TEntity> = {}
) {
  const validated = req.validatedQuery
  queryConfig.allowed =
    req.allowed ?? queryConfig.allowed ?? queryConfig.allowedFields ?? []
  queryConfig.allowedFields = queryConfig.allowed

  if (queryConfig.isList) {
    const queryConfigRes = prepareListQuery(validated, queryConfig)

    req.listConfig = queryConfigRes.listConfig as FindConfig<any>
    req.remoteQueryConfig = queryConfigRes.remoteQueryConfig
  } else {
    const queryConfigRes = prepareRetrieveQuery(validated, queryConfig)

    req.retrieveConfig = queryConfigRes.retrieveConfig as FindConfig<any>
    req.remoteQueryConfig = queryConfigRes.remoteQueryConfig
  }
}
