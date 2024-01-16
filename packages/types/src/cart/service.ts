<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
<<<<<<< HEAD
  CartAddressDTO,
  CartDTO,
  CartLineItemDTO,
  FilterableAddressProps,
  FilterableCartProps,
} from "./common"
import {
<<<<<<< HEAD
=======
  AddLineItemsDTO,
>>>>>>> 7faf1fb55 (wrap up sms)
  CreateAddressDTO,
  CreateCartDTO,
  CreateLineItemDTO,
  CreateLineItemForCartDTO,
  UpdateAddressDTO,
  UpdateCartDTO,
  UpdateLineItemDTO,
  UpdateLineItemWithSelectorDTO,
=======
  CartAddressDTO, CartDTO, CartLineItemDTO,
  FilterableAddressProps, FilterableCartProps
} from "./common"
import {
  AddLineItemsDTO,
  CreateAddressDTO, CreateCartDTO, CreateLineItemDTO,
  UpdateAddressDTO, UpdateCartDTO, UpdateLineItemDTO,
  UpdateLineItemsDTO
>>>>>>> 120458bf0 (items ops)
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
<<<<<<< HEAD
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

  addLineItems(data: CreateLineItemForCartDTO): Promise<CartLineItemDTO>
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
=======
import { IModuleService } from "../modules-sdk";

export interface ICartModuleService extends IModuleService {
>>>>>>> ef0dd4bf9 (feat: Add CartModule foundation)
=======
=======
import { AddressDTO } from "../address"
>>>>>>> 6981f30a3 (add address methods)
=======
>>>>>>> 680c27509 (updateLineItems (missing tests))
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CartAddressDTO,
  CartDTO,
  CartLineItemDTO,
  CartShippingMethodDTO,
  FilterableAddressProps,
  FilterableCartProps
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
  create(data: CreateCartDTO, sharedContext?: Context): Promise<CartDTO>

  update(data: UpdateCartDTO[], sharedContext?: Context): Promise<CartDTO[]>
  update(data: UpdateCartDTO, sharedContext?: Context): Promise<CartDTO>

  delete(cartIds: string[], sharedContext?: Context): Promise<void>
  delete(cartId: string, sharedContext?: Context): Promise<void>

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  // addLineItems(cartId: string, lineItems: CreateLineItemDTO)
  // addLineItems(cartId: string, lineItems: CreateLineItemDTO[])
  // updateLineItem(cartId: string, lineItems: UpdateCartDTO)
  // updateLineItem(cartId: string, lineItems: UpdateCartDTO[])
  // removeLineItems(cartId: string, lineItems: string)
  // removeLineItems(cartId: string, lineItems: string[])
>>>>>>> 989965c08 (interface work)
=======
import { IModuleService } from "../modules-sdk";

export interface ICartModuleService extends IModuleService {
>>>>>>> 07289e991 (feat: Add CartModule foundation)
=======
  addLineItems(data: AddLineItemsDTO, sharedContext?: Context): Promise<CartDTO>
  addLineItems(
    data: AddLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartDTO[]>

  updateLineItems(
    data: UpdateLineItemsDTO,
    sharedContext?: Context
  ): Promise<CartDTO>
  updateLineItems(
    data: UpdateLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartDTO[]>

  removeLineItems(lineItemIds: string[], sharedContext?: Context): Promise<void>
>>>>>>> da96548a8 (module interface + DTOs)
=======
=======
  listAddresses(
    filters?: FilterableAddressProps,
    config?: FindConfig<CartAddressDTO>,
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  createAddresses(
    data: CreateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>
=======
>>>>>>> 120458bf0 (items ops)

  updateAddresses(
    data: UpdateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  deleteAddresses(ids: string[], sharedContext?: Context): Promise<void>

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 6981f30a3 (add address methods)
  // addLineItems(data: AddLineItemsDTO, sharedContext?: Context): Promise<CartDTO>
  // addLineItems(
  //   data: AddLineItemsDTO[],
  //   sharedContext?: Context
  // ): Promise<CartDTO[]>
=======
=======
>>>>>>> 120458bf0 (items ops)
  addLineItems(
    data: AddLineItemsDTO,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>
  addLineItems(
    data: AddLineItemsDTO[],
    sharedContext?: Context
<<<<<<< HEAD
<<<<<<< HEAD
  ): Promise<CartDTO[]>
<<<<<<< HEAD
>>>>>>> 4b5834eed (wip)
=======
=======
  ): Promise<CartLineItemDTO[]>
>>>>>>> 7912f8f5e (first iteration on line items)
=======
  ): Promise<CartLineItemDTO[]>
>>>>>>> 120458bf0 (items ops)
  addLineItems(
    cartId: string,
    items: CreateLineItemDTO[],
    sharedContext?: Context
<<<<<<< HEAD
<<<<<<< HEAD
  ): Promise<CartDTO[]>
>>>>>>> a714d937d (wip)
=======
  ): Promise<CartLineItemDTO[]>
>>>>>>> 7912f8f5e (first iteration on line items)
=======
  ): Promise<CartLineItemDTO[]>
>>>>>>> 120458bf0 (items ops)

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

<<<<<<< HEAD
<<<<<<< HEAD
  // removeLineItems(lineItemIds: string[], sharedContext?: Context): Promise<void>
>>>>>>> ae586e7c8 (CRUD)
=======
  removeLineItems(itemIds: string[], sharedContext?: Context): Promise<void>
  removeLineItems(itemIds: string, sharedContext?: Context): Promise<void>
<<<<<<< HEAD
>>>>>>> a2050618f (removeLineItems)
=======

  addShippingMethods(
    data: CreateShippingMethodDTO,
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO>
  addShippingMethods(
    data: CreateShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>
  addShippingMethods(
    cartId: string,
    methods: CreateShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>
<<<<<<< HEAD
>>>>>>> 533d519d7 (shipping methods)
=======
  removeLineItems(itemIds: string[], sharedContext?: Context): Promise<void>
  removeLineItems(itemIds: string, sharedContext?: Context): Promise<void>
>>>>>>> 120458bf0 (items ops)
=======

  removeShippingMethods(
    methodIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethods(
    methodIds: string,
    sharedContext?: Context
  ): Promise<void>
<<<<<<< HEAD
>>>>>>> f68f88cb1 (finalize shipping methods)
=======
  removeShippingMethods(
    selector: Partial<CartShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<void>
>>>>>>> 7faf1fb55 (wrap up sms)
}
