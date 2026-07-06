import {
  CartDTO,
  CartTypes,
  Context,
  DAL,
  FindConfig,
  ICartModuleService,
  InferEntityType,
  InternalModuleDeclaration,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  createRawPropertiesFromBigNumber,
  decorateCartTotals,
  deduplicate,
  EmitEvents,
  generateEntityId,
  InjectManager,
  InjectTransactionManager,
  isObject,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
  normalizeCurrencyCode,
} from "@medusajs/framework/utils"
import {
  Address,
  Cart,
  CreditLine,
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  ShippingMethod,
  ShippingMethodAdjustment,
  ShippingMethodTaxLine,
} from "@models"
import {
  CreateLineItemDTO,
  CreateShippingMethodDTO,
  UpdateLineItemDTO,
  UpdateShippingMethodTaxLineDTO,
} from "@types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  cartService: ModulesSdkTypes.IMedusaInternalService<any>
  addressService: ModulesSdkTypes.IMedusaInternalService<any>
  lineItemService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingMethodAdjustmentService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingMethodService: ModulesSdkTypes.IMedusaInternalService<any>
  lineItemAdjustmentService: ModulesSdkTypes.IMedusaInternalService<any>
  lineItemTaxLineService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingMethodTaxLineService: ModulesSdkTypes.IMedusaInternalService<any>
}

const generateMethodForModels = {
  Cart,
  CreditLine,
  Address,
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  ShippingMethod,
  ShippingMethodAdjustment,
  ShippingMethodTaxLine,
}

export default class CartModuleService
  extends ModulesSdkUtils.MedusaService<{
    Cart: { dto: CartTypes.CartDTO }
    CreditLine: { dto: CartTypes.CartCreditLineDTO }
    Address: { dto: CartTypes.CartAddressDTO }
    LineItem: { dto: CartTypes.CartLineItemDTO }
    LineItemAdjustment: { dto: CartTypes.LineItemAdjustmentDTO }
    LineItemTaxLine: { dto: CartTypes.LineItemTaxLineDTO }
    ShippingMethod: { dto: CartTypes.CartShippingMethodDTO }
    ShippingMethodAdjustment: { dto: CartTypes.ShippingMethodAdjustmentDTO }
    ShippingMethodTaxLine: { dto: CartTypes.ShippingMethodTaxLineDTO }
  }>(generateMethodForModels)
  implements ICartModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected cartService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Cart>
  >
  protected addressService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Address>
  >
  protected lineItemService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof LineItem>
  >
  protected shippingMethodAdjustmentService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ShippingMethodAdjustment>
  >
  protected shippingMethodService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ShippingMethod>
  >
  protected lineItemAdjustmentService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof LineItemAdjustment>
  >
  protected lineItemTaxLineService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof LineItemTaxLine>
  >
  protected shippingMethodTaxLineService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ShippingMethodTaxLine>
  >

  constructor(
    {
      baseRepository,
      cartService,
      addressService,
      lineItemService,
      shippingMethodAdjustmentService,
      shippingMethodService,
      lineItemAdjustmentService,
      shippingMethodTaxLineService,
      lineItemTaxLineService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.cartService_ = cartService
    this.addressService_ = addressService
    this.lineItemService_ = lineItemService
    this.shippingMethodAdjustmentService_ = shippingMethodAdjustmentService
    this.shippingMethodService_ = shippingMethodService
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
    this.shippingMethodTaxLineService_ = shippingMethodTaxLineService
    this.lineItemTaxLineService_ = lineItemTaxLineService
  }

  private shouldIncludeTotals(config: FindConfig<any>): boolean {
    const totalFields = [
      "total",
      "subtotal",
      "tax_total",
      "discount_total",
      "discount_tax_total",
      "original_total",
      "original_tax_total",
      "item_total",
      "item_subtotal",
      "item_tax_total",
      "original_item_total",
      "original_item_subtotal",
      "original_item_tax_total",
      "shipping_total",
      "shipping_subtotal",
      "shipping_tax_total",
      "original_shipping_tax_total",
      "original_shipping_subtotal",
      "original_shipping_total",
    ]

    const includeTotals = (config?.select ?? []).some((field) =>
      totalFields.includes(field as string)
    )

    if (includeTotals) {
      this.addRelationsToCalculateTotals(config, totalFields)
    }

    return includeTotals
  }

  private addRelationsToCalculateTotals(config: FindConfig<any>, totalFields) {
    config.relations ??= []
    config.select ??= []

    const requiredFieldsForTotals = [
      "items",
      "credit_lines",
      "items.tax_lines",
      "items.adjustments",
      "shipping_methods",
      "shipping_methods.tax_lines",
      "shipping_methods.adjustments",
    ]
    config.relations = deduplicate([
      ...config.relations,
      ...requiredFieldsForTotals,
    ])

    config.select = config.select.filter((field) => {
      return (
        !requiredFieldsForTotals.some((val) =>
          val.startsWith(field as string)
        ) && !totalFields.includes(field)
      )
    })
  }

  // @ts-expect-error
  async retrieveCart(
    id: string,
    config?: FindConfig<any> | undefined,
    sharedContext?: Context | undefined
  ): Promise<CartDTO> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const cart = await super.retrieveCart(id, config, sharedContext)

    if (includeTotals) {
      createRawPropertiesFromBigNumber(decorateCartTotals(cart))
    }

    return cart
  }

  // @ts-expect-error
  async listCarts(
    filters?: any,
    config?: FindConfig<any> | undefined,
    sharedContext?: Context | undefined
  ): Promise<CartDTO[]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const carts = await super.listCarts(filters, config, sharedContext)

    if (includeTotals) {
      carts.forEach((cart) => {
        createRawPropertiesFromBigNumber(decorateCartTotals(cart))
      })
    }

    return carts
  }

  // @ts-expect-error
  async listAndCountCarts(
    filters?: any,
    config?: FindConfig<any> | undefined,
    sharedContext?: Context | undefined
  ): Promise<[CartDTO[], number]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const [carts, count] = await super.listAndCountCarts(
      filters,
      config,
      sharedContext
    )

    if (includeTotals) {
      carts.forEach((cart) => {
        createRawPropertiesFromBigNumber(decorateCartTotals(cart))
      })
    }

    return [carts, count]
  }

  // @ts-expect-error
  async createCarts(
    data: CartTypes.CreateCartDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO[]>

  // @ts-expect-error
  async createCarts(
    data: CartTypes.CreateCartDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createCarts(
    data: CartTypes.CreateCartDTO[] | CartTypes.CreateCartDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartDTO[] | CartTypes.CartDTO> {
    const input = Array.isArray(data) ? data : [data]

    const carts = await this.createCarts_(input, sharedContext)

    const result = await this.baseRepository_.serialize<CartTypes.CartDTO[]>(
      carts
    )

    return (Array.isArray(data) ? result : result[0]) as
      | CartTypes.CartDTO
      | CartTypes.CartDTO[]
  }

  @InjectTransactionManager()
  protected async createCarts_(
    data: CartTypes.CreateCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Cart>[]> {
    const cartsWithItems = data.map(({ items, ...cart }) => {
      const cartId = generateEntityId((cart as any).id, "cart")
      return {
        cart: {
          ...cart,
          currency_code: cart.currency_code
            ? normalizeCurrencyCode(cart.currency_code)
            : cart.currency_code,
          id: cartId,
        },
        items: items || [],
      }
    })

    // Batch create all carts a once instead of sequentially
    const createdCarts = await this.cartService_.create(
      cartsWithItems.map((c) => c.cart),
      sharedContext
    )

    const lineItemsToCreate: CreateLineItemDTO[] = []
    for (const { cart, items } of cartsWithItems) {
      if (items.length) {
        lineItemsToCreate.push(
          ...items.map((item) => ({
            ...item,
            cart_id: cart.id,
          }))
        )
      }
    }

    if (lineItemsToCreate.length) {
      await this.addLineItemsBulk_(lineItemsToCreate, sharedContext)
    }

    const fullCarts = await this.cartService_.list(
      { id: createdCarts.map((c) => c.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )

    // Return in the same input order
    const orderedInputId = cartsWithItems.map((c) => c.cart.id)
    return orderedInputId.map((id) =>
      fullCarts.find((c) => c.id === id)
    ) as InferEntityType<typeof Cart>[]
  }

  // @ts-expect-error
  async updateCarts(
    data: CartTypes.UpdateCartDTO[]
  ): Promise<CartTypes.CartDTO[]>
  // @ts-expect-error
  async updateCarts(
    cartId: string,
    data: CartTypes.UpdateCartDataDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO>
  // @ts-expect-error
  async updateCarts(
    selector: Partial<CartTypes.CartDTO>,
    data: CartTypes.UpdateCartDataDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateCarts(
    dataOrIdOrSelector:
      | CartTypes.UpdateCartDTO[]
      | string
      | Partial<CartTypes.CartDTO>,
    data?: CartTypes.UpdateCartDataDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartDTO[] | CartTypes.CartDTO> {
    const result = await this.updateCarts_(
      dataOrIdOrSelector,
      data,
      sharedContext
    )

    const serializedResult = await this.baseRepository_.serialize<
      CartTypes.CartDTO[]
    >(result)

    return isString(dataOrIdOrSelector) ? serializedResult[0] : serializedResult
  }

  @InjectTransactionManager()
  protected async updateCarts_(
    dataOrIdOrSelector:
      | CartTypes.UpdateCartDTO[]
      | string
      | Partial<CartTypes.CartDTO>,
    data?: CartTypes.UpdateCartDataDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let toUpdate: CartTypes.UpdateCartDTO[] = []
    if (isString(dataOrIdOrSelector)) {
      toUpdate = [
        {
          id: dataOrIdOrSelector,
          ...data,
          ...(data?.currency_code
            ? { currency_code: normalizeCurrencyCode(data.currency_code) }
            : {}),
        },
      ]
    } else if (Array.isArray(dataOrIdOrSelector)) {
      toUpdate = dataOrIdOrSelector.map((d) => ({
        ...d,
        ...(d.currency_code
          ? { currency_code: normalizeCurrencyCode(d.currency_code) }
          : {}),
      }))
    } else {
      const carts = await this.cartService_.list(
        { ...dataOrIdOrSelector },
        { select: ["id"] },
        sharedContext
      )

      toUpdate = carts.map((cart) => {
        return {
          ...data,
          id: cart.id,
          ...(data?.currency_code
            ? { currency_code: normalizeCurrencyCode(data.currency_code) }
            : {}),
        }
      })
    }

    const result = await this.cartService_.update(toUpdate, sharedContext)
    return result
  }

  @InjectManager()
  // @ts-expect-error
  async updateShippingMethods(
    data: CartTypes.UpdateShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]> {
    return super.updateShippingMethods(
      data as unknown as CartTypes.CartShippingMethodDTO[],
      sharedContext
    ) as unknown as Promise<CartTypes.CartShippingMethodDTO[]>
  }

  addLineItems(
    data: CartTypes.CreateLineItemForCartDTO
  ): Promise<CartTypes.CartLineItemDTO[]>
  addLineItems(
    data: CartTypes.CreateLineItemForCartDTO[]
  ): Promise<CartTypes.CartLineItemDTO[]>
  addLineItems(
    cartId: string,
    items: CartTypes.CreateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>

  @InjectManager()
  @EmitEvents()
  async addLineItems(
    cartIdOrData:
      | string
      | CartTypes.CreateLineItemForCartDTO[]
      | CartTypes.CreateLineItemForCartDTO,
    data?: CartTypes.CreateLineItemDTO[] | CartTypes.CreateLineItemDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartLineItemDTO[]> {
    let items: InferEntityType<typeof LineItem>[] = []
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
      items
    )
  }

  @InjectTransactionManager()
  protected async addLineItems_(
    cartId: string,
    items: CartTypes.CreateLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItem>[]> {
    const cart = await this.cartService_.retrieve(
      cartId,
      { select: ["id"] },
      sharedContext
    )

    const toUpdate: CreateLineItemDTO[] = items.map((item) => {
      return {
        ...item,
        cart_id: cart.id,
      }
    })

    return await this.addLineItemsBulk_(toUpdate, sharedContext)
  }

  @InjectTransactionManager()
  protected async addLineItemsBulk_(
    data: CreateLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItem>[]> {
    return await this.lineItemService_.create(data, sharedContext)
  }

  // @ts-ignore
  updateLineItems(
    data: CartTypes.UpdateLineItemWithSelectorDTO[]
  ): Promise<CartTypes.CartLineItemDTO[]>

  // @ts-ignore
  updateLineItems(
    data: (Partial<CartTypes.UpdateLineItemDTO> & { id: string })[]
  ): Promise<CartTypes.CartLineItemDTO[]>

  // @ts-expect-error
  updateLineItems(
    selector: Partial<CartTypes.CartLineItemDTO>,
    data: CartTypes.UpdateLineItemDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO[]>
  // @ts-expect-error
  updateLineItems(
    lineItemId: string,
    data: Partial<CartTypes.UpdateLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartTypes.CartLineItemDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateLineItems(
    lineItemIdOrDataOrSelector:
      | string
      | CartTypes.UpdateLineItemWithSelectorDTO[]
      | Partial<CartTypes.CartLineItemDTO>
      | (Partial<CartTypes.UpdateLineItemDTO> & { id: string })[],
    data?: CartTypes.UpdateLineItemDTO | Partial<CartTypes.UpdateLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.CartLineItemDTO[] | CartTypes.CartLineItemDTO> {
    let items: InferEntityType<typeof LineItem>[] = []
    if (isString(lineItemIdOrDataOrSelector)) {
      const item = await this.updateLineItem_(
        lineItemIdOrDataOrSelector,
        data as Partial<CartTypes.UpdateLineItemDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO>(
        item
      )
    } else if (Array.isArray(lineItemIdOrDataOrSelector) && !data) {
      // We received an array of data including the ids
      const items = await this.lineItemService_.update(
        lineItemIdOrDataOrSelector,
        sharedContext
      )

      return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO[]>(
        items
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

    items = await this.updateLineItemsWithSelector_(
      toUpdate as CartTypes.UpdateLineItemWithSelectorDTO[],
      sharedContext
    )

    return await this.baseRepository_.serialize<CartTypes.CartLineItemDTO[]>(
      items
    )
  }

  @InjectTransactionManager()
  protected async updateLineItem_(
    lineItemId: string,
    data: Partial<CartTypes.UpdateLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItem>> {
    const [item] = await this.lineItemService_.update(
      [{ id: lineItemId, ...data }],
      sharedContext
    )

    return item
  }

  @InjectTransactionManager()
  protected async updateLineItemsWithSelector_(
    updates: CartTypes.UpdateLineItemWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItem>[]> {
    let toUpdate: UpdateLineItemDTO[] = []
    for (const { selector, data } of updates) {
      const items = await this.lineItemService_.list(
        { ...selector },
        {},
        sharedContext
      )

      items.forEach((item) => {
        toUpdate.push({
          ...data,
          id: item.id,
        })
      })
    }

    return await this.lineItemService_.update(toUpdate, sharedContext)
  }

  // @ts-ignore
  async createAddresses(
    data: CartTypes.CreateAddressDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartAddressDTO>
  // @ts-expect-error
  async createAddresses(
    data: CartTypes.CreateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartAddressDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  protected async createAddresses_(
    data: CartTypes.CreateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.create(data, sharedContext)
  }

  // @ts-ignore
  async updateAddresses(
    data: CartTypes.UpdateAddressDTO,
    sharedContext?: Context
  ): Promise<CartTypes.CartAddressDTO>
  // @ts-expect-error
  async updateAddresses(
    data: CartTypes.UpdateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartAddressDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  protected async updateAddresses_(
    data: CartTypes.UpdateAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.update(data, sharedContext)
  }

  async addShippingMethods(
    data: CartTypes.CreateShippingMethodDTO
  ): Promise<CartTypes.CartShippingMethodDTO>
  async addShippingMethods(
    data: CartTypes.CreateShippingMethodDTO[]
  ): Promise<CartTypes.CartShippingMethodDTO[]>
  async addShippingMethods(
    cartId: string,
    methods: CartTypes.CreateShippingMethodForSingleCartDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.CartShippingMethodDTO[]>

  @InjectManager()
  @EmitEvents()
  async addShippingMethods(
    cartIdOrData:
      | string
      | CartTypes.CreateShippingMethodDTO[]
      | CartTypes.CreateShippingMethodDTO,
    data?:
      | CartTypes.CreateShippingMethodDTO[]
      | CartTypes.CreateShippingMethodForSingleCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    CartTypes.CartShippingMethodDTO[] | CartTypes.CartShippingMethodDTO
  > {
    let methods: InferEntityType<typeof ShippingMethod>[]
    if (isString(cartIdOrData)) {
      methods = await this.addShippingMethods_(
        cartIdOrData,
        data as CartTypes.CreateShippingMethodForSingleCartDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]
      methods = await this.addShippingMethodsBulk_(
        data as CartTypes.CreateShippingMethodDTO[],
        sharedContext
      )
    }

    return await this.baseRepository_.serialize<
      CartTypes.CartShippingMethodDTO[]
    >(methods)
  }

  @InjectTransactionManager()
  protected async addShippingMethods_(
    cartId: string,
    data: CartTypes.CreateShippingMethodForSingleCartDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingMethod>[]> {
    const cart = await this.cartService_.retrieve(
      cartId,
      { select: ["id"] },
      sharedContext
    )

    const methods = data.map((method) => {
      return {
        ...method,
        cart_id: cart.id,
      }
    })

    return await this.addShippingMethodsBulk_(methods, sharedContext)
  }

  @InjectTransactionManager()
  protected async addShippingMethodsBulk_(
    data: CartTypes.CreateShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingMethod>[]> {
    return await this.shippingMethodService_.create(
      data as unknown as CreateShippingMethodDTO[],
      sharedContext
    )
  }

  async addLineItemAdjustments(
    adjustments: CartTypes.CreateLineItemAdjustmentDTO[]
  ): Promise<CartTypes.LineItemAdjustmentDTO[]>
  async addLineItemAdjustments(
    adjustment: CartTypes.CreateLineItemAdjustmentDTO
  ): Promise<CartTypes.LineItemAdjustmentDTO[]>
  async addLineItemAdjustments(
    cartId: string,
    adjustments: CartTypes.CreateLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.LineItemAdjustmentDTO[]>

  @InjectManager()
  @EmitEvents()
  async addLineItemAdjustments(
    cartIdOrData:
      | string
      | CartTypes.CreateLineItemAdjustmentDTO[]
      | CartTypes.CreateLineItemAdjustmentDTO,
    adjustments?: CartTypes.CreateLineItemAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemAdjustmentDTO[]> {
    const result = await this.addLineItemAdjustments_(
      cartIdOrData,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.LineItemAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async addLineItemAdjustments_(
    cartIdOrData:
      | string
      | CartTypes.CreateLineItemAdjustmentDTO[]
      | CartTypes.CreateLineItemAdjustmentDTO,
    adjustments?: CartTypes.CreateLineItemAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItemAdjustment>[]> {
    let addedAdjustments: InferEntityType<typeof LineItemAdjustment>[] = []
    if (isString(cartIdOrData)) {
      const cart = await this.cartService_.retrieve(
        cartIdOrData,
        { select: ["id"], relations: ["items"] },
        sharedContext
      )

      const lineIds = cart.items?.map((item) => item.id)

      for (const adj of adjustments || []) {
        if (!lineIds?.includes(adj.item_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Line item with id ${adj.item_id} does not exist on cart with id ${cartIdOrData}`
          )
        }
      }

      addedAdjustments = await this.lineItemAdjustmentService_.create(
        adjustments as CartTypes.CreateLineItemAdjustmentDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]

      addedAdjustments = await this.lineItemAdjustmentService_.create(
        data as CartTypes.CreateLineItemAdjustmentDTO[],
        sharedContext
      )
    }

    return addedAdjustments
  }

  @InjectManager()
  @EmitEvents()
  async upsertLineItemTaxLines(
    taxLines: (
      | CartTypes.CreateLineItemTaxLineDTO
      | CartTypes.UpdateLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemTaxLineDTO[]> {
    const result = await this.lineItemTaxLineService_.upsert(
      taxLines as CartTypes.UpdateLineItemTaxLineDTO[],
      sharedContext
    )

    return await this.baseRepository_.serialize<CartTypes.LineItemTaxLineDTO[]>(
      result
    )
  }

  @InjectTransactionManager()
  protected async upsertLineItemTaxLines_(
    taxLines: (
      | CartTypes.CreateLineItemTaxLineDTO
      | CartTypes.UpdateLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItemTaxLine>[]> {
    const result = await this.lineItemTaxLineService_.upsert(
      taxLines as CartTypes.UpdateLineItemTaxLineDTO[],
      sharedContext
    )

    return result
  }

  @InjectManager()
  @EmitEvents()
  async upsertLineItemAdjustments(
    adjustments: (
      | CartTypes.CreateLineItemAdjustmentDTO
      | CartTypes.UpdateLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemAdjustmentDTO[]> {
    const result = await this.upsertLineItemAdjustments_(
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.LineItemAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async upsertLineItemAdjustments_(
    adjustments: (
      | CartTypes.CreateLineItemAdjustmentDTO
      | CartTypes.UpdateLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItemAdjustment>[]> {
    let result = await this.lineItemAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return result
  }

  @InjectManager()
  @EmitEvents()
  async upsertShippingMethodTaxLines(
    taxLines: (
      | CartTypes.CreateShippingMethodTaxLineDTO
      | CartTypes.UpdateShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]> {
    const result = await this.upsertShippingMethodTaxLines_(
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodTaxLineDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async upsertShippingMethodTaxLines_(
    taxLines: (
      | CartTypes.CreateShippingMethodTaxLineDTO
      | CartTypes.UpdateShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingMethodTaxLine>[]> {
    const result = await this.shippingMethodTaxLineService_.upsert(
      taxLines as UpdateShippingMethodTaxLineDTO[],
      sharedContext
    )

    return result
  }

  @InjectManager()
  @EmitEvents()
  async upsertShippingMethodAdjustments(
    adjustments: (
      | CartTypes.CreateShippingMethodAdjustmentDTO
      | CartTypes.UpdateShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.ShippingMethodAdjustmentDTO[]> {
    const result = await this.upsertShippingMethodAdjustments_(
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async upsertShippingMethodAdjustments_(
    adjustments: (
      | CartTypes.CreateShippingMethodAdjustmentDTO
      | CartTypes.UpdateShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingMethodAdjustment>[]> {
    const result = await this.shippingMethodAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return result
  }

  @InjectManager()
  @EmitEvents()
  async setLineItemAdjustments(
    cartId: string,
    adjustments: (
      | CartTypes.CreateLineItemAdjustmentDTO
      | CartTypes.UpdateLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemAdjustmentDTO[]> {
    const result = await this.setLineItemAdjustments_(
      cartId,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.LineItemAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async setLineItemAdjustments_(
    cartId: string,
    adjustments: (
      | CartTypes.CreateLineItemAdjustmentDTO
      | CartTypes.UpdateLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItemAdjustment>[]> {
    const cart = await this.cartService_.retrieve(
      cartId,
      { select: ["id"], relations: ["items.adjustments"] },
      sharedContext
    )

    const existingAdjustments = await this.lineItemAdjustmentService_.list(
      { item: { cart_id: cart.id } },
      { select: ["id"] },
      sharedContext
    )

    const adjustmentsSet = new Set(
      adjustments
        .map((a) => (a as CartTypes.UpdateLineItemAdjustmentDTO).id)
        .filter(Boolean)
    )

    const toDelete: InferEntityType<typeof LineItemAdjustment>[] = []

    // From the existing adjustments, find the ones that are not passed in adjustments
    existingAdjustments.forEach(
      (adj: InferEntityType<typeof LineItemAdjustment>) => {
        if (!adjustmentsSet.has(adj.id)) {
          toDelete.push(adj)
        }
      }
    )

    if (toDelete.length) {
      await this.lineItemAdjustmentService_.softDelete(
        toDelete.map((adj) => adj!.id),
        sharedContext
      )
    }

    let result = await this.lineItemAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return result
  }

  @InjectManager()
  @EmitEvents()
  async setShippingMethodAdjustments(
    cartId: string,
    adjustments: (
      | CartTypes.CreateShippingMethodAdjustmentDTO
      | CartTypes.UpdateShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.ShippingMethodAdjustmentDTO[]> {
    const result = await this.setShippingMethodAdjustments_(
      cartId,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async setShippingMethodAdjustments_(
    cartId: string,
    adjustments: (
      | CartTypes.CreateShippingMethodAdjustmentDTO
      | CartTypes.UpdateShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingMethodAdjustment>[]> {
    const cart = await this.cartService_.retrieve(
      cartId,
      { select: ["id"], relations: ["shipping_methods.adjustments"] },
      sharedContext
    )

    const existingAdjustments =
      await this.shippingMethodAdjustmentService_.list(
        { shipping_method: { cart_id: cart.id } },
        { select: ["id"] },
        sharedContext
      )

    const adjustmentsSet = new Set(
      adjustments
        .map((a) => (a as CartTypes.UpdateShippingMethodAdjustmentDTO)?.id)
        .filter(Boolean)
    )

    const toDelete: InferEntityType<typeof ShippingMethodAdjustment>[] = []

    // From the existing adjustments, find the ones that are not passed in adjustments
    existingAdjustments.forEach(
      (adj: InferEntityType<typeof ShippingMethodAdjustment>) => {
        if (!adjustmentsSet.has(adj.id)) {
          toDelete.push(adj)
        }
      }
    )

    if (toDelete.length) {
      await this.shippingMethodAdjustmentService_.softDelete(
        toDelete.map((adj) => adj!.id),
        sharedContext
      )
    }

    const result = await this.shippingMethodAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return result
  }

  async addShippingMethodAdjustments(
    adjustments: CartTypes.CreateShippingMethodAdjustmentDTO[]
  ): Promise<CartTypes.ShippingMethodAdjustmentDTO[]>
  async addShippingMethodAdjustments(
    adjustment: CartTypes.CreateShippingMethodAdjustmentDTO
  ): Promise<CartTypes.ShippingMethodAdjustmentDTO>
  async addShippingMethodAdjustments(
    cartId: string,
    adjustments: CartTypes.CreateShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<CartTypes.ShippingMethodAdjustmentDTO[]>

  @InjectManager()
  @EmitEvents()
  async addShippingMethodAdjustments(
    cartIdOrData:
      | string
      | CartTypes.CreateShippingMethodAdjustmentDTO[]
      | CartTypes.CreateShippingMethodAdjustmentDTO,
    adjustments?: CartTypes.CreateShippingMethodAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | CartTypes.ShippingMethodAdjustmentDTO[]
    | CartTypes.ShippingMethodAdjustmentDTO
  > {
    const result = await this.addShippingMethodAdjustments_(
      cartIdOrData,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      | CartTypes.ShippingMethodAdjustmentDTO[]
      | CartTypes.ShippingMethodAdjustmentDTO
    >(result)
  }

  @InjectTransactionManager()
  protected async addShippingMethodAdjustments_(
    cartIdOrData:
      | string
      | CartTypes.CreateShippingMethodAdjustmentDTO[]
      | CartTypes.CreateShippingMethodAdjustmentDTO,
    adjustments?: CartTypes.CreateShippingMethodAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof ShippingMethodAdjustment>[]
    | InferEntityType<typeof ShippingMethodAdjustment>
  > {
    let addedAdjustments: InferEntityType<typeof ShippingMethodAdjustment>[] =
      []
    if (isString(cartIdOrData)) {
      const cart = await this.cartService_.retrieve(
        cartIdOrData,
        { select: ["id"], relations: ["shipping_methods"] },
        sharedContext
      )

      const methodIds = cart.shipping_methods?.map((method) => method.id)

      for (const adj of adjustments || []) {
        if (!methodIds?.includes(adj.shipping_method_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Shipping method with id ${adj.shipping_method_id} does not exist on cart with id ${cartIdOrData}`
          )
        }
      }

      addedAdjustments = await this.shippingMethodAdjustmentService_.create(
        adjustments as CartTypes.CreateShippingMethodAdjustmentDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]

      addedAdjustments = await this.shippingMethodAdjustmentService_.create(
        data as CartTypes.CreateShippingMethodAdjustmentDTO[],
        sharedContext
      )
    }

    if (isObject(cartIdOrData)) {
      return addedAdjustments[0]
    }

    return addedAdjustments
  }

  async addLineItemTaxLines(
    taxLines: CartTypes.CreateLineItemTaxLineDTO[]
  ): Promise<CartTypes.LineItemTaxLineDTO[]>
  addLineItemTaxLines(
    taxLine: CartTypes.CreateLineItemTaxLineDTO
  ): Promise<CartTypes.LineItemTaxLineDTO>
  addLineItemTaxLines(
    cartId: string,
    taxLines:
      | CartTypes.CreateLineItemTaxLineDTO[]
      | CartTypes.CreateShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<CartTypes.LineItemTaxLineDTO[]>

  @InjectManager()
  @EmitEvents()
  async addLineItemTaxLines(
    cartIdOrData:
      | string
      | CartTypes.CreateLineItemTaxLineDTO[]
      | CartTypes.CreateLineItemTaxLineDTO,
    taxLines?:
      | CartTypes.CreateLineItemTaxLineDTO[]
      | CartTypes.CreateLineItemTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemTaxLineDTO[] | CartTypes.LineItemTaxLineDTO> {
    const result = await this.addLineItemTaxLines_(
      cartIdOrData,
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.LineItemTaxLineDTO[] | CartTypes.LineItemTaxLineDTO
    >(result)
  }

  @InjectTransactionManager()
  protected async addLineItemTaxLines_(
    cartIdOrData:
      | string
      | CartTypes.CreateLineItemTaxLineDTO[]
      | CartTypes.CreateLineItemTaxLineDTO,
    taxLines?:
      | CartTypes.CreateLineItemTaxLineDTO[]
      | CartTypes.CreateLineItemTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof LineItemTaxLine>[]
    | InferEntityType<typeof LineItemTaxLine>
  > {
    let addedTaxLines: InferEntityType<typeof LineItemTaxLine>[]
    if (isString(cartIdOrData)) {
      // existence check
      const cart = await this.cartService_.retrieve(
        cartIdOrData,
        { select: ["id"] },
        sharedContext
      )

      if (!cart) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cart with id ${cartIdOrData} does not exist`
        )
      }

      const lines = Array.isArray(taxLines) ? taxLines : [taxLines]

      addedTaxLines = await this.lineItemTaxLineService_.create(
        lines,
        sharedContext
      )
    } else {
      const data = Array.isArray(cartIdOrData) ? cartIdOrData : [cartIdOrData]

      addedTaxLines = await this.lineItemTaxLineService_.create(
        data,
        sharedContext
      )
    }

    if (isObject(cartIdOrData)) {
      return addedTaxLines[0]
    }

    return addedTaxLines
  }

  @InjectManager()
  @EmitEvents()
  async setLineItemTaxLines(
    cartId: string,
    taxLines: (
      | CartTypes.CreateLineItemTaxLineDTO
      | CartTypes.UpdateLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.LineItemTaxLineDTO[]> {
    const result = await this.setLineItemTaxLines_(
      cartId,
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<CartTypes.LineItemTaxLineDTO[]>(
      result
    )
  }

  @InjectTransactionManager()
  protected async setLineItemTaxLines_(
    cartId: string,
    taxLines: (
      | CartTypes.CreateLineItemTaxLineDTO
      | CartTypes.UpdateLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof LineItemTaxLine>[]> {
    const normalizedTaxLines = (
      taxLines as CartTypes.UpdateLineItemTaxLineDTO[]
    ).map((taxLine) => {
      // Pre generate the id so that we can optimized the actions below
      taxLine.id = generateEntityId(taxLine.id, "calitxl")
      return taxLine
    })

    const taxLineIdsSet = new Set<string>(
      normalizedTaxLines.map(
        (taxLine) => (taxLine as CartTypes.UpdateLineItemTaxLineDTO)?.id
      )
    )

    const deleteConstraints: {
      id?: {
        $nin: string[]
      }
      item: { cart_id: string }
    } = {
      item: { cart_id: cartId },
    }

    if (taxLineIdsSet.size) {
      deleteConstraints.id = {
        $nin: Array.from(taxLineIdsSet),
      }
    }

    const [result] = await promiseAll([
      normalizedTaxLines.length
        ? this.lineItemTaxLineService_.upsert(normalizedTaxLines, sharedContext)
        : [],
      this.lineItemTaxLineService_.softDelete(deleteConstraints, sharedContext),
    ])

    return result
  }

  addShippingMethodTaxLines(
    taxLines: CartTypes.CreateShippingMethodTaxLineDTO[]
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]>
  addShippingMethodTaxLines(
    taxLine: CartTypes.CreateShippingMethodTaxLineDTO
  ): Promise<CartTypes.ShippingMethodTaxLineDTO>
  addShippingMethodTaxLines(
    cartId: string,
    taxLines:
      | CartTypes.CreateShippingMethodTaxLineDTO[]
      | CartTypes.CreateShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]>

  @InjectManager()
  @EmitEvents()
  async addShippingMethodTaxLines(
    cartIdOrData:
      | string
      | CartTypes.CreateShippingMethodTaxLineDTO[]
      | CartTypes.CreateShippingMethodTaxLineDTO,
    taxLines?:
      | CartTypes.CreateShippingMethodTaxLineDTO[]
      | CartTypes.CreateShippingMethodTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    CartTypes.ShippingMethodTaxLineDTO[] | CartTypes.ShippingMethodTaxLineDTO
  > {
    const result = await this.addShippingMethodTaxLines_(
      cartIdOrData,
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodTaxLineDTO[] | CartTypes.ShippingMethodTaxLineDTO
    >(result)
  }

  @InjectTransactionManager()
  protected async addShippingMethodTaxLines_(
    cartIdOrData:
      | string
      | CartTypes.CreateShippingMethodTaxLineDTO[]
      | CartTypes.CreateShippingMethodTaxLineDTO,
    taxLines?:
      | CartTypes.CreateShippingMethodTaxLineDTO[]
      | CartTypes.CreateShippingMethodTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof ShippingMethodTaxLine>[]
    | InferEntityType<typeof ShippingMethodTaxLine>
  > {
    let addedTaxLines: InferEntityType<typeof ShippingMethodTaxLine>[]
    if (isString(cartIdOrData)) {
      // existence check
      const cart = await this.cartService_.retrieve(
        cartIdOrData,
        { select: ["id"] },
        sharedContext
      )

      if (!cart) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cart with id ${cartIdOrData} does not exist`
        )
      }

      const lines = Array.isArray(taxLines) ? taxLines : [taxLines]

      addedTaxLines = await this.shippingMethodTaxLineService_.create(
        lines,
        sharedContext
      )
    } else {
      const lines = Array.isArray(taxLines) ? taxLines : [taxLines]

      addedTaxLines = await this.shippingMethodTaxLineService_.create(
        lines,
        sharedContext
      )
    }

    if (isObject(cartIdOrData)) {
      return addedTaxLines[0]
    }

    return addedTaxLines
  }

  @InjectManager()
  @EmitEvents()
  async setShippingMethodTaxLines(
    cartId: string,
    taxLines: (
      | CartTypes.CreateShippingMethodTaxLineDTO
      | CartTypes.UpdateShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<CartTypes.ShippingMethodTaxLineDTO[]> {
    const result = await this.setShippingMethodTaxLines_(
      cartId,
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      CartTypes.ShippingMethodTaxLineDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async setShippingMethodTaxLines_(
    cartId: string,
    taxLines: (
      | CartTypes.CreateShippingMethodTaxLineDTO
      | CartTypes.UpdateShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingMethodTaxLine>[]> {
    const normalizedTaxLines = (
      taxLines as CartTypes.UpdateShippingMethodTaxLineDTO[]
    ).map((taxLine) => {
      taxLine.id = generateEntityId(taxLine.id, "casmtxl")
      return taxLine
    })

    const taxLineIdsSet = new Set(
      normalizedTaxLines.map(
        (taxLine) => (taxLine as CartTypes.UpdateShippingMethodTaxLineDTO)?.id
      )
    )

    const deleteConstraints: {
      id?: {
        $nin: string[]
      }
      shipping_method: { cart_id: string }
    } = {
      shipping_method: { cart_id: cartId },
    }

    if (taxLineIdsSet.size) {
      deleteConstraints.id = {
        $nin: Array.from(taxLineIdsSet),
      }
    }

    const [result] = await promiseAll([
      taxLines.length
        ? this.shippingMethodTaxLineService_.upsert(taxLines, sharedContext)
        : [],
      this.shippingMethodTaxLineService_.softDelete(
        deleteConstraints,
        sharedContext
      ),
    ])

    return result
  }
}
