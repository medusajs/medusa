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
  UpdateCartDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  isString,
  promiseAll,
} from "@medusajs/utils"
import { LineItemAdjustmentLine } from "@models"
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
    filters: CartTypes.FilterableAddressProps = {},
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
  async addLineItemAdjustments(
    lineId: string,
    data: CartTypes.AddLineItemAdjustmentsDTO[],
    sharedContext?: Context | undefined
  ): Promise<CartTypes.LineItemAdjustmentLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addLineItemAdjustments(
    lineIdOrData: string | CartTypes.AddLineItemAdjustmentsDTO[] | CartTypes.AddLineItemAdjustmentsDTO,
    @MedusaContext()
    dataOrSharedContext:
      | CartTypes.AddLineItemAdjustmentsDTO
      | CartTypes.AddLineItemAdjustmentsDTO[]
      | Context,
    @MedusaContext()
    sharedContext?: unknown
  ): Promise<
    | CartTypes.LineItemAdjustmentLineDTO[]
    | CartTypes.LineItemAdjustmentLineDTO
    | void
  > {
    let adjustments: LineItemAdjustmentLine[] = []
    if (isString(lineIdOrData)) {
      adjustments = await this.addLineItemAdjustments_(
        lineIdOrData,
        dataOrSharedContext as
          | CartTypes.CreateLineItemDTO[]
          | CartTypes.CreateLineItemDTO,
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
      const adjustments = !cartToAdjustmentsMap.has(adj.cart_id)
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
