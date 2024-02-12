import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
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
import {
  CreateCustomerAddressDTO,
  CreateCustomerDTO,
  CreateCustomerGroupDTO,
  CustomerGroupUpdatableFields,
  CustomerUpdatableFields,
  UpdateCustomerAddressDTO,
} from "./mutations"

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

  // TODO should be pluralized
  createCustomerGroup(
    data: CreateCustomerGroupDTO[],
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  // TODO should be pluralized
  createCustomerGroup(
    data: CreateCustomerGroupDTO,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  retrieveCustomerGroup(
    groupId: string,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  updateCustomerGroups(
    groupId: string,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  updateCustomerGroups(
    groupIds: string[],
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  updateCustomerGroups(
    selector: FilterableCustomerGroupProps,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  deleteCustomerGroups(groupId: string, sharedContext?: Context): Promise<void>
  deleteCustomerGroups(
    groupIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteCustomerGroups(
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

  // TODO should be pluralized
  removeCustomerFromGroup(
    groupCustomerPair: GroupCustomerPair,
    sharedContext?: Context
  ): Promise<void>

  // TODO should be pluralized
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

  updateAddresses(
    addressId: string,
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO>
  updateAddresses(
    addressIds: string[],
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  updateAddresses(
    selector: FilterableCustomerAddressProps,
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  deleteAddresses(addressId: string, sharedContext?: Context): Promise<void>
  deleteAddresses(addressIds: string[], sharedContext?: Context): Promise<void>
  deleteAddresses(
    selector: FilterableCustomerAddressProps,
    sharedContext?: Context
  ): Promise<void>

  listAddresses(
    filters?: FilterableCustomerAddressProps,
    config?: FindConfig<CustomerAddressDTO>,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  listAndCountAddresses(
    filters?: FilterableCustomerAddressProps,
    config?: FindConfig<CustomerAddressDTO>,
    sharedContext?: Context
  ): Promise<[CustomerAddressDTO[], number]>

  listCustomerGroupCustomers(
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

  softDeleteCustomerGroups<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  restoreCustomerGroups<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}
