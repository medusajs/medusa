import { z } from "@medusajs/framework/zod";

export type StoreAddGiftCardToCartType = z.infer<typeof StoreAddGiftCardToCart>;
export const StoreAddGiftCardToCart = z.strictObject({
  code: z.string(),
});

export type StoreRemoveGiftCardFromCartType = z.infer<
  typeof StoreRemoveGiftCardFromCart
>;
export const StoreRemoveGiftCardFromCart = z.strictObject({
  code: z.string(),
});

export type StoreAddStoreCreditsToCartType = z.infer<
  typeof StoreAddStoreCreditsToCart
>;
export const StoreAddStoreCreditsToCart = z.object({
  amount: z.number().optional(),
});
