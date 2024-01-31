import {
  CreateCustomerAddressDTO,
  CreateCustomerDTO,
  CreateCustomerGroupDTO,
  CustomerGroupUpdatableFields,
  CustomerUpdatableFields,
  UpdateCustomerAddressDTO,
} from "./mutations"
import {
  CustomerAddressDTO,
  CustomerDTO,
  CustomerGroupCustomerDTO,
  CustomerGroupDTO,
  FilterableCustomerAddressProps,
  FilterableCustomerGroupCustomerProps,
  FilterableCustomerGroupProps,
  FilterableCustomerProps,
  GroupCustomerPair,
} from "./common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"

export interface ICustomerModuleService extends IModuleService {
  retrieve(
    customerId: string,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO>

  create(
    data: CreateCustomerDTO[],
    sharedContext?: Context
  ): Promise<CustomerDTO[]>
  create(data: CreateCustomerDTO, sharedContext?: Context): Promise<CustomerDTO>

  update(
    customerId: string,
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO>
  update(
    customerIds: string[],
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>
  update(
    selector: FilterableCustomerProps,
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  delete(customerId: string, sharedContext?: Context): Promise<void>
  delete(customerIds: string[], sharedContext?: Context): Promise<void>
  delete(
    selector: FilterableCustomerProps,
    sharedContext?: Context
  ): Promise<void>

  createCustomerGroup(
    data: CreateCustomerGroupDTO[],
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  createCustomerGroup(
    data: CreateCustomerGroupDTO,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  retrieveCustomerGroup(
    groupId: string,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  updateCustomerGroup(
    groupId: string,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>
  updateCustomerGroup(
    groupIds: string[],
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>
  updateCustomerGroup(
    selector: FilterableCustomerGroupProps,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  deleteCustomerGroup(groupId: string, sharedContext?: Context): Promise<void>
  deleteCustomerGroup(
    groupIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteCustomerGroup(
    selector: FilterableCustomerGroupProps,
    sharedContext?: Context
  ): Promise<void>

  addCustomerToGroup(
    groupCustomerPair: GroupCustomerPair,
    sharedContext?: Context
  ): Promise<{ id: string }>

  addCustomerToGroup(
    groupCustomerPairs: GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<{ id: string }[]>

  removeCustomerFromGroup(
    groupCustomerPair: GroupCustomerPair,
    sharedContext?: Context
  ): Promise<void>
  removeCustomerFromGroup(
    groupCustomerPairs: GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<void>

  addAddresses(
    addresses: CreateCustomerAddressDTO[],
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>
  addAddresses(
    address: CreateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO>

  updateAddress(
    addressId: string,
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO>
  updateAddress(
    addressIds: string[],
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>
  updateAddress(
    selector: FilterableCustomerAddressProps,
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  listAddresses(
    filters?: FilterableCustomerAddressProps,
    config?: FindConfig<CustomerAddressDTO>,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  listCustomerGroupRelations(
    filters?: FilterableCustomerGroupCustomerProps,
    config?: FindConfig<CustomerGroupCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupCustomerDTO[]>

  list(
    filters?: FilterableCustomerProps,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  listAndCount(
    filters?: FilterableCustomerProps,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<[CustomerDTO[], number]>

  listCustomerGroups(
    filters?: FilterableCustomerGroupProps,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  listAndCountCustomerGroups(
    filters?: FilterableCustomerGroupProps,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<[CustomerGroupDTO[], number]>

  softDelete<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  softDeleteCustomerGroup<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  restoreCustomerGroup<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}
