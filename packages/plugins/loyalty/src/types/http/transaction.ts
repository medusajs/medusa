import {
  BaseFilterable,
  FindParams,
  OperatorMap,
  PaginatedResponse,
} from "@medusajs/framework/types";
import {
  ModuleAccountTransaction,
  ModuleCreateAccountTransaction,
} from "../store-credit";
import { AdminStoreCreditAccount } from "./store-credit-account";

export interface AdminGetTransactionsParams
  extends FindParams,
    BaseFilterable<AdminGetTransactionsParams> {
  q?: string;
  id?: string | string[];
  transaction_group_id?: string | string[];
  created_at?: OperatorMap<string>;
  updated_at?: OperatorMap<string>;
}

export interface AdminCreateTransactionParams extends ModuleCreateAccountTransaction {}

export interface AdminTransaction extends ModuleAccountTransaction {
  account: AdminStoreCreditAccount
}

export interface AdminTransactionsResponse extends PaginatedResponse<{
  transactions: AdminTransaction[];
}> {}
