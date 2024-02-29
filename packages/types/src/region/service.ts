import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableRegionCountryProps,
  FilterableRegionProps,
  RegionCountryDTO,
  RegionDTO,
} from "./common"
import { CreateRegionDTO, UpsertRegionDTO, UpdateRegionDTO } from "./mutations"

/**
 * The main service interface for the region module.
 */
export interface IRegionModuleService extends IModuleService {
  /**
   * This method creates regions.
   *
   * @param {CreateRegionDTO[]} data - The regions to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO[]>} The created regions.
   *
   * @example
   * {example-code}
   */
  create(data: CreateRegionDTO[], sharedContext?: Context): Promise<RegionDTO[]>

  /**
   * This method creates a region.
   *
   * @param {CreateRegionDTO} data - The region to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO>} The created region.
   *
   * @example
   * {example-code}
   */
  create(data: CreateRegionDTO, sharedContext?: Context): Promise<RegionDTO>

  /**
   * This method updates existing regions, or creates new ones if they don't exist.
   *
   * @param {UpsertRegionDTO[]} data - The attributes to update or create in each region.
   * @returns {Promise<RegionDTO[]>} The updated and created regions.
   *
   * @example
   * {example-code}
   */
  upsert(data: UpsertRegionDTO[], sharedContext?: Context): Promise<RegionDTO[]>

  /**
   * This method updates an existing region, or creates a new one if it doesn't exist.
   *
   * @param {UpsertRegionDTO} data - The attributes to update or create for the region.
   * @returns {Promise<RegionDTO>} The updated or created region.
   *
   * @example
   * {example-code}
   */
  upsert(data: UpsertRegionDTO, sharedContext?: Context): Promise<RegionDTO>

  /**
   * This method updates an existing region.
   *
   * @param {string} id - The region's ID.
   * @param {UpdatableRegionFields} data - The details to update in the region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO>} The updated region.
   */
  update(
    id: string,
    data: UpdateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>

  /**
   * This method updates existing regions.
   *
   * @param {FilterableRegionProps} selector - The filters to specify which regions should be updated.
   * @param {UpdateRegionDTO} data - The details to update in the regions.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO[]>} The updated regions.
   *
   * @example
   * {example-code}
   */
  update(
    selector: FilterableRegionProps,
    data: UpdateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO[]>

  /**
   * This method deletes regions by their IDs.
   *
   * @param {string[]} ids - The list of IDs of regions to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the regions are deleted.
   *
   * @example
   * {example-code}
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a region by its ID.
   *
   * @param {string} id - The ID of the region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the region is deleted.
   *
   * @example
   * {example-code}
   */
  delete(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a region by its ID.
   *
   * @param {string} id - The ID of the retrieve.
   * @param {FindConfig<RegionDTO>} config - The configurations determining how the region is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO>} The retrieved region.
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
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<RegionDTO>

  /**
   * This method retrieves a paginated list of regions based on optional filters and configuration.
   *
   * @param {FilterableRegionProps} filters - The filters to apply on the retrieved region.
   * @param {FindConfig<RegionDTO>} config - The configurations determining how the region is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO[]>} The list of regions.
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
    filters?: FilterableRegionProps,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<RegionDTO[]>

  /**
   * This method retrieves a paginated list of regions along with the total count of available regions satisfying the provided filters.
   *
   * @param {FilterableRegionProps} filters - The filters to apply on the retrieved region.
   * @param {FindConfig<RegionDTO>} config - The configurations determining how the region is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RegionDTO[], number]>} The list of regions along with their total count.
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
    filters?: FilterableRegionProps,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<[RegionDTO[], number]>

  /**
   * This method retrieves a country by its ID.
   *
   * @param {string} countryId - The country's ID.
   * @param {FindConfig<RegionCountryDTO>} config - The configurations determining how the region country is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region country.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionCountryDTO>} The retrieved country.
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
  retrieveCountry(
    countryId: string,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<RegionCountryDTO>

  /**
   * This method retrieves a paginated list of countries based on optional filters and configuration.
   *
   * @param {FilterableRegionCountryProps} filters - The filters to apply on the retrieved region country.
   * @param {FindConfig<RegionCountryDTO>} config - The configurations determining how the region country is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region country.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionCountryDTO[]>} The list of countries.
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
  listCountries(
    filters?: FilterableRegionCountryProps,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<RegionCountryDTO[]>

  /**
   * This method retrieves a paginated list of countries along with the total count of available countries satisfying the provided filters.
   *
   * @param {FilterableRegionCountryProps} filters - The filters to apply on the retrieved region country.
   * @param {FindConfig<RegionCountryDTO>} config - The configurations determining how the region country is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region country.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RegionCountryDTO[], number]>} The list of countries along with their total count.
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
  listAndCountCountries(
    filters?: FilterableRegionCountryProps,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<[RegionCountryDTO[], number]>

  /**
   * This method soft deletes regions by their IDs.
   *
   * @param {string[]} regionIds - The list of IDs of regions to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} Resolves successfully when the regions are soft-deleted.
   *
   * @example
   * {example-code}
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    regionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted regions by their IDs.
   *
   * @param {string[]} regionIds - The list of IDs of regions to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the regions. You can pass to its `returnLinkableKeys`
   * property any of the regions's relation attribute names, such as `country`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated country.
   * The object's keys are the ID attribute names of the regions entity's relations, such as `country`,
   * and its value is an array of strings, each being the ID of the record associated with the region through this relation,
   * such as the IDs of associated country.
   *
   * @example
   * {example-code}
   */
  restore<TReturnableLinkableKeys extends string = string>(
    regionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method creates default countries.
   *
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the default countries are created.
   *
   * @example
   * {example-code}
   */
  createDefaultCountries(sharedContext?: Context): Promise<void>
}
