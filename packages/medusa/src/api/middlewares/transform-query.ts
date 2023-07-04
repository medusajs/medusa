import { NextFunction, Request, Response } from "express"
import { ClassConstructor } from "../../types/global"
import { validator } from "../../utils/validator"
import { ValidatorOptions } from "class-validator"
import { default as normalizeQuery } from "./normalized-query"
import {
  prepareListQuery,
  prepareRetrieveQuery,
} from "../../utils/get-query-config"
import { BaseEntity } from "../../interfaces"
import { FindConfig, QueryConfig, RequestQueryFields } from "../../types/common"
import { omit } from "lodash"
import { removeUndefinedProperties } from "../../utils"

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
      req.allowedProperties = getAllowedProperties(
        validated,
        req.includes ?? {},
        queryConfig
      )
      attachListOrRetrieveConfig<TEntity>(req, queryConfig)

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
      req.allowedProperties = getStoreAllowedProperties(
        validated,
        req.includes ?? {},
        queryConfig
      )
      attachListOrRetrieveConfig<TEntity>(req, queryConfig)

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
    "expand",
    "fields",
    "order",
  ]) as T
  return removeUndefinedProperties(result)
}

/**
 * build and attach the `retrieveConfig` or `listConfig`
 * @param req
 * @param queryConfig
 */
function attachListOrRetrieveConfig<TEntity extends BaseEntity>(
  req: Request,
  queryConfig?: QueryConfig<TEntity>
) {
  const validated = req.validatedQuery
  if (queryConfig?.isList) {
    req.listConfig = prepareListQuery(
      validated,
      queryConfig
    ) as FindConfig<unknown>
  } else {
    req.retrieveConfig = prepareRetrieveQuery(
      validated,
      queryConfig
    ) as FindConfig<unknown>
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
  queryConfig?: QueryConfig<TEntity>
): string[] {
  const allowed: string[] = []

  const includeKeys = Object.keys(includesOptions)
  const fields = validated.fields
    ? validated.fields?.split(",")
    : queryConfig?.allowedFields || []
  const expand =
    validated.expand || includeKeys.length
      ? [...(validated.expand?.split(",") || []), ...includeKeys]
      : queryConfig?.allowedRelations || []

  allowed.push(...fields, ...expand)

  return allowed
}

/**
 * Build the admin allowed props based on the custom fields query params, the defaults and the includes options.
 * Since admin can access everything, it is only in order to return what the user asked for through fields and expand query params.
 * This can be used later with `cleanResponseData` in order to clean up the returned objects to the client.
 * @param queryConfig
 * @param validated
 * @param includesOptions
 */
function getAllowedProperties<TEntity extends BaseEntity>(
  validated: RequestQueryFields,
  includesOptions: Record<string, boolean>,
  queryConfig?: QueryConfig<TEntity>
): string[] {
  const allowed: (string | keyof TEntity)[] = []

  const includeKeys = Object.keys(includesOptions)
  const fields = validated.fields
    ? validated.fields?.split(",")
    : queryConfig?.defaultFields || []
  const expand =
    validated.expand || includeKeys.length
      ? [...(validated.expand?.split(",") || []), ...includeKeys]
      : queryConfig?.defaultRelations || []

  allowed.push(...fields, ...expand)

  return allowed as string[]
}
