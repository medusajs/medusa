import { AddressDTO } from "../address"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CartAddressDTO,
  CartDTO,
  FilterableAddressProps,
  FilterableCartProps,
  LineItemAdjustmentLineDTO
} from "./common"
import {
  AddLineItemAdjustmentsDTO,
  CreateAddressDTO,
  CreateCartDTO,
  UpdateAddressDTO,
  UpdateCartDTO
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
    config?: FindConfig<AddressDTO>,
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

  // addLineItems(data: AddLineItemsDTO, sharedContext?: Context): Promise<CartDTO>
  // addLineItems(
  //   data: AddLineItemsDTO[],
  //   sharedContext?: Context
  // ): Promise<CartDTO[]>

  // updateLineItems(
  //   data: UpdateLineItemsDTO,
  //   sharedContext?: Context
  // ): Promise<CartDTO>
  // updateLineItems(
  //   data: UpdateLineItemsDTO[],
  //   sharedContext?: Context
  // ): Promise<CartDTO[]>

  // removeLineItems(lineItemIds: string[], sharedContext?: Context): Promise<void>

  addLineItemAdjustments(
    data: AddLineItemAdjustmentsDTO[],
    sharedContext?: Context
  ): Promise<LineItemAdjustmentLineDTO[]>
  addLineItemAdjustments(
    data: AddLineItemAdjustmentsDTO,
    sharedContext?: Context
  ): Promise<LineItemAdjustmentLineDTO>

  // setLineItemAdjustments(
  //   data: CreateLineItemAdjustmentDTO[],
  //   sharedContext?: Context
  // ): Promise<LineItemAdjustmentLineDTO[]>
  // setLineItemAdjustments(
  //   data: CreateLineItemAdjustmentDTO,
  //   sharedContext?: Context
  // ): Promise<LineItemAdjustmentLineDTO>

  // removeLineItemAdjustments(
  //   adjustmentIds: string[],
  //   sharedContext?: Context
  // ): Promise<void>
  // removeLineItemAdjustments(
  //   adjustmentIds: string,
  //   sharedContext?: Context
  // ): Promise<void>
}
