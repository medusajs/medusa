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

const optionalBooleanMapper = new Map([
  ["undefined", undefined],
  ["null", null],
  ["true", true],
  ["false", false],
])

/**
 * @deprecated Use `booleanString` instead
 * It support the chainable API of zod. Please note it does not come with `.optional()` by default
 */
export const OptionalBooleanValidator = z.preprocess(
  (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
  z.boolean().optional()
)

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
