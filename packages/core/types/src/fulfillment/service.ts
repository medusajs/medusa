import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableFulfillmentProps,
  FilterableFulfillmentProviderProps,
  FilterableFulfillmentSetProps,
  FilterableGeoZoneProps,
  FilterableServiceZoneProps,
  FilterableShippingOptionForContextProps,
  FilterableShippingOptionProps,
  FilterableShippingOptionRuleProps,
  FilterableShippingOptionTypeProps,
  FilterableShippingProfileProps,
  FulfillmentDTO,
  FulfillmentProviderDTO,
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

/**
 * The main service interface for the Fulfillment Module.
 */
export interface IFulfillmentModuleService extends IModuleService {
  /**
   * This method retrieves a fulfillment set by its ID.
   *
   * @param {string} id - The ID of the fulfillment set.
   * @param {FindConfig<FulfillmentSetDTO>} config - The configurations determining how the fulfillment set is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a fulfillment set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentSetDTO>} The retrieved fulfillment set.
   *
   * @example
   * A simple example that retrieves a fulfillment set by its ID:
   *
   * ```ts
   * const fulfillmentSet =
   *   await fulfillmentModuleService.retrieve("fuset_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const fulfillmentSet = await fulfillmentModuleService.retrieve(
   *   "fuset_123",
   *   {
   *     relations: ["service_zones"],
   *   }
   * )
   * ```
   */
  retrieve(
    id: string,
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  /**
   * This method retrieves a paginated list of fulfillment sets based on optional filters and configuration.
   *
   * @param {FilterableFulfillmentSetProps} filters - The filters to apply on the retrieved fulfillment sets.
   * @param {FindConfig<FulfillmentSetDTO>} config - The configurations determining how the fulfillment set is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a fulfillment set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentSetDTO[]>} The list of fulfillment sets.
   *
   * @example
   * To retrieve a list of fulfillment sets using their IDs:
   *
   * ```ts
   * const fulfillmentSets = await fulfillmentModuleService.list({
   *   id: ["fuset_123", "fuset_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the fulfillment set:
   *
   * ```ts
   * const fulfillmentSets = await fulfillmentModuleService.list(
   *   {
   *     id: ["fuset_123", "fuset_321"],
   *   },
   *   {
   *     relations: ["search_zones"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const fulfillmentSets = await fulfillmentModuleService.list(
   *   {
   *     id: ["fuset_123", "fuset_321"],
   *   },
   *   {
   *     relations: ["search_zones"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  list(
    filters?: FilterableFulfillmentSetProps,
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>

  /**
   * This method retrieves a paginated list of fulfillment sets along with the total count of available fulfillment sets satisfying the provided filters.
   *
   * @param {FilterableFulfillmentSetProps} filters - The filters to apply on the retrieved fulfillment sets.
   * @param {FindConfig<FulfillmentSetDTO>} config - The configurations determining how the fulfillment set is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a fulfillment set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[FulfillmentSetDTO[], number]>} The list of fulfillment sets along with their total count.
   *
   * @example
   * To retrieve a list of fulfillment sets using their IDs:
   *
   * ```ts
   * const [fulfillmentSets, count] =
   *   await fulfillmentModuleService.listAndCount({
   *     id: ["fuset_123", "fuset_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the fulfillment set:
   *
   * ```ts
   * const [fulfillmentSets, count] =
   *   await fulfillmentModuleService.listAndCount(
   *     {
   *       id: ["fuset_123", "fuset_321"],
   *     },
   *     {
   *       relations: ["search_zones"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [fulfillmentSets, count] =
   *   await fulfillmentModuleService.listAndCount(
   *     {
   *       id: ["fuset_123", "fuset_321"],
   *     },
   *     {
   *       relations: ["search_zones"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCount(
    filters?: FilterableFulfillmentSetProps,
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentSetDTO[], number]>

  /**
   * This method creates fulfillment sets.
   *
   * @param {CreateFulfillmentSetDTO[]} data - The fulfillment sets to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentSetDTO[]>} The created fulfillment sets.
   *
   * @example
   * const fulfillmentSets = await fulfillmentModuleService.create(
   *   [
   *     {
   *       name: "Shipping",
   *       type: "default",
   *     },
   *     {
   *       name: "Pickup",
   *       type: "provider-controlled",
   *     },
   *   ]
   * )
   */
  create(
    data: CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>

  /**
   * This method creates a fulfillment set.
   *
   * @param {CreateFulfillmentSetDTO} data - The fulfillment set to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentSetDTO>} The created fulfillment set.
   *
   * @example
   * const fulfillmentSet = await fulfillmentModuleService.create({
   *   name: "Shipping",
   *   type: "default",
   * })
   */
  create(
    data: CreateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  /**
   * This method updates existing fulfillment sets.
   *
   * @param {UpdateFulfillmentSetDTO[]} data - The attributes to update in the fulfillment sets.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentSetDTO[]>} The updated fulfillment sets.
   *
   * @example
   * const fulfillmentSets = await fulfillmentModuleService.update(
   *   [
   *     {
   *       id: "fuset_123",
   *       name: "Shipping",
   *     },
   *     {
   *       id: "fuset_321",
   *       name: "Pickup",
   *     },
   *   ]
   * )
   */
  update(
    data: UpdateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>

  /**
   * This method updates an existing fulfillment set.
   *
   * @param {UpdateFulfillmentSetDTO} data - The attributes to update in the fulfillment set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentSetDTO>} The updated fulfillment set.
   *
   * @example
   * const fulfillmentSet = await fulfillmentModuleService.update({
   *   id: "fuset_123",
   *   name: "Shipping",
   * })
   */
  update(
    data: UpdateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  /**
   * This method deletes fulfillment sets by their IDs.
   *
   * @param {string[]} ids - The IDs of the fulfillment sets.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the fulfillment sets are deleted successfully.
   *
   * @example
   * await fulfillmentModuleService.delete([
   *   "fuset_123",
   *   "fuset_321",
   * ])
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a fulfillment set by its ID.
   *
   * @param {string} id - The ID of the fulfillment set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the fulfillment set is deleted successfully.
   *
   * @example
   * await fulfillmentModuleService.delete("fuset_123")
   */
  delete(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes fulfillment sets by their IDs.
   *
   * @param {string[]} fulfillmentIds - The IDs of the fulfillment sets.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.softDelete([
   *   "fuset_123",
   *   "fuset_321",
   * ])
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores a soft deleted fulfillment by its IDs.
   *
   * @param {string[]} fulfillmentIds - The IDs of the fulfillment sets.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the fulfillment sets. You can pass to its `returnLinkableKeys`
   * property any of the fulfillment set's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.restore([
   *   "fuset_123",
   *   "fuset_321",
   * ])
   */
  restore<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a service zone by its ID.
   *
   * @param {string} id - The ID of the service zone.
   * @param {FindConfig<ServiceZoneDTO>} config - The configurations determining how the service zone is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a service zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO>} The retrieved service zone.
   *
   * @example
   * A simple example that retrieves a service zone by its ID:
   *
   * ```ts
   * const serviceZone =
   *   await fulfillmentModuleService.retrieveServiceZone(
   *     "serzo_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const serviceZone =
   *   await fulfillmentModuleService.retrieveServiceZone(
   *     "serzo_123",
   *     {
   *       relations: ["shipping_options"],
   *     }
   *   )
   * ```
   */
  retrieveServiceZone(
    id: string,
    config?: FindConfig<ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  /**
   * This method retrieves a paginated list of service zones based on optional filters and configuration.
   *
   * @param {FilterableServiceZoneProps} filters - The filters to apply on the retrieved service zones.
   * @param {FindConfig<ServiceZoneDTO>} config - The configurations determining how the service zone is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a service zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO[]>} The list of service zones.
   *
   * @example
   * To retrieve a list of service zones using their IDs:
   *
   * ```ts
   * const serviceZones =
   *   await fulfillmentModuleService.listServiceZones({
   *     id: ["serzo_123", "serzo_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the service zone:
   *
   * ```ts
   * const serviceZones =
   *   await fulfillmentModuleService.listServiceZones(
   *     {
   *       id: ["serzo_123", "serzo_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const serviceZones =
   *   await fulfillmentModuleService.listServiceZones(
   *     {
   *       id: ["serzo_123", "serzo_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listServiceZones(
    filters?: FilterableServiceZoneProps,
    config?: FindConfig<ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>

  /**
   * This method retrieves a paginated list of service zones along with the total count of available service zones satisfying the provided filters.
   *
   * @param {FilterableServiceZoneProps} filters - The filters to apply on the retrieved service zones.
   * @param {FindConfig<ServiceZoneDTO>} config - The configurations determining how the service zone is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a service zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ServiceZoneDTO[], number]>} The list of service zones along with their total count.
   *
   * @example
   * To retrieve a list of service zones using their IDs:
   *
   * ```ts
   * const [serviceZones, count] =
   *   await fulfillmentModuleService.listAndCountServiceZones({
   *     id: ["serzo_123", "serzo_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the service zone:
   *
   * ```ts
   * const [serviceZones, count] =
   *   await fulfillmentModuleService.listAndCountServiceZones(
   *     {
   *       id: ["serzo_123", "serzo_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [serviceZones, count] =
   *   await fulfillmentModuleService.listAndCountServiceZones(
   *     {
   *       id: ["serzo_123", "serzo_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountServiceZones(
    filters?: FilterableServiceZoneProps,
    config?: FindConfig<ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<[ServiceZoneDTO[], number]>

  /**
   * This method creates service zones.
   *
   * @param {CreateServiceZoneDTO[]} data - The service zones to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO[]>} The created service zones.
   *
   * @example
   * const serviceZones =
   *   await fulfillmentModuleService.createServiceZones([
   *     {
   *       name: "Nordic Shipping Methods",
   *       fulfillment_set_id: "fuset_123",
   *     },
   *     {
   *       name: "Pickup Service Area",
   *       fulfillment_set_id: "fuset_321",
   *     },
   *   ])
   */
  createServiceZones(
    data: CreateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>

  /**
   * This method creates a service zone.
   *
   * @param {CreateServiceZoneDTO} data - The service zone to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO>} The created service zone.
   *
   * @example
   * const serviceZone =
   *   await fulfillmentModuleService.createServiceZones({
   *     name: "Nordic Shipping Methods",
   *     fulfillment_set_id: "fuset_123",
   *   })
   */
  createServiceZones(
    data: CreateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  /**
   * This method updates an existing service zone.
   *
   * @param {string} id - The ID of the service zone.
   * @param {UpdateServiceZoneDTO} data - The attributes to update in the service zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO>} The updated service zone.
   *
   * @example
   * const serviceZone =
   *   await fulfillmentModuleService.updateServiceZones(
   *     "serzo_123",
   *     {
   *       name: "US",
   *     }
   *   )
   */
  updateServiceZones(
    id: string,
    data: UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  /**
   * This method updates existing service zones matching the specified filters.
   *
   * @param {FilterableServiceZoneProps} selector - The filters specifying which service zones to update.
   * @param {UpdateServiceZoneDTO} data - The attributes to update in the service zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO[]>} The updated service zones.
   *
   * @example
   * const serviceZones =
   *   await fulfillmentModuleService.updateServiceZones(
   *     {
   *       id: ["serzo_123", "serzo_321"],
   *     },
   *     {
   *       name: "US",
   *     }
   *   )
   */
  updateServiceZones(
    selector: FilterableServiceZoneProps,
    data: UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>

  /**
   * This method updates or creates a service zone if it doesn't exist.
   *
   * @param {UpsertServiceZoneDTO} data - The attributes in the service zone to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO>} The created or updated service zone.
   *
   * @example
   * const serviceZone =
   *   await fulfillmentModuleService.upsertServiceZones({
   *     id: "serzo_123",
   *     name: "US",
   *   })
   */
  upsertServiceZones(
    data: UpsertServiceZoneDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  /**
   * This method updates or creates service zones if they don't exist.
   *
   * @param {UpsertServiceZoneDTO[]} data - The attributes in the service zones to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ServiceZoneDTO[]>} The created or updated service zones.
   *
   * @example
   * const serviceZones =
   *   await fulfillmentModuleService.upsertServiceZones([
   *     {
   *       id: "serzo_123",
   *       name: "US",
   *     },
   *     {
   *       name: "US",
   *       fulfillment_set_id: "fuset_123",
   *     },
   *   ])
   */
  upsertServiceZones(
    data: UpsertServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>

  /**
   * This method deletes service zones by their IDs.
   *
   * @param {string[]} ids - The IDs of the service zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the service zones are deleted.
   *
   * @example
   * await fulfillmentModuleService.deleteServiceZones([
   *   "serzo_123",
   *   "serzo_321",
   * ])
   */
  deleteServiceZones(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a service zone by its ID.
   *
   * @param {string} id - The ID of the service zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the service zone is deleted.
   *
   * @example
   * await fulfillmentModuleService.deleteServiceZones("serzo_123")
   */
  deleteServiceZones(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes service zones by their IDs.
   *
   * @param {string[]} serviceZoneIds - The IDs of the service zones.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.softDeleteServiceZones([
   *   "serzo_123",
   *   "serzo_321",
   * ])
   */
  softDeleteServiceZones<TReturnableLinkableKeys extends string = string>(
    serviceZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores a soft deleted service zones by their IDs.
   *
   * @param {string[]} serviceZoneIds - The IDs of the service zones.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the service zones. You can pass to its `returnLinkableKeys`
   * property any of the service zone's relation attribute names, such as `{type relation name}`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.restoreServiceZones([
   *   "serzo_123",
   *   "serzo_321",
   * ])
   */
  restoreServiceZones<TReturnableLinkableKeys extends string = string>(
    serviceZoneIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a geo zone by its ID.
   *
   * @param {string} id - The ID of the geo zone.
   * @param {FindConfig<GeoZoneDTO>} config - The configurations determining how the geo zone is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a geo zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<GeoZoneDTO>} The retrieved geo zone.
   *
   * @example
   * A simple example that retrieves a geo zone by its ID:
   *
   * ```ts
   * const geoZone =
   *   await fulfillmentModuleService.retrieveGeoZone("fgz_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const geoZone =
   *   await fulfillmentModuleService.retrieveGeoZone("fgz_123", {
   *     relations: ["service_zone"],
   *   })
   * ```
   */
  retrieveGeoZone(
    id: string,
    config?: FindConfig<GeoZoneDTO>,
    sharedContext?: Context
  ): Promise<GeoZoneDTO>

  /**
   * This method retrieves a paginated list of geo zones based on optional filters and configuration.
   *
   * @param {FilterableGeoZoneProps} filters - The filters to apply on the retrieved geo zones.
   * @param {FindConfig<GeoZoneDTO>} config - The configurations determining how the geo zone is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a geo zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<GeoZoneDTO[]>} The list of geo zones.
   *
   * @example
   * To retrieve a list of geo zones using their IDs:
   *
   * ```ts
   * const geoZones = await fulfillmentModuleService.listGeoZones({
   *   id: ["fgz_123", "fgz_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the geo zone:
   *
   * ```ts
   * const geoZones = await fulfillmentModuleService.listGeoZones(
   *   {
   *     id: ["fgz_123", "fgz_321"],
   *   },
   *   {
   *     relations: ["service_zone"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const geoZones = await fulfillmentModuleService.listGeoZones(
   *   {
   *     id: ["fgz_123", "fgz_321"],
   *   },
   *   {
   *     relations: ["service_zone"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listGeoZones(
    filters?: FilterableGeoZoneProps,
    config?: FindConfig<GeoZoneDTO>,
    sharedContext?: Context
  ): Promise<GeoZoneDTO[]>

  /**
   * This method retrieves a paginated list of geo zones along with the total count of available geo zones satisfying the provided filters.
   *
   * @param {FilterableGeoZoneProps} filters - The filters to apply on the retrieved geo zones.
   * @param {FindConfig<GeoZoneDTO>} config - The configurations determining how the geo zone is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a geo zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[GeoZoneDTO[], number]>} The list of geo zones along with their total count.
   *
   * @example
   * To retrieve a list of geo zones using their IDs:
   *
   * ```ts
   * const [geoZones, count] =
   *   await fulfillmentModuleService.listAndCountGeoZones({
   *     id: ["fgz_123", "fgz_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the geo zone:
   *
   * ```ts
   * const [geoZones, count] =
   *   await fulfillmentModuleService.listAndCountGeoZones(
   *     {
   *       id: ["fgz_123", "fgz_321"],
   *     },
   *     {
   *       relations: ["service_zone"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [geoZones, count] =
   *   await fulfillmentModuleService.listAndCountGeoZones(
   *     {
   *       id: ["fgz_123", "fgz_321"],
   *     },
   *     {
   *       relations: ["service_zone"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountGeoZones(
    filters?: FilterableGeoZoneProps,
    config?: FindConfig<GeoZoneDTO>,
    sharedContext?: Context
  ): Promise<[GeoZoneDTO[], number]>

  /**
   * This method creates geo zones.
   *
   * @param {CreateGeoZoneDTO[]} data - The geo zones to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<GeoZoneDTO[]>} The created geo zones.
   *
   * @example
   * const geoZones =
   *   await fulfillmentModuleService.createGeoZones([
   *     {
   *       type: "country",
   *       service_zone_id: "serzo_123",
   *       country_code: "us",
   *     },
   *     {
   *       type: "city",
   *       service_zone_id: "serzo_321",
   *       province_code: "VT",
   *       city: "Vermont",
   *       country_code: "us",
   *     },
   *   ])
   */
  createGeoZones(
    data: CreateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<GeoZoneDTO[]>

  /**
   * This method creates a geo zones.
   *
   * @param {CreateGeoZoneDTO} data - The geo zone to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<GeoZoneDTO>} The created geo zones.
   *
   * @example
   * const geoZones =
   *   await fulfillmentModuleService.createGeoZones({
   *     type: "country",
   *     service_zone_id: "serzo_123",
   *     country_code: "us",
   *   })
   */
  createGeoZones(
    data: CreateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<GeoZoneDTO>

  /**
   * This method updates existing geo zones.
   *
   * @param {UpdateGeoZoneDTO[]} data - The attributes to update in the geo zones.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<GeoZoneDTO[]>} The updated geo zones.
   *
   * @example
   * const geoZones =
   *   await fulfillmentModuleService.updateGeoZones([
   *     {
   *       id: "fgz_123",
   *       type: "country",
   *       country_code: "us",
   *     },
   *     {
   *       id: "fgz_321",
   *       type: "city",
   *       province_code: "VT",
   *     },
   *   ])
   */
  updateGeoZones(
    data: UpdateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<GeoZoneDTO[]>

  /**
   * This method updates an existing fulfillment.
   *
   * @param {UpdateGeoZoneDTO} data - The attributes to update in the geo zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<GeoZoneDTO>} The updated fulfillment.
   *
   * @example
   * const geoZones =
   *   await fulfillmentModuleService.updateGeoZones({
   *     id: "fgz_123",
   *     type: "country",
   *     country_code: "us",
   *   })
   */
  updateGeoZones(
    data: UpdateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<GeoZoneDTO>

  /**
   * This method deletes geo zones by their IDs.
   *
   * @param {string[]} ids - The IDs of the geo zones.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the geo zones are deleted.
   *
   * @example
   * await fulfillmentModuleService.deleteGeoZones([
   *   "fgz_123",
   *   "fgz_321",
   * ])
   */
  deleteGeoZones(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a geo zone by its ID.
   *
   * @param {string} id - The ID of the geo zone.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the geo zone is deleted.
   *
   * @example
   * await fulfillmentModuleService.deleteGeoZones("fgz_123")
   */
  deleteGeoZones(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes geo zones by their IDs.
   *
   * @param {string[]} geoZoneIds - The IDs of the geo zones.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.softDeleteGeoZones([
   *   "fgz_123",
   *   "fgz_321",
   * ])
   */
  softDeleteGeoZones<TReturnableLinkableKeys extends string = string>(
    geoZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted geo zones by their IDs.
   *
   * @param {string[]} geoZoneIds - The IDs of the geo zones.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the geo zones. You can pass to its `returnLinkableKeys`
   * property any of the geo zone's relation attribute names, such as `{type relation name}`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.restoreGeoZones([
   *   "fgz_123",
   *   "fgz_321",
   * ])
   */
  restoreGeoZones<TReturnableLinkableKeys extends string = string>(
    geoZoneIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a shipping option by its ID.
   *
   * @param {string} id - The ID of the shipping option.
   * @param {FindConfig<ShippingOptionDTO>} config - The configurations determining how the shipping option is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO>} The retrieved shipping option.
   *
   * @example
   * A simple example that retrieves a shipping option by its ID:
   *
   * ```ts
   * const shippingOption =
   *   await fulfillmentModuleService.retrieveShippingOption(
   *     "so_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const shippingOption =
   *   await fulfillmentModuleService.retrieveShippingOption(
   *     "so_123",
   *     {
   *       relations: ["fulfillments"],
   *     }
   *   )
   * ```
   */
  retrieveShippingOption(
    id: string,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>

  /**
   * This method retrieves a paginated list of shipping options based on optional filters and configuration.
   *
   * @param {FilterableShippingOptionProps} filters - The filters to apply on the retrieved shipping options.
   * @param {FindConfig<ShippingOptionDTO>} config - The configurations determining how the shipping option is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO[]>} The list of shipping options.
   *
   * @example
   * To retrieve a list of shipping options using their IDs:
   *
   * ```ts
   * const shippingOptions =
   *   await fulfillmentModuleService.listShippingOptions({
   *     id: ["so_123", "so_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping option:
   *
   * ```ts
   * const shippingOptions =
   *   await fulfillmentModuleService.listShippingOptions(
   *     {
   *       id: ["so_123", "so_321"],
   *     },
   *     {
   *       relations: ["fulfillments"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingOptions =
   *   await fulfillmentModuleService.listShippingOptions(
   *     {
   *       id: ["so_123", "so_321"],
   *     },
   *     {
   *       relations: ["fulfillments"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listShippingOptions(
    filters?: FilterableShippingOptionForContextProps,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>

  /**
   * This method retrieves a paginated list of shipping options based on the provided context.
   *
   * @param {FilterableShippingOptionForContextProps} filters - The context of the how the shipping option is being used. It
   * acts as a filter for the retrieved shipping options.
   * @param {FindConfig<ShippingOptionDTO>} config - The configurations determining how the shipping option is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO[]>} The list of shipping options.
   *
   * @example
   * To retrieve a list of shipping options matching a context:
   *
   * ```ts
   * const shippingOptions =
   *   await fulfillmentModuleService.listShippingOptionsForContext(
   *     {
   *       fulfillment_set_id: ["fuset_123"],
   *       address: {
   *         country_code: "us",
   *       },
   *     }
   *   )
   * ```
   *
   * To specify relations that should be retrieved within the shipping option:
   *
   * ```ts
   * const shippingOptions =
   *   await fulfillmentModuleService.listShippingOptionsForContext(
   *     {
   *       fulfillment_set_id: ["fuset_123"],
   *       address: {
   *         country_code: "us",
   *       },
   *     },
   *     {
   *       relations: ["fulfillments"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingOptions =
   *   await fulfillmentModuleService.listShippingOptionsForContext(
   *     {
   *       fulfillment_set_id: ["fuset_123"],
   *       address: {
   *         country_code: "us",
   *       },
   *     },
   *     {
   *       relations: ["fulfillments"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */

  listShippingOptionsForContext(
    filters: FilterableShippingOptionForContextProps,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>

  /**
   * This method retrieves a paginated list of shipping options along with the total count of available shipping options satisfying the provided filters.
   *
   * @param {Omit<FilterableShippingOptionProps, "context">} filters - Construct a type with the properties of T except for those in type K.
   * @param {FindConfig<ShippingOptionDTO>} config - The configurations determining how the shipping option is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ShippingOptionDTO[], number]>} The list of shipping options along with their total count.
   *
   * @example
   * To retrieve a list of shipping options using their IDs:
   *
   * ```ts
   * const [shippingOptions, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptions({
   *     id: ["so_123", "so_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping option:
   *
   * ```ts
   * const [shippingOptions, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptions(
   *     {
   *       id: ["so_123", "so_321"],
   *     },
   *     {
   *       relations: ["fulfillments"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [shippingOptions, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptions(
   *     {
   *       id: ["so_123", "so_321"],
   *     },
   *     {
   *       relations: ["fulfillments"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountShippingOptions(
    filters?: Omit<FilterableShippingOptionProps, "context">,
    config?: FindConfig<ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionDTO[], number]>

  /**
   * This method creates shipping options.
   *
   * @param {CreateShippingOptionDTO[]} data - The shipping options to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO[]>} The created shipping options.
   *
   * @example
   * const shippingOptions =
   *   await fulfillmentModuleService.createShippingOptions([
   *     {
   *       name: "DHL Express Shipping",
   *       price_type: "flat",
   *       service_zone_id: "serzo_123",
   *       shipping_profile_id: "sp_123",
   *       provider_id: "dhl",
   *       type: {
   *         label: "Express",
   *         description: "Ship in 24 hours",
   *         code: "express",
   *       },
   *     },
   *     {
   *       name: "Webshipper Shipping",
   *       price_type: "flat",
   *       service_zone_id: "serzo_321",
   *       shipping_profile_id: "sp_321",
   *       provider_id: "webshipper",
   *       type: {
   *         label: "Express",
   *         description: "Ship in 24 hours",
   *         code: "express",
   *       },
   *     },
   *   ])
   */
  createShippingOptions(
    data: CreateShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>

  /**
   * This method creates a shipping option.
   *
   * @param {CreateShippingOptionDTO} data - The shipping option to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO>} The created shipping option.
   *
   * @example
   * const shippingOption =
   *   await fulfillmentModuleService.createShippingOptions({
   *     name: "DHL Express Shipping",
   *     price_type: "flat",
   *     service_zone_id: "serzo_123",
   *     shipping_profile_id: "sp_123",
   *     provider_id: "dhl",
   *     type: {
   *       label: "Express",
   *       description: "Ship in 24 hours",
   *       code: "express",
   *     },
   *   })
   */
  createShippingOptions(
    data: CreateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>

  /**
   * This method updates an existing shipping option.
   *
   * @param {string} id - The ID of the shipping option.
   * @param {UpdateShippingOptionDTO} data - The attributes to update in the shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO>} The updated shipping option.
   *
   * @example
   * const shippingOption =
   *   await fulfillmentModuleService.updateShippingOptions(
   *     "so_123",
   *     {
   *       name: "Express shipping",
   *     }
   *   )
   */
  updateShippingOptions(
    id: string,
    data: UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>

  /**
   * This method updates existing shipping options matching the specified filters.
   *
   * @param {FilterableShippingOptionProps} selector - The filters specifying which shipping options to update.
   * @param {UpdateShippingOptionDTO} data - The attributes to update in the shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO[]>} The updated shipping options.
   *
   * @example
   * const shippingOptions =
   *   await fulfillmentModuleService.updateShippingOptions(
   *     {
   *       id: ["so_123", "so_321"],
   *     },
   *     {
   *       name: "Express Shipping",
   *     }
   *   )
   */
  updateShippingOptions(
    selector: FilterableShippingOptionProps,
    data: UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>

  /**
   * This method updates or creates a shipping option if it doesn't exist.
   *
   * @param {UpsertShippingOptionDTO} data - The attributes in the shipping option to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO>} The created or updated shipping option.
   *
   * @example
   * const shippingOptions =
   *   await fulfillmentModuleService.upsertShippingOptions({
   *     id: "so_123",
   *     name: "Express Shipping",
   *   })
   */
  upsertShippingOptions(
    data: UpsertShippingOptionDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionDTO>

  /**
   * This method updates or creates shipping options if they don't exist.
   *
   * @param {UpsertShippingOptionDTO[]} data - The attributes in the shipping options to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionDTO[]>} The created or updated shipping options.
   *
   * @example
   * const shippingOptions =
   *   await fulfillmentModuleService.upsertShippingOptions([
   *     {
   *       id: "so_123",
   *       name: "Express Shipping",
   *     },
   *     {
   *       name: "Express Shipping",
   *       price_type: "flat",
   *       service_zone_id: "serzo_123",
   *       shipping_profile_id: "sp_123",
   *       provider_id: "webshipper",
   *       type: {
   *         label: "Express",
   *         description: "express shipping",
   *         code: "express",
   *       },
   *     },
   *   ])
   */
  upsertShippingOptions(
    data: UpsertShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionDTO[]>

  /**
   * This method deletes shipping options by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping options.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping options are deleted successfully.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingOptions([
   *   "so_123",
   *   "so_321",
   * ])
   */
  deleteShippingOptions(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a shipping option by its ID.
   *
   * @param {string} id - The ID of the shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping option is deleted successfully.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingOptions("so_123")
   */
  deleteShippingOptions(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes shipping option by their IDs.
   *
   * @param {string[]} shippingOptionIds - The IDs of the shipping options.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.softDeleteShippingOptions([
   *   "so_123",
   *   "so_321",
   * ])
   */
  softDeleteShippingOptions<TReturnableLinkableKeys extends string = string>(
    shippingOptionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted shipping options by their IDs.
   *
   * @param {string[]} shippingOptionIds - The list of {summary}
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping options. You can pass to its `returnLinkableKeys`
   * property any of the shipping option's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.restoreShippingOptions([
   *   "so_123",
   *   "so_321",
   * ])
   */
  restoreShippingOptions<TReturnableLinkableKeys extends string = string>(
    shippingOptionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a shipping profile by its ID.
   *
   * @param {string} id - The ID of the shipping profile.
   * @param {FindConfig<ShippingProfileDTO>} config - The configurations determining how the shipping profile is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping profile.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingProfileDTO>} The retrieved shipping profile.
   *
   * @example
   * A simple example that retrieves a shipping profile by its ID:
   *
   * ```ts
   * const shippingProfile =
   *   await fulfillmentModuleService.retrieveShippingProfile(
   *     "sp_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const shippingProfile =
   *   await fulfillmentModuleService.retrieveShippingProfile(
   *     "sp_123",
   *     {
   *       relations: ["options"],
   *     }
   *   )
   * ```
   */
  retrieveShippingProfile(
    id: string,
    config?: FindConfig<ShippingProfileDTO>,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO>

  /**
   * This method retrieves a paginated list of shipping profiles based on optional filters and configuration.
   *
   * @param {FilterableShippingProfileProps} filters - The filters to apply on the retrieved shipping profiles.
   * @param {FindConfig<ShippingProfileDTO>} config - The configurations determining how the shipping profile is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping profile.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingProfileDTO[]>} The list of shipping profiles.
   *
   * @example
   * To retrieve a list of shipping profiles using their IDs:
   *
   * ```ts
   * const shippingProfiles =
   *   await fulfillmentModuleService.listShippingProfiles({
   *     id: ["sp_123", "sp_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping profile:
   *
   * ```ts
   * const shippingProfiles =
   *   await fulfillmentModuleService.listShippingProfiles(
   *     {
   *       id: ["sp_123", "sp_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingProfiles =
   *   await fulfillmentModuleService.listShippingProfiles(
   *     {
   *       id: ["sp_123", "sp_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listShippingProfiles(
    filters?: FilterableShippingProfileProps,
    config?: FindConfig<ShippingProfileDTO>,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO[]>

  /**
   * This method retrieves a paginated list of shipping profiles along with the total count of available shipping profiles satisfying the provided filters.
   *
   * @param {FilterableShippingProfileProps} filters - The filters to apply on the retrieved shipping profiles.
   * @param {FindConfig<ShippingProfileDTO>} config - The configurations determining how the shipping profile is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping profile.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ShippingProfileDTO[], number]>} The list of shipping profiles along with their total count.
   *
   * @example
   * To retrieve a list of shipping profiles using their IDs:
   *
   * ```ts
   * const [shippingProfiles, count] =
   *   await fulfillmentModuleService.listAndCountShippingProfiles(
   *     {
   *       id: ["sp_123", "sp_321"],
   *     }
   *   )
   * ```
   *
   * To specify relations that should be retrieved within the shipping profile:
   *
   * ```ts
   * const [shippingProfiles, count] =
   *   await fulfillmentModuleService.listAndCountShippingProfiles(
   *     {
   *       id: ["sp_123", "sp_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [shippingProfiles, count] =
   *   await fulfillmentModuleService.listAndCountShippingProfiles(
   *     {
   *       id: ["sp_123", "sp_321"],
   *     },
   *     {
   *       relations: ["shipping_options"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountShippingProfiles(
    filters?: FilterableShippingProfileProps,
    config?: FindConfig<ShippingProfileDTO>,
    sharedContext?: Context
  ): Promise<[ShippingProfileDTO[], number]>

  /**
   * This method creates shipping profiles.
   *
   * @param {CreateShippingProfileDTO[]} data - The shipping profiles to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingProfileDTO[]>} The created shipping profiles.
   *
   * @example
   * const shippingProfiles =
   *   await fulfillmentModuleService.createShippingProfiles([
   *     {
   *       name: "Default",
   *     },
   *     {
   *       name: "Digital",
   *     },
   *   ])
   */
  createShippingProfiles(
    data: CreateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<ShippingProfileDTO[]>

  /**
   * This method creates a shipping profile.
   *
   * @param {CreateShippingProfileDTO} data - The shipping profile to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingProfileDTO>} The created shipping profile.
   *
   * @example
   * const shippingProfile =
   *   await fulfillmentModuleService.createShippingProfiles({
   *     name: "Default",
   *   })
   */
  createShippingProfiles(
    data: CreateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO>

  /**
   * This method updates existing shipping profiles.
   *
   * @param {CreateShippingProfileDTO[]} data - The shipping profiles to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingProfileDTO[]>} The updated shipping profiles.
   *
   * @example
   * const shippingProfiles =
   *   await fulfillmentModuleService.updateShippingProfiles([
   *     {
   *       id: "sp_123",
   *       name: "Default",
   *     },
   *     {
   *       id: "sp_321",
   *       name: "Digital",
   *     },
   *   ])
   */
  updateShippingProfiles(
    data: UpdateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<ShippingProfileDTO[]>

  /**
   * This method updates an existing shipping profiles.
   *
   * @param {CreateShippingProfileDTO} data - The shipping profile to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingProfileDTO>} The updated shipping profiles.
   *
   * @example
   * const shippingProfiles =
   *   await fulfillmentModuleService.updateShippingProfiles({
   *     id: "sp_123",
   *     name: "Default",
   *   })
   */
  updateShippingProfiles(
    data: UpdateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<ShippingProfileDTO>

  /**
   * This method deletes shipping profiles by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping profiles.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping profiles are deleted.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingProfiles([
   *   "sp_123",
   *   "sp_321",
   * ])
   */
  deleteShippingProfiles(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a shipping profile by its ID.
   *
   * @param {string} id - The ID of the shipping profile.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping profile is deleted.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingProfiles(
   *   "sp_123"
   * )
   */
  deleteShippingProfiles(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes shipping profiles by their IDs.
   *
   * @param {string[]} shippingProfileIds - The IDs of the shipping profiles.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.softDeleteShippingProfiles([
   *   "sp_123",
   *   "sp_321",
   * ])
   */
  softDeleteShippingProfiles<TReturnableLinkableKeys extends string = string>(
    shippingProfileIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted shipping profiles by their IDs.
   *
   * @param {string[]} shippingProfileIds - The IDs of the shipping profiles.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping profiles. You can pass to its `returnLinkableKeys`
   * property any of the shipping profile's relation attribute names, such as `{type relation name}`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await fulfillmentModuleService.restoreShippingProfiles([
   *   "sp_123",
   *   "sp_321",
   * ])
   */
  restoreShippingProfiles<TReturnableLinkableKeys extends string = string>(
    shippingProfileIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a shipping option rule by its ID.
   *
   * @param {string} id - The ID of the shipping option rule.
   * @param {FindConfig<ShippingOptionRuleDTO>} config - The configurations determining how the shipping option rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionRuleDTO>} The retrieved shipping option rule.
   *
   * @example
   * A simple example that retrieves a shipping option rule by its ID:
   *
   * ```ts
   * const shippingOptionRule =
   *   await fulfillmentModuleService.retrieveShippingOptionRule(
   *     "sorul_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const shippingOptionRule =
   *   await fulfillmentModuleService.retrieveShippingOptionRule(
   *     "sorul_123",
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   */
  retrieveShippingOptionRule(
    id: string,
    config?: FindConfig<ShippingOptionRuleDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO>

  /**
   * This method retrieves a paginated list of shipping option rules based on optional filters and configuration.
   *
   * @param {FilterableShippingOptionRuleProps} filters - The filters to apply on the retrieved shipping option rules.
   * @param {FindConfig<ShippingOptionRuleDTO>} config - The configurations determining how the shipping option rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionRuleDTO[]>} The list of shipping option rules.
   *
   * @example
   * To retrieve a list of shipping option rules using their IDs:
   *
   * ```ts
   * const shippingOptionRules =
   *   await fulfillmentModuleService.listShippingOptionRules({
   *     id: ["sorul_123", "sorul_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping option rule:
   *
   * ```ts
   * const shippingOptionRules =
   *   await fulfillmentModuleService.listShippingOptionRules(
   *     {
   *       id: ["sorul_123", "sorul_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingOptionRules =
   *   await fulfillmentModuleService.listShippingOptionRules(
   *     {
   *       id: ["sorul_123", "sorul_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listShippingOptionRules(
    filters?: FilterableShippingOptionRuleProps,
    config?: FindConfig<ShippingOptionRuleDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO[]>

  /**
   * This method retrieves a paginated list of shipping option rules along with the total count of available shipping option rules satisfying the provided filters.
   *
   * @param {FilterableShippingOptionRuleProps} filters - The filters to apply on the retrieved shipping option rules.
   * @param {FindConfig<ShippingOptionRuleDTO>} config - The configurations determining how the shipping option rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ShippingOptionRuleDTO[], number]>} The list of shipping option rules along with their total count.
   *
   * @example
   * To retrieve a list of shipping option rules using their IDs:
   *
   * ```ts
   * const [shippingOptionRules, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptionRules(
   *     {
   *       id: ["sorul_123", "sorul_321"],
   *     }
   *   )
   * ```
   *
   * To specify relations that should be retrieved within the shipping option rule:
   *
   * ```ts
   * const [shippingOptionRules, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptionRules(
   *     {
   *       id: ["sorul_123", "sorul_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [shippingOptionRules, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptionRules(
   *     {
   *       id: ["sorul_123", "sorul_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountShippingOptionRules(
    filters?: FilterableShippingOptionRuleProps,
    config?: FindConfig<ShippingOptionRuleDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionRuleDTO[], number]>

  /**
   * This method creates shipping option rules.
   *
   * @param {CreateShippingOptionRuleDTO[]} data - The shipping option rules to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionRuleDTO[]>} The created shipping option rules.
   *
   * @example
   * const shippingOptionRules =
   *   await fulfillmentModuleService.createShippingOptionRules([
   *     {
   *       attribute: "customer_group",
   *       operator: "in",
   *       value: "cg_vipgroup",
   *       shipping_option_id: "so_123",
   *     },
   *     {
   *       attribute: "total_weight",
   *       operator: "lt",
   *       value: "2000",
   *       shipping_option_id: "so_321",
   *     },
   *   ])
   */
  createShippingOptionRules(
    data: CreateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO[]>

  /**
   * This method creates a shipping option rule.
   *
   * @param {CreateShippingOptionRuleDTO} data - The shipping option rule to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionRuleDTO>} The created shipping option rule.
   *
   * @example
   * const shippingOptionRule =
   *   await fulfillmentModuleService.createShippingOptionRules({
   *     attribute: "customer_group",
   *     operator: "in",
   *     value: "cg_vipgroup",
   *     shipping_option_id: "so_123",
   *   })
   */
  createShippingOptionRules(
    data: CreateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO>

  /**
   * This method updates existing shipping option rules.
   *
   * @param {UpdateShippingOptionRuleDTO[]} data - The attributes to update in the shipping option rules.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionRuleDTO[]>} The updated shipping option rules.
   *
   * @example
   * const shippingOptionRules =
   *   await fulfillmentModuleService.updateShippingOptionRules([
   *     {
   *       id: "sorul_123",
   *       operator: "in",
   *     },
   *     {
   *       id: "sorul_321",
   *       attribute: "customer_group",
   *       value: "cp_vipgroup",
   *     },
   *   ])
   */
  updateShippingOptionRules(
    data: UpdateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO[]>

  /**
   * This method updates an existing shipping option rule.
   *
   * @param {UpdateShippingOptionRuleDTO} data - The attributes to update in the shipping option rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionRuleDTO>} The updated shipping option rule.
   *
   * @example
   * const shippingOptionRule =
   *   await fulfillmentModuleService.updateShippingOptionRules({
   *     id: "sorul_123",
   *     operator: "in",
   *   })
   */
  updateShippingOptionRules(
    data: UpdateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<ShippingOptionRuleDTO>

  /**
   * This method deletes shipping option rules by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping option rules.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping option rules are deleted successfully.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingOptionRules([
   *   "sorul_123",
   *   "sorul_321",
   * ])
   */
  deleteShippingOptionRules(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a shipping option by its ID.
   *
   * @param {string} id - The ID of the shipping option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping option is deleted successfully.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingOptionRules(
   *   "sorul_123"
   * )
   */
  deleteShippingOptionRules(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a shipping option type by its ID.
   *
   * @param {string} id - The ID of the shipping option type.
   * @param {FindConfig<ShippingOptionTypeDTO>} config - The configurations determining how the shipping option type is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionTypeDTO>} The retrieved shipping option type.
   *
   * @example
   * A simple example that retrieves a shipping option type by its ID:
   *
   * ```ts
   * const shippingOptionType =
   *   await fulfillmentModuleService.retrieveShippingOptionType(
   *     "sotype_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const shippingOptionType =
   *   await fulfillmentModuleService.retrieveShippingOptionType(
   *     "sotype_123",
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   */
  retrieveShippingOptionType(
    id: string,
    config?: FindConfig<ShippingOptionTypeDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionTypeDTO>

  /**
   * This method retrieves a paginated list of shipping option types based on optional filters and configuration.
   *
   * @param {FilterableShippingOptionTypeProps} filters - The filters to apply on the retrieved shipping option types.
   * @param {FindConfig<ShippingOptionTypeDTO>} config - The configurations determining how the shipping option type is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingOptionTypeDTO[]>} The list of shipping option types.
   *
   * @example
   * To retrieve a list of shipping option types using their IDs:
   *
   * ```ts
   * const shippingOptionTypes =
   *   await fulfillmentModuleService.listShippingOptionTypes({
   *     id: ["sotype_123", "sotype_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping option type:
   *
   * ```ts
   * const shippingOptionTypes =
   *   await fulfillmentModuleService.listShippingOptionTypes(
   *     {
   *       id: ["sotype_123", "sotype_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingOptionTypes =
   *   await fulfillmentModuleService.listShippingOptionTypes(
   *     {
   *       id: ["sotype_123", "sotype_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listShippingOptionTypes(
    filters?: FilterableShippingOptionTypeProps,
    config?: FindConfig<ShippingOptionTypeDTO>,
    sharedContext?: Context
  ): Promise<ShippingOptionTypeDTO[]>

  /**
   * This method retrieves a paginated list of shipping option types along with the total count of available shipping option types satisfying the provided filters.
   *
   * @param {FilterableShippingOptionTypeProps} filters - The filters to apply on the retrieved shipping option types.
   * @param {FindConfig<ShippingOptionTypeDTO>} config - The configurations determining how the shipping option type is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping option type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ShippingOptionTypeDTO[], number]>} The list of shipping option types along with their total count.
   *
   * @example
   * To retrieve a list of shipping option types using their IDs:
   *
   * ```ts
   * const [shippingOptionTypes, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptionTypes(
   *     {
   *       id: ["sotype_123", "sotype_321"],
   *     }
   *   )
   * ```
   *
   * To specify relations that should be retrieved within the shipping option type:
   *
   * ```ts
   * const [shippingOptionTypes, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptionTypes(
   *     {
   *       id: ["sotype_123", "sotype_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [shippingOptionTypes, count] =
   *   await fulfillmentModuleService.listAndCountShippingOptionTypes(
   *     {
   *       id: ["sotype_123", "sotype_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountShippingOptionTypes(
    filters?: FilterableShippingOptionTypeProps,
    config?: FindConfig<ShippingOptionTypeDTO>,
    sharedContext?: Context
  ): Promise<[ShippingOptionTypeDTO[], number]>

  /**
   * This method deletes shipping option types by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping option types.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping option types are deleted successfully.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingOptionTypes([
   *   "sotype_123",
   *   "sotype_321",
   * ])
   */
  deleteShippingOptionTypes(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a shipping option type by its ID.
   *
   * @param {string} id - The ID of the shipping option type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping option type is deleted.
   *
   * @example
   * await fulfillmentModuleService.deleteShippingOptionTypes(
   *   "sotype_123"
   * )
   */
  deleteShippingOptionTypes(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a fulfillment by its ID.
   *
   * @param {string} id - The ID of the fulfillment.
   * @param {FindConfig<FulfillmentDTO>} config - The configurations determining how the fulfillment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a fulfillment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentDTO>} The retrieved fulfillment.
   *
   * @example
   * A simple example that retrieves a fulfillment by its ID:
   *
   * ```ts
   * const fulfillment =
   *   await fulfillmentModuleService.retrieveFulfillment(
   *     "ful_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const fulfillment =
   *   await fulfillmentModuleService.retrieveFulfillment(
   *     "ful_123",
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   */
  retrieveFulfillment(
    id: string,
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  /**
   * This method retrieves a paginated list of fulfillments based on optional filters and configuration.
   *
   * @param {FilterableFulfillmentSetProps} filters - The filters to apply on the retrieved fulfillments.
   * @param {FindConfig<FulfillmentDTO>} config - The configurations determining how the fulfillment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a fulfillment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentDTO[]>} The list of fulfillments.
   *
   * @example
   * To retrieve a list of fulfillments using their IDs:
   *
   * ```ts
   * const fulfillments =
   *   await fulfillmentModuleService.listFulfillments({
   *     id: ["ful_123", "ful_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the fulfillment:
   *
   * ```ts
   * const fulfillments =
   *   await fulfillmentModuleService.listFulfillments(
   *     {
   *       id: ["ful_123", "ful_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const fulfillments =
   *   await fulfillmentModuleService.listFulfillments(
   *     {
   *       id: ["ful_123", "ful_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listFulfillments(
    filters?: FilterableFulfillmentProps,
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentDTO[]>

  /**
   * This method retrieves a paginated list of fulfillments along with the total count of available fulfillments satisfying the provided filters.
   *
   * @param {FilterableFulfillmentSetProps} filters - The filters to apply on the retrieved fulfillment sets.
   * @param {FindConfig<FulfillmentDTO>} config - The configurations determining how the fulfillment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a fulfillment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[FulfillmentDTO[], number]>} The list of fulfillments along with their total count.
   *
   * @example
   * To retrieve a list of fulfillments using their IDs:
   *
   * ```ts
   * const [fulfillments, count] =
   *   await fulfillmentModuleService.listAndCountFulfillments(
   *     {
   *       id: ["ful_123", "ful_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   *
   * To specify relations that should be retrieved within the fulfillment:
   *
   * ```ts
   * const [fulfillments, count] =
   *   await fulfillmentModuleService.listAndCountFulfillments(
   *     {
   *       id: ["ful_123", "ful_321"],
   *     },
   *     {
   *       relations: ["shipping_option"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [fulfillments, count] =
   *   await fulfillmentModuleService.listAndCountFulfillments({
   *     id: ["ful_123", "ful_321"],
   *   })
   * ```
   */
  listAndCountFulfillments(
    filters?: FilterableFulfillmentProps,
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentDTO[], number]>

  /**
   * This method creates a fulfillment and call the provider to create a fulfillment.
   *
   * @param {CreateFulfillmentDTO} data - The fulfillment to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentDTO>} The created fulfillment.
   *
   * @example
   * const fulfillment =
   *   await fulfillmentModuleService.createFulfillment({
   *     location_id: "loc_123",
   *     provider_id: "webshipper",
   *     delivery_address: {
   *       address_1: "4120 Auto Park Cir",
   *       country_code: "us",
   *     },
   *     items: [
   *       {
   *         title: "Shirt",
   *         sku: "SHIRT",
   *         quantity: 1,
   *         barcode: "ABCED",
   *       },
   *     ],
   *     labels: [
   *       {
   *         tracking_number: "1234567",
   *         tracking_url: "https://example.com/tracking",
   *         label_url: "https://example.com/label",
   *       },
   *     ],
   *     order: {},
   *   })
   */
  createFulfillment(
    data: CreateFulfillmentDTO,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  /**
   * This method creates a fulfillment and call the provider to create a return.
   *
   * @param {CreateFulfillmentDTO} data - The fulfillment to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentDTO>} The created fulfillment.
   *
   * @example
   * const fulfillment =
   *   await fulfillmentModuleService.createReturnFulfillment({
   *     location_id: "loc_123",
   *     provider_id: "webshipper",
   *     delivery_address: {
   *       address_1: "4120 Auto Park Cir",
   *       country_code: "us",
   *     },
   *     items: [
   *       {
   *         title: "Shirt",
   *         sku: "SHIRT",
   *         quantity: 1,
   *         barcode: "ABCED",
   *       },
   *     ],
   *     labels: [
   *       {
   *         tracking_number: "1234567",
   *         tracking_url: "https://example.com/tracking",
   *         label_url: "https://example.com/label",
   *       },
   *     ],
   *     order: {},
   *   })
   */
  createReturnFulfillment(
    data: CreateFulfillmentDTO,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  /**
   * This method updates an existing fulfillment.
   *
   * @param {string} id - The ID of the fulfillment.
   * @param {UpdateFulfillmentDTO} data - The attributes to update in the fulfillment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentDTO>} The updated fulfillment.
   *
   * @example
   * const fulfillment =
   *   await fulfillmentModuleService.updateFulfillment(
   *     "ful_123",
   *     {
   *       location_id: "loc_123",
   *     }
   *   )
   */
  updateFulfillment(
    id: string,
    data: UpdateFulfillmentDTO,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  /**
   * This method cancels a fulfillment.
   *
   * @param {string} id - The ID of the fulfillment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentDTO>} cancels a fulfillment.
   *
   * @example
   * const fulfillment =
   *  await fulfillmentModuleService.cancelFulfillment("ful_123")
   */
  cancelFulfillment(
    id: string,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  /**
   * This method retrieves the fulfillment options of a fulfillment provider.
   *
   * @param {string} providerId - The fulfillment provider's ID.
   * @returns {Promise<Record<string, unknown>[]>} The fulfillment provider's options.
   *
   * @example
   * const fulfillment =
   *   await fulfillmentModuleService.retrieveFulfillmentOptions(
   *     "ful_123"
   *   )
   */
  retrieveFulfillmentOptions(
    providerId: string
  ): Promise<Record<string, unknown>[]>

  /**
   * This method validates a fulfillment option with the provider it belongs to.
   *
   * @param {string} providerId - The fulfillment provider's ID.
   * @param {Record<string, unknown>} data - The fulfillment option to validate.
   * @returns {Promise<boolean>} Whether the fulfillment option is valid with the specified provider.
   *
   * @example
   * const isValid =
   *   await fulfillmentModuleService.validateFulfillmentOption(
   *     "webshipper",
   *     {
   *       code: "express",
   *     }
   *   )
   */
  validateFulfillmentOption(
    providerId: string,
    data: Record<string, unknown>
  ): Promise<boolean>

  /**
   * This method checks whether a shipping option can be used for a specified context.
   *
   * @param {string} shippingOptionId - The shipping option's ID.
   * @param {Record<string, unknown>} context - The context to check.
   * @returns {Promise<boolean>} Whether the shipping option is valid for the specified context.
   *
   * @example
   * const isValid =
   *   await fulfillmentModuleService.validateShippingOption(
   *     "so_123",
   *     {
   *       customer_group: "cg_vipgroup",
   *     }
   *   )
   */
  validateShippingOption(
    shippingOptionId: string,
    context: Record<string, unknown>
  ): Promise<boolean>

  /**
   * This method retrieves a paginated list of fulfillment providers based on optional filters and configuration.
   *
   * @param {FilterableFulfillmentProviderProps} filters - The filters to apply on the retrieved fulfillment providers.
   * @param {FindConfig<FulfillmentProviderDTO>} config - The configurations determining how the fulfillment provider is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a fulfillment provider.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FulfillmentProviderDTO[]>} The list of fulfillment providers.
   *
   * @example
   * To retrieve a list of fulfillment providers using their IDs:
   *
   * ```ts
   * const providers = await fulfillmentModuleService.listFulfillmentProviders({
   *   id: ["sepro_123", "sepro_321"],
   * })
   * ```
   *
   */
  listFulfillmentProviders(
    filters?: FilterableFulfillmentProviderProps,
    config?: FindConfig<FulfillmentProviderDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentProviderDTO[]>
}
