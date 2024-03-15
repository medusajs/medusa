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
    "allowedRelations" | "allowedFields"
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
      req.allowedProperties = Array.from(
        new Set(
          [
            ...(queryConfigRes.select ?? []),
            ...(queryConfigRes.relations ?? []),
            ...Object.keys(req.includes ?? {}),
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
      req.allowedProperties = Array.from(
        new Set(
          [
            ...(queryConfigRes.select ?? []),
            ...(queryConfigRes.relations ?? []),
            ...Object.keys(req.includes ?? {}),
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
/**
 * Build the store allowed props based on the custom fields query params, the allowed props config and the includes options.
 * This can be used later with `cleanResponseData` in order to clean up the returned objects to the client.
 * @param queryConfig
 * @param validated
 * @param includesOptions
 */
function getStoreAllowedProperties<TEntity extends BaseEntity>(
  validated: RequestQueryFields,
  includesOptions: Record<string, boolean>,
  queryConfig: QueryConfig<TEntity> = {}
): string[] {
  const allowed: string[] = []

  const fields = validated.fields
    ? validated.fields?.split(",")
    : queryConfig.allowed ?? queryConfig.allowedFields ?? []

  const includeKeys = Object.keys(includesOptions)
  const expand =
    validated.expand || includeKeys.length
      ? [...(validated.expand?.split(",") || []), ...includeKeys]
      : queryConfig?.allowedRelations ||
        // Only to maintain backward compatibility when allowed relations is not defined
        stringToSelectRelationObject(
          (queryConfig?.allowedFields ?? []) as string[]
        ).relations ||
        []

  allowed.push(...fields, ...objectToStringPath(buildSelects(expand)))

  return allowed
}

/**
 * Build the admin allowed props based on the custom fields query params, the defaults and the includes options.
 * Since admin can access everything, it is only in order to return what the user asked for through fields and expand query params.
 * This can be used later with `cleanResponseData` in order to clean up the returned objects to the client.
 * @param req
 */
function getAllowedProperties(
  req: Request
): string[] {
  const queryConfig = req.retrieveConfig ?? req.listConfig
  return Array.from(
    new Set(
      [
        ...(queryConfig.select ?? []),
        ...(queryConfig.relations ?? []),
        ...Object.keys(req.includes ?? {}),
      ].filter(Boolean)
    )
  )
}
