import { z } from "zod"

export const AddressPayload = z
  .object({
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    phone: z.string().nullish(),
    company: z.string().nullish(),
    address_1: z.string().nullish(),
    address_2: z.string().nullish(),
    city: z.string().nullish(),
    country_code: z.string().nullish(),
    province: z.string().nullish(),
    postal_code: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export const BigNumberInput = z.union([
  z.number(),
  z.string(),
  z.object({
    value: z.string(),
    precision: z.number(),
  }),
])

/**
 * Return a zod object to apply the $and and $or operators on a schema.
 *
 * @param {ZodObject<any>} schema
 * @return {ZodObject<any>}
 */
export const applyAndAndOrOperators = (schema: z.ZodObject<any>) => {
  return schema.merge(
    z.object({
      $and: z.lazy(() => schema.array()).optional(),
      $or: z.lazy(() => schema.array()).optional(),
    })
  )
}

/**
 * Validates that a value is a boolean when it is passed as a string.
 */
export const booleanString = () =>
  z
    .union([z.boolean(), z.string()])
    .refine((value) => {
      return ["true", "false"].includes(value.toString().toLowerCase())
    })
    .transform((value) => {
      return value.toString().toLowerCase() === "true"
    })

/**
 * Apply a transformer on a schema when the data are validated and recursively normalize the data $and and $or.
 *
 * @param {(data: Data) => NormalizedData} transform
 * @return {(data: Data) => NormalizedData}
 */
export function recursivelyNormalizeSchema<
  Data extends object,
  NormalizedData extends object
>(transform: (data: Data) => NormalizedData): (data: Data) => NormalizedData {
  return (data: any) => {
    const normalizedData = transform(data)

    Object.keys(normalizedData)
      .filter((key) => ["$and", "$or"].includes(key))
      .forEach((key) => {
        normalizedData[key] = normalizedData[key].map(transform)
      })

    return normalizedData
  }
}
