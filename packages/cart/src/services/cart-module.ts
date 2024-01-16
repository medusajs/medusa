import {
  CartTypes,
  Context,
  DAL,
  FilterableCartProps,
  FindConfig,
  ICartModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  isObject,
  isString,
  promiseAll,
} from "@medusajs/utils"
import { LineItem, LineItemAdjustmentLine } from "@models"
import { UpdateLineItemDTO } from "@types"
import { joinerConfig } from "../joiner-config"
import * as services from "../services"
import AddressService from "./address"
import CartService from "./cart"
import LineItemAdjustmentService from "./line-item-adjustment-service"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  cartService: services.CartService
  addressService: services.AddressService
  lineItemService: services.LineItemService
  lineItemAdjustmentService: LineItemAdjustmentService
}

export default class CartModuleService implements ICartModuleService {
  protected baseRepository_: DAL.RepositoryService
  protected cartService_: CartService
  protected addressService_: AddressService
  protected lineItemService_: services.LineItemService
  protected lineItemAdjustmentService_: LineItemAdjustmentService

  constructor(
    {
      baseRepository,
      cartService,
      addressService,
      lineItemService,
      lineItemAdjustmentService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.cartService_ = cartService
    this.addressService_ = addressService
    this.lineItemService_ = lineItemService
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
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
  async addLineItemAdjustments(
    lineId: string,
    data: CartTypes.AddLineItemAdjustmentsDTO[],
    sharedContext?: Context | undefined
  ): Promise<CartTypes.LineItemAdjustmentLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addLineItemAdjustments(
    lineIdOrData: string | CartTypes.AddLineItemAdjustmentsDTO[] | CartTypes.AddLineItemAdjustmentsDTO,
    data:CartTypes.AddLineItemAdjustmentsDTO
      | CartTypes.AddLineItemAdjustmentsDTO[],
    @MedusaContext()
    sharedContext?: Context = {}
  ): Promise<
    | CartTypes.LineItemAdjustmentLineDTO[]
    | CartTypes.LineItemAdjustmentLineDTO
    | void
  > {
    let adjustments: LineItemAdjustmentLine[] = []
    if (isString(lineIdOrData)) {
      adjustments = await this.addLineItemAdjustments_(
        lineIdOrData,
        data,
        sharedContext
      )
    } else if(Array.isArray(lineIdOrData)) {
      adjustments = await this.addLineItemAdjustmentsBulk_(lineIdOrData, sharedContext)
    }

    return await this.baseRepository_.serialize<
      CartTypes.LineItemAdjustmentLineDTO[]
    >(adjustments, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItemAdjustments_(
    lineId: string,
    data: CartTypes.AddLineItemAdjustmentsDTO[] | CartTypes.AddLineItemAdjustmentsDTO,
    @MedusaContext() sharedContext?: Context = {}
  ): Promise<CartTypes.LineItemAdjustmentLineDTO[]> {
    const line = await this.lineItemService_.retrieve(lineId, {}, sharedContext)
    
    const adjustments = Array.isArray(data) ? data : [data]

    const toUpdate = adjustments.map((adj) => {
      return {
        ...adj,
        line_id: line.id,
      }
    })

    return await this.addLineItemAdjustmentsBulk_(toUpdate, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItemAdjustmentsBulk_(
    data: CartTypes.CreateLineItemAdjustmentDTO[],
    @MedusaContext() sharedContext?: Context = {}
  ): Promise<LineItemAdjustmentLine[]> {
    return await this.lineItemAdjustmentService_.create(
      data,
      sharedContext
    )
  }

  async setLineItemAdjustments(
    data: CartTypes.AddLineItemAdjustmentsDTO[],
    sharedContext?: Context | undefined
  ): Promise<CartTypes.LineItemAdjustmentLineDTO[]>
  async setLineItemAdjustments(
    data: CartTypes.AddLineItemAdjustmentsDTO,
    sharedContext?: Context | undefined
  ): Promise<CartTypes.LineItemAdjustmentLineDTO>
  @InjectTransactionManager("baseRepository_")
  async setLineItemAdjustments(
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

    return await this.setLineItemAdjustments_(input, sharedContext as Context)
  }

  @InjectTransactionManager("baseRepository_")
  protected async setLineItemAdjustments_(
    data: CartTypes.SetLineItemAdjustmentsDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.LineItemAdjustmentLineDTO[]> {
    const cartToAdjustmentsMap = new Map<
      string,
      (CartTypes.CreateLineItemAdjustmentDTO | CartTypes.UpdateLineItemAdjustmentDTO)[]
    >()

    for (const d of data) {
      cartToAdjustmentsMap.set(d.cart_id, d.adjustments)
    }

    const existingAdjustments = await this.listLineItemAdjustments(
      { cart_id: [...cartToAdjustmentsMap.keys()] },
      { select: ["id"] },
      sharedContext
    )

    // From the existing adjustments, find the ones that are not passed in data
    const toDelete = existingAdjustments.filter((adj) => {
      const adjustments = cartToAdjustmentsMap.get(adj.cart_id)
      if (adjustments) {
        return !adjustments.find((a) => a.id === adj.id)
      }
      return true
    })
    

    const allAdjustments = data.map((d) => d.adjustments).flat()

    const existingAdjustmentsMap = new Map(
      existingAdjustments.map((adj) => [adj.id, adj])
    )

    const toDelete = allAdjustments.filter((adj) => {
      if (adj.id) {
        
      }
      adj?.id && !existingAdjustmentsMap.has(adj.id)
    })

    const adjustmentsToDelete = existingAdjustments.filter(
      (adj) => !adjustmentsMap.has(adj.id)
    )

    await this.lineItemAdjustmentService_.delete(
      adjustmentsToDelete.map((adj) => adj.id)
    )

    let toDelete: string[] = []
    let toUpdate = []

    for (const update of data) {
      if (adj.) {
        const existing = existingAdjustmentsMap.get(adj.id)
      }

      
    }

    const items = await promiseAll(
      [...adjustmentsMap].map(async ([cartId, adjustments]) => {

        return await this.lineItemAdjustmentService_.create(
          adjustments,
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

  async removeLineItemAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  async removeLineItemAdjustments(
    adjustmentIds: string,
    sharedContext?: Context
  ): Promise<void>
  async removeLineItemAdjustments(
    adjustmentIds: string,
    sharedContext?: Context
  ): Promise<void> {
    const ids = Array.isArray(adjustmentIds) ? adjustmentIds : [adjustmentIds]
    await this.lineItemAdjustmentService_.delete(ids, sharedContext)
  }
}
