import {
  AddressDTO,
  CartAddressDTO,
  CartDTO,
  CartTypes,
  Context,
  CreateCartDTO,
  DAL,
  FilterableCartProps,
  FindConfig,
  ICartModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  UpdateCartDTO
} from "@medusajs/types"

import { FilterableAddressProps } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  promiseAll,
} from "@medusajs/utils"
import { CreateAddressDTO, UpdateAddressDTO } from "@types"
import { joinerConfig } from "../joiner-config"
import AddressService from "./address"
import CartService from "./cart"
import LineItemAdjustmentService from "./line-item-adjustment-service"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  cartService: CartService
  addressService: AddressService
  lineItemAdjustmentService: LineItemAdjustmentService
}

export default class CartModuleService implements ICartModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected cartService_: CartService
  protected addressService_: AddressService
  protected lineItemAdjustmentService_: LineItemAdjustmentService

  constructor(
    {
      baseRepository,
      cartService,
      addressService,
      lineItemAdjustmentService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.cartService_ = cartService
    this.addressService_ = addressService
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
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

  async delete(ids: string[], sharedContext?: Context): Promise<void>

  async delete(ids: string, sharedContext?: Context): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async delete(
    ids: string[] | string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const cartIds = Array.isArray(ids) ? ids : [ids]
    await this.cartService_.delete(cartIds, sharedContext)
  }

  @InjectManager("baseRepository_")
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

    return await this.baseRepository_.serialize<CartAddressDTO[]>(addresses, {
      populate: true,
    })
  }

  async createAddresses(data: CreateAddressDTO, sharedContext?: Context)
  async createAddresses(data: CreateAddressDTO[], sharedContext?: Context)

  @InjectManager("baseRepository_")
  async createAddresses(
    data: CreateAddressDTO[] | CreateAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]
    const addresses = await this.createAddresses_(input, sharedContext)

    const result = await this.listAddresses(
      { id: addresses.map((p) => p.id) },
      {},
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | AddressDTO
      | AddressDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createAddresses_(
    data: CreateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.create(data, sharedContext)
  }

  async updateAddresses(data: UpdateAddressDTO, sharedContext?: Context)
  async updateAddresses(data: UpdateAddressDTO[], sharedContext?: Context)

  @InjectManager("baseRepository_")
  async updateAddresses(
    data: UpdateAddressDTO[] | UpdateAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]
    const addresses = await this.updateAddresses_(input, sharedContext)

    const result = await this.listAddresses(
      { id: addresses.map((p) => p.id) },
      {},
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | AddressDTO
      | AddressDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateAddresses_(
    data: UpdateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.update(data, sharedContext)
  }

  async deleteAddresses(ids: string[], sharedContext?: Context)
  async deleteAddresses(ids: string, sharedContext?: Context)

  @InjectTransactionManager("baseRepository_")
  async deleteAddresses(
    ids: string[] | string,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const addressIds = Array.isArray(ids) ? ids : [ids]
    await this.addressService_.delete(addressIds, sharedContext)
  }

  @InjectManager("baseRepository_")
  async listLineItemAdjustments(
    filters = {},
    config: FindConfig<CartTypes.LineItemAdjustmentLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const lines = await this.lineItemAdjustmentService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.LineItemAdjustmentLineDTO[]
    >(lines, {
      populate: true,
    })
  }

  async addLineItemAdjustments(
    data: CartTypes.AddLineItemAdjustmentsDTO[],
    sharedContext?: Context | undefined
  ): Promise<CartTypes.LineItemAdjustmentLineDTO[]>
  async addLineItemAdjustments(
    data: CartTypes.AddLineItemAdjustmentsDTO,
    sharedContext?: Context | undefined
  ): Promise<CartTypes.LineItemAdjustmentLineDTO>
  @InjectTransactionManager("baseRepository_")
  async addLineItemAdjustments(
    data:
      | CartTypes.AddLineItemAdjustmentsDTO
      | CartTypes.AddLineItemAdjustmentsDTO[],
    sharedContext?: unknown
  ): Promise<
    | CartTypes.LineItemAdjustmentLineDTO[]
    | CartTypes.LineItemAdjustmentLineDTO
    | void
  > {
    const input = Array.isArray(data) ? data : [data]

    return await this.addLineItemAdjustments_(input, sharedContext as Context)
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItemAdjustments_(
    data: CartTypes.AddLineItemAdjustmentsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.LineItemAdjustmentLineDTO[]> {
    const adjustmentsMap = new Map<
      string,
      CartTypes.CreateLineItemAdjustmentDTO[]
    >()

    for (const d of data) {
      adjustmentsMap.set(d.cart_id, d.adjustments)
    }

    const items = await promiseAll(
      [...adjustmentsMap].map(async ([cartId, lineItems]) => {
        return await this.lineItemAdjustmentService_.create(
          cartId,
          lineItems,
          sharedContext
        )
      })
    )

    return await this.listLineItemAdjustments(
      { id: items.flat().map((c) => c.id) },
      {},
      sharedContext
    )
  }
}
