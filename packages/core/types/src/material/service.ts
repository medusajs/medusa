import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  BasicMaterialDTO,
  FilterableBasicMaterialProps,
  SalesMaterialDTO,
  FilterableSalesMaterialProps,
} from "./common"

/**
 * The main service interface for the Material Module.
 */
export interface IMaterialModuleService extends IModuleService {
  // BasicMaterial methods

  /**
   * This method creates basic materials.
   */
  createBasicMaterials(
    data: unknown[],
    sharedContext?: Context
  ): Promise<BasicMaterialDTO[]>

  /**
   * This method creates a basic material.
   */
  createBasicMaterials(
    data: unknown,
    sharedContext?: Context
  ): Promise<BasicMaterialDTO>

  /**
   * This method updates a basic material.
   */
  updateBasicMaterials(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<BasicMaterialDTO>

  /**
   * This method updates basic materials matching the specified filters.
   */
  updateBasicMaterials(
    selector: FilterableBasicMaterialProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<BasicMaterialDTO[]>

  /**
   * This method deletes basic materials by their IDs.
   */
  deleteBasicMaterials(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a basic material by its ID.
   */
  deleteBasicMaterials(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a basic material by its ID.
   */
  retrieveBasicMaterial(
    id: string,
    config?: FindConfig<BasicMaterialDTO>,
    sharedContext?: Context
  ): Promise<BasicMaterialDTO>

  /**
   * This method retrieves a list of basic materials.
   */
  listBasicMaterials(
    filters?: FilterableBasicMaterialProps,
    config?: FindConfig<BasicMaterialDTO>,
    sharedContext?: Context
  ): Promise<BasicMaterialDTO[]>

  /**
   * This method retrieves a paginated list of basic materials along with the total count.
   */
  listAndCountBasicMaterials(
    filters?: FilterableBasicMaterialProps,
    config?: FindConfig<BasicMaterialDTO>,
    sharedContext?: Context
  ): Promise<[BasicMaterialDTO[], number]>

  // SalesMaterial methods

  /**
   * This method creates sales materials.
   */
  createSalesMaterials(
    data: unknown[],
    sharedContext?: Context
  ): Promise<SalesMaterialDTO[]>

  /**
   * This method creates a sales material.
   */
  createSalesMaterials(
    data: unknown,
    sharedContext?: Context
  ): Promise<SalesMaterialDTO>

  /**
   * This method updates a sales material.
   */
  updateSalesMaterials(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<SalesMaterialDTO>

  /**
   * This method updates sales materials matching the specified filters.
   */
  updateSalesMaterials(
    selector: FilterableSalesMaterialProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<SalesMaterialDTO[]>

  /**
   * This method deletes sales materials by their IDs.
   */
  deleteSalesMaterials(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a sales material by its ID.
   */
  deleteSalesMaterials(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a sales material by its ID.
   */
  retrieveSalesMaterial(
    id: string,
    config?: FindConfig<SalesMaterialDTO>,
    sharedContext?: Context
  ): Promise<SalesMaterialDTO>

  /**
   * This method retrieves a list of sales materials.
   */
  listSalesMaterials(
    filters?: FilterableSalesMaterialProps,
    config?: FindConfig<SalesMaterialDTO>,
    sharedContext?: Context
  ): Promise<SalesMaterialDTO[]>

  /**
   * This method retrieves a paginated list of sales materials along with the total count.
   */
  listAndCountSalesMaterials(
    filters?: FilterableSalesMaterialProps,
    config?: FindConfig<SalesMaterialDTO>,
    sharedContext?: Context
  ): Promise<[SalesMaterialDTO[], number]>
}
