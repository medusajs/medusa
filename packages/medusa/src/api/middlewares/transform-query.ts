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
  queryConfig: QueryConfig<TEntity> = {},
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

      attachListOrRetrieveConfig<TEntity>(req, {
        ...queryConfig,
        allowed:
          req.allowed ?? queryConfig.allowed ?? queryConfig.allowedFields ?? [],
      })

      /**
       * TODO: the bellow allowedProperties should probably need to be reworked which would create breaking changes everywhere
       * cleanResponseData is used. It is in fact, what is expected to be returned which IMO
       * should correspond to the select/relations
       *
       * Kept it as it is to maintain backward compatibility
       */
      const queryConfigRes = !queryConfig.isList
        ? req.retrieveConfig
        : req.listConfig
      const includesRelations = Object.keys(req.includes ?? {})
      req.allowedProperties = Array.from(
        new Set(
          [
            ...(req.validatedQuery.fields
              ? queryConfigRes.select ?? []
              : req.allowed ??
                queryConfig.allowed ??
                queryConfig.allowedFields ??
                (queryConfig.defaults as string[]) ??
                queryConfig.defaultFields ??
                []),
            ...(req.validatedQuery.expand || includesRelations.length
              ? [...(validated.expand?.split(",") || []), ...includesRelations] // For backward compatibility, the includes takes precedence over the relations for the returnable fields
              : queryConfig.allowedRelations ?? queryConfigRes.relations ?? []), // For backward compatibility, the allowedRelations takes precedence over the relations for the returnable fields
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
 *
 * @deprecated use `transformQuery` instead
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
  const config = queryConfig.isList
    ? prepareListQuery(validated, queryConfig)
    : prepareRetrieveQuery(validated, queryConfig)

  req.listConfig = ("listConfig" in config &&
    config.listConfig) as FindConfig<any>
  req.retrieveConfig = ("retrieveConfig" in config &&
    config.retrieveConfig) as FindConfig<any>
  req.remoteQueryConfig = config.remoteQueryConfig
}
