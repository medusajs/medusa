import {
  Context,
  DAL,
  FindConfig,
  ICustomerModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  CustomerTypes,
  SoftDeleteReturn,
  RestoreReturn,
  CustomerUpdatableFields,
} from "@medusajs/types"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  mapObjectTo,
  isString,
  isObject,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
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
    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerDTO[]
    >(customer, {
      populate: true,
    })
    return Array.isArray(dataOrArray) ? serialized : serialized[0]
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
    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerGroupDTO[]
    >(groups, {
      populate: true,
    })

    return Array.isArray(dataOrArrayOfData) ? serialized : serialized[0]
  }

  @InjectManager("baseRepository_")
  async retrieveCustomerGroup(
    groupId: string,
    config: FindConfig<CustomerTypes.CustomerGroupDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const group = await this.customerGroupService_.retrieve(
      groupId,
      config,
      sharedContext
    )
    return await this.baseRepository_.serialize<CustomerTypes.CustomerGroupDTO>(
      group,
      { populate: true }
    )
  }

  async updateCustomerGroup(
    groupId: string,
    data: CustomerTypes.CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO>
  async updateCustomerGroup(
    groupIds: string[],
    data: CustomerTypes.CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO[]>
  async updateCustomerGroup(
    selector: CustomerTypes.FilterableCustomerGroupProps,
    data: CustomerTypes.CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerGroupDTO[]>

  @InjectTransactionManager("baseRepository_")
  async updateCustomerGroup(
    groupIdOrSelector:
      | string
      | string[]
      | CustomerTypes.FilterableCustomerGroupProps,
    data: CustomerTypes.CustomerGroupUpdatableFields,
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

  deleteCustomerGroup(groupId: string, sharedContext?: Context): Promise<void>
  deleteCustomerGroup(
    groupIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteCustomerGroup(
    selector: CustomerTypes.FilterableCustomerGroupProps,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async deleteCustomerGroup(
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

  async addAddresses(
    addresses: CustomerTypes.CreateCustomerAddressDTO[],
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO[]>
  async addAddresses(
    address: CustomerTypes.CreateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO>

  @InjectTransactionManager("baseRepository_")
  async addAddresses(
    data:
      | CustomerTypes.CreateCustomerAddressDTO
      | CustomerTypes.CreateCustomerAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    CustomerTypes.CustomerAddressDTO | CustomerTypes.CustomerAddressDTO[]
  > {
    const addresses = await this.addressService_.create(
      Array.isArray(data) ? data : [data],
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerAddressDTO[]
    >(addresses, { populate: true })

    if (Array.isArray(data)) {
      return serialized
    }

    return serialized[0]
  }

  async updateAddress(
    addressId: string,
    data: CustomerTypes.UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO>
  async updateAddress(
    addressIds: string[],
    data: CustomerTypes.UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO[]>
  async updateAddress(
    selector: CustomerTypes.FilterableCustomerAddressProps,
    data: CustomerTypes.UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerTypes.CustomerAddressDTO[]>

  @InjectTransactionManager("baseRepository_")
  async updateAddress(
    addressIdOrSelector:
      | string
      | string[]
      | CustomerTypes.FilterableCustomerAddressProps,
    data: CustomerTypes.UpdateCustomerAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let updateData: CustomerTypes.UpdateCustomerAddressDTO[] = []
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
      const ids = await this.addressService_.list(
        addressIdOrSelector,
        { select: ["id"] },
        sharedContext
      )
      updateData = ids.map(({ id }) => ({
        id,
        ...data,
      }))
    }

    const addresses = await this.addressService_.update(
      updateData,
      sharedContext
    )
    const serialized = await this.baseRepository_.serialize<
      CustomerTypes.CustomerAddressDTO[]
    >(addresses, { populate: true })

    if (isString(addressIdOrSelector)) {
      return serialized[0]
    }

    return serialized
  }

  @InjectManager("baseRepository_")
  async listAddresses(
    filters?: CustomerTypes.FilterableCustomerAddressProps,
    config?: FindConfig<CustomerTypes.CustomerAddressDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CustomerTypes.CustomerAddressDTO[]> {
    const addresses = await this.addressService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CustomerTypes.CustomerAddressDTO[]
    >(addresses, { populate: true })
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

  @InjectManager("baseRepository_")
  async listCustomerGroupRelations(
    filters?: CustomerTypes.FilterableCustomerGroupCustomerProps,
    config?: FindConfig<CustomerTypes.CustomerGroupCustomerDTO>,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const groupCustomers = await this.customerGroupCustomerService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CustomerTypes.CustomerGroupCustomerDTO[]
    >(groupCustomers, {
      populate: true,
    })
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

  @InjectTransactionManager("baseRepository_")
  async softDeleteCustomerGroup<
    TReturnableLinkableKeys extends string = string
  >(
    groupIds: string[],
    config: SoftDeleteReturn<TReturnableLinkableKeys> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const [_, cascadedEntitiesMap] =
      await this.customerGroupService_.softDelete(groupIds, sharedContext)
    return config.returnLinkableKeys
      ? mapObjectTo<Record<TReturnableLinkableKeys, string[]>>(
          cascadedEntitiesMap,
          entityNameToLinkableKeysMap,
          {
            pick: config.returnLinkableKeys,
          }
        )
      : void 0
  }

  @InjectTransactionManager("baseRepository_")
  async restoreCustomerGroup<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config: RestoreReturn<TReturnableLinkableKeys> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const [_, cascadedEntitiesMap] = await this.customerGroupService_.restore(
      groupIds,
      sharedContext
    )
    return config.returnLinkableKeys
      ? mapObjectTo<Record<TReturnableLinkableKeys, string[]>>(
          cascadedEntitiesMap,
          entityNameToLinkableKeysMap,
          {
            pick: config.returnLinkableKeys,
          }
        )
      : void 0
  }

  @InjectTransactionManager("baseRepository_")
  async softDelete<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config: SoftDeleteReturn<TReturnableLinkableKeys> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const [_, cascadedEntitiesMap] = await this.customerService_.softDelete(
      customerIds,
      sharedContext
    )

    return config.returnLinkableKeys
      ? mapObjectTo<Record<TReturnableLinkableKeys, string[]>>(
          cascadedEntitiesMap,
          entityNameToLinkableKeysMap,
          {
            pick: config.returnLinkableKeys,
          }
        )
      : void 0
  }

  @InjectTransactionManager("baseRepository_")
  async restore<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config: RestoreReturn<TReturnableLinkableKeys> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const [_, cascadedEntitiesMap] = await this.customerService_.restore(
      customerIds,
      sharedContext
    )

    return config.returnLinkableKeys
      ? mapObjectTo<Record<TReturnableLinkableKeys, string[]>>(
          cascadedEntitiesMap,
          entityNameToLinkableKeysMap,
          {
            pick: config.returnLinkableKeys,
          }
        )
      : void 0
  }
}
