import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CustomerDTO,
  CustomerGroupDTO,
  FilterableCustomerProps,
  FilterableCustomerGroupProps,
  GroupCustomerPair,
} from "./common"
import { CreateCustomerDTO, CreateCustomerGroupDTO } from "./mutations"

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
    data: Partial<CreateCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO>
  update(
    customerIds: string[],
    data: Partial<CreateCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>
  update(
    selector: FilterableCustomerProps,
    data: Partial<CreateCustomerDTO>,
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

  updateCustomerGroup(
    groupId: string,
    data: Partial<CreateCustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>
  updateCustomerGroup(
    groupIds: string[],
    data: Partial<CreateCustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>
  updateCustomerGroup(
    selector: FilterableCustomerGroupProps,
    data: Partial<CreateCustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  addCustomerToGroup(
    groupCustomerPair: GroupCustomerPair,
    sharedContext?: Context
  ): Promise<{ id: string }>

  addCustomerToGroup(
    groupCustomerPairs: GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<{ id: string }[]>

  removeCustomerFromGroup(
    groupCustomerPair: { customer_id: string; customer_group_id: string },
    sharedContext?: Context
  ): Promise<void>
  removeCustomerFromGroup(
    groupCustomerPairs: { customer_id: string; customer_group_id: string }[],
    sharedContext?: Context
  ): Promise<void>

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
}
