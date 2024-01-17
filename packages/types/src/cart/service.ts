import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CartAddressDTO,
  CartDTO,
  CartLineItemDTO,
  FilterableAddressProps,
  FilterableCartProps,
  FilterableLineItemProps,
  LineItemAdjustmentLineDTO,
} from "./common"
import {
  CreateAddressDTO,
  CreateCartDTO,
  CreateLineItemAdjustmentDTO,
  CreateLineItemDTO,
  CreateLineItemForCartDTO,
  UpdateAddressDTO,
  UpdateCartDTO,
  UpdateLineItemAdjustmentDTO,
  UpdateLineItemDTO,
  UpdateLineItemWithSelectorDTO,
} from "./mutations"

export interface ICartModuleService extends IModuleService {
  retrieve(
    cartId: string,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO>

  list(
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO[]>

  listAndCount(
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<[CartDTO[], number]>

  create(data: CreateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>
  create(data: CreateCartDTO, sharedContext?: Context): Promise<CartDTO>

  update(data: UpdateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>
  update(data: UpdateCartDTO, sharedContext?: Context): Promise<CartDTO>

  delete(cartIds: string[], sharedContext?: Context): Promise<void>
  delete(cartId: string, sharedContext?: Context): Promise<void>

  listAddresses(
    filters?: FilterableAddressProps,
    config?: FindConfig<CartAddressDTO>,
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  createAddresses(
    data: CreateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>
  createAddresses(
    data: CreateAddressDTO,
    sharedContext?: Context
  ): Promise<CartAddressDTO>

  updateAddresses(
    data: UpdateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>
  updateAddresses(
    data: UpdateAddressDTO,
    sharedContext?: Context
  ): Promise<CartAddressDTO>

  deleteAddresses(ids: string[], sharedContext?: Context): Promise<void>
  deleteAddresses(ids: string, sharedContext?: Context): Promise<void>

  retrieveLineItem(
    itemId: string,
    config?: FindConfig<CartLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO>

  listLineItems(
    filters: FilterableLineItemProps,
    config?: FindConfig<CartLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>

  addLineItems(data: CreateLineItemForCartDTO): Promise<CartLineItemDTO[]>
  addLineItems(data: CreateLineItemForCartDTO[]): Promise<CartLineItemDTO[]>
  addLineItems(
    cartId: string,
    items: CreateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>

  updateLineItems(
    data: UpdateLineItemWithSelectorDTO[]
  ): Promise<CartLineItemDTO[]>
  updateLineItems(
    selector: Partial<CartLineItemDTO>,
    data: Partial<UpdateLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>
  updateLineItems(
    lineId: string,
    data: Partial<UpdateLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO>

  removeLineItems(itemIds: string[], sharedContext?: Context): Promise<void>
  removeLineItems(itemIds: string, sharedContext?: Context): Promise<void>
  removeLineItems(
    selector: Partial<CartLineItemDTO>,
    sharedContext?: Context
  ): Promise<void>

  addLineItemAdjustments(
    data: CreateLineItemAdjustmentDTO[]
  ): Promise<LineItemAdjustmentLineDTO[]>
  addLineItemAdjustments(
    data: CreateLineItemAdjustmentDTO
  ): Promise<LineItemAdjustmentLineDTO[]>
  addLineItemAdjustments(
    cartId: string,
    data: CreateLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<LineItemAdjustmentLineDTO[]>

  setLineItemAdjustments(
    cartId: string,
    data: (CreateLineItemAdjustmentDTO | UpdateLineItemAdjustmentDTO)[],
    sharedContext?: Context
  ): Promise<LineItemAdjustmentLineDTO[]>

  removeLineItemAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeLineItemAdjustments(
    adjustmentIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeLineItemAdjustments(
    selector: Partial<LineItemAdjustmentLineDTO>,
    sharedContext?: Context
  ): Promise<void>
}
