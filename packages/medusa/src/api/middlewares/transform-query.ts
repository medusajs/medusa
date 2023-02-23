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

export function transformQuery<
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

      req.filterableFields = omit(validated, [
        "limit",
        "offset",
        "expand",
        "fields",
        "order",
      ])
      req.filterableFields = removeUndefinedProperties(req.filterableFields)

      req.storeAllowedProperties = getStoreAllowedProperties(
        validated,
        req.includes ?? {},
        queryConfig
      )

      req.adminAllowedProperties = getAdminAllowedProperties(
        validated,
        req.includes ?? {},
        queryConfig
      )

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

      next()
    } catch (e) {
      next(e)
    }
  }
}

/**
 * Build the store allowed props based on the custom fields query params, the defaults and the includes options.
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
  if (
    (queryConfig?.defaultFields || validated.fields) &&
    (queryConfig?.defaultRelations || validated.expand)
  ) {
    allowed.push(
      ...(validated.fields
        ? validated.fields.split(",")
        : queryConfig?.allowedFields || []),
      ...(validated.expand
        ? validated.expand.split(",")
        : queryConfig?.allowedRelations || [])
    )
  }

  const includeKeys = Object.keys(includesOptions)
  if (includeKeys) {
    allowed.push(...includeKeys)
  }

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
function getAdminAllowedProperties<TEntity extends BaseEntity>(
  validated: RequestQueryFields,
  includesOptions: Record<string, boolean>,
  queryConfig?: QueryConfig<TEntity>
): string[] {
  const allowed: string[] = []
  if (validated.fields || validated.expand) {
    allowed.push(
      ...(validated.fields?.split(",") ?? []),
      ...(validated.expand?.split(",") ?? [])
    )
  }

  const includeKeys = Object.keys(includesOptions)
  if (includeKeys) {
    allowed.push(...includeKeys)
  }

  return allowed
}
