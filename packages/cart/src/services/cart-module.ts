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
  MedusaError,
  isObject,
  isString,
} from "@medusajs/utils"
import { LineItem, LineItemTaxLine, ShippingMethodTaxLine } from "@models"
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
    data: CartTypes.CreateLineItemForCartDTO
  ): Promise<CartTypes.CartLineItemDTO>
  addLineItems(
    data: CartTypes.CreateLineItemForCartDTO[]
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
    data?: CartTypes.CreateLineItemDTO[] | CartTypes.CreateLineItemDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartLineItemDTO[] | CartTypes.CartLineItemDTO> {
    let items: LineItem[] = []
    if (isString(cartIdOrData)) {
      items = await this.addLineItems_(
        cartIdOrData,
        data as CartTypes.CreateLineItemDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]
      items = await this.addLineItemsBulk_(data, sharedContext)
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
    data: CartTypes.UpdateLineItemWithSelectorDTO[]
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
    data?: CartTypes.UpdateLineItemDTO | Partial<CartTypes.UpdateLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartLineItemDTO[] | CartTypes.CartLineItemDTO> {
    let items: LineItem[] = []
    if (isString(lineItemIdOrDataOrSelector)) {
      const item = await this.updateLineItem_(
        lineItemIdOrDataOrSelector,
        data as Partial<CartTypes.UpdateLineItemDTO>,
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
            data: data,
          } as CartTypes.UpdateLineItemWithSelectorDTO,
        ]

    items = await this.updateLineItemsWithSelector_(toUpdate, sharedContext)

    return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateLineItem_(
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
  protected async updateLineItemsWithSelector_(
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
  ): Promise<CartTypes.CartAddressDTO>
  async createAddresses(
    data: CartTypes.CreateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartAddressDTO[]>

  @InjectManager("baseRepository_")
  async createAddresses(
    data: CartTypes.CreateAddressDTO[] | CartTypes.CreateAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartAddressDTO | CartTypes.CartAddressDTO[]> {
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
  ): Promise<CartTypes.CartAddressDTO>
  async updateAddresses(
    data: CartTypes.UpdateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartAddressDTO[]>

  @InjectManager("baseRepository_")
  async updateAddresses(
    data: CartTypes.UpdateAddressDTO[] | CartTypes.UpdateAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartAddressDTO | CartTypes.CartAddressDTO[]> {
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

  async deleteAddresses(ids: string[], sharedContext?: Context): Promise<void>
  async deleteAddresses(ids: string, sharedContext?: Context): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async deleteAddresses(
    ids: string[] | string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const addressIds = Array.isArray(ids) ? ids : [ids]
    await this.addressService_.delete(addressIds, sharedContext)
  }

  @InjectManager("baseRepository_")
  async listLineItemTaxLines(
    filters = {},
    config: FindConfig<CartTypes.LineItemTaxLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const taxLines = await this.lineItemTaxLineService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<CartTypes.LineItemTaxLineDTO[]>(
      taxLines,
      {
        populate: true,
      }
    )
  }

  addLineItemTaxLines(
    taxLines: CartTypes.CreateLineItemTaxLineDTO[]
  ): Promise<CartTypes.LineItemTaxLineDTO[]>
  addLineItemTaxLines(
    taxLine: CartTypes.CreateLineItemTaxLineDTO
  ): Promise<CartTypes.LineItemTaxLineDTO[]>
  addLineItemTaxLines(
    cartId: string,
    taxLines: CartTypes.CreateLineItemTaxLineDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.LineItemTaxLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addLineItemTaxLines(
    cartIdOrData:
      | string
      | CartTypes.CreateLineItemTaxLineDTO[]
      | CartTypes.CreateLineItemTaxLineDTO,
    taxLines?: CartTypes.CreateLineItemTaxLineDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemTaxLineDTO[]> {
    let addedTaxLines: LineItemTaxLine[] = []
    if (isString(cartIdOrData)) {
      const cart = await this.retrieve(
        cartIdOrData,
        { select: ["id"], relations: ["items"] },
        sharedContext
      )

      const lineIds = cart.items?.map((item) => item.id)

      for (const taxLine of taxLines || []) {
        if (!lineIds?.includes(taxLine.item_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Line item with id ${taxLine.item_id} does not exist on cart with id ${cartIdOrData}`
          )
        }
      }

      addedTaxLines = await this.lineItemTaxLineService_.create(
        taxLines as CartTypes.CreateLineItemTaxLineDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]

      addedTaxLines = await this.lineItemTaxLineService_.create(
        data as CartTypes.CreateLineItemTaxLineDTO[],
        sharedContext
      )
    }

    return await this.baseRepository_.serialize<CartTypes.LineItemTaxLineDTO[]>(
      addedTaxLines,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async setLineItemTaxLines(
    cartId: string,
    taxLines: (
      | CartTypes.CreateLineItemTaxLineDTO
      | CartTypes.UpdateLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemTaxLineDTO[]> {
    const cart = await this.retrieve(
      cartId,
      { select: ["id"], relations: ["items.tax_lines"] },
      sharedContext
    )

    const lineIds = cart.items?.map((item) => item.id)

    const existingTaxLines = await this.listLineItemTaxLines(
      { item_id: lineIds },
      { select: ["id"] },
      sharedContext
    )

    let toUpdate: CartTypes.pdateLineItemTaxLineDTO[] = []
    let toCreate: CartTypes.CreateLineItemTaxLineDTO[] = []
    for (const taxLine of taxLines) {
      if ("id" in taxLine) {
        toUpdate.push(taxLine as CartTypes.UpdateLineItemTaxLineDTO)
      } else {
        toCreate.push(taxLine as CartTypes.CreateLineItemTaxLineDTO)
      }
    }

    const taxLinesSet = new Set(toUpdate.map((taxLine) => taxLine.id))

    const toDelete: CartTypes.LineItemTaxLineDTO[] = []

    // From the existing tax lines, find the ones that are not passed in taxLines
    existingTaxLines.forEach((taxLine: CartTypes.LineItemTaxLineDTO) => {
      if (!taxLinesSet.has(taxLine.id)) {
        toDelete.push(taxLine)
      }
    })

    await this.lineItemTaxLineService.delete(
      toDelete.map((taxLine) => taxLine!.id),
      sharedContext
    )

    const [result] = await promiseAll([
      this.lineItemTaxLineService.create(toCreate, sharedContext),
      this.lineItemTaxLineService.update(toUpdate, sharedContext),
    ])

    return await this.baseRepository_.serialize<CartTypes.LineItemTaxLineDTO[]>(
      result,
      {
        populate: true,
      }
    )
  }

  removeLineItemTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeLineItemTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeLineItemTaxLines(
    selector: Partial<CartTypes.LineItemTaxLineDTO>,
    sharedContext?: Context
  ): Promise<void>

  async removeLineItemTaxLines(
    taxLineIdsOrSelector:
      | string
      | string[]
      | Partial<CartTypes.LineItemTaxLineDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let ids: string[] = []
    if (isObject(taxLineIdsOrSelector)) {
      const taxLines = await this.listLineItemTaxLines(
        {
          ...taxLineIdsOrSelector,
        } as Partial<CartTypes.LineItemTaxLineDTO>,
        { select: ["id"] },
        sharedContext
      )

      ids = taxLines.map((taxLine) => taxLine.id)
    } else {
      ids = Array.isArray(taxLineIdsOrSelector)
        ? taxLineIdsOrSelector
        : [taxLineIdsOrSelector]
    }

    await this.lineItemTaxLinesService_.delete(ids, sharedContext)
  }

  @InjectManager("baseRepository_")
  async listShippingMethodTaxLines(
    filters = {},
    config: FindConfig<CartTypes.ShippingMethodTaxLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const taxLines = await this.shippingMethodTaxLineService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodTaxLineDTO[]
    >(taxLines, {
      populate: true,
    })
  }

  addShippingMethodTaxLines(
    taxLines: CartTypes.CreateShippingMethodTaxLineDTO[]
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]>
  addShippingMethodTaxLines(
    taxLine: CartTypes.CreateShippingMethodTaxLineDTO
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]>
  addShippingMethodTaxLines(
    cartId: string,
    taxLines: CartTypes.CreateShippingMethodTaxLineDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addShippingMethodTaxLines(
    cartIdOrData:
      | string
      | CartTypes.CreateShippingMethodTaxLineDTO[]
      | CartTypes.CreateShippingMethodTaxLineDTO,
    taxLines?: CartTypes.CreateShippingMethodTaxLineDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]> {
    let addedTaxLines: ShippingMethodTaxLine[] = []
    if (isString(cartIdOrData)) {
      const cart = await this.retrieve(
        cartIdOrData,
        { select: ["id"], relations: ["shipping_methods"] },
        sharedContext
      )

      const methodIds = cart.shipping_methods?.map((method) => method.id)

      for (const taxLine of taxLines || []) {
        if (!methodIds?.includes(taxLine.shipping_method_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Shipping method with id ${taxLine.shipping_method_id} does not exist on cart with id ${cartIdOrData}`
          )
        }
      }

      addedTaxLines = await this.shippingMethodTaxLineService_.create(
        taxLines as CartTypes.CreateShippingMethodTaxLineDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]

      addedTaxLines = await this.shippingMethodTaxLineService_.create(
        data as CartTypes.CreateShippingMethodTaxLineDTO[],
        sharedContext
      )
    }

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodTaxLineDTO[]
    >(addedTaxLines, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async setShippingMethodTaxLines(
    cartId: string,
    taxLines: (
      | CartTypes.CreateShippingMethodTaxLineDTO
      | CartTypes.UpdateShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]> {
    const cart = await this.retrieve(
      cartId,
      { select: ["id"], relations: ["shipping_methods.tax_lines"] },
      sharedContext
    )

    const methodIds = cart.shipping_methods?.map((method) => method.id)

    const existingTaxLines = await this.listShippingMethodTaxLines(
      { shipping_method_id: methodIds },
      { select: ["id"] },
      sharedContext
    )

    let toUpdate: CartTypes.UpdateShippingMethodTaxLineDTO[] = []
    let toCreate: CartTypes.CreateShippingMethodTaxLineDTO[] = []
    for (const taxLine of taxLines) {
      if ("id" in taxLine) {
        toUpdate.push(taxLine as CartTypes.UpdateShippingMethodTaxLineDTO)
      } else {
        toCreate.push(taxLine as CartTypes.CreateShippingMethodTaxLineDTO)
      }
    }

    const taxLinesSet = new Set(toUpdate.map((taxLine) => taxLine.id))

    const toDelete: CartTypes.ShippingMethodTaxLineDTO[] = []

    // From the existing tax lines, find the ones that are not passed in taxLines
    existingTaxLines.forEach((taxLine: CartTypes.ShippingMethodTaxLineDTO) => {
      if (!taxLinesSet.has(taxLine.id)) {
        toDelete.push(taxLine)
      }
    })

    await this.shippingMethodTaxLineService.delete(
      toDelete.map((taxLine) => taxLine!.id),
      sharedContext
    )

    const [result] = await promiseAll([
      this.shippingMethodTaxLineService.create(toCreate, sharedContext),
      this.shippingMethodTaxLineService.update(toUpdate, sharedContext),
    ])

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodTaxLineDTO[]
    >(result, {
      populate: true,
    })
  }

  removeShippingMethodTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodTaxLines(
    selector: Partial<CartTypes.ShippingMethodTaxLineDTO>,
    sharedContext?: Context
  ): Promise<void>

  async removeShippingMethodTaxLines(
    taxLineIdsOrSelector:
      | string
      | string[]
      | Partial<CartTypes.ShippingMethodTaxLineDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let ids: string[] = []
    if (isObject(taxLineIdsOrSelector)) {
      const taxLines = await this.listShippingMethodTaxLines(
        {
          ...taxLineIdsOrSelector,
        } as Partial<CartTypes.ShippingMethodTaxLineDTO>,
        { select: ["id"] },
        sharedContext
      )

      ids = taxLines.map((taxLine) => taxLine.id)
    } else {
      ids = Array.isArray(taxLineIdsOrSelector)
        ? taxLineIdsOrSelector
        : [taxLineIdsOrSelector]
    }

    await this.shippingMethodTaxLinesService_.delete(ids, sharedContext)
  }
}
