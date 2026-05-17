import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableShopProps, ShopDTO } from "./common"

/**
 * The main service interface for the Shop Module.
 */
export interface IShopModuleService extends IModuleService {
  /**
   * This method creates shops.
   *
   * @param data - The shops to be created.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The created shops.
   */
  createShops(data: unknown[], sharedContext?: Context): Promise<ShopDTO[]>

  /**
   * This method creates a shop.
   *
   * @param data - The shop to be created.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The created shop.
   */
  createShops(data: unknown, sharedContext?: Context): Promise<ShopDTO>

  /**
   * This method updates a shop.
   *
   * @param id - The ID of the shop.
   * @param data - The attributes to update in the shop.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The updated shop.
   */
  updateShops(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<ShopDTO>

  /**
   * This method updates shops matching the specified filters.
   *
   * @param selector - The filters specifying which shops to update.
   * @param data - The attributes to update in the shop.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The updated shops.
   */
  updateShops(
    selector: FilterableShopProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<ShopDTO[]>

  /**
   * This method deletes shops by their IDs.
   *
   * @param ids - The IDs of the shops.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns Resolves when the shops are deleted successfully.
   */
  deleteShops(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a shop by its ID.
   *
   * @param id - The ID of the shop.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns Resolves when the shop is deleted successfully.
   */
  deleteShops(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a shop by its ID.
   *
   * @param id - The ID of the shop.
   * @param config - The configurations determining how the shop is retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The retrieved shop.
   */
  retrieveShop(
    id: string,
    config?: FindConfig<ShopDTO>,
    sharedContext?: Context
  ): Promise<ShopDTO>

  /**
   * This method retrieves a paginated list of shops based on optional filters and configuration.
   *
   * @param filters - The filters to apply on the retrieved shops.
   * @param config - The configurations determining how the shops are retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The list of shops.
   */
  listShops(
    filters?: FilterableShopProps,
    config?: FindConfig<ShopDTO>,
    sharedContext?: Context
  ): Promise<ShopDTO[]>

  /**
   * This method retrieves a paginated list of shops along with the total count.
   *
   * @param filters - The filters to apply on the retrieved shops.
   * @param config - The configurations determining how the shops are retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The list of shops along with their total count.
   */
  listAndCountShops(
    filters?: FilterableShopProps,
    config?: FindConfig<ShopDTO>,
    sharedContext?: Context
  ): Promise<[ShopDTO[], number]>
}
