import { createSelectParams } from "@zjedene-medusa/medusa/api/utils/validators";
import { z } from "@zjedene-medusa/framework/zod";

export type StoreGetGiftCardsParamsType = z.infer<
  typeof StoreGetGiftCardParams
>;
export const StoreGetGiftCardParams = createSelectParams();

export type StoreRedeemGiftCardType = z.infer<typeof StoreRedeemGiftCard>;
export const StoreRedeemGiftCard = z.strictObject({});
