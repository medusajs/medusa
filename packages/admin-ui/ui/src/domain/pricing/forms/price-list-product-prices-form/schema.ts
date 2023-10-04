import * as z from "zod"

export const priceListProductPricesSchema = z.object({
  variants: z.record(
    z.string(),
    z.object({
      currency: z
        .record(
          z.string(),
          z.object({
            id: z.string().nullable().optional(),
            amount: z.string().nullable(),
          })
        )
        .optional(),
      region: z
        .record(
          z.string(),
          z.object({
            id: z.string().nullable().optional(),
            amount: z.string().nullable(),
          })
        )
        .optional(),
    })
  ),
})
