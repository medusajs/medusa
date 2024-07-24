import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableOrderAddressProps,
  FilterableOrderChangeActionProps,
  FilterableOrderClaimProps,
  FilterableOrderExchangeProps,
  FilterableOrderLineItemAdjustmentProps,
  FilterableOrderLineItemProps,
  FilterableOrderLineItemTaxLineProps,
  FilterableOrderProps,
  FilterableOrderReturnReasonProps,
  FilterableOrderShippingMethodAdjustmentProps,
  FilterableOrderShippingMethodProps,
  FilterableOrderShippingMethodTaxLineProps,
  FilterableOrderTransactionProps,
  FilterableReturnProps,
  OrderAddressDTO,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderChangeReturn,
  OrderClaimDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderItemDTO,
  OrderLineItemAdjustmentDTO,
  OrderLineItemDTO,
  OrderLineItemTaxLineDTO,
  OrderReturnItemDTO,
  OrderReturnReasonDTO,
  OrderShippingMethodAdjustmentDTO,
  OrderShippingMethodDTO,
  OrderShippingMethodTaxLineDTO,
  OrderTransactionDTO,
  ReturnDTO,
} from "./common"
import {
  CancelOrderChangeDTO,
  CancelOrderClaimDTO,
  CancelOrderExchangeDTO,
  CancelOrderFulfillmentDTO,
  CancelOrderReturnDTO,
  ConfirmOrderChangeDTO,
  CreateOrderAddressDTO,
  CreateOrderAdjustmentDTO,
  CreateOrderChangeActionDTO,
  CreateOrderChangeDTO,
  CreateOrderClaimDTO,
  CreateOrderDTO,
  CreateOrderExchangeDTO,
  CreateOrderLineItemDTO,
  CreateOrderLineItemTaxLineDTO,
  CreateOrderReturnDTO,
  CreateOrderReturnItemDTO,
  CreateOrderReturnReasonDTO,
  CreateOrderShippingMethodAdjustmentDTO,
  CreateOrderShippingMethodDTO,
  CreateOrderShippingMethodTaxLineDTO,
  CreateOrderTransactionDTO,
  DeclineOrderChangeDTO,
  ReceiveOrderReturnDTO,
  RegisterOrderFulfillmentDTO,
  RegisterOrderShipmentDTO,
  UpdateOrderAddressDTO,
  UpdateOrderChangeActionDTO,
  UpdateOrderChangeDTO,
  UpdateOrderClaimDTO,
  UpdateOrderClaimWithSelectorDTO,
  UpdateOrderDTO,
  UpdateOrderExchangeDTO,
  UpdateOrderExchangeWithSelectorDTO,
  UpdateOrderItemDTO,
  UpdateOrderItemWithSelectorDTO,
  UpdateOrderLineItemDTO,
  UpdateOrderLineItemTaxLineDTO,
  UpdateOrderLineItemWithSelectorDTO,
  UpdateOrderReturnReasonDTO,
  UpdateOrderReturnReasonWithSelectorDTO,
  UpdateOrderReturnWithSelectorDTO,
  UpdateOrderShippingMethodAdjustmentDTO,
  UpdateOrderShippingMethodDTO,
  UpdateOrderShippingMethodTaxLineDTO,
  UpdateReturnDTO,
  UpsertOrderLineItemAdjustmentDTO,
} from "./mutations"

// TODO: missing listOrderShippingMethods and listOrderChanges, fix module integration to remove any cast
/**
 * The main service interface for the Order Module.
 */
export interface IOrderModuleService extends IModuleService {
  /**
   * This method retrieves an order by its ID.
   *
   * @param {string} orderId - The order's ID.
   * @param {FindConfig<OrderDTO>} config - The configurations determining how the order is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO>} The retrieved order.
   *
   * @example
   * A simple example that retrieves an order change by its ID:
   *
   * ```ts
   * const order = await orderModuleService.retrieveOrder(
   *   "123"
   * )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const order = await orderModuleService.retrieveOrder(
   *   "123",
   *   {
   *     relations: ["items"]
   *   }
   * )
   * ```
   *
   */
  retrieveOrder(
    orderId: string,
    config?: FindConfig<OrderDTO>,
    sharedContext?: Context
  ): Promise<OrderDTO>

  /**
   * This method retrieves a paginated list of orders based on optional filters and configuration.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved order.
   * @param {FindConfig<OrderDTO>} config - The configurations determining how the order is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO[]>} The list of orders.
   *
   * @example
   * To retrieve a list of orders using their IDs:
   *
   * ```ts
   * const orders = await orderModuleService.listOrders({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the order:
   *
   * ```ts
   * const orders = await orderModuleService.listOrders({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["items"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const orders = await orderModuleService.listOrders({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["items"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   *
   */
  listOrders(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderDTO>,
    sharedContext?: Context
  ): Promise<OrderDTO[]>

  /**
   * This method retrieves a paginated list of orders along with the total count of available orders satisfying the provided filters.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved order.
   * @param {FindConfig<OrderDTO>} config - The configurations determining how the order is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[OrderDTO[], number]>} The list of orders along with their total count.
   *
   * @example
   * To retrieve a list of orders using their IDs:
   *
   * ```ts
   * const [orders, count] = await orderModuleService.listAndCountOrders({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the order:
   *
   * ```ts
   * const [orders, count] = await orderModuleService.listAndCountOrders({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["items"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [orders, count] = await orderModuleService.listAndCountOrders({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["items"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   *
   */
  listAndCountOrders(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderDTO>,
    sharedContext?: Context
  ): Promise<[OrderDTO[], number]>

  /**
   * This method retrieves a return by its ID.
   *
   * @param {string} returnId - The return's ID.
   * @param {FindConfig<ReturnDTO>} config - The configurations determining how the return is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a return.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO>} The retrieved return.
   *
   * @example
   * A simple example that retrieves an order change by its ID:
   *
   * ```ts
   * const orderReturn = await orderModuleService.retrieveReturn(
   *   "123"
   * )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const orderReturn = await orderModuleService.retrieveReturn(
   *   "123",
   *   {
   *     relations: ["order"]
   *   }
   * )
   * ```
   */
  retrieveReturn(
    returnId: string,
    config?: FindConfig<ReturnDTO>,
    sharedContext?: Context
  ): Promise<ReturnDTO>

  /**
   * This method retrieves a paginated list of returns based on optional filters and configuration.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved returns.
   * @param {FindConfig<ReturnDTO>} config - The configurations determining how the return is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a return.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO[]>} The list of returns.
   *
   * @example
   * To retrieve a list of returns using their IDs:
   *
   * ```ts
   * const returns = await orderModuleService.listReturns({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the return:
   *
   * ```ts
   * const returns = await orderModuleService.listReturns({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const returns = await orderModuleService.listReturns({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listReturns(
    filters?: FilterableOrderProps,
    config?: FindConfig<ReturnDTO>,
    sharedContext?: Context
  ): Promise<ReturnDTO[]>

  /**
   * This method retrieves a paginated list of returns along with the total count of available returns satisfying the provided filters.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved returns.
   * @param {FindConfig<ReturnDTO>} config - The configurations determining how the return is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a return.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ReturnDTO[], number]>} The list of returns along with their total count.
   *
   * @example
   * To retrieve a list of returns using their IDs:
   *
   * ```ts
   * const [returns, count] = await orderModuleService.listAndCountReturns({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the return:
   *
   * ```ts
   * const [returns, count] = await orderModuleService.listAndCountReturns({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [returns, count] = await orderModuleService.listAndCountReturns({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listAndCountReturns(
    filters?: FilterableOrderProps,
    config?: FindConfig<ReturnDTO>,
    sharedContext?: Context
  ): Promise<[ReturnDTO[], number]>

  /**
   * This method retrieves an order claim by its ID.
   *
   * @param {string} claimId - The claim's ID.
   * @param {FindConfig<OrderClaimDTO>} config - The configurations determining how the order claim is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order claim.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO>} The retrieved order claim.
   *
   * @example
   * A simple example that retrieves an order change by its ID:
   *
   * ```ts
   * const claim = await orderModuleService.retrieveOrderClaim(
   *   "123"
   * )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const claim = await orderModuleService.retrieveOrderClaim(
   *   "123",
   *   {
   *     relations: ["order"]
   *   }
   * )
   * ```
   */
  retrieveOrderClaim(
    claimId: string,
    config?: FindConfig<OrderClaimDTO>,
    sharedContext?: Context
  ): Promise<OrderClaimDTO>

  /**
   * This method retrieves a paginated list of order claims based on optional filters and configuration.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved order claims.
   * @param {FindConfig<OrderClaimDTO>} config - The configurations determining how the order claim is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order claim.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO[]>} The list of order claims.
   *
   * @example
   * To retrieve a list of order claims using their IDs:
   *
   * ```ts
   * const claims = await orderModuleService.listOrderClaims({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the claim:
   *
   * ```ts
   * const claims = await orderModuleService.listOrderClaims({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const claims = await orderModuleService.listOrderClaims({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listOrderClaims(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderClaimDTO>,
    sharedContext?: Context
  ): Promise<OrderClaimDTO[]>

  /**
   * This method retrieves a paginated list of order claims along with the total count of available claims satisfying the provided filters.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved order claims.
   * @param {FindConfig<OrderClaimDTO>} config - The configurations determining how the order claim is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order claim.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[OrderClaimDTO[], number]>} The list of order claims along with their total count.
   *
   * @example
   * To retrieve a list of order claims using their IDs:
   *
   * ```ts
   * const [claims, count] = await orderModuleService.listAndCountOrderClaims({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the claim:
   *
   * ```ts
   * const [claims, count] = await orderModuleService.listAndCountOrderClaims({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [claims, count] = await orderModuleService.listAndCountOrderClaims({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listAndCountOrderClaims(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderClaimDTO>,
    sharedContext?: Context
  ): Promise<[OrderClaimDTO[], number]>

  /**
   * This method retrieves an order exchange by its ID.
   *
   * @param {string} exchangeId - The exchange's ID.
   * @param {FindConfig<OrderExchangeDTO>} config - The configurations determining how the order exchange is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order exchange.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO>} The retrieved order exchange.
   *
   * @example
   * A simple example that retrieves an order change by its ID:
   *
   * ```ts
   * const exchange = await orderModuleService.retrieveOrderExchange(
   *   "123"
   * )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const exchange = await orderModuleService.retrieveOrderExchange(
   *   "123",
   *   {
   *     relations: ["order"]
   *   }
   * )
   * ```
   */
  retrieveOrderExchange(
    exchangeId: string,
    config?: FindConfig<OrderExchangeDTO>,
    sharedContext?: Context
  ): Promise<OrderExchangeDTO>

  /**
   * This method retrieves a paginated list of order exchanges based on optional filters and configuration.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved exchanges.
   * @param {FindConfig<OrderExchangeDTO>} config - The configurations determining how the order exchange is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order exchange.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO[]>} The list of exchanges.
   *
   * @example
   * To retrieve a list of exchanges using their IDs:
   *
   * ```ts
   * const exchanges = await orderModuleService.listOrderExchanges({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the exchange:
   *
   * ```ts
   * const exchanges = await orderModuleService.listOrderExchanges({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const exchanges = await orderModuleService.listOrderExchanges({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listOrderExchanges(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderExchangeDTO>,
    sharedContext?: Context
  ): Promise<OrderExchangeDTO[]>

  /**
   * This method retrieves a paginated list of exchanges along with the total count of available exchanges satisfying the provided filters.
   *
   * @param {FilterableOrderProps} filters - The filters to apply on the retrieved exchanges.
   * @param {FindConfig<OrderExchangeDTO>} config - The configurations determining how the order exchange is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order exchange.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[OrderExchangeDTO[], number]>} The list of exchanges along with their total count.
   *
   * @example
   * To retrieve a list of exchanges using their IDs:
   *
   * ```ts
   * const [exchanges, count] = await orderModuleService.listOrderExchanges({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the exchange:
   *
   * ```ts
   * const [exchanges, count] = await orderModuleService.listOrderExchanges({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [exchanges, count] = await orderModuleService.listOrderExchanges({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listAndCountOrderExchanges(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderExchangeDTO>,
    sharedContext?: Context
  ): Promise<[OrderExchangeDTO[], number]>

  /**
   * This method creates orders
   *
   * @param {CreateOrderDTO[]} data - The order to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO[]>} The created orders.
   *
   * @example
   * ```ts
   * const orders = await orderModuleService.createOrders([{
   *   currency_code: "usd",
   *   items: [
   *     {
   *       title: "Product Name",
   *       quantity: 1,
   *       unit_price: 20
   *     }
   *   ]
   * }])
   * ```
   *
   */
  createOrders(
    data: CreateOrderDTO[],
    sharedContext?: Context
  ): Promise<OrderDTO[]>

  /**
   * This method creates orders
   *
   * @param {CreateOrderDTO} data - The order to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO>} The created orders.
   *
   * @example
   * ```ts
   * const order = await orderModuleService.createOrders({
   *   currency_code: "usd",
   *   items: [
   *     {
   *       title: "Product Name",
   *       quantity: 1,
   *       unit_price: 20
   *     }
   *   ]
   * })
   * ```
   *
   */
  createOrders(data: CreateOrderDTO, sharedContext?: Context): Promise<OrderDTO>

  /**
   * This method updates existing orders. The order IDs are specified in each order object.
   *
   * @param {UpdateOrderDTO[]} data - The attributes to update in the order.
   * @returns {Promise<OrderDTO[]>} The updated orders.
   *
   * @example
   * ```typescript
   * const orders = await orderModuleService.updateOrders([{
   *   id: "123",
   *   email: "example@gmail.com"
   * }])
   * ```
   *
   */
  updateOrders(
    data: UpdateOrderDTO[],
    sharedContext?: Context
  ): Promise<OrderDTO[]>

  /**
   * This method updates existing orders.
   *
   * @param {string} orderId - The ID of the order to update.
   * @param {UpdateOrderDTO} data - The attributes to update in the order.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO>} The updated orders.
   *
   * @example
   * ```typescript
   * const order = await orderModuleService.updateOrders(
   *   "123",
   *   {
   *     email: "example@gmail.com"
   *   }
   * )
   * ```
   *
   */
  updateOrders(
    orderId: string,
    data: UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderDTO>

  /**
   * This method updates existing orders matching the specified filters.
   *
   * @param {Partial<OrderDTO>} selector - The filters specifying which orders to update.
   * @param {UpdateOrderDTO} data - The attributes to update in the orders.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO[]>} The updated orders.
   *
   * @example
   * ```typescript
   * const orders = await orderModuleService.updateOrders({
   *   id: ["123", "321"]
   * }, {
   *   email: "example@gmail.com"
   * })
   * ```
   *
   */
  updateOrders(
    selector: Partial<FilterableOrderProps>,
    data: UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderDTO[]>

  /**
   * This method deletes orders by its ID.
   *
   * @param {string[]} orderIds - The IDs of orders to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the orders are deleted successfully.
   *
   * @example
   * ```typescript
   * await orderModuleService.deleteOrders(["123", "321"])
   * ```
   *
   */
  deleteOrders(orderIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes an order by its ID.
   *
   * @param {string} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order is deleted successfully.
   *
   * @example
   * ```typescript
   * await orderModuleService.deleteOrders("123");
   * ```
   *
   */
  deleteOrders(orderId: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes orders by their IDs.
   *
   * @param {string[]} orderIds - The list of order IDs.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated items.
   * The object's keys are the ID attribute names of the order entity's relations, such as `item_id`, and its value is an array of strings, each being the ID of a record associated
   * with the order through this relation, such as the IDs of associated item.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteOrders(["123", "321"])
   */
  softDeleteOrders<TReturnableLinkableKeys extends string = string>(
    orderIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted orders by their IDs.
   *
   * @param {string[]} orderIds - The list of order IDs.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the orders. You can pass to its `returnLinkableKeys`
   * property any of the order's relation attribute names, such as `items`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the IDs of associated items.
   * The object's keys are the ID attribute names of the order entity's relations, such as `item_id`,
   * and its value is an array of strings, each being the ID of the record associated with the order through this relation,
   * such as the IDs of associated items.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreOrders(["123", "321"])
   */
  restoreOrders<TReturnableLinkableKeys extends string = string>(
    orderIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a paginated list of addresses based on optional filters and configuration.
   *
   * @param {FilterableOrderAddressProps} filters - The filters to apply on the retrieved order addresss.
   * @param {FindConfig<OrderAddressDTO>} config - The configurations determining how the order address is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderAddressDTO[]>} The list of addresses.
   *
   * @example
   * To retrieve a list of addresses using their IDs:
   *
   * ```ts
   * const addresses = await orderModuleService.listAddresses({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const addresses = await orderModuleService.listAddresses({
   *   id: ["123", "321"]
   * }, {
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listAddresses(
    filters?: FilterableOrderAddressProps,
    config?: FindConfig<OrderAddressDTO>,
    sharedContext?: Context
  ): Promise<OrderAddressDTO[]>

  /**
   * This method creates addresses.
   *
   * @param {CreateOrderAddressDTO[]} data - The addresses to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderAddressDTO[]>} The created addresses.
   *
   * @example
   * ```typescript
   * const addresses = await orderModuleService.createAddresses([
   *   {
   *     first_name: "John",
   *     last_name: "Doe",
   *     address_1: "123 Main St",
   *     city: "Anytown",
   *     country_code: "US",
   *     province: "AnyState",
   *     postal_code: "12345"
   *   }
   * ])
   * ```
   *
   */
  createAddresses(
    data: CreateOrderAddressDTO[],
    sharedContext?: Context
  ): Promise<OrderAddressDTO[]>

  /**
   * This method creates a return.
   *
   * @param {CreateOrderAddressDTO} data - The address to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderAddressDTO>} The created return.
   *
   * @example
   * ```typescript
   * const address = await orderModuleService.createAddresses({
   *   first_name: "John",
   *   last_name: "Doe",
   *   address_1: "123 Main St",
   *   city: "Anytown",
   *   country_code: "US",
   *   province: "AnyState",
   *   postal_code: "12345"
   * })
   * ```
   *
   */
  createAddresses(
    data: CreateOrderAddressDTO,
    sharedContext?: Context
  ): Promise<OrderAddressDTO>

  /**
   * This method updates existing addresses. The address ID is specified in each address object.
   *
   * @param {UpdateOrderAddressDTO[]} data - The attributes to update in the address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderAddressDTO[]>} The updated addresses.
   *
   * @example
   * ```typescript
   * const addresses = await orderModuleService.updateAddresses([{
   *   id: "123",
   *   first_name: "John",
   * }])
   * ```
   *
   */
  updateAddresses(
    data: UpdateOrderAddressDTO[],
    sharedContext?: Context
  ): Promise<OrderAddressDTO[]>

  /**
   * This method updates an existing address.
   *
   * @param {UpdateOrderAddressDTO} data - The attributes to update in the address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderAddressDTO>} The updated address.
   *
   * @example
   * ```typescript
   * const address = await orderModuleService.updateAddresses({
   *   id: "123",
   *   first_name: "John",
   * })
   * ```
   *
   */
  updateAddresses(
    data: UpdateOrderAddressDTO,
    sharedContext?: Context
  ): Promise<OrderAddressDTO>

  /**
   * This method deletes addresses by their IDs.
   *
   * @param {string[]} ids - The list of address IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the addresses are deleted.
   *
   * @example
   * ```typescript
   * await orderModuleService.deleteAddresses(["123", "321"])
   * ```
   *
   */
  deleteAddresses(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes an address by its ID.
   *
   * @param {string} ids - The ID of the address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the address is deleted.
   *
   * @example
   * ```typescript
   * await orderModuleService.deleteAddresses("123")
   * ```
   *
   */
  deleteAddresses(ids: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a line item by its ID.
   *
   * @param {string} itemId - The item's ID.
   * @param {FindConfig<OrderLineItemDTO>} config - The configurations determining how the line item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemDTO>} The retrieved line item.
   *
   * @example
   * A simple example that retrieves an order change by its ID:
   *
   * ```ts
   * const lineItem = await orderModuleService.retrieveLineItem("123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const lineItem = await orderModuleService.retrieveLineItem(
   *   "123",
   *   {
   *     relations: ["order"]
   *   }
   * )
   * ```
   *
   */
  retrieveLineItem(
    itemId: string,
    config?: FindConfig<OrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO>

  /**
   * This method retrieves a paginated list of line items based on optional filters and configuration.
   *
   * @param {FilterableOrderLineItemProps} filters - The filters to apply on the retrieved line item.
   * @param {FindConfig<OrderLineItemDTO>} config - The configurations determining how the line item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemDTO[]>} The list of line items.
   *
   * @example
   * To retrieve a list of line items using their IDs:
   *
   * ```ts
   * const lineItems = await orderModuleService.listLineItems({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the line item:
   *
   * ```ts
   * const lineItems = await orderModuleService.listLineItems({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const lineItems = await orderModuleService.listLineItems({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   *
   */
  listLineItems(
    filters: FilterableOrderLineItemProps,
    config?: FindConfig<OrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  /**
   * This method creates a line item.
   *
   * @param {CreateOrderLineItemDTO} data - The  line item to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemDTO[]>} The created line items.
   *
   * @example
   * const lineItems = await orderModuleService.createLineItems({
   *   title: "Shirt",
   *   quantity: 1,
   *   unit_price: 20
   * })
   */
  createLineItems(
    data: CreateOrderLineItemDTO,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  /**
   * This method creates line items.
   *
   * @param {CreateOrderLineItemDTO[]} data - The line items to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemDTO[]>} The created line items.
   *
   * @example
   * const lineItems = await orderModuleService.createLineItems([{
   *   title: "Shirt",
   *   quantity: 1,
   *   unit_price: 20
   * }])
   */
  createLineItems(
    data: CreateOrderLineItemDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  /**
   * This method creates orders.
   *
   * @param {string} orderId - The order's ID.
   * @param {CreateOrderLineItemDTO[]} items - The order line items to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemDTO[]>} The created orders.
   *
   * @example
   * const lineItems = await orderModuleService.createLineItems(
   *   "123",
   *   [{
   *     title: "Shirt",
   *     quantity: 1,
   *     unit_price: 20
   *   }]
   * )
   */
  createLineItems(
    orderId: string,
    items: CreateOrderLineItemDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  /**
   * This method updates existing line items. The line item to update is specified by the `selector` property of the first parameter.
   *
   * @param {UpdateOrderLineItemWithSelectorDTO[]} data - The attributes to update in the order line item with selector.
   * @returns {Promise<OrderLineItemDTO[]>} The updated line items.
   *
   * @example
   * ```typescript
   * const lineItems = await orderModuleService.updateLineItems([
   *   {
   *     selector: {
   *       id: "123"
   *     },
   *     data: {
   *       quantity: 2
   *     }
   *   }
   * ])
   * ```
   *
   */
  updateLineItems(
    data: UpdateOrderLineItemWithSelectorDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  /**
   * This method updates existing line items matching the specified filters.
   *
   * @param {Partial<OrderLineItemDTO>} selector - The filters specifying which line items to update.
   * @param {Partial<UpdateOrderLineItemDTO>} data - The data to update in the line items.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemDTO[]>} The updated line items.
   *
   * @example
   * const lineItems = await orderModuleService.updateLineItems({
   *   id: "123"
   * }, {
   *   quantity: 2
   * })
   *
   */
  updateLineItems(
    selector: Partial<FilterableOrderLineItemProps>,
    data: Partial<UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  /**
   * This method updates an existing line item.
   *
   * @param {string} lineId - The line items's ID.
   * @param {Partial<UpdateOrderLineItemDTO>} data - The data to update in the line item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemDTO>} The updated line item.
   *
   * @example
   * const lineItem = await orderModuleService.updateLineItems(
   *   "123",
   *   {
   *     quantity: 2
   *   }
   * )
   *
   */
  updateLineItems(
    lineId: string,
    data: Partial<UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO>

  /**
   * This method deletes line items by their IDs.
   *
   * @param {string[]} itemIds - The IDs of the line items to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line items are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItems([
   *   "123", "321"
   * ])
   */
  deleteLineItems(itemIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a line item by its ID.
   *
   * @param {string} itemId - The line item's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item is deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItems("123")
   */
  deleteLineItems(itemId: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes line items that match the specified filters.
   *
   * @param {Partial<FilterableOrderLineItemProps>} selector - The filters specifying which line items to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line items are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItems({
   *   id: ["123", "321"]
   * })
   */
  deleteLineItems(
    selector: Partial<FilterableOrderLineItemProps>,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method updates existing order items matching the specified filters.
   *
   * @param {Partial<OrderItemDTO>} selector - The filters specifying which order items to update.
   * @param {UpdateOrderItemDTO} data - The attributes to update in the order item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderItemDTO[]>} The updated order items.
   *
   * @example
   * const orderItems = await orderModuleService.updateOrderItem({
   *   id: "123"
   * }, {
   *   quantity: 2
   * })
   *
   */
  updateOrderItem(
    selector: Partial<FilterableOrderShippingMethodProps>,
    data: UpdateOrderItemDTO,
    sharedContext?: Context
  ): Promise<OrderItemDTO[]>

  /**
   * This method updates an existing order item.
   *
   * @param {string} orderItemId - The order item's ID.
   * @param {Partial<UpdateOrderItemDTO>} data - The data to update in the order item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderItemDTO>} The updated order item.
   *
   * @example
   * const orderItem = await orderModuleService.updateOrderItem(
   *   "123",
   *   {
   *     quantity: 2
   *   }
   * )
   *
   */
  updateOrderItem(
    orderItemId: string,
    data: Partial<UpdateOrderItemDTO>,
    sharedContext?: Context
  ): Promise<OrderItemDTO>

  /**
   * This method updates existing order items. The items are identified either by their ID or the specified filters.
   *
   * @param {string | Partial<OrderItemDTO> | UpdateOrderItemWithSelectorDTO[]} orderItemIdOrDataOrSelector - Either the ID of an order item, or the
   * filters specifying which order items to update.
   * @param {UpdateOrderItemDTO | Partial<UpdateOrderItemDTO>} data - The data to update.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderItemDTO | OrderItemDTO[]>} The updated order items.
   *
   * @example
   * const orderItem = await orderModuleService.updateOrderItem(
   *   "123",
   *   {
   *     quantity: 2
   *   }
   * )
   *
   */
  updateOrderItem(
    orderItemIdOrDataOrSelector:
      | string
      | UpdateOrderItemWithSelectorDTO[]
      | Partial<OrderItemDTO>,
    data?: UpdateOrderItemDTO | Partial<UpdateOrderItemDTO>,
    sharedContext?: Context
  ): Promise<OrderItemDTO[] | OrderItemDTO>

  /**
   * This method retrieves a paginated list of shipping methods based on optional filters and configuration.
   *
   * @param {FilterableOrderShippingMethodProps} filters - The filters to apply on the retrieved shipping method.
   * @param {FindConfig<OrderShippingMethodDTO>} config - The configurations determining how the shipping method is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping method.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodDTO[]>} The list of shipping methods.
   *
   * @example
   * To retrieve a list of shipping methods using their IDs:
   *
   * ```ts
   * const shippingMethods = await orderModuleService.listShippingMethods({
   *   id: ["123", "321"]
   * }, {})
   * ```
   *
   * To specify relations that should be retrieved within the shipping method:
   *
   * ```ts
   * const shippingMethods = await orderModuleService.listShippingMethods({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["adjustments"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingMethods = await orderModuleService.listShippingMethods({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["adjustments"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   *
   */
  listShippingMethods(
    filters: FilterableOrderShippingMethodProps,
    config: FindConfig<OrderShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  /**
   * This method creates a shipping method.
   *
   * @param {CreateOrderShippingMethodDTO} data - The shipping method to be created.
   * @returns {Promise<OrderShippingMethodDTO>} The created shipping method.
   *
   * @example
   * const shippingMethod = await orderModuleService.createShippingMethods({
   *   name: "Express Shipping",
   *   order_id: "123",
   *   amount: 10
   * })
   */
  createShippingMethods(
    data: CreateOrderShippingMethodDTO,
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO>

  /**
   * This method creates shipping methods.
   *
   * @param {CreateOrderShippingMethodDTO[]} data - The order shipping methods to be created.
   * @returns {Promise<OrderShippingMethodDTO[]>} The created orders.
   *
   * @example
   * const shippingMethods = await orderModuleService.createShippingMethods([{
   *   name: "Express Shipping",
   *   order_id: "123",
   *   amount: 10
   * }])
   */
  createShippingMethods(
    data: CreateOrderShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  /**
   * This method creates shipping methods for an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {CreateOrderShippingMethodDTO[]} methods - The shipping methods to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodDTO[]>} The created shipping methods.
   *
   * @example
   * const shippingMethods = await orderModuleService.createShippingMethods(
   *   "123",
   *   [
   *     {
   *       name: "Express Shipping",
   *       order_id: "123",
   *       amount: 10
   *     }
   *   ]
   * )
   */
  createShippingMethods(
    orderId: string,
    methods: CreateOrderShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  /**
   * This method updates existing shipping methods. The shipping method IDs are specified in each shipping method object.
   *
   * @param {UpdateOrderShippingMethodDTO[]} data - The attributes to update in the shipping methods.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodDTO[]>} The updated shipping methods.
   *
   * @example
   * const shippingMethods = await orderModuleService.updateShippingMethods([{
   *   id: "123",
   *   name: "Express Shipping"
   * }])
   */
  updateShippingMethods(
    data: UpdateOrderShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  /**
   * This method updates an existing shipping method.
   *
   * @param {UpdateOrderShippingMethodDTO} data - The attributes to update in the shipping method.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodDTO>} The updated shipping method.
   *
   * @example
   * const shippingMethod = await orderModuleService.updateShippingMethods({
   *   id: "123",
   *   name: "Express Shipping"
   * })
   */
  updateShippingMethods(
    data: UpdateOrderShippingMethodDTO,
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO>

  /**
   * This method deletes shipping methods by their IDs.
   *
   * @param {string[]} methodIds - The list of shipping methods.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping methods are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteShippingMethods([
   *   "123", "321"
   * ])
   */
  deleteShippingMethods(
    methodIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a shipping method by its ID.
   *
   * @param {string} methodId - The shipping method's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method is deleted successfully.
   *
   * @example
   * await orderModuleService.deleteShippingMethods("123")
   */
  deleteShippingMethods(
    methodId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes shipping methods matching the specified filters.
   *
   * @param {Partial<FilterableOrderShippingMethodProps>} selector - The filters specifying the shipping methods to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping methods are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteShippingMethods({
   *   id: "123"
   * })
   */
  deleteShippingMethods(
    selector: Partial<FilterableOrderShippingMethodProps>,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of line item adjustments based on optional filters and configuration.
   *
   * @param {FilterableOrderLineItemAdjustmentProps} filters - The filters to apply on the retrieved line item adjustment.
   * @param {FindConfig<OrderLineItemAdjustmentDTO>} config - The configurations determining how the line item adjustment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item adjustment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemAdjustmentDTO[]>} The list of line item adjustments.
   *
   * @example
   * To retrieve a list of line item adjustments using their IDs:
   *
   * ```ts
   * const lineItemAdjustment = await orderModuleService.listLineItemAdjustments({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the line item adjustment:
   *
   * ```ts
   * const lineItemAdjustment = await orderModuleService.listLineItemAdjustments({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["item"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const lineItemAdjustment = await orderModuleService.listLineItemAdjustments({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["item"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   *
   */
  listLineItemAdjustments(
    filters: FilterableOrderLineItemAdjustmentProps,
    config?: FindConfig<OrderLineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  /**
   * This method creates line item adjustments.
   *
   * @param {CreateOrderAdjustmentDTO[]} data - The line item adjustments to be created.
   * @returns {Promise<OrderLineItemAdjustmentDTO[]>} The created line item adjustments.
   *
   * @example
   * const lineItemAdjustments = await orderModuleService.createLineItemAdjustments([{
   *   amount: 5
   * }])
   */
  createLineItemAdjustments(
    data: CreateOrderAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  /**
   * This method creates a line item adjustment.
   *
   * @param {CreateOrderAdjustmentDTO} data - The line-item adjustment to be created.
   * @returns {Promise<OrderLineItemAdjustmentDTO[]>} The created line-item adjustment.
   *
   * @example
   * const lineItemAdjustment = await orderModuleService.createLineItemAdjustments({
   *   amount: 5
   * })
   */
  createLineItemAdjustments(
    data: CreateOrderAdjustmentDTO,
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  /**
   * This method creates line item adjustments for an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {CreateOrderAdjustmentDTO[]} data - The line-item adjustments to be created.
   * @returns {Promise<OrderLineItemAdjustmentDTO[]>} The created line item adjustments.
   *
   * @example
   * const lineItemAdjustments = await orderModuleService.createLineItemAdjustments(
   *   "123",
   *   [{
   *     amount: 5
   *   }]
   * )
   */
  createLineItemAdjustments(
    orderId: string,
    data: CreateOrderAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  /**
   * This method sets the line item adjustments of an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {UpsertOrderLineItemAdjustmentDTO[]} data - The line item adjustments to create or update. If the `id` property is provided
   * in an object, it means an existing line item adjustment will be updated. Otherwise, a new one is created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemAdjustmentDTO[]>} The order's line item adjustments.
   *
   * @example
   * const lineItemAdjustments = await orderModuleService.setLineItemAdjustments(
   *   "123",
   *   [
   *     {
   *       item_id: "1234",
   *       amount: 10
   *     },
   *     {
   *       id: "123",
   *       item_id: "4321",
   *       amount: 20
   *     }
   *   ]
   * )
   *
   */
  setLineItemAdjustments(
    orderId: string,
    data: UpsertOrderLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  /**
   * This method deletes a line item adjustment by its ID.
   *
   * @param {string[]} adjustmentIds - The IDs of line item adjustments.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item adjustments are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItemAdjustments([
   *   "123", "321"
   * ])
   */
  deleteLineItemAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a line item adjustment by its ID.
   *
   * @param {string} adjustmentId - The ID of the line item adjustment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item adjustment is deleted.
   *
   * @example
   * await orderModuleService.deleteLineItemAdjustments("123")
   */
  deleteLineItemAdjustments(
    adjustmentId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes line item adjustments matching the specified filters.
   *
   * @param {Partial<OrderLineItemAdjustmentDTO>} selector - The filters specifying which line item adjustments to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item adjustments are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItemAdjustments({
   *   id: "123"
   * })
   */
  deleteLineItemAdjustments(
    selector: Partial<OrderLineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of shipping method adjustments based on optional filters and configuration.
   *
   * @param {FilterableOrderShippingMethodAdjustmentProps} filters - The filters to apply on the retrieved shipping method adjustment.
   * @param {FindConfig<OrderShippingMethodAdjustmentDTO>} config - The configurations determining how the shipping method adjustment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping method adjustment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodAdjustmentDTO[]>} The list of shipping method adjustments.
   *
   * @example
   * To retrieve a list of shipping method adjustments using their IDs:
   *
   * ```ts
   * const shippingMethodAdjustments = await orderModuleService
   *   .listShippingMethodAdjustments({
   *     id: ["123", "321"]
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping method adjustment:
   *
   * ```ts
   * const shippingMethodAdjustments = await orderModuleService
   *   .listShippingMethodAdjustments({
   *     id: ["123", "321"]
   *   }, {
   *     relations: ["shipping_method"]
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingMethodAdjustments = await orderModuleService
   *   .listShippingMethodAdjustments({
   *     id: ["123", "321"]
   *   }, {
   *     relations: ["shipping_method"],
   *     take: 20,
   *     skip: 2
   *   })
   * ```
   *
   */
  listShippingMethodAdjustments(
    filters: FilterableOrderShippingMethodAdjustmentProps,
    config?: FindConfig<OrderShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  /**
   * This method creates shipping method adjustments.
   *
   * @param {CreateOrderShippingMethodAdjustmentDTO[]} data - The order shipping method adjustments to be created.
   * @returns {Promise<OrderShippingMethodAdjustmentDTO[]>} The created shipping method adjustments.
   *
   * @example
   * const shippingMethodAdjustments = await orderModuleService
   *   .createShippingMethodAdjustments([
   *     {
   *       shipping_method_id: "123",
   *       code: "50OFF",
   *       amount: 5
   *     }
   *   ])
   */
  createShippingMethodAdjustments(
    data: CreateOrderShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  /**
   * This method creates a shipping method adjustment.
   *
   * @param {CreateOrderShippingMethodAdjustmentDTO} data - The shipping method adjustment to be created.
   * @returns {Promise<OrderShippingMethodAdjustmentDTO>} The created shipping method adjustment.
   *
   * @example
   * const shippingMethodAdjustment = await orderModuleService
   *   .createShippingMethodAdjustments({
   *     shipping_method_id: "123",
   *     code: "50OFF",
   *     amount: 5
   *   })
   */
  createShippingMethodAdjustments(
    data: CreateOrderShippingMethodAdjustmentDTO,
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO>

  /**
   * This method creates shipping method adjustments for an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {CreateOrderShippingMethodAdjustmentDTO[]} data - The order shipping method adjustments to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodAdjustmentDTO[]>} The created shipping method adjustments.
   *
   * @example
   * const shippingMethodAdjustments = await orderModuleService
   *   .createShippingMethodAdjustments(
   *     "123",
   *     [{
   *       shipping_method_id: "123",
   *       code: "50OFF",
   *       amount: 5
   *     }]
   *   )
   */
  createShippingMethodAdjustments(
    orderId: string,
    data: CreateOrderShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  /**
   * This method sets the shipping method adjustments of an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {(CreateOrderShippingMethodAdjustmentDTO | UpdateOrderShippingMethodAdjustmentDTO)[]} data - The shipping method adjustments to be created
   * or updated. If an adjustment object has an `id` property, it's updated. Otherwise, a new adjustment is created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodAdjustmentDTO[]>} The order's shipping method adjustments.
   *
   * @example
   * const shippingMethodAdjustments = await orderModuleService
   *   .setShippingMethodAdjustments(
   *     "123",
   *     [
   *       {
   *         shipping_method_id: "123",
   *         code: "50OFF",
   *         amount: 5
   *       },
   *       {
   *         id: "321",
   *         amount: 5
   *       }
   *     ]
   *   )
   *
   */
  setShippingMethodAdjustments(
    orderId: string,
    data: (
      | CreateOrderShippingMethodAdjustmentDTO
      | UpdateOrderShippingMethodAdjustmentDTO
    )[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  /**
   * This method deletes shipping method adjustments by their IDs.
   *
   * @param {string[]} adjustmentIds - The IDs of shipping method adjustments.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method adjustments are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteShippingMethodAdjustments([
   *   "123", "321"
   * ])
   */
  deleteShippingMethodAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a shipping method adjustment by its ID.
   *
   * @param {string} adjustmentId - The adjustment's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method adjustment is deleted successfully
   *
   * @example
   * await orderModuleService.deleteShippingMethodAdjustments("123")
   */
  deleteShippingMethodAdjustments(
    adjustmentId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes shipping method adjustments matching the specified filters.
   *
   * @param {Partial<OrderShippingMethodAdjustmentDTO>} selector - The filters specifying which shipping method adjustments to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method adjustments are deleted.
   *
   * @example
   * await orderModuleService.deleteShippingMethodAdjustments({
   *   id: "123"
   * })
   */
  deleteShippingMethodAdjustments(
    selector: Partial<OrderShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of line item taxes based on optional filters and configuration.
   *
   * @param {FilterableOrderLineItemTaxLineProps} filters - The filters to apply on the retrieved line item tax line.
   * @param {FindConfig<OrderLineItemTaxLineDTO>} config - The configurations determining how the line item tax line is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item tax line.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemTaxLineDTO[]>} The list of line item taxes.
   *
   * @example
   * To retrieve a list of line item tax lines using their IDs:
   *
   * ```ts
   * const lineItemTaxLines = await orderModuleService
   *   .listLineItemTaxLines({
   *     id: ["123", "321"]
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the line item tax line:
   *
   * ```ts
   * const lineItemTaxLines = await orderModuleService
   *   .listLineItemTaxLines({
   *     id: ["123", "321"]
   *   }, {
   *     relations: ["item"]
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const lineItemTaxLines = await orderModuleService
   *   .listLineItemTaxLines({
   *     id: ["123", "321"]
   *   }, {
   *     relations: ["item"],
   *     take: 20,
   *     skip: 2
   *   })
   * ```
   *
   */
  listLineItemTaxLines(
    filters: FilterableOrderLineItemTaxLineProps,
    config?: FindConfig<OrderLineItemTaxLineDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  /**
   * This method creates line item tax lines.
   *
   * @param {CreateOrderLineItemTaxLineDTO[]} taxLines - The line item tax lines to be created.
   * @returns {Promise<OrderLineItemTaxLineDTO[]>} The created line item tax lines.
   *
   * @example
   * const lineItemTaxLines = await orderModuleService
   *   .createLineItemTaxLines([
   *     {
   *       code: "123",
   *       rate: 2
   *     }
   *   ])
   */
  createLineItemTaxLines(
    taxLines: CreateOrderLineItemTaxLineDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  /**
   * This method creates a line item tax line.
   *
   * @param {CreateOrderLineItemTaxLineDTO} taxLine - The line item tax line to be created.
   * @returns {Promise<OrderLineItemTaxLineDTO>} The created line item tax line.
   *
   * @example
   * const lineItemTaxLines = await orderModuleService
   *   .createLineItemTaxLines({
   *     code: "123",
   *     rate: 2
   *   })
   */
  createLineItemTaxLines(
    taxLine: CreateOrderLineItemTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO>

  /**
   * This method creates line item tax lines for an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {CreateOrderLineItemTaxLineDTO | CreateOrderLineItemTaxLineDTO[]} taxLines - The line item tax lines to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemTaxLineDTO[]>} The created line item tax line.
   *
   * @example
   * const lineItemTaxLines = await orderModuleService
   *   .createLineItemTaxLines(
   *     "123",
   *     [
   *       {
   *         code: "123",
   *         rate: 2
   *       }
   *     ]
   *   )
   */
  createLineItemTaxLines(
    orderId: string,
    taxLines: CreateOrderLineItemTaxLineDTO[] | CreateOrderLineItemTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  /**
   * This method sets the line item tax lines of an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {(CreateOrderLineItemTaxLineDTO | UpdateOrderLineItemTaxLineDTO)[]} taxLines - The line item tax lines to create or update. If the
   * tax line object has an `id` property, it'll be updated. Otherwise, a tax line is created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderLineItemTaxLineDTO[]>} The order's line item tax lines.
   *
   * @example
   * const lineItemTaxLines = await orderModuleService
   *   .setLineItemTaxLines(
   *     "123",
   *     [
   *       {
   *         code: "123",
   *         rate: 2
   *       }
   *     ]
   *   )
   *
   */
  setLineItemTaxLines(
    orderId: string,
    taxLines: (CreateOrderLineItemTaxLineDTO | UpdateOrderLineItemTaxLineDTO)[],
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  /**
   * This method deletes line item tax lines by their IDs.
   *
   * @param {string[]} taxLineIds - The IDs of the line item tax lines.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item tax lines are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItemTaxLines([
   *   "123", "321"
   * ])
   */
  deleteLineItemTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a line item tax line by its ID.
   *
   * @param {string} taxLineId - The ID of the line item tax line.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item tax line is deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItemTaxLines("123")
   */
  deleteLineItemTaxLines(
    taxLineId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes line item tax lines matching the specified filters.
   *
   * @param {FilterableOrderLineItemTaxLineProps} selector - The filters specifying which line item tax lines to update.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item tax lines are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteLineItemTaxLines({
   *   id: ["123", "321"]
   * })
   */
  deleteLineItemTaxLines(
    selector: FilterableOrderLineItemTaxLineProps,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of shipping method tax lines based on optional filters and configuration.
   *
   * @param {FilterableOrderShippingMethodTaxLineProps} filters - The filters to apply on the retrieved shipping method tax line.
   * @param {FindConfig<OrderShippingMethodTaxLineDTO>} config - The configurations determining how the shipping method tax line is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping method tax line.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodTaxLineDTO[]>} The list of shipping method tax lines.
   *
   * @example
   * To retrieve a list of shipping method tax lines using their IDs:
   *
   * ```ts
   * const shippingMethodTaxLines = await orderModuleService
   *   .listShippingMethodTaxLines({
   *     id: ["123", "321"]
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping method tax line:
   *
   * ```ts
   * const shippingMethodTaxLines = await orderModuleService
   *   .listShippingMethodTaxLines({
   *     id: ["123", "321"]
   *   }, {
   *     relations: ["shipping_method"]
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingMethodTaxLines = await orderModuleService
   *   .listShippingMethodTaxLines({
   *     id: ["123", "321"]
   *   }, {
   *     relations: ["shipping_method"],
   *     take: 20,
   *     skip: 2
   *   })
   * ```
   *
   */
  listShippingMethodTaxLines(
    filters: FilterableOrderShippingMethodTaxLineProps,
    config?: FindConfig<OrderShippingMethodTaxLineDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  /**
   * This method creates shipping method tax lines.
   *
   * @param {CreateOrderShippingMethodTaxLineDTO[]} taxLines - The shipping method tax lines to be created.
   * @returns {Promise<OrderShippingMethodTaxLineDTO[]>} The created shipping method tax lines.
   *
   * @example
   * const shippingMethodTaxLines = await orderModuleService
   *   .createShippingMethodTaxLines([
   *     {
   *       code: "123",
   *       rate: 2
   *     }
   *   ])
   */
  createShippingMethodTaxLines(
    taxLines: CreateOrderShippingMethodTaxLineDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  /**
   * This method creates a shipping method tax line.
   *
   * @param {CreateOrderShippingMethodTaxLineDTO} taxLine - The shipping method tax line to be created.
   * @returns {Promise<OrderShippingMethodTaxLineDTO>} The created shipping method tax line.
   *
   * @example
   * const shippingMethodTaxLine = await orderModuleService
   *   .createShippingMethodTaxLines({
   *     code: "123",
   *     rate: 2
   *   })
   */
  createShippingMethodTaxLines(
    taxLine: CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO>

  /**
   * This method creates shipping method tax lines for an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {CreateOrderShippingMethodTaxLineDTO | CreateOrderShippingMethodTaxLineDTO[]} taxLines - The shipping method tax lines to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodTaxLineDTO[]>} The created shipping method tax lines.
   *
   * @example
   * const shippingMethodTaxLines = await orderModuleService
   *   .createShippingMethodTaxLines(
   *     "123",
   *     [{
   *       code: "123",
   *       rate: 2
   *     }]
   *   )
   */
  createShippingMethodTaxLines(
    orderId: string,
    taxLines:
      | CreateOrderShippingMethodTaxLineDTO[]
      | CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  /**
   * This method set the shipping method tax lines of an order.
   *
   * @param {string} orderId - The order's ID.
   * @param {(CreateOrderShippingMethodTaxLineDTO | UpdateOrderShippingMethodTaxLineDTO)[]} taxLines - The shipping method tax lines to create or update.
   * If a tax line object has an `id` property, it's updated. Otherwise, a tax line is created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderShippingMethodTaxLineDTO[]>} The order's shipping method tax lines.
   *
   * @example
   * const shippingMethodTaxLines = await orderModuleService
   *   .setShippingMethodTaxLines(
   *     "123",
   *     [
   *       {
   *         code: "123",
   *         rate: 2
   *       },
   *       {
   *         id: "321",
   *         rate: 2
   *       }
   *     ]
   *   )
   *
   */
  setShippingMethodTaxLines(
    orderId: string,
    taxLines: (
      | CreateOrderShippingMethodTaxLineDTO
      | UpdateOrderShippingMethodTaxLineDTO
    )[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  /**
   * This method deletes shipping method tax lines by their IDs.
   *
   * @param {string[]} taxLineIds - The list of shipping method tax lines.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method tax lines are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteShippingMethodTaxLines([
   *   "123", "321"
   * ])
   */
  deleteShippingMethodTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a shipping method tax line by its ID.
   *
   * @param {string} taxLineId - The ID of the shipping method tax line
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method tax line is deleted successfully.
   *
   * @example
   * await orderModuleService.deleteShippingMethodTaxLines("123")
   */
  deleteShippingMethodTaxLines(
    taxLineId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes shipping method tax line matching the specified filters.
   *
   * @param {FilterableOrderShippingMethodTaxLineProps} selector - The filters specifying which shipping method tax lines to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method tax lines are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteShippingMethodTaxLines({
   *   id: ["123", "321"]
   * })
   */
  deleteShippingMethodTaxLines(
    selector: FilterableOrderShippingMethodTaxLineProps,
    sharedContext?: Context
  ): Promise<void>

  // Order Change

  /**
   * This method retrieves an order change by its ID.
   *
   * @param {string} orderChangeId - The order change ID.
   * @param {FindConfig<OrderChangeDTO>} config - The configurations determining how the order change is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a order change.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeDTO>} The retrieved order change.
   *
   * @example
   * A simple example that retrieves an order change by its ID:
   *
   * ```ts
   * const orderChange = await orderModuleService.retrieveOrderChange(
   *   "123"
   * )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const orderChange = await orderModuleService.retrieveOrderChange(
   *   "123",
   *   {
   *     relations: ["order"]
   *   }
   * )
   * ```
   *
   */
  retrieveOrderChange(
    orderChangeId: string,
    config?: FindConfig<OrderChangeDTO>,
    sharedContext?: Context
  ): Promise<OrderChangeDTO>

  /**
   * This method creates an order change.
   *
   * @param {CreateOrderChangeDTO} data - The order change to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeDTO>} The created order change.
   *
   * @example
   * const orderChange = await orderModuleService.createOrderChange({
   *   order_id: "123",
   * })
   */
  createOrderChange(
    data: CreateOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderChangeDTO>

  /**
   * This method creates order changes.
   *
   * @param {CreateOrderChangeDTO[]} data - The order changes to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeDTO[]>} The created order changes.
   *
   * @example
   * const orderChanges = await orderModuleService.createOrderChange([
   *   {
   *     order_id: "123",
   *   }
   * ])
   *
   */
  createOrderChange(
    data: CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO[]>

  /**
   * This method creates order changes.
   *
   * @param {CreateOrderChangeDTO | CreateOrderChangeDTO[]} data - The order changes to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeDTO | OrderChangeDTO[]>} The created order changes.
   *
   * @example
   * const orderChanges = await orderModuleService.createOrderChange([
   *   {
   *     order_id: "123",
   *   }
   * ])
   *
   */
  createOrderChange(
    data: CreateOrderChangeDTO | CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO | OrderChangeDTO[]>

  /**
   * This method updates an existing order change.
   *
   * @param {UpdateOrderChangeDTO} data - The attributes to update in the order change.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeDTO>} The updated order change.
   *
   * @example
   * const orderChange = await orderModuleService.updateOrderChanges({
   *   id: "123"
   * })
   */
  updateOrderChanges(
    data: UpdateOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderChangeDTO>

  /**
   * This method updates order changes. The order changes are identified by the `id` property of each order change object.
   *
   * @param {UpdateOrderChangeDTO[]} data - The order changes to be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeDTO[]>} The updated order changes.
   *
   * @example
   * const orderChanges = await orderModuleService.updateOrderChanges([{
   *   id: "123"
   * }])
   *
   */
  updateOrderChanges(
    data: UpdateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO[]>

  /**
   * This method updates order changes. The order changes are identified by the `id` property of each order change object.
   *
   * @param {UpdateOrderChangeDTO | UpdateOrderChangeDTO[]} data - The data to update in each order change.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeDTO | OrderChangeDTO[]>} The updated order changes.
   *
   * @example
   * const orderChanges = await orderModuleService.updateOrderChanges([{
   *   id: "123"
   * }])
   *
   */
  updateOrderChanges(
    data: UpdateOrderChangeDTO | UpdateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO | OrderChangeDTO[]>

  /**
   * This method deletes order changes by their IDs.
   *
   * @param {string[]} orderChangeId - The IDs of order changes.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order changes are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteOrderChanges(["123", "321"])
   *
   */
  deleteOrderChanges(
    orderChangeId: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes an order change by its ID.
   *
   * @param {string} orderChangeId - The order change's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order change is deleted successfully.
   *
   * @example
   * await orderModuleService.deleteOrderChanges("123")
   *
   */
  deleteOrderChanges(
    orderChangeId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method cancels an order's change.
   *
   * @param {string} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order's change is canceled successfully.
   *
   * @example
   * await orderModuleService.cancelOrderChange("123")
   *
   */
  cancelOrderChange(orderId: string, sharedContext?: Context): Promise<void>

  /**
   * This method cancels orders' changes.
   *
   * @param {string[]} orderId - The orders IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the orders' changes are canceled successfully.
   *
   * @example
   * await orderModuleService.cancelOrderChange(["123", "321"])
   *
   */
  cancelOrderChange(orderId: string[], sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a preview of an order if its change was confirmed and applied on it.
   *
   * @param {string} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO>} The preview of the order.
   *
   * @example
   * const orderPreview = await orderModuleService.previewOrderChange(
   *   "123"
   * )
   */
  previewOrderChange(
    orderId: string,
    sharedContext?: Context
  ): Promise<OrderDTO>

  /**
   * This method cancels an order's change, providing cancelation details.
   *
   * @param {CancelOrderChangeDTO} data - The cancelation details of the order's change.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order's change is canceled successfully.
   *
   * @example
   * await orderModuleService.cancelOrderChange({
   *   id: "123",
   *   canceled_by: "user_123"
   * })
   *
   */
  cancelOrderChange(
    data: CancelOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method cancels orders' changes, providing cancelation details.
   *
   * @param {CancelOrderChangeDTO[]} data - The cancelation details of the orders' changes.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the orders' changes are canceled successfully.
   *
   * @example
   * await orderModuleService.cancelOrderChange([{
   *   id: "123",
   *   canceled_by: "user_123"
   * }])
   *
   */
  cancelOrderChange(
    data: CancelOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method confirms an order change, applying these changes on the associated order.
   *
   * @param {string} orderChangeId - The order change's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeReturn>} The item and shipping method changes made on the order.
   *
   * @example
   * const {
   *   items,
   *   shippingMethods
   * } =  await orderModuleService.confirmOrderChange("123")
   *
   */
  confirmOrderChange(
    orderChangeId: string,
    sharedContext?: Context
  ): Promise<OrderChangeReturn>

  /**
   * This method confirms order changes, applying these changes on the associated orders.
   *
   * @param {string[]} orderChangeId - The order changes' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} The item and shipping method changes made on the order.
   *
   * @example
   * await orderModuleService.confirmOrderChange(["123"])
   *
   */
  confirmOrderChange(
    orderChangeId: string[],
    sharedContext?: Context
  ): Promise<OrderChangeReturn>

  /**
   * This method confirms an order change, specifying confirmation details.
   *
   * @param {ConfirmOrderChangeDTO} data - The confirmation's details of the order change.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} The item and shipping method changes made on the order.
   *
   * @example
   * await orderModuleService.confirmOrderChange({
   *   id: "123",
   *   confirmed_by: "user_123"
   * })
   *
   */
  confirmOrderChange(
    data: ConfirmOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderChangeReturn>

  /**
   * This method confirms order changes, specifying confirmation details.
   *
   * @param {ConfirmOrderChangeDTO[]} data - The confirm order changes details.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} The item and shipping method changes made on all the orders.
   *
   * @example
   * await orderModuleService.confirmOrderChange([{
   *   id: "123",
   *   confirmed_by: "user_123"
   * }])
   *
   */
  confirmOrderChange(
    data: ConfirmOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeReturn>

  /**
   * This method declines an order change.
   *
   * @param {string} orderChangeId - The order change's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order change is declined successfully.
   *
   * @example
   * await orderModuleService.declineOrderChange("123")
   *
   */
  declineOrderChange(
    orderChangeId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method declines order changes.
   *
   * @param {string[]} orderChangeId - The order changes' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order changes are declined successfully.
   *
   * @example
   * await orderModuleService.declineOrderChange(["123", "321"])
   *
   */
  declineOrderChange(
    orderChangeId: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method declines an order change, providing additional details.
   *
   * @param {DeclineOrderChangeDTO} data - The details of the order change decline.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order change is declined successfully.
   *
   * @example
   * await orderModuleService.declineOrderChange({
   *   id: "123",
   *   declined_by: "user_123"
   * })
   *
   */
  declineOrderChange(
    data: DeclineOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method declines order changes, providing additional details for each.
   *
   * @param {DeclineOrderChangeDTO[]} data - The details of the order change declines.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order changes are declined successfully.
   *
   * @example
   * await orderModuleService.declineOrderChange([
   *   {
   *     id: "123",
   *     declined_by: "user_123"
   *   }
   * ])
   *
   */
  declineOrderChange(
    data: DeclineOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes order changes by their IDs.
   *
   * @param {string | string[]} orderChangeId - The IDs of order changes.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the order change entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the order through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteOrderChanges([
   *   "123", "321"
   * ])
   */
  softDeleteOrderChanges<TReturnableLinkableKeys extends string = string>(
    orderChangeId: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted order changes by their IDs.
   *
   * @param {string | string[]} orderChangeId - The IDs of order changes.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the order. You can pass to its `returnLinkableKeys`
   * property any of the order change's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the order change entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the order change through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreOrderChanges([
   *   "123", "321"
   * ])
   */
  restoreOrderChanges<TReturnableLinkableKeys extends string = string>(
    orderChangeId: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method applies orders' actions who are still pending on the order.
   *
   * @param {string | string[]} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeReturn>} The changes made by applying the actions on the orders.
   *
   * @example
   * const {
   *   items,
   *   shippingMethods
   * } = await orderModuleService.applyPendingOrderActions([
   *   "123", "321"
   * ])
   *
   */
  applyPendingOrderActions(
    orderId: string | string[],
    sharedContext?: Context
  ): Promise<OrderChangeReturn>

  /**
   * This method retrieves a paginated list of order change actions based on optional filters and configuration.
   *
   * @param {FilterableOrderChangeActionProps} filters - The filters to apply on the retrieved order change action.
   * @param {FindConfig<OrderChangeActionDTO>} config - The configurations determining how the order change action is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with an order change action.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeActionDTO[]>} The list of order change actions.
   *
   * @example
   * To retrieve a list of shipping method tax lines using their IDs:
   *
   * ```ts
   * const orderChangeActions = await orderModuleService.listOrderChangeActions({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the shipping method tax line:
   *
   * ```ts
   * const orderChangeActions = await orderModuleService.listOrderChangeActions({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const orderChangeActions = await orderModuleService.listOrderChangeActions({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   *
   */
  listOrderChangeActions(
    filters?: FilterableOrderChangeActionProps,
    config?: FindConfig<OrderChangeActionDTO>,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO[]>

  /**
   * This method retrieves an orde rchange action by its ID.
   *
   * @param {string} actionId - The order change action's ID.
   * @param {FindConfig<OrderChangeActionDTO>} config - The configurations determining how the order change action is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with an order change action.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeActionDTO>} The retrieved order change action.
   *
   * @example
   * A simple example that retrieves an order change by its ID:
   *
   * ```ts
   * const orderChangeAction = await orderModuleService.retrieveOrderChangeAction(
   *   "123"
   * )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const orderChangeAction = await orderModuleService.retrieveOrderChangeAction(
   *   "123",
   *   {
   *     relations: ["order"]
   *   }
   * )
   * ```
   *
   */
  retrieveOrderChangeAction(
    actionId: string,
    config?: FindConfig<OrderChangeActionDTO>,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO>

  /**
   * This method updates an existing order change action.
   *
   * @param {UpdateOrderChangeActionDTO} data - The attributes to update in the order change action.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeActionDTO>} The updated order change action.
   *
   * @example
   * const orderChangeAction = await orderModuleService.updateOrderChangeActions({
   *   id: "123",
   *   internal_note: "Changing an item"
   * })
   */
  updateOrderChangeActions(
    data: UpdateOrderChangeActionDTO,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO>

  /**
   * This method updates order change actions.
   *
   * @param {UpdateOrderChangeActionDTO[]} data - The order change actions to be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeActionDTO[]>} The updated order change actions.
   *
   * @example
   * const orderChangeActions = await orderModuleService.updateOrderChangeActions([{
   *   id: "123",
   *   internal_note: "Changing an item"
   * }])
   *
   */
  updateOrderChangeActions(
    data: UpdateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO[]>

  /**
   * This method updates order change actions.
   *
   * @param {UpdateOrderChangeActionDTO | UpdateOrderChangeActionDTO[]} data - The order change actions to be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeActionDTO | OrderChangeActionDTO[]>} The updated order change actions.
   *
   * @example
   * const orderChangeActions = await orderModuleService.updateOrderChangeActions([{
   *   id: "123",
   *   internal_note: "Changing an item"
   * }])
   *
   */
  updateOrderChangeActions(
    data: UpdateOrderChangeActionDTO | UpdateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO | OrderChangeActionDTO[]>

  /**
   * This method creates and adds an action to an order and its change.
   *
   * @param {CreateOrderChangeActionDTO} data - The action to be added to an order.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeActionDTO>} The order change action added.
   *
   * @example
   * const orderChangeAction = await orderModuleService.addOrderAction({
   *   order_id: "123",
   *   order_change_id: "321",
   *   action: "ITEM_ADD"
   * })
   */
  addOrderAction(
    data: CreateOrderChangeActionDTO,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO>

  /**
   * This method creates and adds actions to orders and their changes.
   *
   * @param {CreateOrderChangeActionDTO[]} data - The order change actions to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderChangeActionDTO[]>} The created order change actions.
   *
   * @example
   * const orderChangeActions = await orderModuleService.addOrderAction([{
   *   order_id: "123",
   *   order_change_id: "321",
   *   action: "ITEM_ADD"
   * }])
   */
  addOrderAction(
    data: CreateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO[]>

  /**
   * This method deletes order change actions by their IDs.
   *
   * @param {string[]} actionId - The IDs of order change actions.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order change actions are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteOrderChangeActions([
   *   "123", "321"
   * ])
   *
   */
  deleteOrderChangeActions(
    actionId: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes an order change action by its ID.
   *
   * @param {string} actionId - The order change action's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order change action is deleted successfully.
   *
   * @example
   * ```typescript
   * await orderModuleService.deleteOrderActions("123")
   * ```
   *
   */
  deleteOrderChangeActions(
    actionId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft-deletes order change actions by their IDs.
   *
   * @param {string} actionIds - The order change action's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order change action is soft-deleted successfully.
   *
   * @example
   * await orderModuleService.softDeleteOrderChangeActions([
   *   "123", "321"
   * ])
   *
   */
  softDeleteOrderChangeActions<TReturnableLinkableKeys extends string = string>(
    actionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted order change actions by their IDs.
   *
   * @param {string | string[]} actionId - The IDs of order change actions.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the order change action. You can pass to its `returnLinkableKeys`
   * property any of the order's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the order change action entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the order through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreOrderChangeActions([
   *   "123", "321"
   * ])
   */
  restoreOrderChangeActions<TReturnableLinkableKeys extends string = string>(
    actionId: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method soft deletes addresses by their IDs.
   *
   * @param {string[]} ids - The IDs of the addresses.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the address entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the order through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteAddresses([
   *   "123", "321"
   * ])
   */
  softDeleteAddresses<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted addresses by their IDs.
   *
   * @param {string[]} ids - The IDs of the addresses.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the addresses. You can pass to its `returnLinkableKeys`
   * property any of the address's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the address entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the address through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreAddresses([
   *   "123", "321"
   * ])
   */
  restoreAddresses<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes line items by their IDs.
   *
   * @param {string[]} ids - The IDs of the line items.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the line item entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the line item through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteLineItems([
   *   "123", "321"
   * ])
   */
  softDeleteLineItems<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted line item by their IDs.
   *
   * @param {string[]} ids - The IDs of the line items.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the order. You can pass to its `returnLinkableKeys`
   * property any of the line item's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the line item entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the line item through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreLineItems([
   *   "123", "321"
   * ])
   */
  restoreLineItems<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft-deletes shipping methods by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping methods.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the shipping method entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the shipping method through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteShippingMethods([
   *   "123", "321"
   * ])
   */
  softDeleteShippingMethods<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted shipping methods by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping methods.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping methods. You can pass to its `returnLinkableKeys`
   * property any of the shipping method's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the shipping method entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the shipping method through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreShippingMethods([
   *   "123", "321"
   * ])
   */
  restoreShippingMethods<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft-deletes line item adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item adjustments.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the line item adjustment entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the line item adjustment through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteLineItemAdjustments([
   *   "123", "321"
   * ])
   */
  softDeleteLineItemAdjustments<
    TReturnableLinkableKeys extends string = string,
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted line item adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item adjustments.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the line item adjustment. You can pass to its `returnLinkableKeys`
   * property any of the line item adjustment's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the line item adjustment entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the line item adjustment through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreLineItemAdjustments([
   *   "123", "321"
   * ])
   */
  restoreLineItemAdjustments<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft-deletes shipping method adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method adjustments.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the shipping method adjustment entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the shipping method adjustment through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteShippingMethodAdjustments([
   *   "123", "321"
   * ])
   */
  softDeleteShippingMethodAdjustments<
    TReturnableLinkableKeys extends string = string,
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted shipping method adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method adjustments.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping method adjustments. You can pass to its `returnLinkableKeys`
   * property any of the shipping method adjustment's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the shipping method adjustment entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the shipping method adjustment through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreShippingMethodAdjustments([
   *   "123", "321"
   * ])
   */
  restoreShippingMethodAdjustments<
    TReturnableLinkableKeys extends string = string,
  >(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft-deletes line item tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item tax lines.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the line item tax line entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the line item tax line through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteLineItemTaxLines([
   *   "123", "321"
   * ])
   */
  softDeleteLineItemTaxLines<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted line item tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item tax lines.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the line item tax lines. You can pass to its `returnLinkableKeys`
   * property any of the line item tax line's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the line item tax line entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the line item tax line through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreLineItemTaxLines([
   *   "123", "321"
   * ])
   */
  restoreLineItemTaxLines<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes shipping method tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method tax lines.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the shipping method tax line entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the shipping method tax line through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteShippingMethodTaxLines([
   *   "123", "321"
   * ])
   */
  softDeleteShippingMethodTaxLines<
    TReturnableLinkableKeys extends string = string,
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft-deleted shipping method tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method tax lines.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping method tax lines. You can pass to its `returnLinkableKeys`
   * property any of the shipping method tax line's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the shipping method tax line entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the shipping method tax line through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreShippingMethodTaxLines([
   *   "123", "321"
   * ])
   */
  restoreShippingMethodTaxLines<
    TReturnableLinkableKeys extends string = string,
  >(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method reverts an order to its last version.
   *
   * @param {string} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order is reverted.
   *
   * @example
   * await orderModuleService.revertLastVersion("123")
   */
  revertLastVersion(orderId: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a paginated list of transactions based on optional filters and configuration.
   *
   * @param {FilterableOrderTransactionProps} filters - The filters to apply on the retrieved transactions.
   * @param {FindConfig<OrderTransactionDTO>} config - The configurations determining how the transaction is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a transaction.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderTransactionDTO[]>} The list of transactions.
   *
   * @example
   * To retrieve a list of transactions using their IDs:
   *
   * ```ts
   * const transactions = await orderModuleService.listTransactions({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the transaction:
   *
   * ```ts
   * const transactions = await orderModuleService.listTransactions({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const transactions = await orderModuleService.listTransactions({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["order"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listTransactions(
    filters?: FilterableOrderTransactionProps,
    config?: FindConfig<OrderTransactionDTO>,
    sharedContext?: Context
  ): Promise<OrderTransactionDTO[]>

  /**
   * This method adds a transaction to an order.
   *
   * @param {CreateOrderTransactionDTO} data - The transaction to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderTransactionDTO>} The created transaction.
   *
   * @example
   * const transaction = await orderModuleService.addTransactions({
   *   order_id: "123",
   *   amount: 10,
   *   currency_code: "usd"
   * })
   */
  addTransactions(
    data: CreateOrderTransactionDTO,
    sharedContext?: Context
  ): Promise<OrderTransactionDTO>

  /**
   * This method adds transactions to an order.
   *
   * @param {CreateOrderTransactionDTO[]} data - The order transactions to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderTransactionDTO[]>} The created order transactions.
   *
   * @example
   * const transactions = await orderModuleService.addTransactions([{
   *   order_id: "123",
   *   amount: 10,
   *   currency_code: "usd"
   * }])
   */
  addTransactions(
    data: CreateOrderTransactionDTO[],
    sharedContext?: Context
  ): Promise<OrderTransactionDTO[]>

  /**
   * This method deletes transactions by their IDs.
   *
   * @param {string | object | string[] | object[]} transactionIds - The ID(s) of the transaction to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the transaction(s) are deleted successfully.
   *
   * @example
   * To delete one transaction:
   *
   * ```ts
   * await orderModuleService.deleteTransactions("123")
   * ```
   *
   * To delete multiple transactions:
   *
   * ```ts
   * await orderModuleService.deleteTransactions(["123", "321"])
   * ```
   */
  deleteTransactions(
    transactionIds: string | object | string[] | object[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes transactions by their IDs.
   *
   * @param {string[]} transactionIds - The IDs of transactions.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the transaction entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the transaction through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteTransactions(["123", "321"])
   */
  softDeleteTransactions<TReturnableLinkableKeys extends string = string>(
    transactionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft-deleted transactions by their IDs.
   *
   * @param {string[]} transactionIds - The IDs of transactions.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the transactions. You can pass to its `returnLinkableKeys`
   * property any of the transaction's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the transaction entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the transaction through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreTransactions(["123", "321"])
   */
  restoreTransactions<TReturnableLinkableKeys extends string = string>(
    transactionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a return reason by its ID.
   *
   * @param {string} reasonId - The return reason's ID.
   * @param {FindConfig<OrderReturnReasonDTO>} config - The configurations determining how the return reason is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a return reason.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnReasonDTO>} The retrieved return reason.
   *
   * @example
   * A simple example that retrieves a return reason by its ID:
   *
   * ```ts
   * const returnReason = await orderModuleService.retrieveReturnReason(
   *   "123"
   * )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const returnReason = await orderModuleService.retrieveReturnReason(
   *   "123",
   *   {
   *     relations: ["parent_return_reason"]
   *   }
   * )
   * ```
   */
  retrieveReturnReason(
    reasonId: string,
    config?: FindConfig<OrderReturnReasonDTO>,
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO>

  /**
   * This method retrieves a paginated list of return reasons based on optional filters and configuration.
   *
   * @param {FilterableOrderReturnReasonProps} filters - The filters to apply on the retrieved return reasons.
   * @param {FindConfig<OrderReturnReasonDTO>} config - The configurations determining how the return reason is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a return reason.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnReasonDTO[]>} The list of return reasons.
   *
   * @example
   * To retrieve a list of return reasons using their IDs:
   *
   * ```ts
   * const returnReasons = await orderModuleService.listReturnReasons({
   *   id: ["123", "321"]
   * })
   * ```
   *
   * To specify relations that should be retrieved within the return reason:
   *
   * ```ts
   * const returnReasons = await orderModuleService.listReturnReasons({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["parent_return_reason"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const returnReasons = await orderModuleService.listReturnReasons({
   *   id: ["123", "321"]
   * }, {
   *   relations: ["parent_return_reason"],
   *   take: 20,
   *   skip: 2
   * })
   * ```
   */
  listReturnReasons(
    filters: FilterableOrderReturnReasonProps,
    config?: FindConfig<OrderReturnReasonDTO>,
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO[]>

  /**
   * This method creates a return reason.
   *
   * @param {CreateOrderReturnReasonDTO} returnReasonData - The return reason to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnReasonDTO>} The created return reason.
   *
   * @example
   * const returnReason = await orderModuleService.createReturnReasons({
   *   label: "Damaged",
   *   value: "damaged"
   * })
   */
  createReturnReasons(
    returnReasonData: CreateOrderReturnReasonDTO,
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO>

  /**
   * This method creates return reasons.
   *
   * @param {CreateOrderReturnReasonDTO[]} returnReasonData - The return reasons to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnReasonDTO[]>} The created return reason.
   *
   * @example
   * const returnReasons = await orderModuleService.createReturnReasons([{
   *   label: "Damaged",
   *   value: "damaged"
   * }])
   */
  createReturnReasons(
    returnReasonData: CreateOrderReturnReasonDTO[],
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO[]>

  /**
   * This method updates existing return reasons.
   *
   * @param {UpdateOrderReturnReasonWithSelectorDTO[]} data - The filters that specifies which
   * return reasons to update, and the data to update in them.
   * @returns {Promise<OrderReturnReasonDTO[]>} The updated return reasons.
   *
   * @example
   * const returnReasons = await orderModuleService.updateReturnReasons([{
   *   selector: {
   *     id: "13"
   *   },
   *   data: {
   *     label: "Damaged"
   *   }
   * }])
   */
  updateReturnReasons(
    data: UpdateOrderReturnReasonWithSelectorDTO[],
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO[]>

  /**
   * This method updates existing return reasons matching the specified filters.
   *
   * @param {Partial<FilterableOrderReturnReasonProps>} selector - The filters specifying which return reason to delete.
   * @param {Partial<UpdateOrderReturnReasonDTO>} data - The data to update in the return reasons.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnReasonDTO[]>} The updated return reasons.
   *
   * @example
   * const returnReasons = await orderModuleService.updateReturnReasons({
   *   id: "123"
   * }, {
   *   label: "Damaged"
   * })
   */
  updateReturnReasons(
    selector: Partial<FilterableOrderReturnReasonProps>,
    data: Partial<UpdateOrderReturnReasonDTO>,
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO[]>

  /**
   * This method updates an existing return reason.
   *
   * @param {string} id - The ID of the return reason.
   * @param {Partial<UpdateOrderReturnReasonDTO>} data - The data to update in the return reason.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnReasonDTO>} The updated return reason.
   *
   * @example
   * const returnReason = await orderModuleService.updateReturnReasons(
   *   "123",
   *   {
   *     label: "Damaged"
   *   }
   * )
   */
  updateReturnReasons(
    id: string,
    data: Partial<UpdateOrderReturnReasonDTO>,
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO>

  /**
   * This method deletes return reasons by their IDs.
   *
   * @param {string[]} returnReasonIds - The IDs of return reasons.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the return reasons are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteReturnReasons([
   *   "123", "321"
   * ])
   */
  deleteReturnReasons(
    returnReasonIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes return reasons by their IDs.
   *
   * @param {string[]} ids - The IDs of the return reasons.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the return reason entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the return reason through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteReturnReasons([
   *   "123", "321"
   * ])
   */
  softDeleteReturnReasons<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft-deleted return reasons by their IDs.
   *
   * @param {string[]} ids - The IDs of the return reasons.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the return reasons. You can pass to its `returnLinkableKeys`
   * property any of the return reason's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the return reason entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the return reason through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreReturnReasons([
   *   "123", "321"
   * ])
   */
  restoreReturnReasons<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method creates a return item.
   *
   * @param {CreateOrderReturnItemDTO} data - The return item to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnItemDTO>} The created return item.
   *
   * @example
   * const returnItem = await orderModuleService.createReturnItems({
   *   return_id: "123",
   *   item_id: "321",
   *   quantity: 1
   * })
   */
  createReturnItems(
    data: CreateOrderReturnItemDTO,
    sharedContext?: Context
  ): Promise<OrderReturnItemDTO>

  /**
   * This method creates return items.
   *
   * @param {CreateOrderReturnItemDTO[]} data - The return items to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderReturnItemDTO[]>} The created return items.
   *
   * @example
   * const returnItems = await orderModuleService.createReturnItems([{
   *   return_id: "123",
   *   item_id: "321",
   *   quantity: 1
   * }])
   */
  createReturnItems(
    data: CreateOrderReturnItemDTO[],
    sharedContext?: Context
  ): Promise<OrderReturnItemDTO[]>

  /**
   * This method creates a return.
   *
   * @param {CreateOrderReturnDTO} data - The return to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO>} The created return.
   *
   * @example
   * const orderReturn = await orderModuleService.createReturns({
   *   order_id: "123",
   *   items: [
   *     {
   *       id: "321",
   *       quantity: 1
   *     }
   *   ]
   * })
   */
  createReturns(
    data: CreateOrderReturnDTO,
    sharedContext?: Context
  ): Promise<ReturnDTO>

  /**
   * This method creates returns.
   *
   * @param {CreateOrderReturnDTO[]} data - The returns to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO[]>} The created returns.
   *
   * @example
   * const returns = await orderModuleService.createReturns([{
   *   order_id: "123",
   *   items: [
   *     {
   *       id: "321",
   *       quantity: 1
   *     }
   *   ]
   * }])
   */
  createReturns(
    data: CreateOrderReturnDTO[],
    sharedContext?: Context
  ): Promise<ReturnDTO[]>

  /**
   * This method updates existing returns.
   *
   * @param {UpdateOrderReturnWithSelectorDTO[]} data - The filters specifying which returns to update,
   * and the data to update in them.
   * @returns {Promise<ReturnDTO[]>} The updated returns.
   *
   * @example
   * const returns = await orderModuleService.updateReturns([{
   *   selector: {
   *     id: "123"
   *   },
   *   data: {
   *     refund_amount: 10
   *   }
   * }])
   */
  updateReturns(
    data: UpdateOrderReturnWithSelectorDTO[],
    sharedContext?: Context
  ): Promise<ReturnDTO[]>

  /**
   * This method updates existing returns matching the specified filters.
   *
   * @param {Partial<FilterableReturnProps>} selector - The filters specifying which returns to update.
   * @param {Partial<UpdateReturnDTO>} data - The data to update in the returns.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO[]>} The updated returns.
   *
   * @example
   * const returns = await orderModuleService.updateReturns({
   *   id: "123"
   * }, {
   *   refund_amount: 10
   * })
   */
  updateReturns(
    selector: Partial<FilterableReturnProps>,
    data: Partial<UpdateReturnDTO>,
    sharedContext?: Context
  ): Promise<ReturnDTO[]>

  /**
   * This method updates an existing return.
   *
   * @param {string} id - The ID of the return.
   * @param {Partial<UpdateReturnDTO>} data - The data to update.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO>} The updated return.
   *
   * @example
   * const orderReturn = await orderModuleService.updateReturns(
   *   "123",
   *   {
   *     refund_amount: 10
   *   }
   * )
   */
  updateReturns(
    id: string,
    data: Partial<UpdateReturnDTO>,
    sharedContext?: Context
  ): Promise<ReturnDTO>

  /**
   * This method deletes returns by their IDs.
   *
   * @param {string[]} ids - The IDs of the returns.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the returns are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteReturns(["123", "321"])
   */
  deleteReturns(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes return items by their IDs.
   *
   * @param {string[]} ids - The IDs of the return items.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the return items are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteReturnItems(["123", "321"])
   */
  deleteReturnItems(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes returns by their IDs.
   *
   * @param {string[]} ids - The IDs of the returns.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the return entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the return through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteReturns(["123", "321"])
   */
  softDeleteReturns<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft-deleted returns by their IDs.
   *
   * @param {string[]} ids - The IDs of the returns.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the returns. You can pass to its `returnLinkableKeys`
   * property any of the return's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the return entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the return through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreReturns(["123", "321"])
   */
  restoreReturns<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method creates an order claim.
   *
   * @param {CreateOrderClaimDTO} data - The order claim to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO>} The created order claim.
   *
   * @example
   * const claim = await orderModuleService.createOrderClaims({
   *   order_id: "123",
   *   type: "refund"
   * })
   */
  createOrderClaims(
    data: CreateOrderClaimDTO,
    sharedContext?: Context
  ): Promise<OrderClaimDTO>

  /**
   * This method creates order claims.
   *
   * @param {CreateOrderClaimDTO[]} data - The order claims to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO[]>} The created order claims.
   *
   * @example
   * const claims = await orderModuleService.createOrderClaims([{
   *   order_id: "123",
   *   type: "refund"
   * }])
   */
  createOrderClaims(
    data: CreateOrderClaimDTO[],
    sharedContext?: Context
  ): Promise<OrderClaimDTO[]>

  /**
   * This method updates existing order claims.
   *
   * @param {UpdateOrderClaimWithSelectorDTO[]} data - The filters specifying which order claims to update,
   * and the data to update in them.
   * @returns {Promise<OrderClaimDTO[]>} The updated order claims.
   *
   * @example
   * const claims = await orderModuleService.updateOrderClaims([
   *   {
   *     selector: {
   *       id: "123"
   *     },
   *     data: {
   *       type: "refund"
   *     }
   *   }
   * ])
   */
  updateOrderClaims(
    data: UpdateOrderClaimWithSelectorDTO[],
    sharedContext?: Context
  ): Promise<OrderClaimDTO[]>

  /**
   * This method updates existing order claims matching the specified filters.
   *
   * @param {Partial<FilterableOrderClaimProps>} selector - The filters specifying which order claims to update.
   * @param {Partial<UpdateOrderClaimDTO>} data - The data to update in the order claims.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO[]>} The updated order claims.
   *
   * @example
   * const claims = await orderModuleService.updateOrderClaims({
   *   id: "123"
   * }, {
   *   type: "refund"
   * })
   */
  updateOrderClaims(
    selector: Partial<FilterableOrderClaimProps>,
    data: Partial<UpdateOrderClaimDTO>,
    sharedContext?: Context
  ): Promise<OrderClaimDTO[]>

  /**
   * This method updates an existing order claim.
   *
   * @param {string} id - The ID of the order claim.
   * @param {Partial<UpdateOrderClaimDTO>} data - The data to update in the order claim.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO>} The updated order claim.
   *
   * @example
   * const claim = await orderModuleService.updateOrderClaims("123", {
   *   type: "refund"
   * })
   */
  updateOrderClaims(
    id: string,
    data: Partial<UpdateOrderClaimDTO>,
    sharedContext?: Context
  ): Promise<OrderClaimDTO>

  /**
   * This method deletes an order claim by its ID.
   *
   * @param {string[]} ids - The IDs of the order claims.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order claims are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteOrderClaims(["123", "321"])
   */
  deleteOrderClaims(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes order claims by their IDs.
   *
   * @param {string[]} ids - The IDs of the order claims.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the order claim entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the order claim through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteOrderClaims(["123", "321"])
   */
  softDeleteOrderClaims<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft-deleted order claims by their IDs.
   *
   * @param {string[]} ids - The IDs of the order claims.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the order. You can pass to its `returnLinkableKeys`
   * property any of the order claim's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the order claim entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the order claims through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreOrderClaims(["123", "321"])
   */
  restoreOrderClaims<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method creates an order exchange.
   *
   * @param {CreateOrderExchangeDTO} data - The order exchange to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO>} The created order exchange.
   *
   * @example
   * const exchange = await orderModuleService.createOrderExchanges({
   *   order_id: "123",
   *   additional_items: [
   *     {
   *       id: "123",
   *       quantity: 1
   *     }
   *   ]
   * })
   */
  createOrderExchanges(
    data: CreateOrderExchangeDTO,
    sharedContext?: Context
  ): Promise<OrderExchangeDTO>

  /**
   * This method creates order exchanges.
   *
   * @param {CreateOrderExchangeDTO[]} data - The order exchanges to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO[]>} The created order exchanges.
   *
   * @example
   * const exchanges = await orderModuleService.createOrderExchanges([{
   *   order_id: "123",
   *   additional_items: [
   *     {
   *       id: "123",
   *       quantity: 1
   *     }
   *   ]
   * }])
   */
  createOrderExchanges(
    data: CreateOrderExchangeDTO[],
    sharedContext?: Context
  ): Promise<OrderExchangeDTO[]>

  /**
   * This method updates existing order exchanges.
   *
   * @param {UpdateOrderExchangeWithSelectorDTO[]} data - The filters specifying which exchanges to update,
   * and the data to update in them.
   * @returns {Promise<OrderExchangeDTO[]>} The updated order exchanges.
   *
   * @example
   * const exchanges = await orderModuleService.updateOrderExchanges([
   *   {
   *     selector: {
   *       id: "123"
   *     },
   *     data: {
   *       return_id: "123"
   *     }
   *   }
   * ])
   */
  updateOrderExchanges(
    data: UpdateOrderExchangeWithSelectorDTO[],
    sharedContext?: Context
  ): Promise<OrderExchangeDTO[]>

  /**
   * This method updates existing order exchanges matching the specified filters.
   *
   * @param {Partial<FilterableOrderExchangeProps>} selector - The filters specifying which order exchanges to update.
   * @param {Partial<UpdateOrderExchangeDTO>} data - The data to update in the order exchanges.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO[]>} The updated order exchanges.
   *
   * @example
   * const exchanges = await orderModuleService.updateOrderExchanges({
   *   id: "123"
   * }, {
   *   return_id: "123"
   * })
   */
  updateOrderExchanges(
    selector: Partial<FilterableOrderExchangeProps>,
    data: Partial<UpdateOrderExchangeDTO>,
    sharedContext?: Context
  ): Promise<OrderExchangeDTO[]>

  /**
   * This method updates an existing order exchange.
   *
   * @param {string} id - The ID of the order exchange.
   * @param {Partial<UpdateOrderExchangeDTO>} data - The data to update in the order exchange.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO>} The updated order exchange.
   *
   * @example
   * const exchange = await orderModuleService.updateOrderExchanges(
   *   "123",
   *   {
   *     return_id: "123"
   *   }
   * )
   */
  updateOrderExchanges(
    id: string,
    data: Partial<UpdateOrderExchangeDTO>,
    sharedContext?: Context
  ): Promise<OrderExchangeDTO>

  /**
   * This method deletes order exchanges by their IDs.
   *
   * @param {string[]} ids - The IDs of the order exchanges.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the order exchanges are deleted successfully.
   *
   * @example
   * await orderModuleService.deleteOrderExchanges(["123", "321"])
   */
  deleteOrderExchanges(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes order exchanges by their IDs.
   *
   * @param {string[]} ids - The IDs of the order exchanges.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * The object's keys are the ID attribute names of the order exchange entity's relations, and its value is an array of strings, each being the ID of a record associated
   * with the order exchange through this relation.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.softDeleteOrderExchanges(["123", "321"])
   */
  softDeleteOrderExchanges<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft-deleted order exchanges by their IDs.
   *
   * @param {string[]} ids - The IDs of the order exchanges.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the order exchanges. You can pass to its `returnLinkableKeys`
   * property any of the order exchange's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * The object's keys are the ID attribute names of the order exchange entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the order exchange through this relation.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await orderModuleService.restoreOrderExchanges(["123", "321"])
   */
  restoreOrderExchanges<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method sets the status of orders to `archived`.
   *
   * @param {string[]} orderIds - The orders' ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO[]>} The archived orders.
   *
   * @example
   * const orders = await orderModuleService.archive(["123", "321"])
   */
  archive(orderIds: string[], sharedContext?: Context): Promise<OrderDTO[]>

  /**
   * This method sets the status of an order to `archived`.
   *
   * @param {string} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO>} The archived order.
   *
   * @example
   * const order = await orderModuleService.archive("123")
   */
  archive(orderId: string, sharedContext?: Context): Promise<OrderDTO>

  /**
   * This method sets the status of orders to `completed`.
   *
   * @param {string[]} orderIds - The orders' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO[]>} The completed orders.
   *
   * @example
   * const orders = await orderModuleService.completeOrder([
   *   "123", "321"
   * ])
   */
  completeOrder(
    orderIds: string[],
    sharedContext?: Context
  ): Promise<OrderDTO[]>

  /**
   * This method sets the status of an order to `completed`.
   *
   * @param {string} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO>} The completed order.
   *
   * @example
   * const order = await orderModuleService.completeOrder("123")
   */
  completeOrder(orderId: string, sharedContext?: Context): Promise<OrderDTO>

  /**
   * This method sets the status of orders to `canceled`.
   *
   * @param {string[]} orderId - The orders' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO[]>} The canceled orders.
   *
   * @example
   * const orders = await orderModuleService.cancel(["123", "321"])
   */
  cancel(orderId: string[], sharedContext?: Context): Promise<OrderDTO[]>

  /**
   * This method sets the status of an order to `canceled`.
   *
   * @param {string} orderId - The order's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderDTO>} Represents the completion of an asynchronous operation
   *
   * @example
   * const orders = await orderModuleService.cancel("123")
   */
  cancel(orderId: string, sharedContext?: Context): Promise<OrderDTO>
  // Bundled flows

  /**
   * Register a fulfillment for an order, return, exchange, or claim.
   *
   * @param {RegisterOrderFulfillmentDTO} data - The fulfillment's details.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the fulfillment is registered successfully.
   *
   * @example
   * await orderModuleService.registerFulfillment({
   *   order_id: "123",
   *   items: [
   *     {
   *       id: "321",
   *       quantity: 1
   *     }
   *   ]
   * })
   */
  registerFulfillment(
    data: RegisterOrderFulfillmentDTO,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method cancels the fulfillment of an order, return, claim, or exchange.
   *
   * @param {CancelOrderFulfillmentDTO} data - The cancelation details.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the fulfillment is canceled.
   *
   * @example
   * await orderModuleService.cancelFulfillment({
   *   order_id: "123",
   *   items: [
   *     {
   *       id: "321",
   *       quantity: 1
   *     }
   *   ]
   * })
   */
  cancelFulfillment(
    data: CancelOrderFulfillmentDTO,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method registers a shipment for an order, return, claim, or exchange.
   *
   * @param {RegisterOrderShipmentDTO} data - The shipment's data.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipment's data are registered successfully.
   *
   * @example
   * await orderModuleService.registerShipment({
   *   order_id: "123",
   *   items: [
   *     {
   *       id: "321",
   *       quantity: 1
   *     }
   *   ]
   * })
   */
  registerShipment(
    data: RegisterOrderShipmentDTO,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method creates a return.
   *
   * @param {CreateOrderReturnDTO} returnData - The order return to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO>} The created order return.
   *
   * @example
   * const orderReturn = await orderModuleService.createReturn({
   *   order_id: "123",
   *   items: [{
   *     id: "321",
   *     quantity: 1
   *   }]
   * })
   */
  createReturn(
    returnData: CreateOrderReturnDTO,
    sharedContext?: Context
  ): Promise<ReturnDTO>

  /**
   * This method cancels an order return.
   *
   * @param {CancelOrderReturnDTO} data - The cancelation details.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO>} The canceled return.
   *
   * @example
   * const orderReturn = await orderModuleService.cancelReturn({
   *   return_id: "123"
   * })
   */
  cancelReturn(
    data: CancelOrderReturnDTO,
    sharedContext?: Context
  ): Promise<ReturnDTO>

  /**
   * This method marks a return as received, changing its status to `received`.
   *
   * @param {ReceiveOrderReturnDTO} returnData - The receival details.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReturnDTO>} The received return.
   *
   * @example
   * const orderReturn = await orderModuleService.receiveReturn({
   *   return_id: "123",
   *   items: [
   *     {
   *       id: "123",
   *       quantity:1
   *     }
   *   ]
   * })
   */
  receiveReturn(
    returnData: ReceiveOrderReturnDTO,
    sharedContext?: Context
  ): Promise<ReturnDTO>

  /**
   * This method creates a claim.
   *
   * @param {CreateOrderClaimDTO} claimData - The order claim to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO>} The created claim.
   *
   * @example
   * const claim = await orderModuleService.createClaim({
   *   order_id: "123",
   *   type: "refund"
   * })
   */
  createClaim(
    claimData: CreateOrderClaimDTO,
    sharedContext?: Context
  ): Promise<OrderClaimDTO>

  /**
   * This method cancels a claim.
   *
   * @param {CancelOrderClaimDTO} data - The cancelation details.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderClaimDTO>} The canceled claim.
   *
   * @example
   * const claim = await orderModuleService.cancelClaim({
   *   claim_id: "123",
   * })
   */
  cancelClaim(
    data: CancelOrderClaimDTO,
    sharedContext?: Context
  ): Promise<OrderClaimDTO>

  /**
   * This method creates an order exchange.
   *
   * @param {CreateOrderExchangeDTO} exchangeData - The order exchange to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO>} The created order exchange.
   *
   * @example
   * const exchange = await orderModuleService.createExchange({
   *   order_id: "123",
   *   additional_items: [
   *     {
   *       id: "123",
   *       quantity: 1
   *     }
   *   ]
   * })
   */
  createExchange(
    exchangeData: CreateOrderExchangeDTO,
    sharedContext?: Context
  ): Promise<OrderExchangeDTO>

  /**
   * This method cancels an exchange.
   *
   * @param {CancelOrderExchangeDTO} data - The cancelation details.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<OrderExchangeDTO>} The canceled order exchange.
   *
   * @example
   * const exchange = await orderModuleService.cancelExchange({
   *   exchange_id: "123"
   * })
   */
  cancelExchange(
    data: CancelOrderExchangeDTO,
    sharedContext?: Context
  ): Promise<OrderExchangeDTO>
}
