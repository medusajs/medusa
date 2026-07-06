import {
  AdminCustomer,
  BaseFilterable,
  FindParams,
  OperatorMap,
  PaginatedResponse,
  StoreCustomer,
} from "@medusajs/framework/types";
import { ModuleStoreCreditAccount } from "../store-credit";

export interface AdminGetStoreCreditAccountsParams
  extends FindParams,
    BaseFilterable<AdminGetStoreCreditAccountsParams> {
  id?: string | string[];
  code?: string | string[];
  customer_id?: string | string[];
  currency_code?: string | string[];
  created_at?: OperatorMap<string>;
  updated_at?: OperatorMap<string>;
}

export interface AdminStoreCreditAccount extends ModuleStoreCreditAccount {
  customer: AdminCustomer;
}

export interface AdminStoreCreditAccountsResponse
  extends PaginatedResponse<{
    store_credit_accounts: AdminStoreCreditAccount[];
  }> {}

export interface AdminStoreCreditAccountResponse {
  store_credit_account: AdminStoreCreditAccount;
}

export interface AdminCreateStoreCreditAccount {
  currency_code: string;
  customer_id?: string;
  metadata?: Record<string, unknown>;
}

export interface AdminCreditStoreCreditAccount {
  amount: number;
  note?: string;
}

export interface StoreAddStoreCreditsToCart {
  amount: number;
}

export interface StoreStoreCreditAccount extends ModuleStoreCreditAccount {
  customer: StoreCustomer;
}

export interface StoreStoreCreditAccountResponse {
  store_credit_account: StoreStoreCreditAccount;
}

export interface StoreGetStoreCreditAccountsParams
  extends FindParams,
    BaseFilterable<StoreGetStoreCreditAccountsParams> {
  currency_code?: string;
  created_at?: OperatorMap<string>;
  updated_at?: OperatorMap<string>;
}

export interface StoreStoreCreditAccountsResponse
  extends PaginatedResponse<{
    store_credit_accounts: StoreStoreCreditAccount[];
  }> {}

export interface StoreClaimStoreCreditAccountParams {
  code: string;
}

export interface StoreClaimStoreCreditAccountResponse {
  store_credit_account: StoreStoreCreditAccount;
}

export interface AdminCreditStoreCreditAccountParams {
  amount: number;
  note?: string;
}

export interface AdminCreditStoreCreditAccountResponse {
  store_credit_account: AdminStoreCreditAccount;
}
