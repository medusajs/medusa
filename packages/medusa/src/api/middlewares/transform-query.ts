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

      if (
        (queryConfig?.defaultFields || validated.fields) &&
        (queryConfig?.defaultRelations || validated.expand)
      ) {
        req.allowedProperties = [
          ...(validated.fields
            ? validated.fields.split(",")
            : queryConfig?.allowedFields || [])!,
          ...(validated.expand
            ? validated.expand.split(",")
            : queryConfig?.allowedRelations || [])!,
        ] as unknown as string[]
      }

      const includesFields = Object.keys(req["includes"] ?? {})
      if (includesFields.length) {
        req.allowedProperties = req.allowedProperties ?? []
        req.allowedProperties.push(...includesFields)
      }

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
