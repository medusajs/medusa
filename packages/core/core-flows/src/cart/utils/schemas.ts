import { z } from "@medusajs/framework/zod"

/**
 * Schema for validating pricing context result data.
 */
export const pricingContextResult = z.record(z.string(), z.any()).optional()

/**
 * Schema for validating shipping options context result data.
 */
export const shippingOptionsContextResult = z.record(z.string(), z.any()).optional()

/**
 * Schema for validating promotion context result data.
 *
 * @since 2.14.3
 */
export const promotionContextResult = z.record(z.string(), z.any()).optional()
