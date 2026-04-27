import {
  createFindParams,
  createOperatorMap,
} from "@medusajs/medusa/api/utils/validators";
import { z } from "@medusajs/framework/zod";

export type AdminGetStoreCreditAccountsParamsType = z.infer<
  typeof AdminGetStoreCreditAccountsParams
>;
export const AdminGetStoreCreditAccountsParams = z.strictObject({
  ...createFindParams({
    limit: 15,
    offset: 0,
  }).shape,
  q: z.string().optional(),
  id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  currency_code: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  customer_id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  updated_at: createOperatorMap().optional(),
  created_at: createOperatorMap().optional(),
});

export type AdminCreateStoreCreditAccountType = z.infer<
  typeof AdminCreateStoreCreditAccount
>;
export const AdminCreateStoreCreditAccount = z.strictObject({
  currency_code: z.string(),
  customer_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type AdminCreditStoreCreditAccountParamsType = z.infer<
  typeof AdminCreditStoreCreditAccountParams
>;
export const AdminCreditStoreCreditAccountParams = z.object({
  amount: z.number(),
  note: z.string().optional(),
});

export type AdminGetStoreCreditAccountTransactionsParamsType = z.infer<
  typeof AdminGetStoreCreditAccountTransactionsParams
>;
export const AdminGetStoreCreditAccountTransactionsParams = z.strictObject({
  ...createFindParams({
    limit: 15,
    offset: 0,
  }).shape,
  q: z.string().optional(),
  id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  updated_at: createOperatorMap().optional(),
  created_at: createOperatorMap().optional(),
});
