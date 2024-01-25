import {
  Context,
  CustomerDTO,
  CustomerTypes,
  DAL,
  ICustomerModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"

import {
  InjectTransactionManager,
  isObject,
  isString,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import {
  IAddressService,
  ICustomerGroupCustomerService,
  ICustomerGroupService,
  ICustomerService,
} from "@types"
import {
  Address,
  Customer,
  CustomerGroup,
  CustomerGroupCustomer,
} from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  customerService: ICustomerService<any>
  addressService: IAddressService<any>
  customerGroupService: ICustomerGroupService<any>
  customerGroupCustomerService: ICustomerGroupCustomerService<any>
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
  protected customerService_: ICustomerService<TCustomer>
  protected addressService_: IAddressService<TAddress>
  protected customerGroupService_: ICustomerGroupService<TCustomerGroup>
  protected customerGroupCustomerService_: ICustomerGroupCustomerService<TCustomerGroupCustomer>

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
    const data = Array.isArray(dataOrArray) ? dataOrArray : [dataOrArray]
    const customer = await this.customerService_.create(data, sharedContext)
    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerDTO[]
    >(customer, {
      populate: true,
    })
    return Array.isArray(dataOrArray) ? serialized : serialized[0]
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
    let updateData: CustomerTypes.UpdateCustomerDTO[] = []
    if (isString(idsOrSelector)) {
      updateData = [
        {
          id: idsOrSelector,
          ...data,
        },
      ]
    } else if (Array.isArray(idsOrSelector)) {
      updateData = idsOrSelector.map((id) => ({
        id,
        ...data,
      }))
    } else {
      const ids = await this.customerService_.list(
        idsOrSelector,
        { select: ["id"] },
        sharedContext
      )
      updateData = ids.map(({ id }) => ({
        id,
        ...data,
      }))
    }

    const customers = await this.customerService_.update(
      updateData,
      sharedContext
    )
    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerDTO[]
    >(customers, {
      populate: true,
    })

    return isString(idsOrSelector) ? serialized[0] : serialized
  }

  delete(customerId: string, sharedContext?: Context): Promise<void>
  delete(customerIds: string[], sharedContext?: Context): Promise<void>
  delete(
    selector: CustomerTypes.FilterableCustomerProps,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async delete(
    idsOrSelector: string | string[] | CustomerTypes.FilterableCustomerProps,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let toDelete = Array.isArray(idsOrSelector)
      ? idsOrSelector
      : [idsOrSelector as string]
    if (isObject(idsOrSelector)) {
      const ids = await this.customerService_.list(
        idsOrSelector,
        {
          select: ["id"],
        },
        sharedContext
      )
      toDelete = ids.map(({ id }) => id)
    }

    return await this.customerService_.delete(toDelete, sharedContext)
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
    const data = Array.isArray(dataOrArrayOfData)
      ? dataOrArrayOfData
      : [dataOrArrayOfData]

    const groups = await this.customerGroupService_.create(data, sharedContext)
    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerGroupDTO[]
    >(groups, {
      populate: true,
    })

    return Array.isArray(dataOrArrayOfData) ? serialized : serialized[0]
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
    let updateData: CustomerTypes.UpdateCustomerGroupDTO[] = []
    if (isString(groupIdOrSelector)) {
      updateData = [
        {
          id: groupIdOrSelector,
          ...data,
        },
      ]
    } else if (Array.isArray(groupIdOrSelector)) {
      updateData = groupIdOrSelector.map((id) => ({
        id,
        ...data,
      }))
    } else {
      const ids = await this.customerGroupService_.list(
        groupIdOrSelector,
        { select: ["id"] },
        sharedContext
      )
      updateData = ids.map(({ id }) => ({
        id,
        ...data,
      }))
    }

    const groups = await this.customerGroupService_.update(
      updateData,
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

  // @ts-ignore
  deleteCustomerGroups(groupId: string, sharedContext?: Context): Promise<void>
  // @ts-ignore
  deleteCustomerGroups(
    groupIds: string[],
    sharedContext?: Context
  ): Promise<void>
  // @ts-ignore
  deleteCustomerGroups(
    selector: CustomerTypes.FilterableCustomerGroupProps,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  // @ts-ignore
  async deleteCustomerGroups(
    groupIdOrSelector:
      | string
      | string[]
      | CustomerTypes.FilterableCustomerGroupProps,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let toDelete = Array.isArray(groupIdOrSelector)
      ? groupIdOrSelector
      : [groupIdOrSelector as string]

    if (isObject(groupIdOrSelector)) {
      const ids = await this.customerGroupService_.list(
        groupIdOrSelector,
        { select: ["id"] },
        sharedContext
      )
      toDelete = ids.map(({ id }) => id)
    }

    return await this.customerGroupService_.delete(toDelete, sharedContext)
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
      Array.isArray(data) ? data : [data],
      sharedContext
    )

    if (Array.isArray(data)) {
      return groupCustomers.map((gc) => ({ id: gc.id }))
    }

    return { id: groupCustomers[0].id }
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
