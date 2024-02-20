import { IModuleService } from "../modules-sdk"
import {
  FilterableFulfillmentSetProps,
  FilterableGeoZoneProps,
  FilterableServiceZoneProps,
  FilterableShippingOptionProps,
  FilterableShippingOptionRuleProps,
  FilterableShippingOptionTypeProps,
  FilterableShippingProfileProps,
  FulfillmentSetDTO,
  GeoZoneDTO,
  ServiceZoneDTO,
  ShippingOptionDTO,
  ShippingOptionRuleDTO,
  ShippingOptionTypeDTO,
  ShippingProfileDTO,
} from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import {
  CreateFulfillmentSetDTO,
  CreateGeoZoneDTO,
  CreateServiceZoneDTO,
  CreateShippingOptionDTO,
  UpdateFulfillmentSetDTO,
  UpdateGeoZoneDTO,
  UpdateServiceZoneDTO,
  UpdateShippingOptionDTO,
} from "./mutations"
import { CreateShippingProfileDTO } from "./mutations/shipping-profile"

export interface IFulfillmentModuleService extends IModuleService {
  /**
   * Create a new fulfillment set
   * @param data
   * @param sharedContext
   */
  create(
    data: CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>
  create(
    data: CreateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  /**
   * Create a new service zone
   * @param data
   * @param sharedContext
   */
  createServiceZones(
    data: CreateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>
  createServiceZones(
    data: CreateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  /**
   * Create a new shipping option
   * @param data
   * @param sharedContext
   */
  createShippingOptions(
    data: CreateShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>
  createShippingOptions(
    data: CreateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>

  /**
   * Create a new shipping profile
   * @param data
   * @param sharedContext
   */
  createShippingProfiles(
    data: CreateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<ShippingProfileDTO[]>

  createShippingProfiles(
    data: CreateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO>

  /**
   * Create a new geo zone
   * @param data
   * @param sharedContext
   */
  createGeoZones(
    data: CreateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<GeoZoneDTO[]>
  createGeoZones(
    data: CreateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<GeoZoneDTO>

  /**
   * Update a fulfillment set
   * @param data
   * @param sharedContext
   */
  update(
    data: UpdateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>
  update(
    data: UpdateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  /**
   * Update a service zone
   * @param data
   * @param sharedContext
   */
  updateServiceZones(
    data: UpdateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>
  updateServiceZones(
    data: UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  /**
   * Update a shipping option
   * @param data
   * @param sharedContext
   */
  updateShippingOptions(
    data: UpdateShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>
  updateShippingOptions(
    data: UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>

  /**
   * Update a shipping profile
   * @param data
   * @param sharedContext
   */
  updateShippingProfiles(
    data: CreateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<ShippingProfileDTO[]>
  updateShippingProfiles(
    data: CreateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO>

  /**
   * Update a geo zone
   * @param data
   * @param sharedContext
   */
  updateGeoZones(
    data: UpdateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<GeoZoneDTO[]>
  updateGeoZones(
    data: UpdateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<GeoZoneDTO>

  /**
   * Delete a fulfillment set
   * @param ids
   * @param sharedContext
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>

  /**
   * Delete a service zone
   * @param ids
   * @param sharedContext
   */
  deleteServiceZones(ids: string[], sharedContext?: Context): Promise<void>
  deleteServiceZones(id: string, sharedContext?: Context): Promise<void>

  /**
   * Delete a shippingOption
   * @param ids
   * @param sharedContext
   */
  deleteShippingOptions(ids: string[], sharedContext?: Context): Promise<void>
  deleteShippingOptions(id: string, sharedContext?: Context): Promise<void>

  /**
   * Delete a shipping profile
   * @param ids
   * @param sharedContext
   */
  deleteShippingProfiles(ids: string[], sharedContext?: Context): Promise<void>
  deleteShippingProfiles(id: string, sharedContext?: Context): Promise<void>

  /**
   * Delete a geo zone
   * @param ids
   * @param sharedContext
   */
  deleteGeoZones(ids: string[], sharedContext?: Context): Promise<void>
  deleteGeoZones(id: string, sharedContext?: Context): Promise<void>

  /**
   * Retrieve a fulfillment set
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieve(
    id: string,
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  /**
   * Retrieve a service zone
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieveServiceZone(
    id: string,
    config?: FindConfig<ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  /**
   * Retrieve a shipping option
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieveShippingOption(
    id: string,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>

  /**
   * Retrieve a shipping profile
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieveShippingProfile(
    id: string,
    config?: FindConfig<ShippingProfileDTO>,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO>

  /**
   * Retrieve a geo zone
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieveGeoZone(
    id: string,
    config?: FindConfig<GeoZoneDTO>,
    sharedContext?: Context
  ): Promise<GeoZoneDTO>

  /**
   * Retrieve a shipping option rule
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieveShippingOptionRule(
    id: string,
    config?: FindConfig<ShippingOptionRuleDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO>

  /**
   * Retrieve a shipping option type
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieveShippingOptionType(
    id: string,
    config?: FindConfig<ShippingOptionTypeDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionTypeDTO>

  /**
   * List fulfillment sets
   * @param filters
   * @param config
   * @param sharedContext
   */
  list(
    filters?: FilterableFulfillmentSetProps,
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>

  /**
   * List service zones
   * @param filters
   * @param config
   * @param sharedContext
   */
  listServiceZones(
    filters?: FilterableServiceZoneProps,
    config?: FindConfig<ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>

  /**
   * List shipping options
   * @param filters
   * @param config
   * @param sharedContext
   */
  listShippingOptions(
    filters?: FilterableShippingOptionProps,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>

  /**
   * List shipping profiles
   * @param filters
   * @param config
   * @param sharedContext
   */
  listShippingProfiles(
    filters?: FilterableShippingProfileProps,
    config?: FindConfig<ShippingProfileDTO>,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO[]>

  /**
   * List geo zones
   * @param filters
   * @param config
   * @param sharedContext
   */
  listGeoZones(
    filters?: FilterableGeoZoneProps,
    config?: FindConfig<GeoZoneDTO>,
    sharedContext?: Context
  ): Promise<GeoZoneDTO[]>

  /**
   * List shipping option rules
   * @param filters
   * @param config
   * @param sharedContext
   */
  listShippingOptionRules(
    filters?: FilterableShippingOptionRuleProps,
    config?: FindConfig<ShippingOptionRuleDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO[]>

  /**
   * List shipping option types
   * @param filters
   * @param config
   * @param sharedContext
   */
  listShippingOptionTypes(
    filters?: FilterableShippingOptionTypeProps,
    config?: FindConfig<ShippingOptionTypeDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionTypeDTO[]>

  /**
   * List and count fulfillment sets
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCount(
    filters?: FilterableFulfillmentSetProps,
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentSetDTO[], number]>

  /**
   * List and count service zones
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountServiceZones(
    filters?: FilterableServiceZoneProps,
    config?: FindConfig<ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<[ServiceZoneDTO[], number]>

  /**
   * List and count shipping options
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountShippingOptions(
    filters?: FilterableShippingOptionProps,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionDTO[], number]>

  /**
   * List and count shipping profiles
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountShippingProfiles(
    filters?: FilterableShippingProfileProps,
    config?: FindConfig<ShippingProfileDTO>,
    sharedContext?: Context
  ): Promise<[ShippingProfileDTO[], number]>

  /**
   * List and count geo zones
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountGeoZones(
    filters?: FilterableGeoZoneProps,
    config?: FindConfig<GeoZoneDTO>,
    sharedContext?: Context
  ): Promise<[GeoZoneDTO[], number]>

  /**
   * List and count shipping option rules
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountShippingOptionRules(
    filters?: FilterableShippingOptionRuleProps,
    config?: FindConfig<ShippingOptionRuleDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionRuleDTO[], number]>

  /**
   * List and count shipping options types
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountShippingOptionsTypes(
    filters?: FilterableShippingOptionTypeProps,
    config?: FindConfig<ShippingOptionTypeDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionTypeDTO[], number]>

  /**
   * Soft delete fulfillment sets
   * @param fulfillmentIds
   * @param config
   * @param sharedContext
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * Soft delete service zones
   * @param serviceZoneIds
   * @param config
   * @param sharedContext
   */
  softDeleteServiceZones<TReturnableLinkableKeys extends string = string>(
    serviceZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * Soft delete shipping options
   * @param shippingOptionsIds
   * @param config
   * @param sharedContext
   */
  softDeleteShippingOptions<TReturnableLinkableKeys extends string = string>(
    shippingOptionsIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * Soft delete shipping profiles
   * @param shippingProfileIds
   * @param config
   * @param sharedContext
   */
  softDeleteShippingProfiles<TReturnableLinkableKeys extends string = string>(
    shippingProfileIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * Soft delete geo zones
   * @param geoZoneIds
   * @param config
   * @param sharedContext
   */
  softDeleteGeoZones<TReturnableLinkableKeys extends string = string>(
    geoZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  // TODO define needed soft delete/delete/restore methods
}
