import {
  Context,
  DAL,
  FilterableCartProps,
  FindConfig,
  ICartModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { CartTypes } from "@medusajs/types"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  isObject,
  isString,
} from "@medusajs/utils"
import { LineItem } from "@models"
import { UpdateLineItemDTO } from "@types"
import { joinerConfig } from "../joiner-config"
import * as services from "../services"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  cartService: services.CartService
  addressService: services.AddressService
  lineItemService: services.LineItemService
}

export default class CartModuleService implements ICartModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected cartService_: services.CartService
  protected addressService_: services.AddressService
  protected lineItemService_: services.LineItemService

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
    data: CartTypes.CreateCartDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO[]>

  async create(
    data: CartTypes.CreateCartDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO>

  @InjectManager("baseRepository_")
  async create(
    data: CartTypes.CreateCartDTO[] | CartTypes.CreateCartDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartDTO[] | CartTypes.CartDTO> {
    const input = Array.isArray(data) ? data : [data]

    const carts = await this.create_(input, sharedContext)

    const result = await this.list(
      { id: carts.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | CartTypes.CartDTO
      | CartTypes.CartDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: CartTypes.CreateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.cartService_.create(data, sharedContext)
  }

  async update(
    data: CartTypes.UpdateCartDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO[]>

  async update(
    data: CartTypes.UpdateCartDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO>

  @InjectManager("baseRepository_")
  async update(
    data: CartTypes.UpdateCartDTO[] | CartTypes.UpdateCartDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartDTO[] | CartTypes.CartDTO> {
    const input = Array.isArray(data) ? data : [data]
    const carts = await this.update_(input, sharedContext)

    const result = await this.list(
      { id: carts.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | CartTypes.CartDTO
      | CartTypes.CartDTO[]
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
    filters: CartTypes.FilterableLineItemProps = {},
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

  addLineItems(
    data: CartTypes.CreateLineItemForCartDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO>
  addLineItems(
    data: CartTypes.CreateLineItemForCartDTO[],
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
      | CartTypes.CreateLineItemForCartDTO[]
      | CartTypes.CreateLineItemForCartDTO,
    dataOrSharedContext?:
      | CartTypes.CreateLineItemDTO[]
      | CartTypes.CreateLineItemDTO
      | Context,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartLineItemDTO[] | CartTypes.CartLineItemDTO> {
    let items: LineItem[] = []
    if (isString(cartIdOrData)) {
      items = await this.addLineItems_(
        cartIdOrData,
        dataOrSharedContext as CartTypes.CreateLineItemDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]
      items = await this.addLineItemsBulk_(data, dataOrSharedContext as Context)
    }

    return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItems_(
    cartId: string,
    items: CartTypes.CreateLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    const cart = await this.retrieve(cartId, { select: ["id"] }, sharedContext)

    const toUpdate = items.map((item) => {
      return {
        ...item,
        cart_id: cart.id,
      }
    })

    return await this.addLineItemsBulk_(toUpdate, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItemsBulk_(
    data: CartTypes.CreateLineItemForCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    return await this.lineItemService_.create(data, sharedContext)
  }

  updateLineItems(
    data: CartTypes.UpdateLineItemWithSelectorDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>
  updateLineItems(
    selector: Partial<CartTypes.CartLineItemDTO>,
    data: CartTypes.UpdateLineItemDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>
  updateLineItems(
    lineItemId: string,
    data: Partial<CartTypes.UpdateLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO>

  @InjectManager("baseRepository_")
  async updateLineItems(
    lineItemIdOrDataOrSelector:
      | string
      | CartTypes.UpdateLineItemWithSelectorDTO[]
      | Partial<CartTypes.CartLineItemDTO>,
    @MedusaContext()
    dataOrSharedContext?:
      | CartTypes.UpdateLineItemDTO
      | Partial<CartTypes.UpdateLineItemDTO>
      | Context,
    @MedusaContext()
    sharedContext: Context = {}
  ): Promise<CartTypes.CartLineItemDTO[] | CartTypes.CartLineItemDTO> {
    let items: LineItem[] = []
    if (isString(lineItemIdOrDataOrSelector)) {
      const item = await this.updateSingleLineItem_(
        lineItemIdOrDataOrSelector,
        dataOrSharedContext as Partial<CartTypes.UpdateLineItemDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO>(
        item,
        {
          populate: true,
        }
      )
    }

    const toUpdate = Array.isArray(lineItemIdOrDataOrSelector)
      ? lineItemIdOrDataOrSelector
      : [
          {
            selector: lineItemIdOrDataOrSelector,
            data: dataOrSharedContext,
          } as CartTypes.UpdateLineItemWithSelectorDTO,
        ]

    items = await this.updateLineItemsWithSelectorBulk_(
      toUpdate,
      dataOrSharedContext as Context
    )

    return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateSingleLineItem_(
    lineItemId: string,
    data: Partial<CartTypes.UpdateLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem> {
    const [item] = await this.lineItemService_.update(
      [{ id: lineItemId, ...data }],
      sharedContext
    )

    return item
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateLineItemsWithSelectorBulk_(
    updates: CartTypes.UpdateLineItemWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    let toUpdate: UpdateLineItemDTO[] = []
    for (const { selector, data } of updates) {
      const items = await this.listLineItems({ ...selector }, {}, sharedContext)

      items.forEach((item) => {
        toUpdate.push({
          ...data,
          id: item.id,
        })
      })
    }

    return await this.lineItemService_.update(toUpdate, sharedContext)
  }

  async removeLineItems(
    itemIds: string[],
    sharedContext?: Context
  ): Promise<void>
  async removeLineItems(itemIds: string, sharedContext?: Context): Promise<void>
  async removeLineItems(
    selector: Partial<CartTypes.CartLineItemDTO>,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async removeLineItems(
    itemIdsOrSelector: string | string[] | Partial<CartTypes.CartLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let toDelete: string[] = []
    if (isObject(itemIdsOrSelector)) {
      const items = await this.listLineItems(
        { ...itemIdsOrSelector } as Partial<CartTypes.CartLineItemDTO>,
        {},
        sharedContext
      )

      toDelete = items.map((item) => item.id)
    } else {
      toDelete = Array.isArray(itemIdsOrSelector)
        ? itemIdsOrSelector
        : [itemIdsOrSelector]
    }

    await this.lineItemService_.delete(toDelete, sharedContext)
  }

  async createAddresses(
    data: CartTypes.CreateAddressDTO,
    sharedContext?: Context
  )
  async createAddresses(
    data: CartTypes.CreateAddressDTO[],
    sharedContext?: Context
  )

  @InjectManager("baseRepository_")
  async createAddresses(
    data: CartTypes.CreateAddressDTO[] | CartTypes.CreateAddressDTO,
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
      | CartTypes.CartAddressDTO
      | CartTypes.CartAddressDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createAddresses_(
    data: CartTypes.CreateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.create(data, sharedContext)
  }

  async updateAddresses(
    data: CartTypes.UpdateAddressDTO,
    sharedContext?: Context
  )
  async updateAddresses(
    data: CartTypes.UpdateAddressDTO[],
    sharedContext?: Context
  )

  @InjectManager("baseRepository_")
  async updateAddresses(
    data: CartTypes.UpdateAddressDTO[] | CartTypes.UpdateAddressDTO,
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
      | CartTypes.CartAddressDTO
      | CartTypes.CartAddressDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateAddresses_(
    data: CartTypes.UpdateAddressDTO[],
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
}
