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
  InjectManager,
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
import { EntityManager } from "@mikro-orm/core"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  customerService: ModulesSdkTypes.InternalModuleService<any>
  addressService: ModulesSdkTypes.InternalModuleService<any>
  customerGroupService: ModulesSdkTypes.InternalModuleService<any>
  customerGroupCustomerService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [
  { model: Address, singular: "Address", plural: "Addresses" },
  CustomerGroup,
  CustomerGroupCustomer,
]

export default class CustomerModuleService<
    TAddress extends Address = Address,
    TCustomer extends Customer = Customer,
    TCustomerGroup extends CustomerGroup = CustomerGroup,
    TCustomerGroupCustomer extends CustomerGroupCustomer = CustomerGroupCustomer
  >
  extends ModulesSdkUtils.MedusaService<
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

  @InjectManager("baseRepository_")
  async create(
    dataOrArray:
      | CustomerTypes.CreateCustomerDTO
      | CustomerTypes.CreateCustomerDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CustomerTypes.CustomerDTO | CustomerTypes.CustomerDTO[]> {
    const customers = await this.create_(dataOrArray, sharedContext)

    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerDTO[]
    >(customers, {
      populate: true,
    })

    return Array.isArray(dataOrArray) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  async create_(
    dataOrArray:
      | CustomerTypes.CreateCustomerDTO
      | CustomerTypes.CreateCustomerDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CustomerTypes.CustomerDTO[]> {
    const data = Array.isArray(dataOrArray) ? dataOrArray : [dataOrArray]

    const customers = await this.customerService_.create(data, sharedContext)

    const addressDataWithCustomerIds = data
      .map(({ addresses }, i) => {
        if (!addresses) {
          return []
        }

        return addresses.map((address) => ({
          ...address,
          customer_id: customers[i].id,
        }))
      })
      .flat()

    await this.addAddresses(addressDataWithCustomerIds, sharedContext)

    return customers as unknown as CustomerTypes.CustomerDTO[]
  }

  update(
    customerId: string,
    data: CustomerTypes.CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO>
  update(
    customerIds: string[],
    data: CustomerTypes.CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO[]>
  update(
    selector: CustomerTypes.FilterableCustomerProps,
    data: CustomerTypes.CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerDTO[]>

  @InjectTransactionManager("baseRepository_")
  async update(
    idsOrSelector: string | string[] | CustomerTypes.FilterableCustomerProps,
    data: CustomerTypes.CustomerUpdatableFields,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let updateData:
      | CustomerTypes.UpdateCustomerDTO
      | CustomerTypes.UpdateCustomerDTO[]
      | {
          selector: CustomerTypes.FilterableCustomerProps
          data: CustomerTypes.CustomerUpdatableFields
        }

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
        selector: idsOrSelector,
        data: data,
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

  // @ts-ignore
  async updateCustomerGroups(
    groupId: string,
    data: CustomerTypes.CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO>
  async updateCustomerGroups(
    groupIds: string[],
    data: CustomerTypes.CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO[]>
  async updateCustomerGroups(
    selector: CustomerTypes.FilterableCustomerGroupProps,
    data: CustomerTypes.CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO[]>

  @InjectTransactionManager("baseRepository_")
  async updateCustomerGroups(
    groupIdOrSelector:
      | string
      | string[]
      | CustomerTypes.FilterableCustomerGroupProps,
    data: CustomerTypes.CustomerGroupUpdatableFields,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let updateData:
      | CustomerTypes.UpdateCustomerGroupDTO
      | CustomerTypes.UpdateCustomerGroupDTO[]
      | {
          selector: CustomerTypes.FilterableCustomerGroupProps
          data: CustomerTypes.CustomerGroupUpdatableFields
        }

    if (isString(groupIdOrSelector) || Array.isArray(groupIdOrSelector)) {
      const groupIdOrSelectorArray = Array.isArray(groupIdOrSelector)
        ? groupIdOrSelector
        : [groupIdOrSelector]
      updateData = groupIdOrSelectorArray.map((id) => ({
        id,
        ...data,
      }))
    } else {
      updateData = {
        selector: groupIdOrSelector,
        data: data,
      }
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

  // TODO: should be createAddresses to conform to the convention
  async addAddresses(
    addresses: CustomerTypes.CreateCustomerAddressDTO[],
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO[]>
  async addAddresses(
    address: CustomerTypes.CreateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO>

  @InjectManager("baseRepository_")
  async addAddresses(
    data:
      | CustomerTypes.CreateCustomerAddressDTO
      | CustomerTypes.CreateCustomerAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    CustomerTypes.CustomerAddressDTO | CustomerTypes.CustomerAddressDTO[]
  > {
    const addresses = await this.addAddresses_(data, sharedContext)

    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerAddressDTO[]
    >(addresses, { populate: true })

    if (Array.isArray(data)) {
      return serialized
    }

    return serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  private async addAddresses_(
    data:
      | CustomerTypes.CreateCustomerAddressDTO
      | CustomerTypes.CreateCustomerAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.create(
      Array.isArray(data) ? data : [data],
      sharedContext
    )
  }

  // @ts-ignore
  async updateAddresses(
    addressId: string,
    data: CustomerTypes.UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO>
  async updateAddresses(
    addressIds: string[],
    data: CustomerTypes.UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO[]>
  async updateAddresses(
    selector: CustomerTypes.FilterableCustomerAddressProps,
    data: CustomerTypes.UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO[]>

  @InjectTransactionManager("baseRepository_")
  async updateAddresses(
    addressIdOrSelector:
      | string
      | string[]
      | CustomerTypes.FilterableCustomerAddressProps,
    data: CustomerTypes.UpdateCustomerAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let updateData:
      | CustomerTypes.UpdateCustomerAddressDTO[]
      | {
          selector: CustomerTypes.FilterableCustomerAddressProps
          data: CustomerTypes.UpdateCustomerAddressDTO
        }
    if (isString(addressIdOrSelector)) {
      updateData = [
        {
          id: addressIdOrSelector,
          ...data,
        },
      ]
    } else if (Array.isArray(addressIdOrSelector)) {
      updateData = addressIdOrSelector.map((id) => ({
        id,
        ...data,
      }))
    } else {
      updateData = {
        selector: addressIdOrSelector,
        data,
      }
    }

    const addresses = await this.addressService_.update(
      updateData,
      sharedContext
    )

    await this.flush(sharedContext)

    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerAddressDTO[]
    >(addresses, { populate: true })

    if (isString(addressIdOrSelector)) {
      return serialized[0]
    }

    return serialized
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

  private async flush(context: Context) {
    const em = (context.manager ?? context.transactionManager) as EntityManager
    await em.flush()
  }
}
