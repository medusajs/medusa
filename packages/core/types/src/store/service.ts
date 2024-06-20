import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableStoreProps, StoreDTO } from "./common"
import { CreateStoreDTO, UpdateStoreDTO, UpsertStoreDTO } from "./mutations"

/**
 * The main service interface for the Store Module.
 */
export interface IStoreModuleService extends IModuleService {
  /**
   * This method creates stores.
   *
   * @param {CreateStoreDTO[]} data - The stores to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO[]>} The created stores.
   *
   * @example
   * const stores = await storeModuleService.createStores([
   *   {
   *     name: "Acme",
   *     supported_currency_codes: ["usd", "eur"],
   *     default_currency_code: "usd",
   *   },
   *   {
   *     name: "Acme 2",
   *     supported_currency_codes: ["usd"],
   *     default_currency_code: "usd",
   *   },
   * ])
   */
  createStores(
    data: CreateStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreDTO[]>

  /**
   * This method creates a store.
   *
   * @param {CreateStoreDTO} data - The store to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO>} The created store.
   *
   * @example
   * const store = await storeModuleService.createStores({
   *   name: "Acme",
   *   supported_currency_codes: ["usd", "eur"],
   *   default_currency_code: "usd",
   * })
   */
  createStores(data: CreateStoreDTO, sharedContext?: Context): Promise<StoreDTO>

  /**
   * This method updates or creates stores if they don't exist.
   *
   * @param {UpsertStoreDTO[]} data - The attributes in the stores to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO[]>} The created or updated stores.
   *
   * @example
   * const stores = await storeModuleService.upsertStores([
   *   {
   *     id: "store_123",
   *     name: "Acme",
   *   },
   *   {
   *     name: "Acme 2",
   *     supported_currency_codes: ["usd"],
   *     default_currency_code: "usd",
   *   },
   * ])
   */
  upsertStores(
    data: UpsertStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreDTO[]>

  /**
   * This method updates or creates a store if it doesn't exist.
   *
   * @param {UpsertStoreDTO} data - The attributes in the store to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO>} The created or updated store.
   *
   * @example
   * const store = await storeModuleService.upsertStores({
   *   id: "store_123",
   *   name: "Acme",
   * })
   */
  upsertStores(data: UpsertStoreDTO, sharedContext?: Context): Promise<StoreDTO>

  /**
   * This method updates an existing store.
   *
   * @param {string} id - The ID of the store.
   * @param {UpdateStoreDTO} data - The attributes to update in the store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO>} The updated store.
   *
   * @example
   * const store = await storeModuleService.updateStores("store_123", {
   *   name: "Acme",
   * })
   */
  updateStores(
    id: string,
    data: UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreDTO>

  /**
   * This method updates existing stores matching the specified filters.
   *
   * @param {FilterableStoreProps} selector - The filters specifying which stores to update.
   * @param {UpdateStoreDTO} data - The attributes to update in the store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO[]>} The updated stores.
   *
   * @example
   * const store = await storeModuleService.updateStores(
   *   {
   *     name: ["Acme"],
   *   },
   *   {
   *     default_currency_code: "usd",
   *   }
   * )
   */
  updateStores(
    selector: FilterableStoreProps,
    data: UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreDTO[]>

  /**
   * This method deletes stores by their IDs.
   *
   * @param {string[]} ids - The IDs of the stores.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the stores are deleted successfully.
   *
   * @example
   * await storeModuleService.deleteStores(["store_123", "store_321"])
   */
  deleteStores(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a store by its ID.
   *
   * @param {string} id - The ID of the store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the store is deleted successfully.
   *
   * @example
   * await storeModuleService.deleteStores("store_123")
   */
  deleteStores(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a store by its ID.
   *
   * @param {string} id - The ID of the store.
   * @param {FindConfig<StoreDTO>} config - The configurations determining how the store is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO>} The retrieved store.
   *
   * @example
   * const store = await storeModuleService.retrieveStore("store_123")
   */
  retrieveStore(
    id: string,
    config?: FindConfig<StoreDTO>,
    sharedContext?: Context
  ): Promise<StoreDTO>

  /**
   * This method retrieves a paginated list of stores based on optional filters and configuration.
   *
   * @param {FilterableStoreProps} filters - The filters to apply on the retrieved stores.
   * @param {FindConfig<StoreDTO>} config - The configurations determining how the store is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO[]>} The list of stores.
   *
   * @example
   * To retrieve a list of stores using their IDs:
   *
   * ```ts
   * const stores = await storeModuleService.listStores({
   *   id: ["store_123", "store_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const stores = await storeModuleService.listStores(
   *   {
   *     id: ["store_123", "store_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listStores(
    filters?: FilterableStoreProps,
    config?: FindConfig<StoreDTO>,
    sharedContext?: Context
  ): Promise<StoreDTO[]>

  /**
   * This method retrieves a paginated list of stores along with the total count of available stores satisfying the provided filters.
   *
   * @param {FilterableStoreProps} filters - The filters to apply on the retrieved stores.
   * @param {FindConfig<StoreDTO>} config - The configurations determining how the store is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[StoreDTO[], number]>} The list of stores along with their total count.
   *
   * @example
   * To retrieve a list of stores using their IDs:
   *
   * ```ts
   * const [stores, count] = await storeModuleService.listAndCountStores(
   *   {
   *     id: ["store_123", "store_321"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [stores, count] = await storeModuleService.listAndCountStores(
   *   {
   *     id: ["store_123", "store_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAndCountStores(
    filters?: FilterableStoreProps,
    config?: FindConfig<StoreDTO>,
    sharedContext?: Context
  ): Promise<[StoreDTO[], number]>

  /**
   * This method soft deletes a store by its IDs.
   *
   * @param {string[]} storeIds - The IDs of the stores.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await storeModuleService.softDeleteStores([
   *   "store_123",
   *   "store_321",
   * ])
   */
  softDeleteStores<TReturnableLinkableKeys extends string = string>(
    storeIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores a soft deleted store by its IDs.
   *
   * @param {string[]} storeIds - The IDs of the stores.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the store. You can pass to its `returnLinkableKeys`
   * property any of the store's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await storeModuleService.restoreStores(["store_123", "store_321"])
   */
  restoreStores<TReturnableLinkableKeys extends string = string>(
    storeIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
