import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { BrandDTO, FilterableBrandProps } from "./common"

/**
 * The main service interface for the Brand Module.
 */
export interface IBrandModuleService extends IModuleService {
  /**
   * This method creates brands.
   *
   * @param data - The brands to be created.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The created brands.
   */
  createBrands(data: unknown[], sharedContext?: Context): Promise<BrandDTO[]>

  /**
   * This method creates a brand.
   *
   * @param data - The brand to be created.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The created brand.
   */
  createBrands(data: unknown, sharedContext?: Context): Promise<BrandDTO>

  /**
   * This method updates a brand.
   *
   * @param id - The ID of the brand.
   * @param data - The attributes to update in the brand.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The updated brand.
   */
  updateBrands(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<BrandDTO>

  /**
   * This method updates brands matching the specified filters.
   *
   * @param selector - The filters specifying which brands to update.
   * @param data - The attributes to update in the brand.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The updated brands.
   */
  updateBrands(
    selector: FilterableBrandProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<BrandDTO[]>

  /**
   * This method deletes brands by their IDs.
   *
   * @param ids - The IDs of the brands.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns Resolves when the brands are deleted successfully.
   */
  deleteBrands(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a brand by its ID.
   *
   * @param id - The ID of the brand.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns Resolves when the brand is deleted successfully.
   */
  deleteBrands(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a brand by its ID.
   *
   * @param id - The ID of the brand.
   * @param config - The configurations determining how the brand is retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The retrieved brand.
   */
  retrieveBrand(
    id: string,
    config?: FindConfig<BrandDTO>,
    sharedContext?: Context
  ): Promise<BrandDTO>

  /**
   * This method retrieves a paginated list of brands based on optional filters and configuration.
   *
   * @param filters - The filters to apply on the retrieved brands.
   * @param config - The configurations determining how the brands are retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The list of brands.
   */
  listBrands(
    filters?: FilterableBrandProps,
    config?: FindConfig<BrandDTO>,
    sharedContext?: Context
  ): Promise<BrandDTO[]>

  /**
   * This method retrieves a paginated list of brands along with the total count.
   *
   * @param filters - The filters to apply on the retrieved brands.
   * @param config - The configurations determining how the brands are retrieved.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The list of brands along with their total count.
   */
  listAndCountBrands(
    filters?: FilterableBrandProps,
    config?: FindConfig<BrandDTO>,
    sharedContext?: Context
  ): Promise<[BrandDTO[], number]>
}
