import { z } from "@medusajs/framework/zod"
export const pricingContextResult = z.record(z.string(), z.any()).optional()
export const reservationAllocationsResult = z
  .array(
    z.object({
      line_item_id: z.string().optional(),
      inventory_item_id: z.string(),
      allocations: z
        .array(
          z.object({
            location_id: z.string(),
            quantity: z.any(),
          })
        )
        .min(1),
    })
  )
  .optional()
export const shippingOptionsContextResult = z.record(z.string(), z.any()).optional()
export const promotionContextResult = z.record(z.string(), z.any()).optional()
export const taxLineContextResult = z.record(z.string(), z.any()).optional()
