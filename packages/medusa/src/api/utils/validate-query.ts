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
import { zodValidator } from "./validate-body"

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
  zodSchema: z.ZodObject<any, any> | z.ZodEffects<any, any>,
  queryConfig: QueryConfig<TEntity>
): (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => Promise<void> {
  return async (req: MedusaRequest, _: MedusaResponse, next: NextFunction) => {
    try {
      const allowed = req.allowed ?? queryConfig.allowed ?? []
      delete req.allowed

      const query = normalizeQuery(req)
      const validated = await zodValidator(zodSchema, query)
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
