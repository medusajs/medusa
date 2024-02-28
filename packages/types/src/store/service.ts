import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableStoreProps, StoreDTO } from "./common"
import { CreateStoreDTO, UpdateStoreDTO, UpsertStoreDTO } from "./mutations"

/**
 * The main service interface for the store module.
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
   * {example-code}
   */
  create(data: CreateStoreDTO[], sharedContext?: Context): Promise<StoreDTO[]>

  /**
   * This method creates a store.
   *
   * @param {CreateStoreDTO} data - The store to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO>} The created store.
   *
   * @example
   * {example-code}
   */
  create(data: CreateStoreDTO, sharedContext?: Context): Promise<StoreDTO>

  /**
   * This method updates existing stores, or creates new ones if they don't exist.
   *
   * @param {UpsertStoreDTO[]} data - The attributes to update or create in each store.
   * @returns {Promise<StoreDTO[]>} The updated and created stores.
   *
   * @example
   * {example-code}
   */
  upsert(data: UpsertStoreDTO[], sharedContext?: Context): Promise<StoreDTO[]>

  /**
   * This method updates an existing store, or creates a new one if it doesn't exist.
   *
   * @param {UpsertStoreDTO} data - The attributes to update or create for the store.
   * @returns {Promise<StoreDTO>} The updated or created store.
   *
   * @example
   * {example-code}
   */
  upsert(data: UpsertStoreDTO, sharedContext?: Context): Promise<StoreDTO>

  /**
   * This method updates an existing store.
   *
   * @param {string} id - The store's ID.
   * @param {UpdateStoreDTO} data - The details to update in the store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO>} The updated store.
   */
  update(
    id: string,
    data: UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreDTO>

  /**
   * This method updates existing stores.
   *
   * @param {FilterableStoreProps} selector - The filters to specify which stores should be updated.
   * @param {UpdateStoreDTO} data - The details to update in the stores.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO[]>} The updated stores.
   *
   * @example
   * {example-code}
   */
  update(
    selector: FilterableStoreProps,
    data: UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreDTO[]>

  /**
   * This method deletes stores by their IDs.
   *
   * @param {string[]} ids - The list of IDs of stores to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the stores are deleted.
   *
   * @example
   * {example-code}
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a store by its ID.
   *
   * @param {string} id - The ID of the store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the store is deleted.
   *
   * @example
   * {example-code}
   */
  delete(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a store by its ID.
   *
   * @param {string} id - The ID of the retrieve.
   * @param {FindConfig<StoreDTO>} config - The configurations determining how the store is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO>} The retrieved store.
   *
   * @example
   * A simple example that retrieves a {type name} by its ID:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  retrieve(
    id: string,
    config?: FindConfig<StoreDTO>,
    sharedContext?: Context
  ): Promise<StoreDTO>

  /**
   * This method retrieves a paginated list of stores based on optional filters and configuration.
   *
   * @param {FilterableStoreProps} filters - The filters to apply on the retrieved store.
   * @param {FindConfig<StoreDTO>} config - The configurations determining how the store is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StoreDTO[]>} The list of stores.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  list(
    filters?: FilterableStoreProps,
    config?: FindConfig<StoreDTO>,
    sharedContext?: Context
  ): Promise<StoreDTO[]>

  /**
   * This method retrieves a paginated list of stores along with the total count of available stores satisfying the provided filters.
   *
   * @param {FilterableStoreProps} filters - The filters to apply on the retrieved store.
   * @param {FindConfig<StoreDTO>} config - The configurations determining how the store is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a store.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[StoreDTO[], number]>} The list of stores along with their total count.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listAndCount(
    filters?: FilterableStoreProps,
    config?: FindConfig<StoreDTO>,
    sharedContext?: Context
  ): Promise<[StoreDTO[], number]>

  /**
   * This method soft deletes stores by their IDs.
   *
   * @param {string[]} storeIds - The list of IDs of stores to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} Resolves successfully when the stores are soft-deleted.
   *
   * @example
   * {example-code}
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    storeIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted stores by their IDs.
   *
   * @param {string[]} storeIds - The list of IDs of stores to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the stores. You can pass to its `returnLinkableKeys`
   * property any of the stores's relation attribute names, such as `currency`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated currency.
   * The object's keys are the ID attribute names of the stores entity's relations, such as `currency_code`,
   * and its value is an array of strings, each being the ID of the record associated with the store through this relation,
   * such as the IDs of associated currency.
   *
   * @example
   * {example-code}
   */
  restore<TReturnableLinkableKeys extends string = string>(
    storeIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
