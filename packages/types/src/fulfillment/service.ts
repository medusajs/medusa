import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableFulfillmentProps,
  FilterableFulfillmentSetProps,
  FilterableGeoZoneProps,
  FilterableServiceZoneProps,
  FilterableShippingOptionForContextProps,
  FilterableShippingOptionProps,
  FilterableShippingOptionRuleProps,
  FilterableShippingOptionTypeProps,
  FilterableShippingProfileProps,
  FulfillmentDTO,
  FulfillmentSetDTO,
  GeoZoneDTO,
  ServiceZoneDTO,
  ShippingOptionDTO,
  ShippingOptionRuleDTO,
  ShippingOptionTypeDTO,
  ShippingProfileDTO,
} from "./common"
import {
  CreateFulfillmentSetDTO,
  CreateGeoZoneDTO,
  CreateServiceZoneDTO,
  CreateShippingOptionDTO,
  CreateShippingOptionRuleDTO,
  UpdateFulfillmentDTO,
  UpdateFulfillmentSetDTO,
  UpdateGeoZoneDTO,
  UpdateServiceZoneDTO,
  UpdateShippingOptionDTO,
  UpdateShippingOptionRuleDTO,
  UpdateShippingProfileDTO,
  UpsertServiceZoneDTO,
  UpsertShippingOptionDTO,
} from "./mutations"
import { CreateFulfillmentDTO } from "./mutations/fulfillment"
import { CreateShippingProfileDTO } from "./mutations/shipping-profile"

export interface IFulfillmentModuleService extends IModuleService {
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
   * Delete a fulfillment set
   * @param ids
   * @param sharedContext
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>
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
   * Restore fulfillment sets
   * @param fulfillmentIds
   * @param config
   * @param sharedContext
   */
  restore<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

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
   * Update a service zone
   */
  updateServiceZones(
    id: string,
    data: UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>
  updateServiceZones(
    selector: FilterableServiceZoneProps,
    data: UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>

  /**
   * Upsert a service zone
   */
  upsertServiceZones(
    data: UpsertServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>
  upsertServiceZones(
    data: UpsertServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>
  /**
   * Delete a service zone
   * @param ids
   * @param sharedContext
   */
  deleteServiceZones(ids: string[], sharedContext?: Context): Promise<void>
  deleteServiceZones(id: string, sharedContext?: Context): Promise<void>
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
   * Restore service zones
   * @param serviceZoneIds
   * @param config
   * @param sharedContext
   */
  restoreServiceZones<TReturnableLinkableKeys extends string = string>(
    serviceZoneIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

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
   * Delete a geo zone
   * @param ids
   * @param sharedContext
   */
  deleteGeoZones(ids: string[], sharedContext?: Context): Promise<void>
  deleteGeoZones(id: string, sharedContext?: Context): Promise<void>
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
  /**
   * Restore geo zones
   * @param geoZoneIds
   * @param config
   * @param sharedContext
   */
  restoreGeoZones<TReturnableLinkableKeys extends string = string>(
    geoZoneIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

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
   * List shipping options and eventually filter the result based on the context and their rules
   * @param filters
   * @param config
   * @param sharedContext
   */
  listShippingOptionsForContext(
    filters: FilterableShippingOptionForContextProps,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>
  /**
   * List and count shipping options without taking into account the context
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountShippingOptions(
    filters?: Omit<FilterableShippingOptionProps, "context">,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionDTO[], number]>
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
   * Update a shipping option
   * @param id
   * @param data
   * @param sharedContext
   */
  updateShippingOptions(
    id: string,
    data: UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>
  updateShippingOptions(
    selector: FilterableShippingOptionProps,
    data: UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>

  /**
   * Upsert a shipping option
   */
  upsertShippingOptions(
    data: UpsertShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>
  upsertShippingOptions(
    data: UpsertShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>
  /**
   * Delete a shippingOption
   * @param ids
   * @param sharedContext
   */
  deleteShippingOptions(ids: string[], sharedContext?: Context): Promise<void>
  deleteShippingOptions(id: string, sharedContext?: Context): Promise<void>
  /**
   * Soft delete shipping options
   * @param shippingOptionIds
   * @param config
   * @param sharedContext
   */
  softDeleteShippingOptions<TReturnableLinkableKeys extends string = string>(
    shippingOptionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * Restore shipping options
   * @param shippingOptionIds
   * @param config
   * @param sharedContext
   */
  restoreShippingOptions<TReturnableLinkableKeys extends string = string>(
    shippingOptionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

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
   * Update a shipping profile
   * @param data
   * @param sharedContext
   */
  updateShippingProfiles(
    data: UpdateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<ShippingProfileDTO[]>
  updateShippingProfiles(
    data: UpdateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO>
  /**
   * Delete a shipping profile
   * @param ids
   * @param sharedContext
   */
  deleteShippingProfiles(ids: string[], sharedContext?: Context): Promise<void>
  deleteShippingProfiles(id: string, sharedContext?: Context): Promise<void>
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
   * Restore shipping profiles
   * @param shippingProfileIds
   * @param config
   * @param sharedContext
   */
  restoreShippingProfiles<TReturnableLinkableKeys extends string = string>(
    shippingProfileIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

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
   * Create a new shipping option rules
   * @param data
   * @param sharedContext
   */
  createShippingOptionRules(
    data: CreateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO[]>
  createShippingOptionRules(
    data: CreateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO>
  /**
   * Update a shipping option rule
   * @param data
   * @param sharedContext
   */
  updateShippingOptionRules(
    data: UpdateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO[]>
  updateShippingOptionRules(
    data: UpdateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO>
  /**
   * Delete a shipping option rule
   * @param ids
   * @param sharedContext
   */
  deleteShippingOptionRules(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteShippingOptionRules(id: string, sharedContext?: Context): Promise<void>

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
   * List and count shipping options types
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountShippingOptionTypes(
    filters?: FilterableShippingOptionTypeProps,
    config?: FindConfig<ShippingOptionTypeDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionTypeDTO[], number]>

  /**
   * delete a shipping option type
   * @param ids
   * @param sharedContext
   */
  deleteShippingOptionTypes(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteShippingOptionTypes(id: string, sharedContext?: Context): Promise<void>

  /**
   * Retrieve a fulfillment
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieveFulfillment(
    id: string,
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>
  /**
   * List fulfillments
   * @param filters
   * @param config
   * @param sharedContext
   */
  listFulfillments(
    filters?: FilterableFulfillmentProps,
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentDTO[]>
  /**
   * List and count fulfillments
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCountFulfillments(
    filters?: FilterableFulfillmentProps,
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentDTO[], number]>
  /**
   * Create a new fulfillment including into the third party provider
   * @param data
   * @param sharedContext
   */
  createFulfillment(
    data: CreateFulfillmentDTO,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>
  /**
   * Update a fulfillment
   * @param data
   * @param sharedContext
   */
  updateFulfillment(
    id: string,
    data: UpdateFulfillmentDTO,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>
  /**
   * Cancel the given fulfillment including into the third party provider
   * @param id
   * @param sharedContext
   */
  cancelFulfillment(
    id: string,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  /**
   * Retrieve the available fulfillment options for the given data.
   */
  retrieveFulfillmentOptions(
    providerId: string
  ): Promise<Record<string, unknown>[]>

  /**
   * Validate the given shipping option fulfillment option from the provided data
   */
  validateFulfillmentOption(
    providerId: string,
    data: Record<string, unknown>
  ): Promise<boolean>

  /**
   * Validate if the given shipping option is valid for a given context
   */
  validateShippingOption(
    shippingOptionId: string,
    context: Record<string, unknown>
  ): Promise<boolean>
}
