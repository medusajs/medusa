import { z } from "zod"

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

export const createOperatorMap = (type?: z.ZodType) => {
  if (!type) {
    type = z.string()
  }
  return z.object({
    $eq: z.union([type, z.array(type)]).optional(),
    $ne: z.union([type, z.array(type)]).optional(),
    $in: z.array(type).optional(),
    $nin: z.array(type).optional(),
    $like: type.optional(),
    $re: type.optional(),
    $contains: type.optional(),
    $gt: type.optional(),
    $gte: type.optional(),
    $lt: type.optional(),
    $lte: type.optional(),
  })
}
