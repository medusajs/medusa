import { NextFunction } from "express"
import { MedusaRequest, MedusaResponse } from "../../types/routing"
import { zodValidator } from "./validate-body"
import { z } from "zod"
import { removeUndefinedProperties } from "../../utils"
import { omit } from "lodash"
import { BaseEntity, QueryConfig, RequestQueryFields } from "@medusajs/types"
import {
  prepareListQuery,
  prepareRetrieveQuery,
} from "../../utils/get-query-config"
import { FindConfig } from "@medusajs/types"
/**
 * Normalize an input query, especially from array like query params to an array type
 * e.g: /admin/orders/?fields[]=id,status,cart_id becomes { fields: ["id", "status", "cart_id"] }
 */
const normalizeQuery = (req: MedusaRequest) => {
  return Object.entries(req.query).reduce((acc, [key, val]) => {
    if (Array.isArray(val) && val.length === 1) {
      acc[key] = (val as string[])[0].split(",")
    } else {
      acc[key] = val
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
  zodSchema: z.ZodObject<any, any>,
  queryConfig: QueryConfig<TEntity>,
  config?: {
    strict?: boolean
  }
): (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => Promise<void> {
  return async (req: MedusaRequest, _: MedusaResponse, next: NextFunction) => {
    try {
      const query = normalizeQuery(req)
      const validated = await zodValidator(zodSchema, query, config)
      const cnf = queryConfig.isList
        ? prepareListQuery(validated, queryConfig)
        : prepareRetrieveQuery(validated, queryConfig)

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
