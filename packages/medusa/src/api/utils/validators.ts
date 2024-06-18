import { z } from "zod"

export const createBatchBody = (
  createValidator: z.ZodType,
  updateValidator: z.ZodType,
  deleteValidator: z.ZodType = z.string()
) => {
  return z.object({
    create: z.array(createValidator).nullish(),
    update: z.array(updateValidator).nullish(),
    delete: z.array(deleteValidator).nullish(),
  })
}

export const createLinkBody = () => {
  return z.object({
    add: z.array(z.string()).optional(),
    remove: z.array(z.string()).optional(),
  })
}

export const createSelectParams = () => {
  return z.object({
    fields: z.string().nullish(),
  })
}

export const createFindParams = ({
  offset,
  limit,
  order,
}: {
  offset?: number
  limit?: number
  order?: string
} = {}) => {
  const selectParams = createSelectParams()

  return selectParams.merge(
    z.object({
      offset: z.preprocess(
        (val) => {
          if (val && typeof val === "string") {
            return parseInt(val)
          }
          return val
        },
        z
          .number()
          .nullish()
          .default(offset ?? 0)
      ),
      limit: z.preprocess(
        (val) => {
          if (val && typeof val === "string") {
            return parseInt(val)
          }
          return val
        },
        z
          .number()
          .nullish()
          .default(limit ?? 20)
      ),
      order: order ? z.string().nullish().default(order) : z.string().nullish(),
    })
  )
}

export const createOperatorMap = (
  type?: z.ZodType,
  valueParser?: (val: any) => any
) => {
  if (!type) {
    type = z.string()
  }

  let unionType: any = z.union([type, z.array(type)]).nullish()
  let arrayType: any = z.array(type).nullish()
  let simpleType: any = type.nullish()

  if (valueParser) {
    unionType = z
      .preprocess(valueParser, z.union([type, z.array(type)]))
      .nullish()
    arrayType = z.preprocess(valueParser, z.array(type)).nullish()
    simpleType = z.preprocess(valueParser, type).nullish()
  }

  return z.object({
    $eq: unionType,
    $ne: unionType,
    $in: arrayType,
    $nin: arrayType,
    $like: simpleType,
    $ilike: simpleType,
    $re: simpleType,
    $contains: simpleType,
    $gt: simpleType,
    $gte: simpleType,
    $lt: simpleType,
    $lte: simpleType,
  })
}
