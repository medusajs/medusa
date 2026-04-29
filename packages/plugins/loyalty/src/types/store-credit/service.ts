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

/**
 * The filters to apply when retrieving store credit accounts.
 */
export interface ModuleStoreCreditAccountFilters
  extends BaseFilterable<ModuleStoreCreditAccountFilters> {
  /**
   * A search term to filter store credit accounts by.
   */
  q?: string;
  /**
   * Filter by store credit account ID(s).
   */
  id?: string | string[];
  /**
   * Filter by currency code(s).
   */
  currency_code?: string | string[];
  /**
   * Filter by customer ID(s).
   */
  customer_id?: string | string[];
  /**
   * The field to order results by.
   */
  order?: string;
}

/**
 * The filters to apply when listing account transactions.
 */
export interface ModuleListAccountTransactions
  extends BaseFilterable<ModuleListAccountTransactions> {
  /**
   * Filter by transaction ID(s).
   */
  id?: string | string[];
  /**
   * Filter by store credit account ID(s).
   */
  account_id?: string | string[];
  /**
   * The field to order results by.
   */
  order?: string;
}

/**
 * The main service interface for the StoreCredit Module.
 */
export interface IStoreCreditModuleService extends IModuleService {
  /* Entity: StoreCreditAccount */

  /**
   * This method creates a store credit account.
   *
   * @param {ModuleCreateStoreCreditAccount} data - The store credit account to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleStoreCreditAccount>} The created store credit account.
   *
   * @example
   * const account = await storeCreditModuleService.createStoreCreditAccounts({
   *   currency_code: "usd",
   *   customer_id: "cust_123",
   * })
   */
  createStoreCreditAccounts(
    data: ModuleCreateStoreCreditAccount,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount>;

  /**
   * This method creates store credit accounts.
   *
   * @param {ModuleCreateStoreCreditAccount[]} data - The store credit accounts to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleStoreCreditAccount[]>} The created store credit accounts.
   *
   * @example
   * const accounts = await storeCreditModuleService.createStoreCreditAccounts([
   *   {
   *     currency_code: "usd",
   *     customer_id: "cust_123",
   *   },
   * ])
   */
  createStoreCreditAccounts(
    data: ModuleCreateStoreCreditAccount[],
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount[]>;

  /**
   * This method updates a store credit account.
   *
   * @param {ModuleUpdateStoreCreditAccount} data - The attributes to update in the store credit account.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleStoreCreditAccount>} The updated store credit account.
   *
   * @example
   * const account = await storeCreditModuleService.updateStoreCreditAccounts({
   *   id: "sca_123",
   *   customer_id: "cust_456",
   * })
   */
  updateStoreCreditAccounts(
    data: ModuleUpdateStoreCreditAccount,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount>;

  /**
   * This method updates store credit accounts.
   *
   * @param {ModuleUpdateStoreCreditAccount[]} data - The attributes to update in the store credit accounts.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleStoreCreditAccount[]>} The updated store credit accounts.
   *
   * @example
   * const accounts = await storeCreditModuleService.updateStoreCreditAccounts([
   *   {
   *     id: "sca_123",
   *     customer_id: "cust_456",
   *   },
   * ])
   */
  updateStoreCreditAccounts(
    data: ModuleUpdateStoreCreditAccount[],
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount[]>;

  /**
   * This method retrieves a paginated list of store credit accounts based on optional filters and configuration.
   *
   * @param {ModuleStoreCreditAccountFilters} filters - The filters to apply on the retrieved store credit accounts.
   * @param {FindConfig<ModuleStoreCreditAccount>} config - The configurations determining how the store credit accounts are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a store credit account.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleStoreCreditAccount[]>} The list of store credit accounts.
   *
   * @example
   * To retrieve a list of store credit accounts by customer:
   *
   * ```ts
   * const accounts = await storeCreditModuleService.listStoreCreditAccounts({
   *   id: ["sca_123", "sca_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the store credit accounts:
   * 
   * :::note
   * 
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   * 
   * :::
   *
   * ```ts
   * const accounts = await storeCreditModuleService.listStoreCreditAccounts(
   *   {
   *     id: ["sca_123", "sca_321"],
   *   },
   *   {
   *     relations: ["transactions"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const accounts = await storeCreditModuleService.listStoreCreditAccounts(
   *   { id: ["sca_123", "sca_321"] },
   *   { take: 20, skip: 2 }
   * )
   * ```
   */
  listStoreCreditAccounts(
    filters?: ModuleStoreCreditAccountFilters,
    config?: FindConfig<ModuleStoreCreditAccount>,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount[]>;

  /**
   * This method retrieves a store credit account by its ID.
   *
   * @param {string} id - The ID of the store credit account to retrieve.
   * @param {FindConfig<ModuleStoreCreditAccount>} config - The configurations determining how the store credit account is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a store credit account.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleStoreCreditAccount>} The retrieved store credit account.
   *
   * @example
   * A simple example that retrieves a store credit account by its ID:
   *
   * ```ts
   * const account = await storeCreditModuleService.retrieveStoreCreditAccount("sca_123")
   * ```
   *
   * To specify relations that should be retrieved:
   * 
   * :::note
   * 
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   * 
   * :::
   *
   * ```ts
   * const account = await storeCreditModuleService.retrieveStoreCreditAccount("sca_123", {
   *   relations: ["transactions"],
   * })
   * ```
   */
  retrieveStoreCreditAccount(
    id: string,
    config?: FindConfig<ModuleStoreCreditAccount>,
    sharedContext?: Context
  ): Promise<ModuleStoreCreditAccount>;

  /**
   * This method deletes store credit accounts by their IDs.
   *
   * @param {string[]} ids - The IDs of the store credit accounts to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the store credit accounts are deleted successfully.
   *
   * @example
   * await storeCreditModuleService.deleteStoreCreditAccounts(["sca_123", "sca_456"])
   */
  deleteStoreCreditAccounts(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>;

  /**
   * This method soft deletes store credit accounts by their IDs. Soft-deleted accounts can be restored using the {@link restoreStoreCreditAccounts} method.
   *
   * @param {string[]} ids - The IDs of the store credit accounts to soft delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the store credit accounts are soft deleted successfully.
   *
   * @example
   * await storeCreditModuleService.softDeleteStoreCreditAccounts(["sca_123"])
   */
  softDeleteStoreCreditAccounts(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>;

  /**
   * This method restores soft-deleted store credit accounts by their IDs.
   *
   * @param {string[]} ids - The IDs of the store credit accounts to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore and return.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<TReturnableLinkableKeys, string[]> | void>} The IDs of restored linked records, or void if no linkable keys are requested.
   *
   * @example
   * await storeCreditModuleService.restoreStoreCreditAccounts(["sca_123"])
   */
  restoreStoreCreditAccounts<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>;

  /* Entity: AccountTransaction */

  /**
   * This method retrieves a list of account transactions based on the provided filters.
   *
   * @param {ModuleListAccountTransactions} filters - The filters to apply on the retrieved transactions.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleAccountTransaction[]>} The list of account transactions.
   *
   * @example
   * To retrieve a list of account transactions by ID:
   *
   * ```ts
   * const transactions = await storeCreditModuleService.listAccountTransactions({
   *   id: ["txn_123", "txn_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the account transactions:
   * 
   * :::note
   * 
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   * 
   * :::
   *
   * ```ts
   * const transactions = await storeCreditModuleService.listAccountTransactions({
   *   id: ["txn_123", "txn_321"],
   * }, {
   *   relations: ["account"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const transactions = await storeCreditModuleService.listAccountTransactions(
   *   { id: ["txn_123", "txn_321"] },
   *   { take: 20, skip: 2 }
   * )
   * ```
   */
  listAccountTransactions(
    filters: ModuleListAccountTransactions,
    sharedContext?: Context
  ): Promise<ModuleAccountTransaction[]>;

  /**
   * This method retrieves the balance statistics for a store credit account.
   *
   * @param {ModuleRetrieveAccountStats} filters - The filters to identify the account to retrieve stats for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleAccountStats>} The account statistics including balance, credits, and debits.
   *
   * @example
   * const stats = await storeCreditModuleService.retrieveAccountStats({
   *   account_id: "sca_123",
   * })
   */
  retrieveAccountStats(
    filters: ModuleRetrieveAccountStats,
    sharedContext?: Context
  ): Promise<ModuleAccountStats>;

  /**
   * This method credits one or more store credit accounts by creating credit transactions.
   *
   * @param {ModuleCreditAccount[]} data - The credit transactions to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleAccountTransaction[]>} The created credit transactions.
   *
   * @example
   * const transactions = await storeCreditModuleService.creditAccounts([
   *   {
   *     account_id: "sca_123",
   *     amount: 100,
   *     reference: "order",
   *     reference_id: "order_123",
   *   },
   * ])
   */
  creditAccounts(
    data: ModuleCreditAccount[],
    sharedContext?: Context
  ): Promise<ModuleAccountTransaction[]>;

  /**
   * This method debits one or more store credit accounts by creating debit transactions.
   *
   * @param {ModuleDebitAccount[]} data - The debit transactions to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleAccountTransaction[]>} The created debit transactions.
   *
   * @example
   * const transactions = await storeCreditModuleService.debitAccounts([
   *   {
   *     account_id: "sca_123",
   *     amount: 50,
   *     reference: "cart",
   *     reference_id: "cart_123",
   *   },
   * ])
   */
  debitAccounts(
    data: ModuleDebitAccount[],
    sharedContext?: Context
  ): Promise<ModuleAccountTransaction[]>;

  /**
   * This method deletes account transactions by their IDs.
   *
   * @param {string[]} ids - The IDs of the transactions to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the transactions are deleted successfully.
   *
   * @example
   * await storeCreditModuleService.deleteTransactions(["txn_123", "txn_456"])
   */
  deleteTransactions(ids: string[], sharedContext?: Context): Promise<void>;
}
