import {
  AddressDTO,
  CartDTO,
  CartLineItemDTO,
  Context,
  CreateCartDTO,
  CreateLineItemDTO,
  DAL,
  FilterableCartProps,
  FindConfig,
  ICartModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  UpdateCartDTO,
  UpdateLineItemsDTO,
} from "@medusajs/types"

import { AddLineItemsDTO, FilterableAddressProps } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  isString,
  promiseAll,
} from "@medusajs/utils"
import { CreateAddressDTO, UpdateAddressDTO, UpdateLineItemDTO } from "@types"
import { joinerConfig } from "../joiner-config"
import AddressService from "./address"
import CartService from "./cart"
import LineItemService from "./line-item"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  cartService: CartService
  addressService: AddressService
  lineItemService: LineItemService
}

export default class CartModuleService implements ICartModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected cartService_: CartService
  protected addressService_: AddressService
  protected lineItemService_: LineItemService

  constructor(
    {
      baseRepository,
      cartService,
      addressService,
      lineItemService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.cartService_ = cartService
    this.addressService_ = addressService
    this.lineItemService_ = lineItemService
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

    return this.baseRepository_.serialize<CartDTO[]>(carts, {
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

  @InjectManager("baseRepository_")
  async create(
    data: CreateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartDTO[]> {
    const carts = await this.create_(data, sharedContext)

    return await this.list(
      { id: carts.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: CreateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.cartService_.create(data, sharedContext)
  }

  @InjectManager("baseRepository_")
  async update(
    data: UpdateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartDTO[]> {
    const carts = await this.update_(data, sharedContext)

    return await this.list(
      { id: carts.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.cartService_.update(data, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.cartService_.delete(ids, sharedContext)
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

  @InjectManager("baseRepository_")
  async retrieveLineItem(
    itemId: string,
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const item = await this.lineItemService_.retrieve(
      itemId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CartLineItemDTO[]>(item, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listLineItems(
    filters = {},
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const items = await this.lineItemService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CartLineItemDTO[]>(items, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async addLineItems(
    cartIdOrData: string | AddLineItemsDTO[] | AddLineItemsDTO,
    dataOrSharedContext?: CreateLineItemDTO[] | Context,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]> {
    if (isString(cartIdOrData)) {
      return await this.addLineItems_(
        cartIdOrData,
        dataOrSharedContext as CreateLineItemDTO[],
        sharedContext
      )
    }

    if (Array.isArray(cartIdOrData)) {
      return await this.addLineItemsBulk_(
        cartIdOrData,
        dataOrSharedContext as Context
      )
    }

    return await this.addLineItemsBulk_(
      [cartIdOrData],
      dataOrSharedContext as Context
    )
  }

  protected async addLineItems_(
    cartId: string,
    data: CreateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]> {
    return await this.addLineItemsBulk_(
      [{ cart_id: cartId, items: data }],
      sharedContext
    )
  }

  protected async addLineItemsBulk_(
    data: AddLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]> {
    const lineItemsMap = new Map<string, CreateLineItemDTO[]>()

    for (const lineItemData of data) {
      lineItemsMap.set(lineItemData.cart_id, lineItemData.items)
    }

    const items = await promiseAll(
      [...lineItemsMap].map(async ([cartId, lineItems]) => {
        return await this.lineItemService_.create(
          cartId,
          lineItems,
          sharedContext
        )
      })
    )

    return await this.listLineItems(
      { id: items.flat().map((c) => c.id) },
      {},
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async updateLineItems(
    data: UpdateLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]> {
    const lineItemsMap = new Map<string, UpdateLineItemDTO[]>()

    for (const lineItemData of data) {
      lineItemsMap.set(lineItemData.cart_id, lineItemData.items)
    }

    const items = await promiseAll(
      [...lineItemsMap].map(async ([cartId, lineItems]) => {
        return await this.lineItemService_.update(
          cartId,
          lineItems,
          sharedContext
        )
      })
    )

    return await this.listLineItems(
      { id: items.flat().map((c) => c.id) },
      {},
      sharedContext
    )
  }

  // @InjectTransactionManager("baseRepository_")
  // async removeLineItems(lineItemIds: string[], sharedContext?: Context): Promise<void> {

  // }
}
