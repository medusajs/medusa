import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { CartDTO, FilterableCartProps } from "./common"
import {
  AddLineItemsDTO,
  CreateCartDTO,
  UpdateCartDTO,
  UpdateLineItemsDTO,
} from "./mutations"

/**
 * {summary}
 */
export interface ICartModuleService extends IModuleService {
  /**
   * This method retrieves a {type name} by its ID.
   *
   * @param {string} cartId - The Cart's ID.
   * @param {FindConfig<CartDTO>} config - The configurations determining how the {type name} is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a {item name}.
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO>} The retrieved {type name}.
   *
   * @example
   * A simple example that retrieves a price set by its ID:
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
    cartId: string,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO>

  /**
   * This method retrieves a paginated list of {type name} based on optional filters and configuration.
   *
   * @param {FilterableCartProps} filters - The filters to apply on the retrieved {type name}.
   * @param {FindConfig<CartDTO>} config - The configurations determining how the {type name} is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a {item name}.
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO[]>} The list of {type name}.
   *
   * @example
   * To retrieve a list of prices sets using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the price sets:
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
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO[]>

  /**
   * This method retrieves a paginated list of {type name} along with the total count of available {type name} satisfying the provided filters.
   *
   * @param {FilterableCartProps} filters - The filters to apply on the retrieved {type name}.
   * @param {FindConfig<CartDTO>} config - The configurations determining how the {type name} is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a {item name}.
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<[CartDTO[], number]>} The list of {type name} along with their total count.
   *
   * @example
   * To retrieve a list of prices sets using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the price sets:
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
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<[CartDTO[], number]>

  /**
   * This method creates a new {type name}
   *
   * @param {CreateCartDTO[]} data - The {type name} to be created.
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO[]>} The created {type name}.
   *
   * @example
   * {example-code}
   */
  create(data: CreateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>

  /**
   * This method updates existing {type name}.
   *
   * @param {UpdateCartDTO[]} data - The attributes to update in the {type name}.
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO[]>} The updated {type name}.
   *
   * @example
   * {example-code}
   */
  update(data: UpdateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>

  /**
   * This method deletes {type name} by its ID.
   *
   * @param {string[]} cartIds - {summary}
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<void>} Resolves when {summary}
   *
   * @example
   * {example-code}
   */
  delete(cartIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method {summary}
   *
   * @param {AddLineItemsDTO} data - {summary}
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO>} {summary}
   *
   * @example
   * {example-code}
   */
  addLineItems(data: AddLineItemsDTO, sharedContext?: Context): Promise<CartDTO>

  /**
   * This method {summary}
   *
   * @param {AddLineItemsDTO[]} data - {summary}
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO[]>} {summary}
   *
   * @example
   * {example-code}
   */
  addLineItems(
    data: AddLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartDTO[]>

  /**
   * This method updates existing {type name}.
   *
   * @param {UpdateLineItemsDTO} data - The attributes to update in the {type name}.
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO>} The updated {type name}.
   *
   * @example
   * {example-code}
   */
  updateLineItems(
    data: UpdateLineItemsDTO,
    sharedContext?: Context
  ): Promise<CartDTO>

  /**
   * This method updates existing {type name}.
   *
   * @param {UpdateLineItemsDTO[]} data - The attributes to update in the {type name}.
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<CartDTO[]>} The updated {type name}.
   *
   * @example
   * {example-code}
   */
  updateLineItems(
    data: UpdateLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartDTO[]>

  /**
   * This method {summary}
   *
   * @param {string[]} lineItemIds - {summary}
   * @param {Context} sharedContext - {summary}
   * @returns {Promise<void>} Resolves when {summary}
   *
   * @example
   * {example-code}
   */
  removeLineItems(lineItemIds: string[], sharedContext?: Context): Promise<void>
}
