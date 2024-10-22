import { BaseEntity, QueryConfig, RequestQueryFields } from "@medusajs/types"
import { MedusaError, removeUndefinedProperties } from "@medusajs/utils"
import { NextFunction } from "express"
import { omit } from "lodash"
import { z } from "zod"

import { zodValidator } from "../../zod/zod-helpers"
import { MedusaRequest, MedusaResponse } from "../types"
import { prepareListQuery, prepareRetrieveQuery } from "./get-query-config"

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
  zodSchema: z.ZodObject<any, any> | z.ZodEffects<any, any>,
  queryConfig: QueryConfig<TEntity>
): (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => Promise<void> {
  return async function validateQuery(
    req: MedusaRequest,
    _: MedusaResponse,
    next: NextFunction
  ) {
    try {
      const restricted = req.restrictedFields?.list()
      const allowed = queryConfig.allowed ?? []

      // If any custom allowed fields are set, we add them to the allowed list along side the one configured in the query config if any
      if (req.allowed?.length) {
        allowed.push(...req.allowed)
      }

      delete req.allowed
      const query = normalizeQuery(req)

      const validated = await zodValidator(zodSchema, query)
      const cnf = queryConfig.isList
        ? prepareListQuery(validated, { ...queryConfig, allowed, restricted })
        : prepareRetrieveQuery(validated, {
            ...queryConfig,
            allowed,
            restricted,
          })

      req.validatedQuery = validated
      req.filterableFields = getFilterableFields(req.validatedQuery)
      req.remoteQueryConfig = cnf.remoteQueryConfig as any
      req.listConfig = (cnf as any).listConfig
      req.retrieveConfig = (cnf as any).retrieveConfig

      next()
    } catch (e) {
      next(e)
    }
  }
}
