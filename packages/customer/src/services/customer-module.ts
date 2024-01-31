import {
  Context,
  CustomerDTO,
  CustomerTypes,
  DAL,
  ICustomerModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"

import {
  InjectTransactionManager,
  isString,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import {
  Address,
  Customer,
  CustomerGroup,
  CustomerGroupCustomer,
} from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  customerService: ModulesSdkTypes.InternalModuleService<any>
  addressService: ModulesSdkTypes.InternalModuleService<any>
  customerGroupService: ModulesSdkTypes.InternalModuleService<any>
  customerGroupCustomerService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [Address, CustomerGroup, CustomerGroupCustomer]

export default class CustomerModuleService<
    TAddress extends Address = Address,
    TCustomer extends Customer = Customer,
    TCustomerGroup extends CustomerGroup = CustomerGroup,
    TCustomerGroupCustomer extends CustomerGroupCustomer = CustomerGroupCustomer
  >
  // TODO seb I let you manage that when you are moving forward
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    CustomerDTO,
    {
      Address: { dto: any }
      CustomerGroup: { dto: any }
      CustomerGroupCustomer: { dto: any }
    }
  >(Customer, generateMethodForModels, entityNameToLinkableKeysMap)
  implements ICustomerModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected customerService_: ModulesSdkTypes.InternalModuleService<TCustomer>
  protected addressService_: ModulesSdkTypes.InternalModuleService<TAddress>
  protected customerGroupService_: ModulesSdkTypes.InternalModuleService<TCustomerGroup>
  protected customerGroupCustomerService_: ModulesSdkTypes.InternalModuleService<TCustomerGroupCustomer>

  constructor(
    {
      baseRepository,
      customerService,
      addressService,
      customerGroupService,
      customerGroupCustomerService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.customerService_ = customerService
    this.addressService_ = addressService
    this.customerGroupService_ = customerGroupService
    this.customerGroupCustomerService_ = customerGroupCustomerService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async create(
    data: CustomerTypes.CreateCustomerDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO>

  async create(
    data: CustomerTypes.CreateCustomerDTO[],
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO[]>

  @InjectTransactionManager("baseRepository_")
  async create(
    dataOrArray:
      | CustomerTypes.CreateCustomerDTO
      | CustomerTypes.CreateCustomerDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const customer = await this.customerService_.create(
      dataOrArray,
      sharedContext
    )
    return await this.baseRepository_.serialize<
      CustomerTypes.CustomerDTO | CustomerTypes.CustomerDTO[]
    >(customer, {
      populate: true,
    })
  }

  update(
    customerId: string,
    data: Partial<CustomerTypes.CreateCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO>
  update(
    customerIds: string[],
    data: Partial<CustomerTypes.CreateCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO[]>
  update(
    selector: CustomerTypes.FilterableCustomerProps,
    data: Partial<CustomerTypes.CreateCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO[]>

  @InjectTransactionManager("baseRepository_")
  async update(
    idsOrSelector: string | string[] | CustomerTypes.FilterableCustomerProps,
    data: Partial<CustomerTypes.CreateCustomerDTO>,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let updateData:
      | CustomerTypes.UpdateCustomerDTO
      | CustomerTypes.UpdateCustomerDTO[]
      | {
          selector: CustomerTypes.FilterableCustomerProps
          data: Partial<CustomerTypes.CreateCustomerDTO>
        } = []

    if (isString(idsOrSelector)) {
      updateData = {
        id: idsOrSelector,
        ...data,
      }
    } else if (Array.isArray(idsOrSelector)) {
      updateData = idsOrSelector.map((id) => ({
        id,
        ...data,
      }))
    } else {
      updateData = {
        selector: idsOrSelector as CustomerTypes.FilterableCustomerProps,
        data,
      }
    }

    const customers = await this.customerService_.update(
      updateData,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerDTO | CustomerTypes.CustomerDTO[]
    >(customers, {
      populate: true,
    })

    return isString(idsOrSelector) ? serialized[0] : serialized
  }

  async createCustomerGroup(
    dataOrArrayOfData: CustomerTypes.CreateCustomerGroupDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO>

  async createCustomerGroup(
    dataOrArrayOfData: CustomerTypes.CreateCustomerGroupDTO[],
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createCustomerGroup(
    dataOrArrayOfData:
      | CustomerTypes.CreateCustomerGroupDTO
      | CustomerTypes.CreateCustomerGroupDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const groups = await this.customerGroupService_.create(
      dataOrArrayOfData,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CustomerTypes.CustomerGroupDTO | CustomerTypes.CustomerGroupDTO[]
    >(groups, {
      populate: true,
    })
  }

  async updateCustomerGroup(
    groupId: string,
    data: Partial<CustomerTypes.CreateCustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO>
  async updateCustomerGroup(
    groupIds: string[],
    data: Partial<CustomerTypes.CreateCustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO[]>
  async updateCustomerGroup(
    selector: CustomerTypes.FilterableCustomerGroupProps,
    data: Partial<CustomerTypes.CreateCustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO[]>

  @InjectTransactionManager("baseRepository_")
  async updateCustomerGroup(
    groupIdOrSelector:
      | string
      | string[]
      | CustomerTypes.FilterableCustomerGroupProps,
    data: Partial<CustomerTypes.CreateCustomerGroupDTO>,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const groups = await this.customerGroupService_.update(
      groupIdOrSelector,
      sharedContext
    )

    if (isString(groupIdOrSelector)) {
      return await this.baseRepository_.serialize<CustomerTypes.CustomerGroupDTO>(
        groups[0],
        { populate: true }
      )
    }

    return await this.baseRepository_.serialize<
      CustomerTypes.CustomerGroupDTO[]
    >(groups, { populate: true })
  }

  async addCustomerToGroup(
    groupCustomerPair: CustomerTypes.GroupCustomerPair,
    sharedContext?: Context
  ): Promise<{ id: string }>

  async addCustomerToGroup(
    groupCustomerPairs: CustomerTypes.GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<{ id: string }[]>

  @InjectTransactionManager("baseRepository_")
  async addCustomerToGroup(
    data: CustomerTypes.GroupCustomerPair | CustomerTypes.GroupCustomerPair[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ id: string } | { id: string }[]> {
    const groupCustomers = await this.customerGroupCustomerService_.create(
      data,
      sharedContext
    )

    if (Array.isArray(data)) {
      return (groupCustomers as unknown as TCustomerGroupCustomer[]).map(
        (gc) => ({ id: gc.id })
      )
    }

    return { id: groupCustomers.id }
  }

  async removeCustomerFromGroup(
    groupCustomerPair: CustomerTypes.GroupCustomerPair,
    sharedContext?: Context
  ): Promise<void>
  async removeCustomerFromGroup(
    groupCustomerPairs: CustomerTypes.GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async removeCustomerFromGroup(
    data: CustomerTypes.GroupCustomerPair | CustomerTypes.GroupCustomerPair[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const pairs = Array.isArray(data) ? data : [data]
    const groupCustomers = await this.customerGroupCustomerService_.list({
      $or: pairs,
    })
    await this.customerGroupCustomerService_.delete(
      groupCustomers.map((gc) => gc.id),
      sharedContext
    )
  }
}
