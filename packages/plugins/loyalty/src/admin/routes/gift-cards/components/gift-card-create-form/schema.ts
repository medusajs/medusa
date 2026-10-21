import { z } from "zod"

export const GiftCardCreateSchema = z.object({
  value: z
    .object({
      value: z.string(),
      float: z.number().nullable(),
    })
    .refine(({ float }) => float !== null && float > 0, {
      error: "Value must be a positive number",
    }),
  currency_code: z.string({
    error: "Currency is required",
  }),
  expires_at: z.date().nullable().optional(),
  note: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
})
