import { z } from "@medusajs/framework/zod"

/**
 * Schema for pricing context result data structure.
 */
export const pricingContextResult = z.record(z.string(), z.any()).optional()

/**
 * Schema for shipping options context result data structure.
 */
export const shippingOptionsContextResult = z.record(z.string(), z.any()).optional()

/**
 * Schema for promotion context result data structure.
 */
export const promotionContextResult = z.record(z.string(), z.any()).optional()

/**
 * Schema for tax line context result data structure.
 *
 * @since 2.15.6
 */
export const taxLineContextResult = z.record(z.string(), z.any()).optional()
