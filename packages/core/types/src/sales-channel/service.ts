import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableSalesChannelProps, SalesChannelDTO } from "./common"
import {
  CreateSalesChannelDTO,
  UpdateSalesChannelDTO,
  UpsertSalesChannelDTO,
} from "./mutations"

/**
 * The main service interface for the Sales Channel Module.
 */
export interface ISalesChannelModuleService extends IModuleService {
  /**
   * This method creates sales channels.
   *
   * @param {CreateSalesChannelDTO[]} data - The sales channels to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO[]>} The created sales channels.
   *
   * @example
   * const salesChannels = await salesChannelModuleService.createSalesChannels([
   *   {
   *     name: "B2B",
   *   },
   * ])
   */
  createSalesChannels(
    data: CreateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  /**
   * This method creates a sales channel.
   *
   * @param {CreateSalesChannelDTO} data - The sales channel to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO>} The created sales channel.
   *
   * @example
   * const salesChannel = await salesChannelModuleService.createSalesChannels({
   *   name: "B2B",
   * })
   */
  createSalesChannels(
    data: CreateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  /**
   * This method updates an existing sales channel.
   *
   * @param {string} channelId - The sales channel's ID.
   * @param {UpdateSalesChannelDTO} data - The attributes to update in the sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO>} The updated sales channel.
   *
   * @example
   * const salesChannel = await salesChannelModuleService.updateSalesChannels(
   *   "sc_123",
   *   {
   *     description: "Sales channel for B2B customers",
   *   }
   * )
   */
  updateSalesChannels(
    channelId: string,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  /**
   * This method updates existing sales channels matching the specified filters
   *
   * @param {FilterableSalesChannelProps} selector - The filters specifying which sales channels to update.
   * @param {UpdateSalesChannelDTO} data - The attributes to update in the sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO[]>} The updated sales channels.
   *
   * @example
   * const salesChannels = await salesChannelModuleService.updateSalesChannels(
   *   {
   *     name: "B2B",
   *   },
   *   {
   *     description: "Sales channel for B2B customers",
   *   }
   * )
   */
  updateSalesChannels(
    selector: FilterableSalesChannelProps,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  /**
   * This method updates or creates a sales channel if it doesn't exist.
   *
   * @param {UpsertSalesChannelDTO} data - The attributes in the sales channel to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO>} The created or updated sales channel.
   *
   * @example
   * const salesChannel = await salesChannelModuleService.upsertSalesChannels({
   *   name: "B2B",
   * })
   */
  upsertSalesChannels(
    data: UpsertSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  /**
   * This method updates or creates sales channels if they don't exist.
   *
   * @param {UpsertSalesChannelDTO[]} data - The attributes in the sales channels to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO[]>} The created or updated sales channels.
   *
   * @example
   * const salesChannels = await salesChannelModuleService.upsertSalesChannels([
   *   {
   *     name: "B2B",
   *   },
   *   {
   *     id: "sc_123",
   *     description: "Sales channel for B2B customers",
   *   },
   * ])
   */
  upsertSalesChannels(
    data: UpsertSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  /**
   * This method deletes sales channel by their IDs.
   *
   * @param {string[]} ids - The IDs of the sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the sales channels are deleted successfully.
   *
   * @example
   * await salesChannelModuleService.deleteSalesChannels(["sc_123", "sc_321"])
   */
  deleteSalesChannels(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a sales channel by its ID.
   *
   * @param {string} id - The ID of the sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the sales channel is deleted successfully.
   *
   * @example
   * await salesChannelModuleService.deleteSalesChannels("sc_123")
   */
  deleteSalesChannels(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a sales channel by its ID.
   *
   * @param {string} id - The ID of the sales channel.
   * @param {FindConfig<SalesChannelDTO>} config - The configurations determining how the sales channel is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO>} The retrieved sales channel.
   *
   * @example
   * const salesChannel =
   *   await salesChannelModuleService.retrieveSalesChannel("sc_123")
   */
  retrieveSalesChannel(
    id: string,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  /**
   * This method retrieves a paginated list of sales channels based on optional filters and configuration.
   *
   * @param {FilterableSalesChannelProps} filters - The filters to apply on the retrieved sales channels.
   * @param {FindConfig<SalesChannelDTO>} config - The configurations determining how the sales channel is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO[]>} The list of sales channels.
   *
   * @example
   * To retrieve a list of sales channels using their IDs:
   *
   * ```ts
   * const salesChannels = await salesChannelModuleService.listSalesChannels({
   *   id: ["sc_123", "sc_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const salesChannels = await salesChannelModuleService.listSalesChannels(
   *   {
   *     id: ["sc_123", "sc_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listSalesChannels(
    filters?: FilterableSalesChannelProps,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  /**
   * This method retrieves a paginated list of sales channels along with the total count of available sales channels satisfying the provided filters.
   *
   * @param {FilterableSalesChannelProps} filters - The filters to apply on the retrieved sales channels.
   * @param {FindConfig<SalesChannelDTO>} config - The configurations determining how the sales channel is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[SalesChannelDTO[], number]>} The list of sales channels along with their total count.
   *
   * @example
   * To retrieve a list of sales channels using their IDs:
   *
   * ```ts
   * const [salesChannels, count] =
   *   await salesChannelModuleService.listAndCountSalesChannels({
   *     id: ["sc_123", "sc_321"],
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [salesChannels, count] =
   *   await salesChannelModuleService.listAndCountSalesChannels(
   *     {
   *       id: ["sc_123", "sc_321"],
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountSalesChannels(
    filters?: FilterableSalesChannelProps,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<[SalesChannelDTO[], number]>

  /**
   * This method soft deletes sales channels by their IDs.
   *
   * @param {string[]} salesChannelIds - The sales channels' ID.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await salesChannelModuleService.softDeleteSalesChannels(["sc_123", "sc_321"])
   */
  softDeleteSalesChannels<TReturnableLinkableKeys extends string = string>(
    salesChannelIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores a soft deleted sales channel by its IDs.
   *
   * @param {string[]} salesChannelIds - The list of {summary}
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the sales channel. You can pass to its `returnLinkableKeys`
   * property any of the sales channel's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await salesChannelModuleService.restoreSalesChannels(["sc_123", "sc_321"])
   */
  restoreSalesChannels<TReturnableLinkableKeys extends string = string>(
    salesChannelIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
