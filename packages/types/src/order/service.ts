import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableOrderAddressProps,
  FilterableOrderLineItemAdjustmentProps,
  FilterableOrderLineItemProps,
  FilterableOrderLineItemTaxLineProps,
  FilterableOrderProps,
  FilterableOrderShippingMethodAdjustmentProps,
  FilterableOrderShippingMethodProps,
  FilterableOrderShippingMethodTaxLineProps,
  OrderAddressDTO,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderItemDTO,
  OrderLineItemAdjustmentDTO,
  OrderLineItemDTO,
  OrderLineItemTaxLineDTO,
  OrderShippingMethodAdjustmentDTO,
  OrderShippingMethodDTO,
  OrderShippingMethodTaxLineDTO,
} from "./common"
import {
  CancelOrderChangeDTO,
  ConfirmOrderChangeDTO,
  CreateOrderAddressDTO,
  CreateOrderAdjustmentDTO,
  CreateOrderChangeActionDTO,
  CreateOrderChangeDTO,
  CreateOrderDTO,
  CreateOrderLineItemDTO,
  CreateOrderLineItemForOrderDTO,
  CreateOrderLineItemTaxLineDTO,
  CreateOrderShippingMethodAdjustmentDTO,
  CreateOrderShippingMethodDTO,
  CreateOrderShippingMethodTaxLineDTO,
  DeclineOrderChangeDTO,
  UpdateOrderAddressDTO,
  UpdateOrderDTO,
  UpdateOrderItemDTO,
  UpdateOrderItemWithSelectorDTO,
  UpdateOrderLineItemDTO,
  UpdateOrderLineItemTaxLineDTO,
  UpdateOrderLineItemWithSelectorDTO,
  UpdateOrderShippingMethodAdjustmentDTO,
  UpdateOrderShippingMethodTaxLineDTO,
  UpsertOrderLineItemAdjustmentDTO,
} from "./mutations"

export interface IOrderModuleService extends IModuleService {
  retrieve(
    orderId: string,
    config?: FindConfig<OrderDTO>,
    sharedContext?: Context
  ): Promise<OrderDTO>

  list(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderDTO>,
    sharedContext?: Context
  ): Promise<OrderDTO[]>

  listAndCount(
    filters?: FilterableOrderProps,
    config?: FindConfig<OrderDTO>,
    sharedContext?: Context
  ): Promise<[OrderDTO[], number]>

  create(data: CreateOrderDTO[], sharedContext?: Context): Promise<OrderDTO[]>
  create(data: CreateOrderDTO, sharedContext?: Context): Promise<OrderDTO>

  update(data: UpdateOrderDTO[]): Promise<OrderDTO[]>
  update(
    orderId: string,
    data: UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderDTO>
  update(
    selector: Partial<FilterableOrderProps>,
    data: UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderDTO[]>

  delete(orderIds: string[], sharedContext?: Context): Promise<void>
  delete(orderId: string, sharedContext?: Context): Promise<void>

  softDelete<TReturnableLinkableKeys extends string = string>(
    storeIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    storeIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  listAddresses(
    filters?: FilterableOrderAddressProps,
    config?: FindConfig<OrderAddressDTO>,
    sharedContext?: Context
  ): Promise<OrderAddressDTO[]>

  createAddresses(
    data: CreateOrderAddressDTO[],
    sharedContext?: Context
  ): Promise<OrderAddressDTO[]>
  createAddresses(
    data: CreateOrderAddressDTO,
    sharedContext?: Context
  ): Promise<OrderAddressDTO>

  updateAddresses(
    data: UpdateOrderAddressDTO[],
    sharedContext?: Context
  ): Promise<OrderAddressDTO[]>
  updateAddresses(
    data: UpdateOrderAddressDTO,
    sharedContext?: Context
  ): Promise<OrderAddressDTO>

  deleteAddresses(ids: string[], sharedContext?: Context): Promise<void>
  deleteAddresses(ids: string, sharedContext?: Context): Promise<void>

  retrieveLineItem(
    itemId: string,
    config?: FindConfig<OrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO>

  listLineItems(
    filters: FilterableOrderLineItemProps,
    config?: FindConfig<OrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  createLineItems(
    data: CreateOrderLineItemForOrderDTO
  ): Promise<OrderLineItemDTO[]>
  createLineItems(
    data: CreateOrderLineItemForOrderDTO[]
  ): Promise<OrderLineItemDTO[]>
  createLineItems(
    orderId: string,
    items: CreateOrderLineItemDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  updateLineItems(
    data: UpdateOrderLineItemWithSelectorDTO[]
  ): Promise<OrderLineItemDTO[]>
  updateLineItems(
    selector: Partial<FilterableOrderLineItemProps>,
    data: Partial<UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>
  updateLineItems(
    lineId: string,
    data: Partial<UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO>

  deleteLineItems(itemIds: string[], sharedContext?: Context): Promise<void>
  deleteLineItems(itemIds: string, sharedContext?: Context): Promise<void>
  deleteLineItems(
    selector: Partial<FilterableOrderLineItemProps>,
    sharedContext?: Context
  ): Promise<void>

  updateOrderItem(
    selector: Partial<FilterableOrderShippingMethodProps>,
    data: UpdateOrderItemDTO,
    sharedContext?: Context
  ): Promise<OrderItemDTO[]>
  updateOrderItem(
    orderDetailId: string,
    data: Partial<UpdateOrderItemDTO>,
    sharedContext?: Context
  ): Promise<OrderItemDTO>

  updateOrderItem(
    orderDetailIdOrDataOrSelector:
      | string
      | UpdateOrderItemWithSelectorDTO[]
      | Partial<OrderItemDTO>,
    data?: UpdateOrderItemDTO | Partial<UpdateOrderItemDTO>,
    sharedContext?: Context
  ): Promise<OrderItemDTO[] | OrderItemDTO>

  listShippingMethods(
    filters: FilterableOrderShippingMethodProps,
    config: FindConfig<OrderShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  createShippingMethods(
    data: CreateOrderShippingMethodDTO
  ): Promise<OrderShippingMethodDTO>
  createShippingMethods(
    data: CreateOrderShippingMethodDTO[]
  ): Promise<OrderShippingMethodDTO[]>
  createShippingMethods(
    orderId: string,
    methods: CreateOrderShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  deleteShippingMethods(
    methodIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethods(
    methodIds: string,
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethods(
    selector: Partial<FilterableOrderShippingMethodProps>,
    sharedContext?: Context
  ): Promise<void>

  listLineItemAdjustments(
    filters: FilterableOrderLineItemAdjustmentProps,
    config?: FindConfig<OrderLineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  createLineItemAdjustments(
    data: CreateOrderAdjustmentDTO[]
  ): Promise<OrderLineItemAdjustmentDTO[]>
  createLineItemAdjustments(
    data: CreateOrderAdjustmentDTO
  ): Promise<OrderLineItemAdjustmentDTO[]>
  createLineItemAdjustments(
    orderId: string,
    data: CreateOrderAdjustmentDTO[]
  ): Promise<OrderLineItemAdjustmentDTO[]>

  setLineItemAdjustments(
    orderId: string,
    data: UpsertOrderLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  deleteLineItemAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteLineItemAdjustments(
    adjustmentIds: string,
    sharedContext?: Context
  ): Promise<void>
  deleteLineItemAdjustments(
    selector: Partial<OrderLineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  listShippingMethodAdjustments(
    filters: FilterableOrderShippingMethodAdjustmentProps,
    config?: FindConfig<OrderShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  createShippingMethodAdjustments(
    data: CreateOrderShippingMethodAdjustmentDTO[]
  ): Promise<OrderShippingMethodAdjustmentDTO[]>
  createShippingMethodAdjustments(
    data: CreateOrderShippingMethodAdjustmentDTO
  ): Promise<OrderShippingMethodAdjustmentDTO>
  createShippingMethodAdjustments(
    orderId: string,
    data: CreateOrderShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  setShippingMethodAdjustments(
    orderId: string,
    data: (
      | CreateOrderShippingMethodAdjustmentDTO
      | UpdateOrderShippingMethodAdjustmentDTO
    )[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  deleteShippingMethodAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethodAdjustments(
    adjustmentId: string,
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethodAdjustments(
    selector: Partial<OrderShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  listLineItemTaxLines(
    filters: FilterableOrderLineItemTaxLineProps,
    config?: FindConfig<OrderLineItemTaxLineDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  createLineItemTaxLines(
    taxLines: CreateOrderLineItemTaxLineDTO[]
  ): Promise<OrderLineItemTaxLineDTO[]>
  createLineItemTaxLines(
    taxLine: CreateOrderLineItemTaxLineDTO
  ): Promise<OrderLineItemTaxLineDTO>
  createLineItemTaxLines(
    orderId: string,
    taxLines: CreateOrderLineItemTaxLineDTO[] | CreateOrderLineItemTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  setLineItemTaxLines(
    orderId: string,
    taxLines: (CreateOrderLineItemTaxLineDTO | UpdateOrderLineItemTaxLineDTO)[],
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  deleteLineItemTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteLineItemTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  deleteLineItemTaxLines(
    selector: FilterableOrderLineItemTaxLineProps,
    sharedContext?: Context
  ): Promise<void>

  listShippingMethodTaxLines(
    filters: FilterableOrderShippingMethodTaxLineProps,
    config?: FindConfig<OrderShippingMethodTaxLineDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  createShippingMethodTaxLines(
    taxLines: CreateOrderShippingMethodTaxLineDTO[]
  ): Promise<OrderShippingMethodTaxLineDTO[]>
  createShippingMethodTaxLines(
    taxLine: CreateOrderShippingMethodTaxLineDTO
  ): Promise<OrderShippingMethodTaxLineDTO>
  createShippingMethodTaxLines(
    orderId: string,
    taxLines:
      | CreateOrderShippingMethodTaxLineDTO[]
      | CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  setShippingMethodTaxLines(
    orderId: string,
    taxLines: (
      | CreateOrderShippingMethodTaxLineDTO
      | UpdateOrderShippingMethodTaxLineDTO
    )[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  deleteShippingMethodTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethodTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethodTaxLines(
    selector: FilterableOrderShippingMethodTaxLineProps,
    sharedContext?: Context
  ): Promise<void>

  // Order Change
  createOrderChange(
    data: CreateOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderChangeDTO>
  createOrderChange(
    data: CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO[]>
  createOrderChange(
    data: CreateOrderChangeDTO | CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO | OrderChangeDTO[]>

  cancelOrderChange(orderId: string, sharedContext?: Context): Promise<void>
  cancelOrderChange(orderId: string[], sharedContext?: Context): Promise<void>
  cancelOrderChange(
    data: CancelOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>
  cancelOrderChange(
    data: CancelOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  confirmOrderChange(orderId: string, sharedContext?: Context): Promise<void>
  confirmOrderChange(orderId: string[], sharedContext?: Context): Promise<void>
  confirmOrderChange(
    data: ConfirmOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>
  confirmOrderChange(
    data: ConfirmOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  declineOrderChange(orderId: string, sharedContext?: Context): Promise<void>
  declineOrderChange(orderId: string[], sharedContext?: Context): Promise<void>
  declineOrderChange(
    data: DeclineOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>
  declineOrderChange(
    data: DeclineOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  applyPendingOrderActions(orderId: string | string[], sharedContext?: Context)

  addOrderAction(
    data: CreateOrderChangeActionDTO,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO>
  addOrderAction(
    data: CreateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO[]>

  softDeleteAddresses<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restoreAddresses<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  softDeleteLineItems<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restoreLineItems<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  softDeleteShippingMethods<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restoreShippingMethods<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  softDeleteLineItemAdjustments<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restoreLineItemAdjustments<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  softDeleteShippingMethodAdjustments<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restoreShippingMethodAdjustments<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  softDeleteLineItemTaxLines<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restoreLineItemTaxLines<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  softDeleteShippingMethodTaxLines<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restoreShippingMethodTaxLines<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}
