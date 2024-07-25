import { BaseEntity, QueryConfig, RequestQueryFields } from "@medusajs/types"
import { NextFunction } from "express"
import { omit } from "lodash"
import { z } from "zod"
import { MedusaRequest, MedusaResponse } from "../../types/routing"
import { removeUndefinedProperties } from "../../utils"
import {
  prepareListQuery,
  prepareRetrieveQuery,
} from "../../utils/get-query-config"
import { zodValidator } from "./zod-helper"
import { MedusaError } from "@medusajs/utils"

/**
 * Normalize an input query, especially from array like query params to an array type
 * e.g: /admin/orders/?fields[]=id,status,cart_id becomes { fields: ["id", "status", "cart_id"] }
 *
 * We only support up to 2 levels of depth for query params in order to have a somewhat readable query param, and limit possible performance issues
 */
const normalizeQuery = (req: MedusaRequest) => {
  return Object.entries(req.query).reduce((acc, [key, val]) => {
    let normalizedValue = val
    if (Array.isArray(val) && val.length === 1 && typeof val[0] === "string") {
      normalizedValue = val[0].split(",")
    }

    if (key.includes(".")) {
      const [parent, child, ...others] = key.split(".")
      if (others.length > 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          `Key accessor more than 2 levels deep: ${key}`
        )
      }

      if (!acc[parent]) {
        acc[parent] = {}
      }
      acc[parent] = {
        ...acc[parent],
        [child]: normalizedValue,
      }
    } else {
      acc[key] = normalizedValue
    }

    return acc
  }, {})
}

/**
 * Omit the non filterable config from the validated object
 * @param obj
 */
const getFilterableFields = <T extends RequestQueryFields>(obj: T): T => {
  const result = omit(obj, ["limit", "offset", "fields", "order"]) as T
  return removeUndefinedProperties(result)
}

export function validateAndTransformQuery<TEntity extends BaseEntity>(
  zodSchema:
    | z.ZodObject<any, any>
    | ((
        customSchema?: z.ZodObject<any, any>
      ) => z.ZodObject<any, any> | z.ZodEffects<any, any>),
  queryConfig: QueryConfig<TEntity>
): (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => Promise<void> {
  return async (req: MedusaRequest, _: MedusaResponse, next: NextFunction) => {
    try {
      const allowed = (req.allowed ?? queryConfig.allowed ?? []) as string[]
      delete req.allowed
      const query = normalizeQuery(req)

      let schema: z.ZodObject<any, any> | z.ZodEffects<any, any>
      const { queryParams: queryParamsToMerge } = req.extendedValidators ?? {}

      if (typeof zodSchema === "function") {
        schema = zodSchema(queryParamsToMerge)
      } else if (queryParamsToMerge) {
        schema = zodSchema.merge(queryParamsToMerge)
      } else {
        schema = zodSchema
      }

      const validated = await zodValidator(schema, query)
      const cnf = queryConfig.isList
        ? prepareListQuery(validated, { ...queryConfig, allowed })
        : prepareRetrieveQuery(validated, { ...queryConfig, allowed })

      req.validatedQuery = validated
      req.filterableFields = getFilterableFields(req.validatedQuery)
      req.remoteQueryConfig = cnf.remoteQueryConfig
      req.listConfig = (cnf as any).listConfig
      req.retrieveConfig = (cnf as any).retrieveConfig

      next()
    } catch (e) {
      next(e)
    }
  }
}
