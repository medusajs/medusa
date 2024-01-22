import {
  Context,
  DAL,
  FindConfig,
  ICustomerModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  CustomerTypes,
} from "@medusajs/types"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import { joinerConfig } from "../joiner-config"
import * as services from "../services"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  customerService: services.CustomerService
  addressService: services.AddressService
  customerGroupService: services.CustomerGroupService
  customerGroupCustomerService: services.CustomerGroupCustomerService
}

export default class CustomerModuleService implements ICustomerModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected customerService_: services.CustomerService
  protected addressService_: services.AddressService
  protected customerGroupService_: services.CustomerGroupService
  protected customerGroupCustomerService_: services.CustomerGroupCustomerService

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
    this.baseRepository_ = baseRepository
    this.customerService_ = customerService
    this.addressService_ = addressService
    this.customerGroupService_ = customerGroupService
    this.customerGroupCustomerService_ = customerGroupCustomerService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config: FindConfig<CustomerTypes.CustomerDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CustomerTypes.CustomerDTO> {
    const customer = await this.customerService_.retrieve(
      id,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CustomerTypes.CustomerDTO>(
      customer,
      {
        populate: true,
      }
    )
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

    if (Array.isArray(dataOrArray)) {
      return await this.baseRepository_.serialize<CustomerTypes.CustomerDTO[]>(
        customer,
        {
          populate: true,
        }
      )
    }

    return await this.baseRepository_.serialize<CustomerTypes.CustomerDTO>(
      customer[0],
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async list(
    filters: CustomerTypes.FilterableCustomerProps = {},
    config: FindConfig<CustomerTypes.CustomerDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const customers = await this.customerService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CustomerTypes.CustomerDTO[]>(
      customers,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: CustomerTypes.FilterableCustomerProps = {},
    config: FindConfig<CustomerTypes.CustomerDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[CustomerTypes.CustomerDTO[], number]> {
    const [customers, count] = await this.customerService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<CustomerTypes.CustomerDTO[]>(
        customers,
        {
          populate: true,
        }
      ),
      count,
    ]
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

    if (Array.isArray(dataOrArrayOfData)) {
      return await this.baseRepository_.serialize<
        CustomerTypes.CustomerGroupDTO[]
      >(groups, {
        populate: true,
      })
    }

    return await this.baseRepository_.serialize<CustomerTypes.CustomerGroupDTO>(
      groups[0],
      { populate: true }
    )
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

  @InjectManager("baseRepository_")
  async listCustomerGroups(
    filters: CustomerTypes.FilterableCustomerGroupProps = {},
    config: FindConfig<CustomerTypes.CustomerGroupDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const groups = await this.customerGroupService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CustomerTypes.CustomerGroupDTO[]
    >(groups, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountCustomerGroups(
    filters: CustomerTypes.FilterableCustomerGroupProps = {},
    config: FindConfig<CustomerTypes.CustomerGroupDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[CustomerTypes.CustomerGroupDTO[], number]> {
    const [groups, count] = await this.customerGroupService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<CustomerTypes.CustomerGroupDTO[]>(
        groups,
        {
          populate: true,
        }
      ),
      count,
    ]
  }
}
