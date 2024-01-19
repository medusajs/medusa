import {
  Context,
  DAL,
  FindConfig,
  ICustomerModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  CustomerTypes,
} from "@medusajs/types"

import { InjectManager, MedusaContext } from "@medusajs/utils"
import { joinerConfig } from "../joiner-config"
import * as services from "../services"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  customerService: services.CustomerService
  addressService: services.AddressService
  customerGroupService: services.CustomerGroupService
}

export default class CustomerModuleService implements ICustomerModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected customerService_: services.CustomerService
  protected addressService_: services.AddressService
  protected customerGroupService_: services.CustomerGroupService

  constructor(
    {
      baseRepository,
      customerService,
      addressService,
      customerGroupService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.customerService_ = customerService
    this.addressService_ = addressService
    this.customerGroupService_ = customerGroupService
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

  @InjectManager("baseRepository_")
  async create(
    data: CustomerTypes.CreateCustomerDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CustomerTypes.CustomerDTO> {
    const [customer] = await this.customerService_.create([data], sharedContext)

    return await this.baseRepository_.serialize<CustomerTypes.CustomerDTO>(
      customer,
      {
        populate: true,
      }
    )
  }
}
