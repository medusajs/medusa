import {
  createFindParams,
  createOperatorMap,
} from "@medusajs/medusa/api/utils/validators";
import { z } from "@medusajs/framework/zod";
import { GiftCardStatus } from "../../../types";

export type AdminGetGiftCardsParamsType = z.infer<
  typeof AdminGetGiftCardsParams
>;
export const AdminGetGiftCardsParams = z.strictObject({
  ...createFindParams({
    limit: 15,
    offset: 0,
  }).shape,
  q: z.string().optional(),
  customer_id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  reference_id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  reference: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  status: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
});

export type AdminGetGiftCardOrdersParamsType = z.infer<
  typeof AdminGetGiftCardOrdersParams
>;
export const AdminGetGiftCardOrdersParams = z.strictObject({
  fields: z.string().optional(),
});

export type AdminCreateGiftCardType = z.infer<typeof AdminCreateGiftCard>;
export const AdminCreateGiftCard = z.strictObject({
  status: z
    .enum([GiftCardStatus.PENDING, GiftCardStatus.REDEEMED])
    .default(GiftCardStatus.PENDING),
  currency_code: z.string(),
  value: z.number().min(1),
  code: z.string().optional(),
  expires_at: z.string().nullish(),
  reference: z.string().optional(),
  reference_id: z.string().optional(),
  line_item_id: z.string().optional(),
  note: z.string().nullish(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AdminUpdateGiftCardType = z.infer<typeof AdminUpdateGiftCard>;
export const AdminUpdateGiftCard = z.strictObject({
  status: z
    .enum([GiftCardStatus.PENDING, GiftCardStatus.REDEEMED])
    .optional(),
  note: z.string().nullish(),
  expires_at: z.string().nullish(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
