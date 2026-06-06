import { z } from "@zjedene-medusa/framework/zod"
export const pricingContextResult = z.record(z.string(), z.any()).optional()
export const shippingOptionsContextResult = z.record(z.string(), z.any()).optional()
export const promotionContextResult = z.record(z.string(), z.any()).optional()
