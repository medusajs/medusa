import { BigNumberValue } from "@medusajs/framework/types";

/* Entity: StoreCreditAccount */

/**
 * Represents a store credit account in the Store Credit Module.
 */
export type ModuleStoreCreditAccount = {
  /**
   * The store credit account's ID.
   */
  id: string;
  /**
   * The ID of the customer who owns this account, if any.
   */
  customer_id?: string;
  /**
   * The unique code that identifies this account, used for anonymous or gift card accounts.
   */
  code?: string;
  /**
   * The three-letter ISO currency code of the account's balance.
   * 
   * @example usd
   */
  currency_code: string;
  /**
   * The total amount credited to this account.
   */
  credits: BigNumberValue;
  /**
   * The total amount debited from this account.
   */
  debits: BigNumberValue;
  /**
   * The current balance of this account (credits minus debits).
   */
  balance: BigNumberValue;
  /**
   * Custom key-value pairs attached to this account.
   */
  metadata: Record<string, unknown>;
  /**
   * The date the account was created.
   */
  created_at: string;
  /**
   * The date the account was last updated.
   */
  updated_at: string;
};

/**
 * The data required to create a store credit account.
 */
export type ModuleCreateStoreCreditAccount = {
  /**
   * The unique code for the account. If not provided, one is auto-generated.
   */
  code?: string;
  /**
   * The ID of the customer to associate with the account.
   */
  customer_id?: string;
  /**
   * The three-letter ISO currency code for the account.
   * 
   * @example usd
   */
  currency_code: string;
  /**
   * Custom key-value pairs to attach to the account.
   */
  metadata?: Record<string, unknown>;
};

/**
 * The data required to credit a store credit account with an amount.
 */
export type ModuleCreditStoreCreditAccount = {
  /**
   * The ID of the store credit account to credit.
   */
  account_id: string;
  /**
   * The amount to credit to the account.
   */
  amount: number;
  /**
   * An optional note describing the credit transaction.
   */
  note?: string;
  /**
   * The resource type this credit references (for example, "order", "gift_card").
   */
  reference?: string;
  /**
   * The ID of the referenced resource.
   */
  reference_id?: string;
};

/**
 * The data required to update a store credit account.
 */
export type ModuleUpdateStoreCreditAccount = {
  /**
   * The ID of the store credit account to update.
   */
  id: string;
  /**
   * The ID of the customer to associate with the account.
   */
  customer_id?: string;
  /**
   * The three-letter ISO currency code to update.
   */
  currency_code?: string;
  /**
   * Custom key-value pairs to update on the account.
   */
  metadata?: Record<string, unknown>;
};

/* Entity: AccountTransaction */

/**
 * The type of an account transaction.
 */
export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

/**
 * A union of the possible transaction type string values.
 */
export type TransactionTypeValues =
  | TransactionType.CREDIT
  | TransactionType.DEBIT;

/**
 * Represents a transaction on a store credit account.
 */
export type ModuleAccountTransaction = {
  /**
   * The transaction's ID.
   */
  id: string;
  /**
   * The ID of the store credit account this transaction belongs to.
   */
  account_id: string;
  /**
   * Whether this is a credit or debit transaction.
   */
  type: TransactionTypeValues;
  /**
   * The transaction amount.
   */
  amount: BigNumberValue;
  /**
   * The store credit account this transaction belongs to.
   */
  account: ModuleStoreCreditAccount;
  /**
   * An optional note describing the transaction.
   */
  note?: string;
  /**
   * The resource type this transaction references (for example, "order", "cart").
   */
  reference?: string;
  /**
   * The ID of the referenced resource.
   */
  reference_id?: string;
  /**
   * Custom key-value pairs attached to this transaction.
   */
  metadata: Record<string, unknown>;
  /**
   * The date the transaction was created.
   */
  created_at: string;
  /**
   * The date the transaction was last updated.
   */
  updated_at: string;
};

/**
 * The data required to create an account transaction.
 */
export type ModuleCreateAccountTransaction = {
  /**
   * The ID of the store credit account to transact on.
   */
  account_id: string;
  /**
   * The transaction amount.
   */
  amount: BigNumberValue;
  /**
   * Whether this is a credit or debit transaction.
   */
  type: TransactionTypeValues;
  /**
   * An optional note describing the transaction.
   */
  note?: string;
  /**
   * The resource type this transaction references.
   */
  reference?: string;
  /**
   * The ID of the referenced resource.
   */
  reference_id?: string;
  /**
   * Custom key-value pairs to attach to the transaction.
   */
  metadata?: Record<string, unknown>;
};

/**
 * The data required to credit a store credit account.
 */
export type ModuleCreditAccount = {
  /**
   * The ID of the store credit account to credit.
   */
  account_id: string;
  /**
   * The amount to credit.
   */
  amount: BigNumberValue;
  /**
   * An optional note describing the credit.
   */
  note?: string;
  /**
   * The resource type this credit references (for example, "cart", "order").
   */
  reference: string;
  /**
   * The ID of the referenced resource.
   */
  reference_id: string;
};

/**
 * The data required to debit a store credit account.
 */
export type ModuleDebitAccount = {
  /**
   * The ID of the store credit account to debit.
   */
  account_id: string;
  /**
   * The amount to debit.
   */
  amount: BigNumberValue;
  /**
   * An optional note describing the debit.
   */
  note?: string;
  /**
   * The resource type this debit references (for example, "cart", "order").
   */
  reference: string;
  /**
   * The ID of the referenced resource.
   */
  reference_id: string;
};

/**
 * The data required to retrieve statistics for a store credit account.
 */
export type ModuleRetrieveAccountStats = {
  /**
   * The ID of the store credit account to retrieve stats for.
   */
  account_id: string;
};

/**
 * Aggregated balance statistics for a store credit account.
 */
export type ModuleAccountStats = {
  /**
   * The store credit account's ID.
   */
  id: string;
  /**
   * The current balance of the account (credits minus debits).
   */
  balance: BigNumberValue;
  /**
   * The total amount credited to the account.
   */
  credits: BigNumberValue;
  /**
   * The total amount debited from the account.
   */
  debits: BigNumberValue;
};
