import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableStoreInventoryProps, StoreInventoryDTO } from "./common"

/**
 * The main service interface for the Store Inventory Module.
 */
export interface IStoreInventoryModuleService extends IModuleService {
  /**
   * This method creates store inventories.
   *
   * @param data - The store inventories to be created.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The created store inventories.
   */
  createStoreInventories(
    data: unknown[],
    sharedContext?: Context
  ): Promise<StoreInventoryDTO[]>

  /**
   * This method creates a store inventory.
   *
   * @param data - The store inventory to be created.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The created store inventory.
   */
  createStoreInventories(
    data: unknown,
    sharedContext?: Context
  ): Promise<StoreInventoryDTO>

  /**
   * This method updates a store inventory.
   *
   * @param id - The ID of the store inventory.
   * @param data - The attributes to update in the store inventory.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The updated store inventory.
   */
  updateStoreInventories(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<StoreInventoryDTO>

  /**
   * This method updates store inventories matching the specified filters.
   *
   * @param selector - The filters specifying which store inventories to update.
   * @param data - The attributes to update in the store inventory.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The updated store inventories.
   */
  updateStoreInventories(
    selector: FilterableStoreInventoryProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<StoreInventoryDTO[]>

  /**
   * This method deletes store inventories by their IDs.
   *
   * @param ids - The IDs of the store inventories.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns Resolves when the store inventories are deleted successfully.
   */
  deleteStoreInventories(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a store inventory by its ID.
   *
   * @param id - The ID of the store inventory.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns Resolves when the store inventory is deleted successfully.
   */
  deleteStoreInventories(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a store inventory by its ID.
   *
   * @param id - The ID of the store inventory.
   * @param config - The configurations determining how the store inventory is retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The retrieved store inventory.
   */
  retrieveStoreInventory(
    id: string,
    config?: FindConfig<StoreInventoryDTO>,
    sharedContext?: Context
  ): Promise<StoreInventoryDTO>

  /**
   * This method retrieves a paginated list of store inventories based on optional filters and configuration.
   *
   * @param filters - The filters to apply on the retrieved store inventories.
   * @param config - The configurations determining how the store inventories are retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The list of store inventories.
   */
  listStoreInventories(
    filters?: FilterableStoreInventoryProps,
    config?: FindConfig<StoreInventoryDTO>,
    sharedContext?: Context
  ): Promise<StoreInventoryDTO[]>

  /**
   * This method retrieves a paginated list of store inventories along with the total count.
   *
   * @param filters - The filters to apply on the retrieved store inventories.
   * @param config - The configurations determining how the store inventories are retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The list of store inventories along with their total count.
   */
  listAndCountStoreInventories(
    filters?: FilterableStoreInventoryProps,
    config?: FindConfig<StoreInventoryDTO>,
    sharedContext?: Context
  ): Promise<[StoreInventoryDTO[], number]>
}
