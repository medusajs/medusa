import { NextFunction, Request, Response } from "express"
import { ClassConstructor } from "../../types/global"
import { validator } from "../../utils/validator"
import { ValidatorOptions } from "class-validator"
import { default as normalizeQuery } from "./normalized-query"
import { getListConfig, getRetrieveConfig } from "../../utils/get-query-config"
import { BaseEntity } from "../../interfaces/models/base-entity"
import { FindConfig } from "../../types/common"
import { omit } from "lodash"
import { MedusaError } from "medusa-core-utils/dist"

type QueryConfig<TEntity extends BaseEntity> = {
  defaultFields?: (keyof TEntity | string)[]
  defaultRelations?: string[]
  allowedFields?: string[]
  defaultLimit?: number
  isList: boolean
}

type QueryTypedClass = {
  expand?: string
  fields?: string
  offset?: number
  limit?: number
  order?: string
}

export function transformQuery<
  T extends QueryTypedClass,
  TEntity extends BaseEntity
>(
  plainToClass: ClassConstructor<T>,
  queryConfig: QueryConfig<TEntity> = {
    isList: true,
  },
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

      if (queryConfig.isList) {
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

function prepareListQuery<
  T extends QueryTypedClass,
  TEntity extends BaseEntity
>(validated: T, queryConfig: QueryConfig<TEntity>) {
  const { order, fields, expand, limit, offset } = validated

  let expandRelations: string[] | undefined = undefined
  if (expand) {
    expandRelations = expand.split(",")
  }

  let expandFields: (keyof TEntity)[] | undefined = undefined
  if (fields) {
    expandFields = fields.split(",") as (keyof TEntity)[]
  }

  let orderBy: { [k: symbol]: "DESC" | "ASC" } | undefined
  if (typeof order !== "undefined") {
    let orderField = order
    if (order.startsWith("-")) {
      const [, field] = order.split("-")
      orderField = field
      orderBy = { [field]: "DESC" }
    } else {
      orderBy = { [order]: "ASC" }
    }

    if (!(queryConfig.allowedFields || []).includes(orderField)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Order field must be a valid product field"
      )
    }
  }

  return getListConfig<TEntity>(
    queryConfig.defaultFields as (keyof TEntity)[],
    queryConfig.defaultRelations as string[],
    expandFields,
    expandRelations,
    limit ?? queryConfig.defaultLimit,
    offset ?? 0,
    orderBy
  )
}

function prepareRetrieveQuery<
  T extends QueryTypedClass,
  TEntity extends BaseEntity
>(validated: T, queryConfig: QueryConfig<TEntity>) {
  const { fields, expand } = validated

  let expandRelations: string[] = []
  if (expand) {
    expandRelations = expand.split(",")
  }

  let expandFields: (keyof TEntity)[] = []
  if (fields) {
    expandFields = fields.split(",") as (keyof TEntity)[]
  }

  return getRetrieveConfig<TEntity>(
    queryConfig.defaultFields as (keyof TEntity)[],
    queryConfig.defaultRelations as string[],
    expandFields,
    expandRelations
  )
}
