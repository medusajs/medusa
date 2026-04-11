import { z } from "@medusajs/framework/zod"
export const pricingContextResult = z.record(z.string(), z.any()).optional()
export const shippingOptionsContextResult = z.record(z.string(), z.any()).optional()
