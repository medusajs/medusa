import { z } from "zod"

export const createBatchBody = (
  createValidator: z.ZodType,
  updateValidator: z.ZodType,
  deleteValidator: z.ZodType = z.string()
) => {
  return z.object({
    create: z.array(createValidator).optional(),
    update: z.array(updateValidator).optional(),
    delete: z.array(deleteValidator).optional(),
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
    fields: z.string().optional(),
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
          .optional()
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
          .optional()
          .default(limit ?? 20)
      ),
      order: order
        ? z.string().optional().default(order)
        : z.string().optional(),
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

  let unionType: any = z.union([type, z.array(type)]).optional()
  let arrayType: any = z.array(type).optional()
  let simpleType: any = type.optional()

  if (valueParser) {
    unionType = z
      .preprocess(valueParser, z.union([type, z.array(type)]))
      .optional()
    arrayType = z.preprocess(valueParser, z.array(type)).optional()
    simpleType = z.preprocess(valueParser, type).optional()
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
