import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableOrderAddressProps,
  FilterableOrderChangeActionProps,
  FilterableOrderChangeProps,
  FilterableOrderLineItemAdjustmentProps,
  FilterableOrderLineItemProps,
  FilterableOrderLineItemTaxLineProps,
  FilterableOrderProps,
  FilterableOrderShippingMethodAdjustmentProps,
  FilterableOrderShippingMethodProps,
  FilterableOrderShippingMethodTaxLineProps,
  FilterableOrderTransactionProps,
  OrderAddressDTO,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderLineItemAdjustmentDTO,
  OrderLineItemDTO,
  OrderLineItemTaxLineDTO,
  OrderShippingMethodAdjustmentDTO,
  OrderShippingMethodDTO,
  OrderShippingMethodTaxLineDTO,
  OrderTransactionDTO,
} from "./common"
import {
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
  CreateOrderShippingMethodForSingleOrderDTO,
  CreateOrderShippingMethodTaxLineDTO,
  CreateOrderTransactionDTO,
  UpdateOrderAddressDTO,
  UpdateOrderChangeActionDTO,
  UpdateOrderChangeDTO,
  UpdateOrderDTO,
  UpdateOrderLineItemDTO,
  UpdateOrderLineItemTaxLineDTO,
  UpdateOrderLineItemWithSelectorDTO,
  UpdateOrderShippingMethodAdjustmentDTO,
  UpdateOrderShippingMethodTaxLineDTO,
  UpdateOrderTransactionDTO,
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

  update(data: UpdateOrderDTO[], sharedContext?: Context): Promise<OrderDTO[]>
  update(data: UpdateOrderDTO, sharedContext?: Context): Promise<OrderDTO>

  delete(orderIds: string[], sharedContext?: Context): Promise<void>
  delete(orderId: string, sharedContext?: Context): Promise<void>

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

  addLineItems(
    data: CreateOrderLineItemForOrderDTO
  ): Promise<OrderLineItemDTO[]>
  addLineItems(
    data: CreateOrderLineItemForOrderDTO[]
  ): Promise<OrderLineItemDTO[]>
  addLineItems(
    orderId: string,
    items: CreateOrderLineItemDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>

  updateLineItems(
    data: UpdateOrderLineItemWithSelectorDTO[]
  ): Promise<OrderLineItemDTO[]>
  updateLineItems(
    selector: Partial<OrderLineItemDTO>,
    data: Partial<UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO[]>
  updateLineItems(
    lineId: string,
    data: Partial<UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemDTO>

  removeLineItems(itemIds: string[], sharedContext?: Context): Promise<void>
  removeLineItems(itemIds: string, sharedContext?: Context): Promise<void>
  removeLineItems(
    selector: Partial<OrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<void>

  listShippingMethods(
    filters: FilterableOrderShippingMethodProps,
    config: FindConfig<OrderShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  addShippingMethods(
    data: CreateOrderShippingMethodDTO
  ): Promise<OrderShippingMethodDTO>
  addShippingMethods(
    data: CreateOrderShippingMethodDTO[]
  ): Promise<OrderShippingMethodDTO[]>
  addShippingMethods(
    orderId: string,
    methods: CreateOrderShippingMethodForSingleOrderDTO[],
    sharedContext?: Context
  ): Promise<OrderShippingMethodDTO[]>

  removeShippingMethods(
    methodIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethods(
    methodIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethods(
    selector: Partial<OrderShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<void>

  listLineItemAdjustments(
    filters: FilterableOrderLineItemAdjustmentProps,
    config?: FindConfig<OrderLineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  addLineItemAdjustments(
    data: CreateOrderAdjustmentDTO[]
  ): Promise<OrderLineItemAdjustmentDTO[]>
  addLineItemAdjustments(
    data: CreateOrderAdjustmentDTO
  ): Promise<OrderLineItemAdjustmentDTO[]>
  addLineItemAdjustments(
    orderId: string,
    data: CreateOrderAdjustmentDTO[]
  ): Promise<OrderLineItemAdjustmentDTO[]>

  setLineItemAdjustments(
    orderId: string,
    data: UpsertOrderLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderLineItemAdjustmentDTO[]>

  removeLineItemAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeLineItemAdjustments(
    adjustmentIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeLineItemAdjustments(
    selector: Partial<OrderLineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  listShippingMethodAdjustments(
    filters: FilterableOrderShippingMethodAdjustmentProps,
    config?: FindConfig<OrderShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodAdjustmentDTO[]>

  addShippingMethodAdjustments(
    data: CreateOrderShippingMethodAdjustmentDTO[]
  ): Promise<OrderShippingMethodAdjustmentDTO[]>
  addShippingMethodAdjustments(
    data: CreateOrderShippingMethodAdjustmentDTO
  ): Promise<OrderShippingMethodAdjustmentDTO>
  addShippingMethodAdjustments(
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

  removeShippingMethodAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodAdjustments(
    adjustmentId: string,
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodAdjustments(
    selector: Partial<OrderShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  listLineItemTaxLines(
    filters: FilterableOrderLineItemTaxLineProps,
    config?: FindConfig<OrderLineItemTaxLineDTO>,
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  addLineItemTaxLines(
    taxLines: CreateOrderLineItemTaxLineDTO[]
  ): Promise<OrderLineItemTaxLineDTO[]>
  addLineItemTaxLines(
    taxLine: CreateOrderLineItemTaxLineDTO
  ): Promise<OrderLineItemTaxLineDTO>
  addLineItemTaxLines(
    orderId: string,
    taxLines: CreateOrderLineItemTaxLineDTO[] | CreateOrderLineItemTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  setLineItemTaxLines(
    orderId: string,
    taxLines: (CreateOrderLineItemTaxLineDTO | UpdateOrderLineItemTaxLineDTO)[],
    sharedContext?: Context
  ): Promise<OrderLineItemTaxLineDTO[]>

  removeLineItemTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeLineItemTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeLineItemTaxLines(
    selector: FilterableOrderLineItemTaxLineProps,
    sharedContext?: Context
  ): Promise<void>

  listShippingMethodTaxLines(
    filters: FilterableOrderShippingMethodTaxLineProps,
    config?: FindConfig<OrderShippingMethodTaxLineDTO>,
    sharedContext?: Context
  ): Promise<OrderShippingMethodTaxLineDTO[]>

  addShippingMethodTaxLines(
    taxLines: CreateOrderShippingMethodTaxLineDTO[]
  ): Promise<OrderShippingMethodTaxLineDTO[]>
  addShippingMethodTaxLines(
    taxLine: CreateOrderShippingMethodTaxLineDTO
  ): Promise<OrderShippingMethodTaxLineDTO>
  addShippingMethodTaxLines(
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

  removeShippingMethodTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodTaxLines(
    selector: FilterableOrderShippingMethodTaxLineProps,
    sharedContext?: Context
  ): Promise<void>

  retrieveOrderChange(
    id: string,
    sharedContext?: Context
  ): Promise<OrderChangeDTO>

  listOrderChanges(
    filters: FilterableOrderChangeProps,
    config?: FindConfig<OrderChangeDTO>,
    sharedContext?: Context
  ): Promise<OrderChangeDTO[]>

  createOrderChange(
    data: CreateOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderChangeDTO>
  createOrderChange(
    data: CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO[]>

  updateOrderChange(
    data: UpdateOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderChangeDTO>
  updateOrderChange(
    data: UpdateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeDTO[]>

  softDeleteOrderChange<TReturnableLinkableKeys extends string = string>(
    serviceZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restoreOrderChange<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  retrieveOrderChangeAction(
    id: string,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO>

  listOrderChangeActions(
    filters: FilterableOrderChangeActionProps,
    config?: FindConfig<OrderChangeActionDTO>,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO[]>

  createOrderChangeAction(
    data: CreateOrderChangeActionDTO,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO>
  createOrderChangeAction(
    data: CreateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO[]>

  updateOrderChangeAction(
    data: UpdateOrderChangeActionDTO,
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO>
  updateOrderChangeAction(
    data: UpdateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<OrderChangeActionDTO[]>

  softDeleteOrderChangeAction<TReturnableLinkableKeys extends string = string>(
    serviceZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restoreOrderChangeAction<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  retrieveOrderTransaction(
    id: string,
    sharedContext?: Context
  ): Promise<OrderTransactionDTO>

  listOrderTransactions(
    filters: FilterableOrderTransactionProps,
    config?: FindConfig<OrderTransactionDTO>,
    sharedContext?: Context
  ): Promise<OrderTransactionDTO[]>

  createOrderTransaction(
    orderTransaction: CreateOrderTransactionDTO,
    sharedContext?: Context
  ): Promise<OrderTransactionDTO>
  createOrderTransaction(
    orderTransaction: CreateOrderTransactionDTO[],
    sharedContext?: Context
  ): Promise<OrderTransactionDTO[]>

  updateOrderTransaction(
    id: string,
    orderTransaction: UpdateOrderTransactionDTO,
    sharedContext?: Context
  ): Promise<OrderTransactionDTO>
  updateOrderTransaction(
    id: string,
    orderTransaction: UpdateOrderTransactionDTO[],
    sharedContext?: Context
  ): Promise<OrderTransactionDTO[]>

  softDeleteTransaction<TReturnableLinkableKeys extends string = string>(
    serviceZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restoreTransaction<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
