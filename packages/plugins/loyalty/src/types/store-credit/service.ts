import { RestoreReturn } from "@medusajs/framework/types";
import {
  BaseFilterable,
  Context,
  FindConfig,
  IModuleService,
} from "@medusajs/types";
import {
  ModuleAccountStats,
  ModuleAccountTransaction,
  ModuleCreateStoreCreditAccount,
  ModuleCreditAccount,
  ModuleDebitAccount,
  ModuleRetrieveAccountStats,
  ModuleStoreCreditAccount,
  ModuleUpdateStoreCreditAccount,
} from "./module";

export interface ModuleStoreCreditAccountFilters
  extends BaseFilterable<ModuleStoreCreditAccountFilters> {
  q?: string;
  id?: string | string[];
  currency_code?: string | string[];
  customer_id?: string | string[];
  order?: string;
}

export interface ModuleListAccountTransactions
  extends BaseFilterable<ModuleListAccountTransactions> {
  id?: string | string[];
  account_id?: string | string[];
  order?: string;
}

/**
 * The main service interface for the StoreCredit Module.
 */
export interface IStoreCreditModuleService extends IModuleService {
  /* Entity: StoreCreditAccount */
  createStoreCreditAccounts(
    data: ModuleCreateStoreCreditAccount,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount>;

  createStoreCreditAccounts(
    data: ModuleCreateStoreCreditAccount[],
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount[]>;

  updateStoreCreditAccounts(
    data: ModuleUpdateStoreCreditAccount,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount>;

  updateStoreCreditAccounts(
    data: ModuleUpdateStoreCreditAccount[],
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount[]>;

  listStoreCreditAccounts(
    filters?: ModuleStoreCreditAccountFilters,
    config?: FindConfig<ModuleStoreCreditAccount>,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount[]>;

  retrieveStoreCreditAccount(
    id: string,
    config?: FindConfig<ModuleStoreCreditAccount>,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount>;

  deleteStoreCreditAccounts(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>;

  softDeleteStoreCreditAccounts(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>;

  restoreStoreCreditAccounts<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>;

  /* Entity: AccountTransaction */

  listAccountTransactions(
    filters: ModuleListAccountTransactions,
    sharedContext?: Context
  ): Promise<ModuleAccountTransaction[]>;

  retrieveAccountStats(
    filters: ModuleRetrieveAccountStats,
    sharedContext?: Context
  ): Promise<ModuleAccountStats>;

  creditAccounts(
    data: ModuleCreditAccount[],
    sharedContext?: Context
  ): Promise<ModuleAccountTransaction[]>;

  debitAccounts(
    data: ModuleDebitAccount[],
    sharedContext?: Context
  ): Promise<ModuleAccountTransaction[]>;

  deleteTransactions(ids: string[], sharedContext?: Context): Promise<void>;
}
