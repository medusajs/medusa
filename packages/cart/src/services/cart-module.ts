import {
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

import { CartTypes } from "@medusajs/types"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  isString,
  promiseAll,
} from "@medusajs/utils"

import { joinerConfig } from "../joiner-config"
import * as services from "../services"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  cartService: services.CartService
  addressService: services.AddressService
  lineItemService: services.LineItemService
  shippingMethodService: services.ShippingMethodService
}

export default class CartModuleService implements ICartModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected cartService_: services.CartService
  protected addressService_: services.AddressService
  protected lineItemService_: services.LineItemService
  protected shippingMethodService_: services.ShippingMethodService

  constructor(
    {
      baseRepository,
      cartService,
      addressService,
      lineItemService,
      shippingMethodService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.cartService_ = cartService
    this.addressService_ = addressService
    this.lineItemService_ = lineItemService
    this.shippingMethodService_ = shippingMethodService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config: FindConfig<CartTypes.CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartDTO> {
    const cart = await this.cartService_.retrieve(id, config, sharedContext)

    return await this.baseRepository_.serialize<CartTypes.CartDTO>(cart, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async list(
    filters: CartTypes.FilterableCartProps = {},
    config: FindConfig<CartTypes.CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartDTO[]> {
    const carts = await this.cartService_.list(filters, config, sharedContext)

    return this.baseRepository_.serialize<CartTypes.CartDTO[]>(carts, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: FilterableCartProps = {},
    config: FindConfig<CartTypes.CartDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[CartTypes.CartDTO[], number]> {
    const [carts, count] = await this.cartService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<CartTypes.CartDTO[]>(carts, {
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
    data: CartTypes.CreateCartDTO[],
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
    data: CartTypes.UpdateCartDTO[],
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
    filters: CartTypes.FilterableAddressProps = {},
    config: FindConfig<CartTypes.CartAddressDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const addresses = await this.addressService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CartTypes.CartAddressDTO[]>(
      addresses,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async createAddresses(
    data: CartTypes.CreateAddressDTO[],
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
    data: CartTypes.UpdateAddressDTO[],
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
    config: FindConfig<CartTypes.CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const item = await this.lineItemService_.retrieve(
      itemId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO[]>(
      item,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listLineItems(
    filters = {},
    config: FindConfig<CartTypes.CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const items = await this.lineItemService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listShippingMethods(
    filters = {},
    config: FindConfig<CartTypes.CartShippingMethodDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const methods = await this.shippingMethodService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.CartShippingMethodDTO[]
    >(methods, {
      populate: true,
    })
  }

  addLineItems(
    data: CartTypes.AddLineItemsDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>
  addLineItems(
    data: CartTypes.AddLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>
  addLineItems(
    cartId: string,
    items: CartTypes.CreateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>

  @InjectManager("baseRepository_")
  async addLineItems(
    cartIdOrData:
      | string
      | CartTypes.AddLineItemsDTO[]
      | CartTypes.AddLineItemsDTO,
    dataOrSharedContext?: CartTypes.CreateLineItemDTO[] | Context,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]> {
    if (isString(cartIdOrData)) {
      return await this.addLineItems_(
        cartIdOrData,
        dataOrSharedContext as CartTypes.CreateLineItemDTO[],
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

  @InjectTransactionManager("baseRepository_")
  protected async addLineItems_(
    cartId: string,
    data: CartTypes.CreateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]> {
    return await this.addLineItemsBulk_(
      [{ cart_id: cartId, items: data }],
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItemsBulk_(
    data: CartTypes.AddLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]> {
    const lineItemsMap = new Map<string, CartTypes.CreateLineItemDTO[]>()

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

  updateLineItems(
    data: CartTypes.UpdateLineItemsDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>
  updateLineItems(
    data: CartTypes.UpdateLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>
  updateLineItems(
    cartId: string,
    data: CartTypes.UpdateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>

  @InjectManager("baseRepository_")
  async updateLineItems(
    cartIdOrData:
      | string
      | CartTypes.UpdateLineItemsDTO[]
      | CartTypes.UpdateLineItemsDTO,
    dataOrSharedContext?: CartTypes.UpdateLineItemDTO[] | Context,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]> {
    if (isString(cartIdOrData)) {
      return await this.updateLineItems_(
        cartIdOrData,
        dataOrSharedContext as CartTypes.UpdateLineItemDTO[],
        sharedContext
      )
    }

    if (Array.isArray(cartIdOrData)) {
      return await this.updateLineItemsBulk_(
        cartIdOrData,
        dataOrSharedContext as Context
      )
    }

    return await this.updateLineItemsBulk_(
      [cartIdOrData],
      dataOrSharedContext as Context
    )
  }

  @InjectManager("baseRepository_")
  protected async updateLineItems_(
    cartId: string,
    data: CartTypes.UpdateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]> {
    return await this.updateLineItemsBulk_(
      [
        {
          cart_id: cartId,
          items: data,
        },
      ],
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateLineItemsBulk_(
    data: CartTypes.UpdateLineItemsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]> {
    const lineItemsMap = new Map<string, CartTypes.UpdateLineItemDTO[]>()

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
      { relations: ["cart"] },
      sharedContext
    )
  }
  async removeLineItems(
    itemIds: string[],
    sharedContext?: Context
  ): Promise<void>
  async removeLineItems(itemIds: string, sharedContext?: Context): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async removeLineItems(
    itemIds: string | string[],
    sharedContext?: Context
  ): Promise<void> {
    const toDelete = Array.isArray(itemIds) ? itemIds : [itemIds]
    await this.lineItemService_.delete(toDelete, sharedContext)
  }

  addShippingMethod(
    data: CartTypes.AddShippingMethodsDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]>
  addShippingMethod(
    data: CartTypes.AddShippingMethodsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]>
  addShippingMethod(
    cartId: string,
    items: CartTypes.CreateShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]>

  @InjectManager("baseRepository_")
  async addShippingMethod(
    cartIdOrData:
      | string
      | CartTypes.AddShippingMethodsDTO[]
      | CartTypes.AddShippingMethodsDTO,
    dataOrSharedContext?: CartTypes.CreateShippingMethodDTO[] | Context,
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]> {
    if (isString(cartIdOrData)) {
      return await this.addShippingMethods_(
        cartIdOrData,
        dataOrSharedContext as CartTypes.CreateShippingMethodDTO[],
        sharedContext
      )
    }

    if (Array.isArray(cartIdOrData)) {
      return await this.addShippingMethodsBulk_(
        cartIdOrData,
        dataOrSharedContext as Context
      )
    }

    return await this.addShippingMethodsBulk_(
      [cartIdOrData],
      dataOrSharedContext as Context
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async addShippingMethods_(
    cartId: string,
    data: CartTypes.CreateShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]> {
    return await this.addShippingMethodsBulk_(
      [{ cart_id: cartId, shipping_methods: data }],
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async addShippingMethodsBulk_(
    data: CartTypes.AddShippingMethodsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]> {
    const methodsMap = new Map<string, CartTypes.CreateShippingMethodDTO[]>()

    for (const methodData of data) {
      methodsMap.set(methodData.cart_id, methodData.shipping_methods)
    }

    const methods = await promiseAll(
      [...methodsMap].map(async ([cartId, methods]) => {
        return await this.shippingMethodService_.create(
          cartId,
          methods,
          sharedContext
        )
      })
    )

    return await this.listShippingMethods(
      { id: methods.flat().map((method) => method.id) },
      {},
      sharedContext
    )
  }
}
