import { IModuleService } from "../modules-sdk"
import { FilterableSalesChannelProps, SalesChannelDTO } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "./mutations"

/**
 * The main service interface for the sales channel module.
 */
export interface ISalesChannelModuleService extends IModuleService {
  /**
   * This method creates sales channels.
   *
   * @param {CreateSalesChannelDTO[]} data - The sales channel to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO[]>} The created sales channels.
   *
   * @example
   * {example-code}
   */
  create(
    data: CreateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  /**
   * This method creates a sales channel.
   *
   * @param {CreateSalesChannelDTO} data - The sales channel to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO>} The created a sales channel.
   *
   * @example
   * {example-code}
   */
  create(
    data: CreateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  /**
   * This method updates existing sales channels.
   *
   * @param {UpdateSalesChannelDTO[]} data - The attributes to update in each sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO[]>} The updated sales channels.
   *
   * @example
   * {example-code}
   */
  update(
    data: UpdateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  /**
   * This method updates an existing sales channel.
   *
   * @param {UpdateSalesChannelDTO} data - The attributes to update in the sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO>} The updated sales channel.
   *
   * @example
   * {example-code}
   */
  update(
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  /**
   * This method deletes sales channels by their IDs.
   *
   * @param {string[]} ids - The list of IDs of sales channels to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the sales channels are deleted.
   *
   * @example
   * {example-code}
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a sales channel by its ID.
   *
   * @param {string} id - The ID of the sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the sales channel is deleted.
   *
   * @example
   * {example-code}
   */
  delete(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a sales channel by its ID.
   *
   * @param {string} id - The ID of the retrieve.
   * @param {FindConfig<SalesChannelDTO>} config - The configurations determining how the sales channel is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO>} The retrieved sales channels.
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
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  /**
   * This method retrieves a paginated list of sales channels based on optional filters and configuration.
   *
   * @param {FilterableSalesChannelProps} filters - The filters to apply on the retrieved sales channel.
   * @param {FindConfig<SalesChannelDTO>} config - The configurations determining how the sales channel is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<SalesChannelDTO[]>} The list of sales channels.
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
    filters?: FilterableSalesChannelProps,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  /**
   * This method retrieves a paginated list of sales channels along with the total count of available sales channels satisfying the provided filters.
   *
   * @param {FilterableSalesChannelProps} filters - The filters to apply on the retrieved sales channel.
   * @param {FindConfig<SalesChannelDTO>} config - The configurations determining how the sales channel is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a sales channel.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[SalesChannelDTO[], number]>} The list of sales channels along with their total count.
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
    filters?: FilterableSalesChannelProps,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<[SalesChannelDTO[], number]>

  /**
   * This method soft deletes sales channels by their IDs.
   *
   * @param {string[]} salesChannelIds - The list of IDs of sales channels to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} Resolves when the sales channels are soft deleted.
   *
   * @example
   * {example-code}
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    salesChannelIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted sales channels by their IDs.
   *
   * @param {string[]} salesChannelIds - The list of IDs of sales channels to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the sales channels. You can pass to its `returnLinkableKeys`
   * property any of the sales channels's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the sales channels entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the sales channel through this relation.
   *
   * @example
   * {example-code}
   */
  restore<TReturnableLinkableKeys extends string = string>(
    salesChannelIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
