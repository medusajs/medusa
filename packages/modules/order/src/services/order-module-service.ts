import {
  Context,
  CreateOrderChangeActionDTO,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  IOrderModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  OrderDTO,
  OrderTypes,
  UpdateOrderItemWithSelectorDTO,
  UpdateOrderReturnReasonDTO,
  UpdateOrderTransactionDTO,
} from "@medusajs/types"
import {
  createRawPropertiesFromBigNumber,
  decorateCartTotals,
  deduplicate,
  getShippingMethodsTotals,
  InjectManager,
  InjectTransactionManager,
  isObject,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  OrderChangeStatus,
  promiseAll,
} from "@medusajs/utils"
import {
  Address,
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  Order,
  OrderChange,
  OrderChangeAction,
  OrderItem,
  OrderShippingMethod,
  OrderSummary,
  ReturnReason,
  ShippingMethod,
  ShippingMethodAdjustment,
  ShippingMethodTaxLine,
  Transaction,
} from "@models"
import {
  CreateOrderItemDTO,
  CreateOrderLineItemDTO,
  CreateOrderLineItemTaxLineDTO,
  CreateOrderShippingMethodDTO,
  CreateOrderShippingMethodTaxLineDTO,
  UpdateOrderItemDTO,
  UpdateOrderLineItemDTO,
  UpdateOrderLineItemTaxLineDTO,
  UpdateOrderShippingMethodTaxLineDTO,
} from "@types"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { calculateOrderChange, ChangeActionType } from "../utils"
import { formatOrder } from "../utils/transform-order"
import OrderChangeService from "./order-change-service"
import OrderService from "./order-service"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  orderService: OrderService<any>
  addressService: ModulesSdkTypes.InternalModuleService<any>
  lineItemService: ModulesSdkTypes.InternalModuleService<any>
  shippingMethodAdjustmentService: ModulesSdkTypes.InternalModuleService<any>
  shippingMethodService: ModulesSdkTypes.InternalModuleService<any>
  lineItemAdjustmentService: ModulesSdkTypes.InternalModuleService<any>
  lineItemTaxLineService: ModulesSdkTypes.InternalModuleService<any>
  shippingMethodTaxLineService: ModulesSdkTypes.InternalModuleService<any>
  transactionService: ModulesSdkTypes.InternalModuleService<any>
  orderChangeService: OrderChangeService<any>
  orderChangeActionService: ModulesSdkTypes.InternalModuleService<any>
  orderItemService: ModulesSdkTypes.InternalModuleService<any>
  orderSummaryService: ModulesSdkTypes.InternalModuleService<any>
  orderShippingMethodService: ModulesSdkTypes.InternalModuleService<any>
  returnReasonService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [
  Address,
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  ShippingMethod,
  ShippingMethodAdjustment,
  ShippingMethodTaxLine,
  Transaction,
  OrderChange,
  OrderChangeAction,
  OrderItem,
  OrderSummary,
  OrderShippingMethod,
  ReturnReason,
]

export default class OrderModuleService<
    TOrder extends Order = Order,
    TAddress extends Address = Address,
    TLineItem extends LineItem = LineItem,
    TLineItemAdjustment extends LineItemAdjustment = LineItemAdjustment,
    TLineItemTaxLine extends LineItemTaxLine = LineItemTaxLine,
    TShippingMethodAdjustment extends ShippingMethodAdjustment = ShippingMethodAdjustment,
    TShippingMethodTaxLine extends ShippingMethodTaxLine = ShippingMethodTaxLine,
    TShippingMethod extends ShippingMethod = ShippingMethod,
    TTransaction extends Transaction = Transaction,
    TOrderChange extends OrderChange = OrderChange,
    TOrderChangeAction extends OrderChangeAction = OrderChangeAction,
    TOrderItem extends OrderItem = OrderItem,
    TOrderSummary extends OrderSummary = OrderSummary,
    TOrderShippingMethod extends OrderShippingMethod = OrderShippingMethod,
    TReturnReason extends ReturnReason = ReturnReason
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    OrderTypes.OrderDTO,
    {
      Address: { dto: OrderTypes.OrderAddressDTO }
      LineItem: { dto: OrderTypes.OrderLineItemDTO }
      LineItemAdjustment: { dto: OrderTypes.OrderLineItemAdjustmentDTO }
      LineItemTaxLine: { dto: OrderTypes.OrderLineItemTaxLineDTO }
      ShippingMethod: { dto: OrderTypes.OrderShippingMethodDTO }
      ShippingMethodAdjustment: {
        dto: OrderTypes.OrderShippingMethodAdjustmentDTO
      }
      ShippingMethodTaxLine: { dto: OrderTypes.OrderShippingMethodTaxLineDTO }
      Transaction: { dto: OrderTypes.OrderTransactionDTO }
      OrderChange: { dto: OrderTypes.OrderChangeDTO }
      OrderChangeAction: { dto: OrderTypes.OrderChangeActionDTO }
      OrderItem: { dto: OrderTypes.OrderItemDTO }
      OrderSummary: { dto: OrderTypes.OrderSummaryDTO }
      OrderShippingMethod: { dto: OrderShippingMethod }
      ReturnReason: { dto: OrderTypes.OrderReturnReasonDTO }
    }
  >(Order, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IOrderModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected orderService_: OrderService<TOrder>
  protected addressService_: ModulesSdkTypes.InternalModuleService<TAddress>
  protected lineItemService_: ModulesSdkTypes.InternalModuleService<TLineItem>
  protected shippingMethodAdjustmentService_: ModulesSdkTypes.InternalModuleService<TShippingMethodAdjustment>
  protected shippingMethodService_: ModulesSdkTypes.InternalModuleService<TShippingMethod>
  protected lineItemAdjustmentService_: ModulesSdkTypes.InternalModuleService<TLineItemAdjustment>
  protected lineItemTaxLineService_: ModulesSdkTypes.InternalModuleService<TLineItemTaxLine>
  protected shippingMethodTaxLineService_: ModulesSdkTypes.InternalModuleService<TShippingMethodTaxLine>
  protected transactionService_: ModulesSdkTypes.InternalModuleService<TTransaction>
  protected orderChangeService_: OrderChangeService<TOrderChange>
  protected orderChangeActionService_: ModulesSdkTypes.InternalModuleService<TOrderChangeAction>
  protected orderItemService_: ModulesSdkTypes.InternalModuleService<TOrderItem>
  protected orderSummaryService_: ModulesSdkTypes.InternalModuleService<TOrderSummary>
  protected orderShippingMethodService_: ModulesSdkTypes.InternalModuleService<TOrderShippingMethod>
  protected returnReasonService_: ModulesSdkTypes.InternalModuleService<TReturnReason>

  constructor(
    {
      baseRepository,
      orderService,
      addressService,
      lineItemService,
      shippingMethodAdjustmentService,
      shippingMethodService,
      lineItemAdjustmentService,
      shippingMethodTaxLineService,
      lineItemTaxLineService,
      transactionService,
      orderChangeService,
      orderChangeActionService,
      orderItemService,
      orderSummaryService,
      orderShippingMethodService,
      returnReasonService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.orderService_ = orderService
    this.addressService_ = addressService
    this.lineItemService_ = lineItemService
    this.shippingMethodAdjustmentService_ = shippingMethodAdjustmentService
    this.shippingMethodService_ = shippingMethodService
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
    this.shippingMethodTaxLineService_ = shippingMethodTaxLineService
    this.lineItemTaxLineService_ = lineItemTaxLineService
    this.transactionService_ = transactionService
    this.orderChangeService_ = orderChangeService
    this.orderChangeActionService_ = orderChangeActionService
    this.orderItemService_ = orderItemService
    this.orderSummaryService_ = orderSummaryService
    this.orderShippingMethodService_ = orderShippingMethodService
    this.returnReasonService_ = returnReasonService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
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
      "original_shipping_tax_subtotal",
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

  async retrieve(
    id: string,
    config?: FindConfig<any> | undefined,
    sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderDTO> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const order = await super.retrieve(id, config, sharedContext)

    return formatOrder(order, { includeTotals }) as OrderTypes.OrderDTO
  }

  async list(
    filters?: any,
    config?: FindConfig<any> | undefined,
    sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderDTO[]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const orders = await super.list(filters, config, sharedContext)

    return formatOrder(orders, {
      includeTotals,
    }) as OrderTypes.OrderDTO[]
  }

  async listAndCount(
    filters?: any,
    config?: FindConfig<any> | undefined,
    sharedContext?: Context | undefined
  ): Promise<[OrderTypes.OrderDTO[], number]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const [orders, count] = await super.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      formatOrder(orders, { includeTotals }) as OrderTypes.OrderDTO[],
      count,
    ]
  }

  async create(
    data: OrderTypes.CreateOrderDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  async create(
    data: OrderTypes.CreateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>

  @InjectManager("baseRepository_")
  async create(
    data: OrderTypes.CreateOrderDTO[] | OrderTypes.CreateOrderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[] | OrderTypes.OrderDTO> {
    const input = Array.isArray(data) ? data : [data]

    const orders = await this.create_(input, sharedContext)

    const result = await this.list(
      {
        id: orders.map((p) => p!.id),
      },
      {
        relations: [
          "shipping_address",
          "billing_address",
          "summary",
          "items",
          "items.tax_lines",
          "items.adjustments",
          "shipping_methods",
          "shipping_methods.tax_lines",
          "shipping_methods.adjustments",
          "transactions",
        ],
      },
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | OrderTypes.OrderDTO
      | OrderTypes.OrderDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: OrderTypes.CreateOrderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const lineItemsToCreate: CreateOrderLineItemDTO[] = []

    const createdOrders: Order[] = []
    for (const { items, shipping_methods, ...order } of data) {
      const ord = order as any

      const shippingMethods = shipping_methods?.map((sm: any) => {
        return {
          shipping_method: { ...sm },
        }
      })

      ord.shipping_methods = shippingMethods

      const orderWithTotals = decorateCartTotals({
        ...ord,
        items,
      }) as any
      const calculated = calculateOrderChange({
        order: orderWithTotals,
        actions: [],
        transactions: order.transactions,
      })
      createRawPropertiesFromBigNumber(calculated)

      ord.summary = {
        totals: calculated.summary,
      }

      const created = await this.orderService_.create(ord, sharedContext)

      createdOrders.push(created)

      if (items?.length) {
        const orderItems = items.map((item) => {
          return {
            ...item,
            order_id: created.id,
          }
        })

        lineItemsToCreate.push(...orderItems)
      }
    }

    if (lineItemsToCreate.length) {
      await this.createLineItemsBulk_(lineItemsToCreate, sharedContext)
    }

    return createdOrders
  }

  async update(
    data: OrderTypes.UpdateOrderDTO[]
  ): Promise<OrderTypes.OrderDTO[]>
  async update(
    orderId: string,
    data: OrderTypes.UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>
  async update(
    selector: Partial<OrderTypes.FilterableOrderProps>,
    data: OrderTypes.UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectManager("baseRepository_")
  async update(
    dataOrIdOrSelector:
      | OrderTypes.UpdateOrderDTO[]
      | string
      | Partial<OrderTypes.FilterableOrderProps>,
    data?: OrderTypes.UpdateOrderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[] | OrderTypes.OrderDTO> {
    const result = await this.update_(dataOrIdOrSelector, data, sharedContext)

    const serializedResult = await this.baseRepository_.serialize<
      OrderTypes.OrderDTO[]
    >(result, {
      populate: true,
    })

    return isString(dataOrIdOrSelector) ? serializedResult[0] : serializedResult
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    dataOrIdOrSelector:
      | OrderTypes.UpdateOrderDTO[]
      | string
      | Partial<OrderTypes.FilterableOrderProps>,
    data?: OrderTypes.UpdateOrderDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let toUpdate: OrderTypes.UpdateOrderDTO[] = []
    if (isString(dataOrIdOrSelector)) {
      toUpdate = [
        {
          id: dataOrIdOrSelector,
          ...data,
        },
      ]
    } else if (Array.isArray(dataOrIdOrSelector)) {
      toUpdate = dataOrIdOrSelector
    } else {
      const orders = await this.orderService_.list(
        { ...dataOrIdOrSelector },
        { select: ["id"] },
        sharedContext
      )

      toUpdate = orders.map((order) => {
        return {
          ...data,
          id: order.id,
        }
      })
    }

    const result = await this.orderService_.update(toUpdate, sharedContext)
    return result
  }

  createLineItems(
    data: OrderTypes.CreateOrderLineItemForOrderDTO
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  createLineItems(
    data: OrderTypes.CreateOrderLineItemForOrderDTO[]
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  createLineItems(
    orderId: string,
    items: OrderTypes.CreateOrderLineItemDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemDTO[]>

  @InjectManager("baseRepository_")
  async createLineItems(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderLineItemForOrderDTO[]
      | OrderTypes.CreateOrderLineItemForOrderDTO,
    data?:
      | OrderTypes.CreateOrderLineItemDTO[]
      | OrderTypes.CreateOrderLineItemDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemDTO[]> {
    let items: LineItem[] = []
    if (isString(orderIdOrData)) {
      items = await this.createLineItems_(
        orderIdOrData,
        data as OrderTypes.CreateOrderLineItemDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      const allOrderIds = data.map((dt) => dt.order_id)
      const order = await this.list(
        { id: allOrderIds },
        { select: ["id", "version"] },
        sharedContext
      )
      const mapOrderVersion = order.reduce((acc, curr) => {
        acc[curr.id] = curr.version
        return acc
      }, {})

      const lineItems = data.map((dt) => {
        return {
          ...dt,
          version: mapOrderVersion[dt.order_id],
        }
      })

      items = await this.createLineItemsBulk_(lineItems, sharedContext)
    }

    return await this.baseRepository_.serialize<OrderTypes.OrderLineItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async createLineItems_(
    orderId: string,
    items: OrderTypes.CreateOrderLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id", "version"] },
      sharedContext
    )

    const toUpdate: CreateOrderLineItemDTO[] = items.map((item) => {
      return {
        ...item,
        order_id: order.id,
        version: order.version,
      }
    })

    return await this.createLineItemsBulk_(toUpdate, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async createLineItemsBulk_(
    data: CreateOrderLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    const orderItemToCreate: CreateOrderItemDTO[] = []

    const lineItems = await this.lineItemService_.create(data, sharedContext)

    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i]
      const toCreate = data[i]

      if (toCreate.order_id) {
        orderItemToCreate.push({
          order_id: toCreate.order_id,
          version: toCreate.version ?? 1,
          item_id: item.id,
          quantity: toCreate.quantity,
        })
      }
    }

    if (orderItemToCreate.length) {
      await this.orderItemService_.create(orderItemToCreate, sharedContext)
    }

    return lineItems
  }

  updateLineItems(
    data: OrderTypes.UpdateOrderLineItemWithSelectorDTO[]
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  updateLineItems(
    selector: Partial<OrderTypes.FilterableOrderLineItemProps>,
    data: OrderTypes.UpdateOrderLineItemDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  updateLineItems(
    lineItemId: string,
    data: Partial<OrderTypes.UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemDTO>

  @InjectManager("baseRepository_")
  async updateLineItems(
    lineItemIdOrDataOrSelector:
      | string
      | OrderTypes.UpdateOrderLineItemWithSelectorDTO[]
      | Partial<OrderTypes.FilterableOrderLineItemProps>,
    data?:
      | OrderTypes.UpdateOrderLineItemDTO
      | Partial<OrderTypes.UpdateOrderLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemDTO[] | OrderTypes.OrderLineItemDTO> {
    let items: LineItem[] = []
    if (isString(lineItemIdOrDataOrSelector)) {
      const item = await this.updateLineItem_(
        lineItemIdOrDataOrSelector,
        data as Partial<OrderTypes.UpdateOrderLineItemDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<OrderTypes.OrderLineItemDTO>(
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
          } as OrderTypes.UpdateOrderLineItemWithSelectorDTO,
        ]

    items = await this.updateLineItemsWithSelector_(toUpdate, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderLineItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateLineItem_(
    lineItemId: string,
    data: Partial<OrderTypes.UpdateOrderLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem> {
    const [item] = await this.lineItemService_.update(
      [{ id: lineItemId, ...data }],
      sharedContext
    )

    if ("quantity" in data) {
      await this.updateOrderItemWithSelector_(
        [
          {
            selector: { item_id: item.id },
            data,
          },
        ],
        sharedContext
      )
    }

    return item
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateLineItemsWithSelector_(
    updates: OrderTypes.UpdateOrderLineItemWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    let toUpdate: UpdateOrderLineItemDTO[] = []
    const detailsToUpdate: UpdateOrderItemWithSelectorDTO[] = []
    for (const { selector, data } of updates) {
      const items = await this.listLineItems({ ...selector }, {}, sharedContext)

      items.forEach((item) => {
        toUpdate.push({
          ...data,
          id: item.id,
        })

        if ("quantity" in data) {
          detailsToUpdate.push({
            selector: { item_id: item.id },
            data,
          })
        }
      })
    }

    if (detailsToUpdate.length) {
      await this.updateOrderItemWithSelector_(detailsToUpdate, sharedContext)
    }

    return await this.lineItemService_.update(toUpdate, sharedContext)
  }

  updateOrderItem(
    selector: Partial<OrderTypes.OrderItemDTO>,
    data: OrderTypes.UpdateOrderItemDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderItemDTO[]>
  updateOrderItem(
    orderItemId: string,
    data: Partial<OrderTypes.UpdateOrderItemDTO>,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderItemDTO>

  @InjectManager("baseRepository_")
  async updateOrderItem(
    orderItemIdOrDataOrSelector:
      | string
      | OrderTypes.UpdateOrderItemWithSelectorDTO[]
      | Partial<OrderTypes.OrderItemDTO>,
    data?:
      | OrderTypes.UpdateOrderItemDTO
      | Partial<OrderTypes.UpdateOrderItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderItemDTO[] | OrderTypes.OrderItemDTO> {
    let items: OrderItem[] = []
    if (isString(orderItemIdOrDataOrSelector)) {
      const item = await this.updateOrderItem_(
        orderItemIdOrDataOrSelector,
        data as Partial<OrderTypes.UpdateOrderItemDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<OrderTypes.OrderItemDTO>(
        item,
        {
          populate: true,
        }
      )
    }

    const toUpdate = Array.isArray(orderItemIdOrDataOrSelector)
      ? orderItemIdOrDataOrSelector
      : [
          {
            selector: orderItemIdOrDataOrSelector,
            data: data,
          } as OrderTypes.UpdateOrderItemWithSelectorDTO,
        ]

    items = await this.updateOrderItemWithSelector_(toUpdate, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateOrderItem_(
    orderItemId: string,
    data: Partial<OrderTypes.UpdateOrderItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderItem> {
    const [detail] = await this.orderItemService_.update(
      [{ id: orderItemId, ...data }],
      sharedContext
    )

    return detail
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateOrderItemWithSelector_(
    updates: OrderTypes.UpdateOrderItemWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderItem[]> {
    let toUpdate: UpdateOrderItemDTO[] = []
    for (const { selector, data } of updates) {
      const details = await this.listOrderItems(
        { ...selector },
        {},
        sharedContext
      )

      details.forEach((detail) => {
        toUpdate.push({
          ...data,
          id: detail.id,
        })
      })
    }

    return await this.orderItemService_.update(toUpdate, sharedContext)
  }

  async createAddresses(
    data: OrderTypes.CreateOrderAddressDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderAddressDTO>
  async createAddresses(
    data: OrderTypes.CreateOrderAddressDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderAddressDTO[]>

  @InjectManager("baseRepository_")
  async createAddresses(
    data: OrderTypes.CreateOrderAddressDTO[] | OrderTypes.CreateOrderAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderAddressDTO | OrderTypes.OrderAddressDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const addresses = await this.createAddresses_(input, sharedContext)

    const result = await this.listAddresses(
      { id: addresses.map((p) => p.id) },
      {},
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | OrderTypes.OrderAddressDTO
      | OrderTypes.OrderAddressDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createAddresses_(
    data: OrderTypes.CreateOrderAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.create(data, sharedContext)
  }

  async updateAddresses(
    data: OrderTypes.UpdateOrderAddressDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderAddressDTO>
  async updateAddresses(
    data: OrderTypes.UpdateOrderAddressDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderAddressDTO[]>

  @InjectManager("baseRepository_")
  async updateAddresses(
    data: OrderTypes.UpdateOrderAddressDTO[] | OrderTypes.UpdateOrderAddressDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderAddressDTO | OrderTypes.OrderAddressDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const addresses = await this.updateAddresses_(input, sharedContext)

    const result = await this.listAddresses(
      { id: addresses.map((p) => p.id) },
      {},
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | OrderTypes.OrderAddressDTO
      | OrderTypes.OrderAddressDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateAddresses_(
    data: OrderTypes.UpdateOrderAddressDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.addressService_.update(data, sharedContext)
  }

  async createShippingMethods(
    data: OrderTypes.CreateOrderShippingMethodDTO
  ): Promise<OrderTypes.OrderShippingMethodDTO>
  async createShippingMethods(
    data: OrderTypes.CreateOrderShippingMethodDTO[]
  ): Promise<OrderTypes.OrderShippingMethodDTO[]>
  async createShippingMethods(
    orderId: string,
    methods: OrderTypes.CreateOrderShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodDTO[]>

  @InjectManager("baseRepository_")
  async createShippingMethods(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderShippingMethodDTO[]
      | OrderTypes.CreateOrderShippingMethodDTO,
    data?: OrderTypes.CreateOrderShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderShippingMethodDTO[] | OrderTypes.OrderShippingMethodDTO
  > {
    let methods: ShippingMethod[]
    if (isString(orderIdOrData)) {
      methods = await this.createShippingMethods_(
        orderIdOrData,
        data!,
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      const allOrderIds = data.map((dt) => dt.order_id)
      const order = await this.list(
        { id: allOrderIds },
        { select: ["id", "version"] },
        sharedContext
      )
      const mapOrderVersion = order.reduce((acc, curr) => {
        acc[curr.id] = curr.version
        return acc
      }, {})

      const orderShippingMethodData = data.map((dt) => {
        return {
          shipping_method: dt,
          order_id: dt.order_id,
          version: mapOrderVersion[dt.order_id],
        }
      })
      methods = await this.createShippingMethodsBulk_(
        orderShippingMethodData as any,
        sharedContext
      )
    }

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodDTO[]
    >(methods, { populate: true })
  }

  @InjectTransactionManager("baseRepository_")
  protected async createShippingMethods_(
    orderId: string,
    data: CreateOrderShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ShippingMethod[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id", "version"] },
      sharedContext
    )

    const methods = data.map((method) => {
      return {
        shipping_method: method,
        order_id: order.id,
        version: method.version ?? order.version ?? 1,
      }
    })

    return await this.createShippingMethodsBulk_(methods, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async createShippingMethodsBulk_(
    data: {
      shipping_method: OrderTypes.CreateOrderShippingMethodDTO
      order_id: string
      version: number
    }[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ShippingMethod[]> {
    const sm = await this.orderShippingMethodService_.create(
      data as unknown as CreateOrderShippingMethodDTO[],
      sharedContext
    )

    return sm.map((s) => s.shipping_method)
  }

  async createLineItemAdjustments(
    adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[]
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>
  async createLineItemAdjustments(
    adjustment: OrderTypes.CreateOrderLineItemAdjustmentDTO
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>
  async createLineItemAdjustments(
    orderId: string,
    adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createLineItemAdjustments(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderLineItemAdjustmentDTO[]
      | OrderTypes.CreateOrderLineItemAdjustmentDTO,
    adjustments?: OrderTypes.CreateOrderLineItemAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]> {
    let addedAdjustments: LineItemAdjustment[] = []
    if (isString(orderIdOrData)) {
      const order = await this.retrieve(
        orderIdOrData,
        { select: ["id"], relations: ["items.item"] },
        sharedContext
      )

      const lineIds = order.items?.map((item) => item.id)

      for (const adj of adjustments || []) {
        if (!lineIds?.includes(adj.item_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Line item with id ${adj.item_id} does not exist on order with id ${orderIdOrData}`
          )
        }
      }

      addedAdjustments = await this.lineItemAdjustmentService_.create(
        adjustments as OrderTypes.CreateOrderLineItemAdjustmentDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      addedAdjustments = await this.lineItemAdjustmentService_.create(
        data as OrderTypes.CreateOrderLineItemAdjustmentDTO[],
        sharedContext
      )
    }

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemAdjustmentDTO[]
    >(addedAdjustments, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async setLineItemAdjustments(
    orderId: string,
    adjustments: (
      | OrderTypes.CreateOrderLineItemAdjustmentDTO
      | OrderTypes.UpdateOrderLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id"], relations: ["items.item.adjustments"] },
      sharedContext
    )

    const existingAdjustments = (order.items ?? [])
      .map((item) => item.adjustments ?? [])
      .flat()
      .map((adjustment) => adjustment.id)

    const adjustmentsSet = new Set(
      adjustments
        .map((a) => (a as OrderTypes.UpdateOrderLineItemAdjustmentDTO).id)
        .filter(Boolean)
    )

    const toDelete: string[] = []

    // From the existing adjustments, find the ones that are not passed in adjustments
    existingAdjustments.forEach((adj) => {
      if (!adjustmentsSet.has(adj)) {
        toDelete.push(adj)
      }
    })

    if (toDelete.length) {
      await this.lineItemAdjustmentService_.delete(toDelete, sharedContext)
    }

    let result = await this.lineItemAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemAdjustmentDTO[]
    >(result, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async setShippingMethodAdjustments(
    orderId: string,
    adjustments: (
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO
      | OrderTypes.UpdateOrderShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id"], relations: ["shipping_methods.adjustments"] },
      sharedContext
    )

    const existingAdjustments = (order.shipping_methods ?? [])
      .map((shippingMethod) => shippingMethod.adjustments ?? [])
      .flat()
      .map((adjustment) => adjustment.id)

    const adjustmentsSet = new Set(
      adjustments
        .map(
          (a) => (a as OrderTypes.UpdateOrderShippingMethodAdjustmentDTO)?.id
        )
        .filter(Boolean)
    )

    const toDelete: string[] = []

    // From the existing adjustments, find the ones that are not passed in adjustments
    existingAdjustments.forEach((adj) => {
      if (!adjustmentsSet.has(adj)) {
        toDelete.push(adj)
      }
    })

    if (toDelete.length) {
      await this.shippingMethodAdjustmentService_.delete(
        toDelete,
        sharedContext
      )
    }

    const result = await this.shippingMethodAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodAdjustmentDTO[]
    >(result, {
      populate: true,
    })
  }

  async createShippingMethodAdjustments(
    adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[]
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>
  async createShippingMethodAdjustments(
    adjustment: OrderTypes.CreateOrderShippingMethodAdjustmentDTO
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO>
  async createShippingMethodAdjustments(
    orderId: string,
    adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createShippingMethodAdjustments(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO[]
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO,
    adjustments?: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | OrderTypes.OrderShippingMethodAdjustmentDTO[]
    | OrderTypes.OrderShippingMethodAdjustmentDTO
  > {
    let addedAdjustments: ShippingMethodAdjustment[] = []
    if (isString(orderIdOrData)) {
      const order = await this.retrieve(
        orderIdOrData,
        { select: ["id"], relations: ["shipping_methods"] },
        sharedContext
      )

      const methodIds = order.shipping_methods?.map((method) => method.id)

      for (const adj of adjustments || []) {
        if (!methodIds?.includes(adj.shipping_method_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Shipping method with id ${adj.shipping_method_id} does not exist on order with id ${orderIdOrData}`
          )
        }
      }

      addedAdjustments = await this.shippingMethodAdjustmentService_.create(
        adjustments as OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      addedAdjustments = await this.shippingMethodAdjustmentService_.create(
        data as OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
        sharedContext
      )
    }

    if (isObject(orderIdOrData)) {
      return await this.baseRepository_.serialize<OrderTypes.OrderShippingMethodAdjustmentDTO>(
        addedAdjustments[0],
        {
          populate: true,
        }
      )
    }

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodAdjustmentDTO[]
    >(addedAdjustments, {
      populate: true,
    })
  }

  createLineItemTaxLines(
    taxLines: OrderTypes.CreateOrderLineItemTaxLineDTO[]
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>
  createLineItemTaxLines(
    taxLine: OrderTypes.CreateOrderLineItemTaxLineDTO
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO>
  createLineItemTaxLines(
    orderId: string,
    taxLines:
      | OrderTypes.CreateOrderLineItemTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createLineItemTaxLines(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderLineItemTaxLineDTO[]
      | OrderTypes.CreateOrderLineItemTaxLineDTO,
    taxLines?:
      | OrderTypes.CreateOrderLineItemTaxLineDTO[]
      | OrderTypes.CreateOrderLineItemTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderLineItemTaxLineDTO[] | OrderTypes.OrderLineItemTaxLineDTO
  > {
    let addedTaxLines: LineItemTaxLine[]
    if (isString(orderIdOrData)) {
      const lines = Array.isArray(taxLines) ? taxLines : [taxLines]

      addedTaxLines = await this.lineItemTaxLineService_.create(
        lines as CreateOrderLineItemTaxLineDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      addedTaxLines = await this.lineItemTaxLineService_.create(
        data as CreateOrderLineItemTaxLineDTO[],
        sharedContext
      )
    }

    const serialized = await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemTaxLineDTO[]
    >(addedTaxLines, {
      populate: true,
    })

    if (isObject(orderIdOrData)) {
      return serialized[0]
    }

    return serialized
  }

  @InjectTransactionManager("baseRepository_")
  async setLineItemTaxLines(
    orderId: string,
    taxLines: (
      | OrderTypes.CreateOrderLineItemTaxLineDTO
      | OrderTypes.UpdateOrderLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id"], relations: ["items.item.tax_lines"] },
      sharedContext
    )

    const existingTaxLines = (order.items ?? [])
      .map((item) => item.tax_lines ?? [])
      .flat()
      .map((taxLine) => taxLine.id)

    const taxLinesSet = new Set(
      taxLines
        .map(
          (taxLine) => (taxLine as OrderTypes.UpdateOrderLineItemTaxLineDTO)?.id
        )
        .filter(Boolean)
    )

    const toDelete: string[] = []
    existingTaxLines.forEach((taxLine: string) => {
      if (!taxLinesSet.has(taxLine)) {
        toDelete.push(taxLine)
      }
    })

    if (toDelete.length) {
      await this.lineItemTaxLineService_.delete(toDelete, sharedContext)
    }

    const result = await this.lineItemTaxLineService_.upsert(
      taxLines as UpdateOrderLineItemTaxLineDTO[],
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemTaxLineDTO[]
    >(result, {
      populate: true,
    })
  }

  createShippingMethodTaxLines(
    taxLines: OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>
  createShippingMethodTaxLines(
    taxLine: OrderTypes.CreateOrderShippingMethodTaxLineDTO
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO>
  createShippingMethodTaxLines(
    orderId: string,
    taxLines:
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createShippingMethodTaxLines(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    taxLines?:
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | OrderTypes.OrderShippingMethodTaxLineDTO[]
    | OrderTypes.OrderShippingMethodTaxLineDTO
  > {
    let addedTaxLines: ShippingMethodTaxLine[]
    if (isString(orderIdOrData)) {
      const lines = Array.isArray(taxLines) ? taxLines : [taxLines]

      addedTaxLines = await this.shippingMethodTaxLineService_.create(
        lines as CreateOrderShippingMethodTaxLineDTO[],
        sharedContext
      )
    } else {
      addedTaxLines = await this.shippingMethodTaxLineService_.create(
        taxLines as CreateOrderShippingMethodTaxLineDTO[],
        sharedContext
      )
    }

    const serialized =
      await this.baseRepository_.serialize<OrderTypes.OrderShippingMethodTaxLineDTO>(
        addedTaxLines[0],
        {
          populate: true,
        }
      )

    if (isObject(orderIdOrData)) {
      return serialized[0]
    }

    return serialized
  }

  @InjectTransactionManager("baseRepository_")
  async setShippingMethodTaxLines(
    orderId: string,
    taxLines: (
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO
      | OrderTypes.UpdateOrderShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id"], relations: ["shipping_methods.tax_lines"] },
      sharedContext
    )

    const existingTaxLines = (order.shipping_methods ?? [])
      .map((shippingMethod) => shippingMethod.tax_lines ?? [])
      .flat()
      .map((taxLine) => taxLine.id)

    const taxLinesSet = new Set(
      taxLines
        .map(
          (taxLine) =>
            (taxLine as OrderTypes.UpdateOrderShippingMethodTaxLineDTO)?.id
        )
        .filter(Boolean)
    )

    const toDelete: string[] = []
    existingTaxLines.forEach((taxLine: string) => {
      if (!taxLinesSet.has(taxLine)) {
        toDelete.push(taxLine)
      }
    })

    if (toDelete.length) {
      await this.shippingMethodTaxLineService_.delete(toDelete, sharedContext)
    }

    const result = await this.shippingMethodTaxLineService_.upsert(
      taxLines as UpdateOrderShippingMethodTaxLineDTO[],
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodTaxLineDTO[]
    >(result, {
      populate: true,
    })
  }

  async createOrderChange(
    data: OrderTypes.CreateOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeDTO>

  async createOrderChange(
    data: OrderTypes.CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeDTO[]>

  @InjectManager("baseRepository_")
  async createOrderChange(
    data: OrderTypes.CreateOrderChangeDTO | OrderTypes.CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeDTO | OrderTypes.OrderChangeDTO[]> {
    const changes = await this.createOrderChange_(data, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderChangeDTO>(
      Array.isArray(data) ? changes : changes[0],
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async createOrderChange_(
    data: OrderTypes.CreateOrderChangeDTO | OrderTypes.CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderChange[]> {
    const dataArr = Array.isArray(data) ? data : [data]

    const orderIds: string[] = []
    const dataMap: Record<string, object> = {}
    for (const change of dataArr) {
      orderIds.push(change.order_id)
      dataMap[change.order_id] = change
    }

    const orders = await this.list(
      {
        id: orderIds,
      },
      {
        select: ["id", "version"],
      },
      sharedContext
    )

    if (orders.length !== orderIds.length) {
      const foundOrders = orders.map((o) => o.id)
      const missing = orderIds.filter((id) => !foundOrders.includes(id))
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order could not be found: ${missing.join(", ")}`
      )
    }

    const input = orders.map((order) => {
      return {
        ...dataMap[order.id],
        version: order.version + 1,
      } as any
    })

    return await this.orderChangeService_.create(input, sharedContext)
  }

  async cancelOrderChange(
    orderId: string,
    sharedContext?: Context
  ): Promise<void>

  async cancelOrderChange(
    orderId: string[],
    sharedContext?: Context
  ): Promise<void>

  async cancelOrderChange(
    data: OrderTypes.CancelOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>

  async cancelOrderChange(
    data: OrderTypes.CancelOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async cancelOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.CancelOrderChangeDTO
      | OrderTypes.CancelOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void> {
    const data = Array.isArray(orderChangeIdOrData)
      ? orderChangeIdOrData
      : [orderChangeIdOrData]

    const orderChangeIds = isString(data[0])
      ? data
      : (data as any).map((dt) => dt.id)

    await this.getAndValidateOrderChange_(orderChangeIds, false, sharedContext)

    const updates = data.map((dt) => {
      return {
        ...(isString(dt) ? { id: dt } : dt),
        canceled_at: new Date(),
        status: OrderChangeStatus.CANCELED,
      }
    })

    await this.orderChangeService_.update(updates as any, sharedContext)
  }

  async confirmOrderChange(
    orderChangeId: string,
    sharedContext?: Context
  ): Promise<void>

  async confirmOrderChange(
    orderChangeId: string[],
    sharedContext?: Context
  ): Promise<void>

  async confirmOrderChange(
    data: OrderTypes.ConfirmOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>

  async confirmOrderChange(
    data: OrderTypes.ConfirmOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async confirmOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.ConfirmOrderChangeDTO
      | OrderTypes.ConfirmOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void> {
    const data = Array.isArray(orderChangeIdOrData)
      ? orderChangeIdOrData
      : [orderChangeIdOrData]

    const orderChangeIds = isString(data[0])
      ? data
      : (data as any).map((dt) => dt.id)

    const orderChange = await this.getAndValidateOrderChange_(
      orderChangeIds,
      true,
      sharedContext
    )

    const updates = data.map((dt) => {
      return {
        ...(isString(dt) ? { id: dt } : dt),
        confirmed_at: new Date(),
        status: OrderChangeStatus.CONFIRMED,
      }
    })

    await this.orderChangeService_.update(updates as any, sharedContext)

    const orderChanges = orderChange.map((change) => {
      change.actions = change.actions.map((action) => {
        return {
          ...action,
          version: change.version,
          order_id: change.order_id,
        }
      })
      return change.actions
    })

    await this.applyOrderChanges_(orderChanges.flat(), sharedContext)
  }

  async declineOrderChange(
    orderChangeId: string,
    sharedContext?: Context
  ): Promise<void>

  async declineOrderChange(
    orderChangeId: string[],
    sharedContext?: Context
  ): Promise<void>

  async declineOrderChange(
    data: OrderTypes.DeclineOrderChangeDTO,
    sharedContext?: Context
  ): Promise<void>

  async declineOrderChange(
    data: OrderTypes.DeclineOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async declineOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.DeclineOrderChangeDTO
      | OrderTypes.DeclineOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<void> {
    const data = Array.isArray(orderChangeIdOrData)
      ? orderChangeIdOrData
      : [orderChangeIdOrData]

    const orderChangeIds = isString(data[0])
      ? data
      : (data as any).map((dt) => dt.id)

    await this.getAndValidateOrderChange_(orderChangeIds, false, sharedContext)

    const updates = data.map((dt) => {
      return {
        ...(isString(dt) ? { id: dt } : dt),
        declined_at: new Date(),
        status: OrderChangeStatus.DECLINED,
      }
    })

    await this.orderChangeService_.update(updates as any, sharedContext)
  }

  @InjectManager("baseRepository_")
  async applyPendingOrderActions(
    orderId: string | string[],
    sharedContext?: Context
  ): Promise<void> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]

    const orders = await this.list(
      { id: orderIds },
      {
        select: ["id", "version"],
      },
      sharedContext
    )

    const changes = await this.orderChangeActionService_.list(
      {
        order_id: orders.map((order) => order.id),
        version: orders[0].version,
        applied: false,
      },
      {
        select: [
          "id",
          "order_id",
          "ordering",
          "version",
          "applied",
          "reference",
          "reference_id",
          "action",
          "details",
          "amount",
          "raw_amount",
          "internal_note",
        ],
        order: {
          ordering: "ASC",
        },
      },
      sharedContext
    )

    await this.applyOrderChanges_(changes, sharedContext)
  }

  @InjectManager("baseRepository_")
  async revertLastVersion(orderId: string, sharedContext?: Context) {
    const order = await super.retrieve(
      orderId,
      {
        select: ["id", "version"],
      },
      sharedContext
    )

    if (order.version < 2) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order with id ${orderId} has no previous versions`
      )
    }

    return await this.revertLastChange_(order, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async revertLastChange_(
    order: OrderDTO,
    sharedContext?: Context
  ): Promise<void> {
    const currentVersion = order.version

    // Order Changes
    const orderChanges = await this.orderChangeService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderChangesIds = orderChanges.map((change) => change.id)

    await this.orderChangeService_.softDelete(orderChangesIds, sharedContext)

    // Order Changes Actions
    const orderChangesActions = await this.orderChangeActionService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderChangeActionsIds = orderChangesActions.map((action) => action.id)

    await this.orderChangeActionService_.softDelete(
      orderChangeActionsIds,
      sharedContext
    )

    // Order Summary
    const orderSummary = await this.orderSummaryService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderSummaryIds = orderSummary.map((summary) => summary.id)

    await this.orderSummaryService_.softDelete(orderSummaryIds, sharedContext)

    // Order Items
    const orderItems = await this.orderItemService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderItemIds = orderItems.map((summary) => summary.id)

    await this.orderItemService_.softDelete(orderItemIds, sharedContext)

    // Shipping Methods
    const orderShippingMethods = await this.orderShippingMethodService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderShippingMethodIds = orderShippingMethods.map(
      (summary) => summary.id
    )

    await this.orderShippingMethodService_.softDelete(
      orderShippingMethodIds,
      sharedContext
    )

    // Order
    await this.orderService_.update(
      {
        selector: {
          id: order.id,
        },
        data: {
          version: order.version - 1,
        },
      },
      sharedContext
    )
  }

  private async getAndValidateOrderChange_(
    orderChangeIds: string[],
    includeActions: boolean,
    sharedContext?: Context
  ): Promise<any> {
    const options = {
      select: ["id", "order_id", "version", "status"],
      relations: [] as string[],
      order: {},
    }

    if (includeActions) {
      options.select.push("actions")
      options.relations.push("actions")
      options.order = {
        actions: {
          ordering: "ASC",
        },
      }
    }

    const orderChanges = await this.listOrderChanges(
      {
        id: orderChangeIds,
      },
      options,
      sharedContext
    )

    if (orderChanges.length !== orderChangeIds.length) {
      const foundOrders = orderChanges.map((o) => o.id)
      const missing = orderChangeIds.filter((id) => !foundOrders.includes(id))
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order Change could not be found: ${missing.join(", ")}`
      )
    }

    for (const orderChange of orderChanges) {
      const notAllowed: string[] = []
      if (
        !(
          orderChange.status === OrderChangeStatus.PENDING ||
          orderChange.status === OrderChangeStatus.REQUESTED
        )
      ) {
        notAllowed.push(orderChange.id)
      }

      if (notAllowed.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Order Change cannot be modified: ${notAllowed.join(", ")}.`
        )
      }
    }

    return orderChanges
  }

  async addOrderAction(
    data: OrderTypes.CreateOrderChangeActionDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeActionDTO>
  async addOrderAction(
    data: OrderTypes.CreateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeActionDTO[]>
  @InjectTransactionManager("baseRepository_")
  async addOrderAction(
    data:
      | OrderTypes.CreateOrderChangeActionDTO
      | OrderTypes.CreateOrderChangeActionDTO[],
    sharedContext?: Context
  ): Promise<
    OrderTypes.OrderChangeActionDTO | OrderTypes.OrderChangeActionDTO[]
  > {
    let dataArr = Array.isArray(data) ? data : [data]

    const orderChangeMap = {}
    const orderChangeIds = dataArr
      .map((data, idx) => {
        if (data.order_change_id) {
          orderChangeMap[data.order_change_id] ??= []
          orderChangeMap[data.order_change_id].push(dataArr[idx])
        }
        return data.order_change_id
      })
      .filter(Boolean) as string[]

    if (orderChangeIds.length) {
      const ordChanges = await this.getAndValidateOrderChange_(
        orderChangeIds,
        false,
        sharedContext
      )
      for (const ordChange of ordChanges) {
        orderChangeMap[ordChange.id].forEach((data) => {
          if (data) {
            data.order_id = ordChange.order_id
            data.version = ordChange.version
          }
        })
      }
    }

    const actions = (await this.orderChangeActionService_.create(
      dataArr,
      sharedContext
    )) as OrderTypes.OrderChangeActionDTO[]
    return Array.isArray(data) ? actions : actions[0]
  }

  private async applyOrderChanges_(
    changeActions: any[],
    sharedContext?: Context
  ): Promise<void> {
    type ApplyOrderChangeDTO = {
      id: string
      order_id: string
      version: number
      actions: OrderChangeAction[]
      applied: boolean
    }

    const actionsMap: Record<string, any[]> = {}
    const ordersIds: string[] = []
    const usedActions: any[] = []

    for (const action of changeActions as ApplyOrderChangeDTO[]) {
      if (action.applied) {
        continue
      }

      ordersIds.push(action.order_id)

      actionsMap[action.order_id] ??= []
      actionsMap[action.order_id].push(action)

      usedActions.push({
        selector: {
          id: action.id,
        },
        data: {
          applied: true,
        },
      })
    }

    if (!ordersIds.length) {
      return
    }

    const orders = await this.list(
      { id: deduplicate(ordersIds) },
      {
        select: [
          "id",
          "version",
          "items.detail",
          "transactions",
          "summary",
          "total",
        ],
        relations: ["transactions", "items", "items.detail"],
      },
      sharedContext
    )

    const itemsToUpsert: OrderItem[] = []
    const shippingMethodsToInsert: OrderShippingMethod[] = []
    const summariesToUpsert: any[] = []
    const orderToUpdate: any[] = []

    for (const order of orders) {
      const calculated = calculateOrderChange({
        order: order as any,
        actions: actionsMap[order.id],
        transactions: order.transactions,
      })

      createRawPropertiesFromBigNumber(calculated)

      const version = actionsMap[order.id][0].version!

      for (const item of calculated.order.items) {
        const orderItem = item.detail as any
        itemsToUpsert.push({
          id: orderItem.version === version ? orderItem.id : undefined,
          item_id: item.id,
          order_id: order.id,
          version,
          quantity: item.detail.quantity,
          fulfilled_quantity: item.detail.fulfilled_quantity,
          shipped_quantity: item.detail.shipped_quantity,
          return_requested_quantity: item.detail.return_requested_quantity,
          return_received_quantity: item.detail.return_received_quantity,
          return_dismissed_quantity: item.detail.return_dismissed_quantity,
          written_off_quantity: item.detail.written_off_quantity,
          metadata: item.detail.metadata,
        } as any)
      }

      const orderSummary = order.summary as any
      summariesToUpsert.push({
        id: orderSummary.version === version ? orderSummary.id : undefined,
        order_id: order.id,
        version,
        totals: calculated.summary,
      })

      if (version > order.version) {
        for (const shippingMethod of order.shipping_methods ?? []) {
          const sm = {
            ...(shippingMethod as any).detail,
            version,
          }
          delete sm.id
          shippingMethodsToInsert.push(sm)
        }

        orderToUpdate.push({
          selector: {
            id: order.id,
          },
          data: {
            version,
          },
        })
      }
    }

    await promiseAll([
      orderToUpdate.length
        ? this.orderService_.update(orderToUpdate, sharedContext)
        : null,
      usedActions.length
        ? this.orderChangeActionService_.update(usedActions, sharedContext)
        : null,
      itemsToUpsert.length
        ? this.orderItemService_.upsert(itemsToUpsert, sharedContext)
        : null,
      summariesToUpsert.length
        ? this.orderSummaryService_.upsert(summariesToUpsert, sharedContext)
        : null,
      shippingMethodsToInsert.length
        ? this.orderShippingMethodService_.create(
            shippingMethodsToInsert,
            sharedContext
          )
        : null,
    ])
  }

  @InjectTransactionManager("baseRepository_")
  async registerFulfillment(
    data: OrderTypes.RegisterOrderFulfillmentDTO,
    sharedContext?: Context
  ): Promise<void> {
    const items = data.items.map((item) => {
      return {
        action: ChangeActionType.FULFILL_ITEM,
        internal_note: item.internal_note,
        reference: data.reference,
        reference_id: data.reference_id,
        details: {
          reference_id: item.id,
          quantity: item.quantity,
          metadata: item.metadata,
        },
      }
    })

    const change = await this.createOrderChange_(
      {
        order_id: data.order_id,
        description: data.description,
        internal_note: data.internal_note,
        created_by: data.created_by,
        metadata: data.metadata,
        actions: items,
      },
      sharedContext
    )

    await this.confirmOrderChange(change[0].id, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async registerShipment(
    data: OrderTypes.RegisterOrderShipmentDTO,
    sharedContext?: Context
  ): Promise<void> {
    let shippingMethodId

    if (!isString(data.shipping_method)) {
      const methods = await this.createShippingMethods(
        data.order_id,
        data.shipping_method as any,
        sharedContext
      )
      shippingMethodId = methods[0].id
    } else {
      shippingMethodId = data.shipping_method
    }

    const method = await this.shippingMethodService_.retrieve(
      shippingMethodId,
      {
        relations: ["tax_lines", "adjustments"],
      },
      sharedContext
    )

    const calculatedAmount = getShippingMethodsTotals([method as any], {})[
      method.id
    ]

    const actions: CreateOrderChangeActionDTO[] = data.items.map((item) => {
      return {
        action: ChangeActionType.SHIP_ITEM,
        internal_note: item.internal_note,
        reference: data.reference,
        reference_id: shippingMethodId,
        details: {
          reference_id: item.id,
          quantity: item.quantity,
          metadata: item.metadata,
        },
      }
    })

    if (shippingMethodId) {
      actions.push({
        action: ChangeActionType.SHIPPING_ADD,
        reference: data.reference,
        reference_id: shippingMethodId,
        amount: calculatedAmount.total,
      })
    }

    const change = await this.createOrderChange_(
      {
        order_id: data.order_id,
        description: data.description,
        internal_note: data.internal_note,
        created_by: data.created_by,
        metadata: data.metadata,
        actions,
      },
      sharedContext
    )

    await this.confirmOrderChange(change[0].id, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async createReturn(
    data: OrderTypes.CreateOrderReturnDTO,
    sharedContext?: Context
  ): Promise<void> {
    let shippingMethodId

    if (!isString(data.shipping_method)) {
      const methods = await this.createShippingMethods(
        data.order_id,
        [{ order_id: data.order_id, ...data.shipping_method }],
        sharedContext
      )
      shippingMethodId = methods[0].id
    } else {
      shippingMethodId = data.shipping_method
    }

    const method = await this.shippingMethodService_.retrieve(
      shippingMethodId,
      {
        relations: ["tax_lines", "adjustments"],
      },
      sharedContext
    )

    const calculatedAmount = getShippingMethodsTotals([method as any], {})[
      method.id
    ]

    const actions: CreateOrderChangeActionDTO[] = data.items.map((item) => {
      return {
        action: ChangeActionType.RETURN_ITEM,
        internal_note: item.internal_note,
        reference: data.reference,
        reference_id: shippingMethodId,
        details: {
          reference_id: item.id,
          quantity: item.quantity,
          metadata: item.metadata,
        },
      }
    })

    if (shippingMethodId) {
      actions.push({
        action: ChangeActionType.SHIPPING_ADD,
        reference: data.reference,
        reference_id: shippingMethodId,
        amount: calculatedAmount.total,
      })
    }

    const change = await this.createOrderChange_(
      {
        order_id: data.order_id,
        description: data.description,
        internal_note: data.internal_note,
        created_by: data.created_by,
        metadata: data.metadata,
        actions,
      },
      sharedContext
    )

    await this.confirmOrderChange(change[0].id, sharedContext)
  }

  public async addTransactions(
    transactionData: OrderTypes.CreateOrderTransactionDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO>

  public async addTransactions(
    transactionData: OrderTypes.CreateOrderTransactionDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO[]>

  @InjectTransactionManager("baseRepository_")
  public async addTransactions(
    transactionData:
      | OrderTypes.CreateOrderTransactionDTO
      | OrderTypes.CreateOrderTransactionDTO[],
    sharedContext?: Context
  ): Promise<
    OrderTypes.OrderTransactionDTO | OrderTypes.OrderTransactionDTO[]
  > {
    const data = Array.isArray(transactionData)
      ? transactionData
      : [transactionData]

    const created = await this.transactionService_.create(data, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderTransactionDTO>(
      !Array.isArray(transactionData) ? created[0] : created,
      {
        populate: true,
      }
    )
  }

  updateTransactions(
    data: OrderTypes.UpdateOrderTransactionWithSelectorDTO[]
  ): Promise<OrderTypes.OrderTransactionDTO[]>

  updateTransactions(
    selector: Partial<OrderTypes.FilterableOrderTransactionProps>,
    data: OrderTypes.UpdateOrderTransactionDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO[]>

  updateTransactions(
    id: string,
    data: Partial<OrderTypes.UpdateOrderTransactionDTO>,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO>

  @InjectManager("baseRepository_")
  async updateTransactions(
    idOrDataOrSelector:
      | string
      | OrderTypes.UpdateOrderTransactionWithSelectorDTO[]
      | Partial<OrderTypes.FilterableOrderTransactionProps>,
    data?:
      | OrderTypes.UpdateOrderTransactionDTO
      | Partial<OrderTypes.UpdateOrderTransactionDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderTransactionDTO[] | OrderTypes.OrderTransactionDTO
  > {
    let trxs: Transaction[] = []
    if (isString(idOrDataOrSelector)) {
      const trx = await this.updateTransaction_(
        idOrDataOrSelector,
        data as Partial<OrderTypes.UpdateOrderTransactionDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<OrderTypes.OrderTransactionDTO>(
        trx,
        {
          populate: true,
        }
      )
    }

    const toUpdate = Array.isArray(idOrDataOrSelector)
      ? idOrDataOrSelector
      : [
          {
            selector: idOrDataOrSelector,
            data: data,
          } as OrderTypes.UpdateOrderTransactionWithSelectorDTO,
        ]

    trxs = await this.updateTransactionsWithSelector_(toUpdate, sharedContext)

    return await this.baseRepository_.serialize<
      OrderTypes.OrderTransactionDTO[]
    >(trxs, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateTransaction_(
    trxId: string,
    data: Partial<OrderTypes.UpdateOrderTransactionDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Transaction> {
    const [trx] = await this.transactionService_.update(
      [{ id: trxId, ...data }],
      sharedContext
    )

    return trx
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateTransactionsWithSelector_(
    updates: OrderTypes.UpdateOrderTransactionWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Transaction[]> {
    let toUpdate: UpdateOrderTransactionDTO[] = []

    for (const { selector, data } of updates) {
      const trxs = await super.listTransactions(
        { ...selector },
        {},
        sharedContext
      )

      trxs.forEach((trx) => {
        toUpdate.push({
          ...data,
          id: trx.id,
        })
      })
    }

    return await this.transactionService_.update(toUpdate, sharedContext)
  }

  public async createReturnReasons(
    transactionData: OrderTypes.CreateOrderReturnReasonDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderReturnReasonDTO>

  public async createReturnReasons(
    transactionData: OrderTypes.CreateOrderReturnReasonDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderReturnReasonDTO[]>

  @InjectTransactionManager("baseRepository_")
  public async createReturnReasons(
    returnReasonData:
      | OrderTypes.CreateOrderReturnReasonDTO
      | OrderTypes.CreateOrderReturnReasonDTO[],
    sharedContext?: Context
  ): Promise<
    OrderTypes.OrderReturnReasonDTO | OrderTypes.OrderReturnReasonDTO[]
  > {
    const data = Array.isArray(returnReasonData)
      ? returnReasonData
      : [returnReasonData]

    const created = await this.returnReasonService_.create(data, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderReturnReasonDTO>(
      !Array.isArray(returnReasonData) ? created[0] : created,
      {
        populate: true,
      }
    )
  }

  updateReturnReasons(
    data: OrderTypes.UpdateOrderReturnReasonWithSelectorDTO[]
  ): Promise<OrderTypes.OrderReturnReasonDTO[]>

  updateReturnReasons(
    selector: Partial<OrderTypes.FilterableOrderReturnReasonProps>,
    data: OrderTypes.UpdateOrderReturnReasonDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderReturnReasonDTO[]>

  updateReturnReasons(
    id: string,
    data: Partial<OrderTypes.UpdateOrderReturnReasonDTO>,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderReturnReasonDTO>

  @InjectManager("baseRepository_")
  async updateReturnReasons(
    idOrDataOrSelector:
      | string
      | OrderTypes.UpdateOrderReturnReasonWithSelectorDTO[]
      | Partial<OrderTypes.FilterableOrderReturnReasonProps>,
    data?:
      | OrderTypes.UpdateOrderReturnReasonDTO
      | Partial<OrderTypes.UpdateOrderReturnReasonDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderReturnReasonDTO[] | OrderTypes.OrderReturnReasonDTO
  > {
    let reasons: ReturnReason[] = []
    if (isString(idOrDataOrSelector)) {
      const reason = await this.updateReturnReason_(
        idOrDataOrSelector,
        data as Partial<OrderTypes.UpdateOrderReturnReasonDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<OrderTypes.OrderReturnReasonDTO>(
        reason,
        {
          populate: true,
        }
      )
    }

    const toUpdate = Array.isArray(idOrDataOrSelector)
      ? idOrDataOrSelector
      : [
          {
            selector: idOrDataOrSelector,
            data: data,
          } as OrderTypes.UpdateOrderReturnReasonWithSelectorDTO,
        ]

    reasons = await this.updateReturnReasonsWithSelector_(
      toUpdate,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderReturnReasonDTO[]
    >(reasons, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateReturnReason_(
    reasonId: string,
    data: Partial<OrderTypes.UpdateOrderReturnReasonDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ReturnReason> {
    const [reason] = await this.returnReasonService_.update(
      [{ id: reasonId, ...data }],
      sharedContext
    )

    return reason
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateReturnReasonsWithSelector_(
    updates: OrderTypes.UpdateOrderReturnReasonWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ReturnReason[]> {
    let toUpdate: UpdateOrderReturnReasonDTO[] = []

    for (const { selector, data } of updates) {
      const reasons = await super.listReturnReasons(
        { ...selector },
        {},
        sharedContext
      )

      reasons.forEach((reason) => {
        toUpdate.push({
          ...data,
          id: reason.id,
        })
      })
    }

    return await this.returnReasonService_.update(toUpdate, sharedContext)
  }
}
