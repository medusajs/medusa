import { z } from "zod"
import { optionalBooleanMapper } from "../../../utils/validators/is-boolean"

export const AddressPayload = z
  .object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    city: z.string().optional(),
    country_code: z.string().optional(),
    province: z.string().optional(),
    postal_code: z.string().optional(),
    metadata: z.record(z.string()).optional().nullable(),
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

export const OptionalBooleanValidator = z.preprocess(
  (val: any) => optionalBooleanMapper.get(val?.toLowerCase()),
  z.boolean().optional()
)
