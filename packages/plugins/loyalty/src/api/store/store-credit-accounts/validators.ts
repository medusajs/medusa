import {
  createFindParams,
  createOperatorMap,
} from "@medusajs/medusa/api/utils/validators";
import { z } from "@medusajs/framework/zod";

export type StoreGetStoreCreditAccountParamsType = z.infer<
  typeof StoreGetStoreCreditAccountsParams
>;
export const StoreGetStoreCreditAccountParams = z.object({});

export type StoreClaimStoreCreditAccountParamsType = z.infer<
  typeof StoreClaimStoreCreditAccountParams
>;
export const StoreClaimStoreCreditAccountParams = z.object({
  code: z.string(),
});

export type StoreGetStoreCreditAccountsParamsType = z.infer<
  typeof StoreGetStoreCreditAccountsParams
>;
export const StoreGetStoreCreditAccountsParams = z.strictObject({
  ...createFindParams({
    limit: 15,
    offset: 0,
  }).shape,
  currency_code: z.string(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
});
