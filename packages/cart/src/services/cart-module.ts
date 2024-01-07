import {
  AddressDTO,
  CartDTO,
  Context,
  CreateCartDTO,
  DAL,
  FilterableCartProps,
  FindConfig,
  ICartModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  UpdateCartDTO,
} from "@medusajs/types"

import { FilterableAddressProps } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import { CreateAddressDTO, UpdateAddressDTO } from "@types"
import { joinerConfig } from "../joiner-config"
import AddressService from "./address"
import CartService from "./cart"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  cartService: CartService
  addressService: AddressService
}

export default class CartModuleService implements ICartModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected cartService_: CartService
  protected addressService_: AddressService

  constructor(
    { baseRepository, cartService, addressService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.cartService_ = cartService
    this.addressService_ = addressService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config: FindConfig<CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartDTO> {
    const cart = await this.cartService_.retrieve(id, config, sharedContext)

    return await this.baseRepository_.serialize<CartDTO>(cart, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async list(
    filters: FilterableCartProps = {},
    config: FindConfig<CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartDTO[]> {
    const carts = await this.cartService_.list(filters, config, sharedContext)

    return await this.baseRepository_.serialize<CartDTO[]>(carts, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: FilterableCartProps = {},
    config: FindConfig<CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[CartDTO[], number]> {
    const [carts, count] = await this.cartService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<CartDTO[]>(carts, {
        populate: true,
      }),
      count,
    ]
  }

  async create(
    data: CreateCartDTO[],
    sharedContext?: Context
  ): Promise<CartDTO[]>

  async create(data: CreateCartDTO, sharedContext?: Context): Promise<CartDTO>

  @InjectManager("baseRepository_")
  async create(
    data: CreateCartDTO[] | CreateCartDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartDTO[] | CartDTO> {
    const input = Array.isArray(data) ? data : [data]

    const carts = await this.create_(input, sharedContext)

    const result = await this.list(
      { id: carts.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as CartDTO | CartDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: CreateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.cartService_.create(data, sharedContext)
  }

  async update(
    data: UpdateCartDTO[],
    sharedContext?: Context
  ): Promise<CartDTO[]>

  async update(data: UpdateCartDTO, sharedContext?: Context): Promise<CartDTO>

  @InjectManager("baseRepository_")
  async update(
    data: UpdateCartDTO[] | UpdateCartDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartDTO[] | CartDTO> {
    const input = Array.isArray(data) ? data : [data]
    const carts = await this.update_(input, sharedContext)

    const result = await this.list(
      { id: carts.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as CartDTO | CartDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.cartService_.update(data, sharedContext)
  }

  async delete(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  async delete(
    ids: string,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async delete(
    ids: string[] | string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const cartIds = Array.isArray(ids) ? ids : [ids]
    await this.cartService_.delete(cartIds, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async listAddresses(
    filters: FilterableAddressProps = {},
    config: FindConfig<AddressDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const addresses = await this.addressService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<AddressDTO[]>(addresses, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async createAddresses(
    data: CreateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const addresses = await this.addressService_.create(data, sharedContext)

    return await this.listAddresses(
      { id: addresses.map((p) => p!.id) },
      {},
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async updateAddresses(
    data: UpdateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const addresses = await this.addressService_.update(data, sharedContext)

    return await this.listAddresses(
      { id: addresses.map((p) => p!.id) },
      {},
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async deleteAddresses(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    await this.addressService_.delete(ids, sharedContext)
  }
}
