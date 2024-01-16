import {
  AddressDTO,
  CartAddressDTO,
  Context,
  DAL,
  FilterableAddressProps,
  FindConfig,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { Address } from "@models"
import { AddressRepository } from "../repositories/address"
import { CreateAddressDTO, UpdateAddressDTO } from "../types"

type InjectedDependencies = {
  addressRepository: DAL.RepositoryService
}

export default class AddressService<TEntity extends Address = Address> {
  protected readonly addressRepository_: DAL.RepositoryService

  constructor({ addressRepository }: InjectedDependencies) {
    this.addressRepository_ = addressRepository
  }

  @InjectManager("addressRepository_")
  async retrieve(
    id: string,
    config: FindConfig<AddressDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<Address, AddressDTO>({
      id: id,
      entityName: Address.name,
      repository: this.addressRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("addressRepository_")
  async list(
    filters: FilterableAddressProps = {},
    config: FindConfig<CartAddressDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Address>(filters, config)

    return (await this.addressRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("addressRepository_")
  async listAndCount(
    filters: FilterableAddressProps = {},
    config: FindConfig<AddressDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Address>(filters, config)

    return (await this.addressRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("addressRepository_")
  async create(
    data: CreateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.addressRepository_ as AddressRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("addressRepository_")
  async update(
    data: UpdateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const existingAddresses = await this.list(
      { id: data.map(({ id }) => id) },
      {},
      sharedContext
    )

    const existingAddressesMap = new Map(
      existingAddresses.map<[string, Address]>((addr) => [addr.id, addr])
    )

    const updates: UpdateAddressDTO[] = []

    for (const update of data) {
      const address = existingAddressesMap.get(update.id)

      if (!address) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Address with id "${update.id}" not found`
        )
      }

      updates.push({ ...update, id: address.id })
    }

    return (await (this.addressRepository_ as AddressRepository).update(
      updates,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("addressRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.addressRepository_.delete(ids, sharedContext)
  }
}
