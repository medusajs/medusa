import { BigNumberValue } from "@medusajs/framework/types";

/* Entity: StoreCreditAccount */
export type ModuleStoreCreditAccount = {
  id: string;
  customer_id?: string;
  code?: string;
  currency_code: string;
  credits: BigNumberValue;
  debits: BigNumberValue;
  balance: BigNumberValue;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ModuleCreateStoreCreditAccount = {
  code?: string;
  customer_id?: string;
  currency_code: string;
  metadata?: Record<string, unknown>;
};

export type ModuleCreditStoreCreditAccount = {
  account_id: string;
  amount: number;
  note?: string;
  reference?: string;
  reference_id?: string;
};

export type ModuleUpdateStoreCreditAccount = {
  id: string;
  customer_id?: string;
  currency_code?: string;
  metadata?: Record<string, unknown>;
};

/* Entity: AccountTransaction */

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

export type TransactionTypeValues =
  | TransactionType.CREDIT
  | TransactionType.DEBIT;

export type ModuleAccountTransaction = {
  id: string;
  account_id: string;
  type: TransactionTypeValues;
  amount: BigNumberValue;
  account: ModuleStoreCreditAccount;
  note?: string;
  reference?: string;
  reference_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ModuleCreateAccountTransaction = {
  account_id: string;
  amount: BigNumberValue;
  type: TransactionTypeValues;
  note?: string;
  reference?: string;
  reference_id?: string;
  metadata?: Record<string, unknown>;
};

export type ModuleCreditAccount = {
  account_id: string;
  amount: BigNumberValue;
  note?: string;
  reference: string;
  reference_id: string;
};

export type ModuleDebitAccount = {
  account_id: string;
  amount: BigNumberValue;
  note?: string;
  reference: string;
  reference_id: string;
};

export type ModuleRetrieveAccountStats = {
  account_id: string;
};

export type ModuleAccountStats = {
  id: string;
  balance: BigNumberValue;
  credits: BigNumberValue;
  debits: BigNumberValue;
};
