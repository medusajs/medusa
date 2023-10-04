import * as z from "zod"

export const priceListPricesSchema = z.object({
  products: z.record(
    z.string(),
    z.object({
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
  ),
})
