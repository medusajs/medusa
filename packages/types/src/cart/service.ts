import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CartAddressDTO,
  CartDTO,
  CartLineItemDTO,
  CartShippingMethodDTO,
  FilterableAddressProps,
  FilterableCartProps,
} from "./common"
import {
  AddLineItemsDTO,
  AddShippingMethodsDTO,
  CreateAddressDTO,
  CreateCartDTO,
  CreateLineItemDTO,
  CreateShippingMethodDTO,
  UpdateAddressDTO,
  UpdateCartDTO,
  UpdateLineItemDTO,
  UpdateLineItemsDTO,
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

  update(data: UpdateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>

  delete(cartIds: string[], sharedContext?: Context): Promise<void>

  listAddresses(
    filters?: FilterableAddressProps,
    config?: FindConfig<CartAddressDTO>,
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  createAddresses(
    data: CreateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  updateAddresses(
    data: UpdateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  deleteAddresses(ids: string[], sharedContext?: Context): Promise<void>

  addLineItems(
    data: AddLineItemsDTO,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>
  addLineItems(
    data: AddLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>
  addLineItems(
    cartId: string,
    items: CreateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>

  updateLineItems(
    data: UpdateLineItemsDTO,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>
  updateLineItems(
    data: UpdateLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>
  updateLineItems(
    cartId: string,
    data: UpdateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>

  removeLineItems(itemIds: string[], sharedContext?: Context): Promise<void>
  removeLineItems(itemIds: string, sharedContext?: Context): Promise<void>

  addShippingMethod(
    data: AddShippingMethodsDTO,
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>
  addShippingMethod(
    data: AddShippingMethodsDTO[],
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>
  addShippingMethod(
    cartId: string,
    items: CreateShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>
}
