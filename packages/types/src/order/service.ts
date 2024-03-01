import { FindConfig } from "../common"
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
  CreateOrderAddressDTO,
  CreateOrderAdjustmentDTO,
  CreateOrderDTO,
  CreateOrderLineItemDTO,
  CreateOrderLineItemForOrderDTO,
  CreateOrderLineItemTaxLineDTO,
  CreateOrderShippingMethodAdjustmentDTO,
  CreateOrderShippingMethodDTO,
  CreateOrderShippingMethodTaxLineDTO,
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
    selector: Partial<OrderDTO>,
    data: UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderDTO[]>

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

  updateOrderItem(
    selector: Partial<OrderItemDTO>,
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

  addShippingMethods(
    data: CreateOrderShippingMethodDTO
  ): Promise<OrderShippingMethodDTO>
  addShippingMethods(
    data: CreateOrderShippingMethodDTO[]
  ): Promise<OrderShippingMethodDTO[]>
  addShippingMethods(
    orderId: string,
    methods: CreateOrderShippingMethodDTO[],
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
}
