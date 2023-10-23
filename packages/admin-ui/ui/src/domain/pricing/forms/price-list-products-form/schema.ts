import * as z from "zod"

export const priceListProductsSchema = z.object({
  ids: z.string().array().min(1, {
    message: "At least one product must be selected",
  }),
})
