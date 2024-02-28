import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CartAddressDTO,
  CartDTO,
  CartLineItemDTO,
  CartShippingMethodDTO,
  FilterableAddressProps,
  FilterableCartProps,
  FilterableLineItemAdjustmentProps,
  FilterableLineItemProps,
  FilterableLineItemTaxLineProps,
  FilterableShippingMethodAdjustmentProps,
  FilterableShippingMethodProps,
  FilterableShippingMethodTaxLineProps,
  LineItemAdjustmentDTO,
  LineItemTaxLineDTO,
  ShippingMethodAdjustmentDTO,
  ShippingMethodTaxLineDTO,
} from "./common"
import {
  CreateAddressDTO,
  CreateCartDTO,
  CreateLineItemAdjustmentDTO,
  CreateLineItemDTO,
  CreateLineItemForCartDTO,
  CreateLineItemTaxLineDTO,
  CreateShippingMethodAdjustmentDTO,
  CreateShippingMethodDTO,
  CreateShippingMethodForSingleCartDTO,
  CreateShippingMethodTaxLineDTO,
  UpdateAddressDTO,
  UpdateCartDTO,
  UpdateCartDataDTO,
  UpdateLineItemDTO,
  UpdateLineItemTaxLineDTO,
  UpdateLineItemWithSelectorDTO,
  UpdateShippingMethodAdjustmentDTO,
  UpdateShippingMethodTaxLineDTO,
  UpsertLineItemAdjustmentDTO,
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

  update(data: UpdateCartDTO[]): Promise<CartDTO[]>
  update(
    cartId: string,
    data: UpdateCartDataDTO,
    sharedContext?: Context
  ): Promise<CartDTO>
  update(
    selector: Partial<CartDTO>,
    data: UpdateCartDataDTO,
    sharedContext?: Context
  ): Promise<CartDTO[]>

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

  listShippingMethods(
    filters: FilterableShippingMethodProps,
    config: FindConfig<CartShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>

  addShippingMethods(
    data: CreateShippingMethodDTO
  ): Promise<CartShippingMethodDTO>
  addShippingMethods(
    data: CreateShippingMethodDTO[]
  ): Promise<CartShippingMethodDTO[]>
  addShippingMethods(
    cartId: string,
    methods: CreateShippingMethodForSingleCartDTO[],
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>

  listLineItemAdjustments(
    filters: FilterableLineItemAdjustmentProps,
    config?: FindConfig<LineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<LineItemAdjustmentDTO[]>

  addLineItemAdjustments(
    data: CreateLineItemAdjustmentDTO[]
  ): Promise<LineItemAdjustmentDTO[]>
  addLineItemAdjustments(
    data: CreateLineItemAdjustmentDTO
  ): Promise<LineItemAdjustmentDTO[]>
  addLineItemAdjustments(
    cartId: string,
    data: CreateLineItemAdjustmentDTO[]
  ): Promise<LineItemAdjustmentDTO[]>

  setLineItemAdjustments(
    cartId: string,
    data: UpsertLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<LineItemAdjustmentDTO[]>

  listShippingMethodAdjustments(
    filters: FilterableShippingMethodAdjustmentProps,
    config?: FindConfig<ShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<ShippingMethodAdjustmentDTO[]>

  addShippingMethodAdjustments(
    data: CreateShippingMethodAdjustmentDTO[]
  ): Promise<ShippingMethodAdjustmentDTO[]>
  addShippingMethodAdjustments(
    data: CreateShippingMethodAdjustmentDTO
  ): Promise<ShippingMethodAdjustmentDTO>
  addShippingMethodAdjustments(
    cartId: string,
    data: CreateShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<ShippingMethodAdjustmentDTO[]>

  setShippingMethodAdjustments(
    cartId: string,
    data: (
      | CreateShippingMethodAdjustmentDTO
      | UpdateShippingMethodAdjustmentDTO
    )[],
    sharedContext?: Context
  ): Promise<ShippingMethodAdjustmentDTO[]>

  listLineItemTaxLines(
    filters: FilterableLineItemTaxLineProps,
    config?: FindConfig<LineItemTaxLineDTO>,
    sharedContext?: Context
  ): Promise<LineItemTaxLineDTO[]>

  addLineItemTaxLines(
    taxLines: CreateLineItemTaxLineDTO[]
  ): Promise<LineItemTaxLineDTO[]>
  addLineItemTaxLines(
    taxLine: CreateLineItemTaxLineDTO
  ): Promise<LineItemTaxLineDTO>
  addLineItemTaxLines(
    cartId: string,
    taxLines: CreateLineItemTaxLineDTO[] | CreateLineItemTaxLineDTO,
    sharedContext?: Context
  ): Promise<LineItemTaxLineDTO[]>

  setLineItemTaxLines(
    cartId: string,
    taxLines: (CreateLineItemTaxLineDTO | UpdateLineItemTaxLineDTO)[],
    sharedContext?: Context
  ): Promise<LineItemTaxLineDTO[]>

  listShippingMethodTaxLines(
    filters: FilterableShippingMethodTaxLineProps,
    config?: FindConfig<ShippingMethodTaxLineDTO>,
    sharedContext?: Context
  ): Promise<ShippingMethodTaxLineDTO[]>

  addShippingMethodTaxLines(
    taxLines: CreateShippingMethodTaxLineDTO[]
  ): Promise<ShippingMethodTaxLineDTO[]>
  addShippingMethodTaxLines(
    taxLine: CreateShippingMethodTaxLineDTO
  ): Promise<ShippingMethodTaxLineDTO>
  addShippingMethodTaxLines(
    cartId: string,
    taxLines: CreateShippingMethodTaxLineDTO[] | CreateShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<ShippingMethodTaxLineDTO[]>

  setShippingMethodTaxLines(
    cartId: string,
    taxLines: (
      | CreateShippingMethodTaxLineDTO
      | UpdateShippingMethodTaxLineDTO
    )[],
    sharedContext?: Context
  ): Promise<ShippingMethodTaxLineDTO[]>

  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>
  deleteLineItems(ids: string[], sharedContext?: Context): Promise<void>
  deleteLineItems(id: string, sharedContext?: Context): Promise<void>
  deleteShippingMethods(ids: string[], sharedContext?: Context): Promise<void>
  deleteShippingMethods(id: string, sharedContext?: Context): Promise<void>
  deleteLineItemAdjustments(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteLineItemAdjustments(id: string, sharedContext?: Context): Promise<void>
  deleteShippingMethodAdjustments(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethodAdjustments(
    id: string,
    sharedContext?: Context
  ): Promise<void>
  deleteLineItemTaxLines(ids: string[], sharedContext?: Context): Promise<void>
  deleteLineItemTaxLines(id: string, sharedContext?: Context): Promise<void>
  deleteShippingMethodTaxLines(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteShippingMethodTaxLines(
    id: string,
    sharedContext?: Context
  ): Promise<void>

  softDelete<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
  restore<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

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
