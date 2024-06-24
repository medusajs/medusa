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
import { CreateRegionDTO, UpdateRegionDTO, UpsertRegionDTO } from "./mutations"

/**
 * The main service interface for the Region Module.
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
   * const region = await regionModuleService.createRegions([
   *   {
   *     name: "Europe",
   *     currency_code: "eur",
   *     countries: ["dk", "de", "fr"],
   *   },
   *   {
   *     name: "United States of America",
   *     currency_code: "usd",
   *     countries: ["us"],
   *   },
   * ])
   */
  createRegions(
    data: CreateRegionDTO[],
    sharedContext?: Context
  ): Promise<RegionDTO[]>

  /**
   * This method creates a region.
   *
   * @param {CreateRegionDTO} data - The region to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO>} The created region.
   *
   * @example
   * const region = await regionModuleService.createRegions({
   *   name: "Europe",
   *   currency_code: "eur",
   *   countries: ["dk", "de", "fr"],
   * })
   */
  createRegions(
    data: CreateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>

  /**
   * This method updates or creates regions if they don't exist.
   *
   * @param {UpsertRegionDTO[]} data - The attributes in the regions to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO[]>} The created or updated regions.
   *
   * @example
   * const region = await regionModuleService.upsertRegions([
   *   {
   *     id: "reg_123",
   *     automatic_taxes: false,
   *   },
   *   {
   *     name: "Europe",
   *     currency_code: "eur",
   *   },
   * ])
   */
  upsertRegions(
    data: UpsertRegionDTO[],
    sharedContext?: Context
  ): Promise<RegionDTO[]>

  /**
   * This method updates or creates a region if it doesn't exist.
   *
   * @param {UpsertRegionDTO} data - The attributes in the region to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO>} The created or updated region.
   *
   * @example
   * const region = await regionModuleService.upsertRegions({
   *   id: "reg_123",
   *   automatic_taxes: false,
   * })
   */
  upsertRegions(
    data: UpsertRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>

  /**
   * This method updates an existing region.
   *
   * @param {string} id - The ID of the region.
   * @param {UpdateRegionDTO} data - The attributes to update in the region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO>} The updated region.
   *
   * @example
   * const region = await regionModuleService.updateRegions("reg_123", {
   *   automatic_taxes: false,
   * })
   */
  updateRegions(
    id: string,
    data: UpdateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>

  /**
   * This method updates existing regions.
   *
   * @param {FilterableRegionProps} selector - The filters to apply on the retrieved regions.
   * @param {UpdateRegionDTO} data - The attributes to update in the region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO[]>} The updated regions.
   *
   * @example
   * const region = await regionModuleService.updateRegions(
   *   {
   *     name: "Europe",
   *   },
   *   {
   *     automatic_taxes: false,
   *   }
   * )
   */
  updateRegions(
    selector: FilterableRegionProps,
    data: UpdateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO[]>

  /**
   * This method deletes regions by their IDs.
   *
   * @param {string[]} ids - The IDs of the region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the regions are deleted.
   *
   * @example
   * await regionModuleService.deleteRegions(["reg_123", "reg_321"])
   */
  deleteRegions(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a region by its ID.
   *
   * @param {string} id - The ID of the region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the region is deleted.
   *
   * @example
   * await regionModuleService.deleteRegions("reg_123")
   */
  deleteRegions(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a region by its ID.
   *
   * @param {string} id - The ID of the region.
   * @param {FindConfig<RegionDTO>} config - The configurations determining how the region is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO>} The retrieved region.
   *
   * @example
   * A simple example that retrieves a region by its ID:
   *
   * ```ts
   * const region = await regionModuleService.retrieveRegion("reg_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const region = await regionModuleService.retrieveRegion("reg_123", {
   *   relations: ["countries"],
   * })
   * ```
   */
  retrieveRegion(
    id: string,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<RegionDTO>

  /**
   * This method retrieves a paginated list of regions based on optional filters and configuration.
   *
   * @param {FilterableRegionProps} filters - The filters to apply on the retrieved regions.
   * @param {FindConfig<RegionDTO>} config - The configurations determining how the region is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionDTO[]>} The list of regions.
   *
   * @example
   * To retrieve a list of regions using their IDs:
   *
   * ```ts
   * const regions = await regionModuleService.listRegions({
   *   id: ["reg_123", "reg_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the regions:
   *
   * ```ts
   * const regions = await regionModuleService.listRegions(
   *   {
   *     id: ["reg_123", "reg_321"],
   *   },
   *   {
   *     relations: ["countries"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const regions = await regionModuleService.listRegions(
   *   {
   *     id: ["reg_123", "reg_321"],
   *   },
   *   {
   *     relations: ["countries"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listRegions(
    filters?: FilterableRegionProps,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<RegionDTO[]>

  /**
   * This method retrieves a paginated list of regions along with the total count of available regions satisfying the provided filters.
   *
   * @param {FilterableRegionProps} filters - The filters to apply on the retrieved regions.
   * @param {FindConfig<RegionDTO>} config - The configurations determining how the region is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RegionDTO[], number]>} The list of regions along with their total count.
   *
   * @example
   * To retrieve a list of regions using their IDs:
   *
   * ```ts
   * const [regions, count] =
   *   await regionModuleService.listAndCountRegions({
   *     id: ["reg_123", "reg_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the regions:
   *
   * ```ts
   * const [regions, count] =
   *   await regionModuleService.listAndCountRegions(
   *     {
   *       id: ["reg_123", "reg_321"],
   *     },
   *     {
   *       relations: ["countries"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [regions, count] =
   * await regionModuleService.listAndCountRegions(
   *   {
   *     id: ["reg_123", "reg_321"],
   *   },
   *   {
   *     relations: ["countries"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAndCountRegions(
    filters?: FilterableRegionProps,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<[RegionDTO[], number]>

  /**
   * This method retrieves a country by its 2 character ISO code.
   *
   * @param {string} countryId - The country's ID, which is the 2 character ISO code.
   * @param {FindConfig<RegionCountryDTO>} config - The configurations determining how the country is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a country.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionCountryDTO>} The retrieved country.
   *
   * @example
   * A simple example that retrieves a country by its 2 character ISO code:
   *
   * ```ts
   * const country =
   *   await regionModuleService.retrieveCountry("us")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const country = await regionModuleService.retrieveCountry(
   *   "us",
   *   {
   *     relations: ["region"],
   *   }
   * )
   * ```
   */
  retrieveCountry(
    countryId: string,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<RegionCountryDTO>

  /**
   * This method retrieves a paginated list of countries based on optional filters and configuration.
   *
   * @param {FilterableRegionCountryProps} filters - The filters to apply on the retrieved countries.
   * @param {FindConfig<RegionCountryDTO>} config - The configurations determining how the country is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a country.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RegionCountryDTO[]>} The list of countries.
   *
   * @example
   * To retrieve a list of countries using their IDs:
   *
   * ```ts
   * const countries = await regionModuleService.listCountries({
   *   iso_2: ["us", "eur"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the countries:
   *
   * ```ts
   * const countries = await regionModuleService.listCountries(
   *   {
   *     iso_2: ["us", "eur"],
   *   },
   *   {
   *     relations: ["region"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const countries = await regionModuleService.listCountries(
   *   {
   *     iso_2: ["us", "eur"],
   *   },
   *   {
   *     relations: ["region"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listCountries(
    filters?: FilterableRegionCountryProps,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<RegionCountryDTO[]>

  /**
   * This method retrieves a paginated list of countries along with the total count of available countries satisfying the provided filters.
   *
   * @param {FilterableRegionCountryProps} filters - The filters to apply on the retrieved countries.
   * @param {FindConfig<RegionCountryDTO>} config - The configurations determining how the country is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a country.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RegionCountryDTO[], number]>} The list of countries along with their total count.
   *
   * @example
   * To retrieve a list of countries using their IDs:
   *
   * ```ts
   * const [countries, count] =
   *   await regionModuleService.listAndCountCountries({
   *     iso_2: ["us", "eur"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the countries:
   *
   * ```ts
   * const [countries, count] =
   *   await regionModuleService.listAndCountCountries(
   *     {
   *       iso_2: ["us", "eur"],
   *     },
   *     {
   *       relations: ["region"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [countries, count] =
   *   await regionModuleService.listAndCountCountries(
   *     {
   *       iso_2: ["us", "eur"],
   *     },
   *     {
   *       relations: ["region"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountCountries(
    filters?: FilterableRegionCountryProps,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<[RegionCountryDTO[], number]>

  /**
   * This method soft deletes a region by its IDs.
   *
   * @param {string[]} regionIds - The regions' IDs.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated country.
   * The object's keys are the ID attribute names of the region entity's relations, such as `country_id`, and its value is an array of strings, each being the ID of a record associated
   * with the region through this relation, such as the IDs of associated countries.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await regionModuleService.softDeleteRegions(["reg_123", "reg_321"], {
   *   returnLinkableKeys: ["country_id"],
   * })
   */
  softDeleteRegions<TReturnableLinkableKeys extends string = string>(
    regionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted regions by their IDs.
   *
   * @param {string[]} regionIds - The regions' IDs.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the region. You can pass to its `returnLinkableKeys`
   * property any of the region's relation attribute names, such as `countries`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated countries.
   * The object's keys are the ID attribute names of the region entity's relations, such as `country_id`,
   * and its value is an array of strings, each being the ID of the record associated with the region through this relation,
   * such as the IDs of associated countries.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await regionModuleService.restoreRegions(["reg_123", "reg_321"], {
   *   returnLinkableKeys: ["country_id"],
   * })
   */
  restoreRegions<TReturnableLinkableKeys extends string = string>(
    regionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
