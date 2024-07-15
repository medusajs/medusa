import {
  BigNumberInput,
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  IOrderModuleService,
  ModulesSdkTypes,
  OrderDTO,
  OrderTypes,
  RestoreReturn,
  SoftDeleteReturn,
  UpdateOrderItemWithSelectorDTO,
  UpdateOrderReturnReasonDTO,
} from "@medusajs/types"
import {
  BigNumber,
  createRawPropertiesFromBigNumber,
  DecorateCartLikeInputDTO,
  decorateCartTotals,
  deduplicate,
  InjectManager,
  InjectTransactionManager,
  isObject,
  isString,
  MathBN,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  OrderStatus,
  promiseAll,
  transformPropertiesToBigNumber,
} from "@medusajs/utils"
import {
  Address,
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  Order,
  OrderChange,
  OrderChangeAction,
  OrderClaim,
  OrderExchange,
  OrderItem,
  OrderShippingMethod,
  OrderSummary,
  Return,
  ReturnItem,
  ReturnReason,
  ShippingMethod,
  ShippingMethodAdjustment,
  ShippingMethodTaxLine,
  Transaction,
} from "@models"
import {
  CreateOrderChangeDTO,
  CreateOrderItemDTO,
  CreateOrderLineItemDTO,
  CreateOrderLineItemTaxLineDTO,
  CreateOrderShippingMethodDTO,
  CreateOrderShippingMethodTaxLineDTO,
  OrderChangeStatus,
  UpdateOrderItemDTO,
  UpdateOrderLineItemDTO,
  UpdateOrderLineItemTaxLineDTO,
  UpdateOrderShippingMethodTaxLineDTO,
} from "@types"
import {
  applyChangesToOrder,
  ApplyOrderChangeDTO,
  calculateOrderChange,
  formatOrder,
} from "../utils"
import * as BundledActions from "./actions"
import OrderService from "./order-service"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  orderService: OrderService
  addressService: ModulesSdkTypes.IMedusaInternalService<any>
  lineItemService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingMethodAdjustmentService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingMethodService: ModulesSdkTypes.IMedusaInternalService<any>
  lineItemAdjustmentService: ModulesSdkTypes.IMedusaInternalService<any>
  lineItemTaxLineService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingMethodTaxLineService: ModulesSdkTypes.IMedusaInternalService<any>
  transactionService: ModulesSdkTypes.IMedusaInternalService<any>
  orderChangeService: ModulesSdkTypes.IMedusaInternalService<any>
  orderChangeActionService: ModulesSdkTypes.IMedusaInternalService<any>
  orderItemService: ModulesSdkTypes.IMedusaInternalService<any>
  orderSummaryService: ModulesSdkTypes.IMedusaInternalService<any>
  orderShippingMethodService: ModulesSdkTypes.IMedusaInternalService<any>
  returnReasonService: ModulesSdkTypes.IMedusaInternalService<any>
  returnService: ModulesSdkTypes.IMedusaInternalService<any>
  returnItemService: ModulesSdkTypes.IMedusaInternalService<any>
  orderClaimService: ModulesSdkTypes.IMedusaInternalService<any>
  orderExchangeService: ModulesSdkTypes.IMedusaInternalService<any>
}

const generateMethodForModels = {
  Order,
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
  Return,
  ReturnItem,
  OrderClaim,
  OrderExchange,
}

// TODO: rm template args here, keep it for later to not collide with carlos work at least as little as possible
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
    TReturnReason extends ReturnReason = ReturnReason,
    TReturn extends Return = Return,
    TReturnItem extends ReturnItem = ReturnItem,
    TClaim extends OrderClaim = OrderClaim,
    TExchange extends OrderExchange = OrderExchange
  >
  extends ModulesSdkUtils.MedusaService<{
    Order: { dto: OrderTypes.OrderDTO }
    Address: { dto: OrderTypes.OrderAddressDTO }
    LineItem: { dto: OrderTypes.OrderLineItemDTO }
    LineItemAdjustment: { dto: OrderTypes.OrderLineItemAdjustmentDTO }
    LineItemTaxLine: { dto: OrderTypes.OrderLineItemTaxLineDTO }
    ShippingMethod: { dto: OrderTypes.OrderShippingMethodDTO }
    ShippingMethodAdjustment: {
      dto: OrderTypes.OrderShippingMethodAdjustmentDTO
    }
    ShippingMethodTaxLine: { dto: OrderTypes.OrderShippingMethodTaxLineDTO }
    OrderChange: { dto: OrderTypes.OrderChangeDTO }
    OrderChangeAction: { dto: OrderTypes.OrderChangeActionDTO }
    OrderItem: { dto: OrderTypes.OrderItemDTO }
    OrderShippingMethod: { dto: OrderShippingMethod }
    ReturnReason: { dto: OrderTypes.OrderReturnReasonDTO }
    OrderSummary: { dto: OrderTypes.OrderSummaryDTO }
    Transaction: { dto: OrderTypes.OrderTransactionDTO }
    Return: { dto: any } // TODO: Add return dto
    ReturnItem: { dto: any } // TODO: Add return item dto
    OrderClaim: { dto: any } // TODO: Add claim dto
    OrderExchange: { dto: any } // TODO: Add exchange dto
  }>(generateMethodForModels)
  implements IOrderModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected orderService_: OrderService
  protected addressService_: ModulesSdkTypes.IMedusaInternalService<TAddress>
  protected lineItemService_: ModulesSdkTypes.IMedusaInternalService<TLineItem>
  protected shippingMethodAdjustmentService_: ModulesSdkTypes.IMedusaInternalService<TShippingMethodAdjustment>
  protected shippingMethodService_: ModulesSdkTypes.IMedusaInternalService<TShippingMethod>
  protected lineItemAdjustmentService_: ModulesSdkTypes.IMedusaInternalService<TLineItemAdjustment>
  protected lineItemTaxLineService_: ModulesSdkTypes.IMedusaInternalService<TLineItemTaxLine>
  protected shippingMethodTaxLineService_: ModulesSdkTypes.IMedusaInternalService<TShippingMethodTaxLine>
  protected transactionService_: ModulesSdkTypes.IMedusaInternalService<TTransaction>
  protected orderChangeService_: ModulesSdkTypes.IMedusaInternalService<TOrderChange>
  protected orderChangeActionService_: ModulesSdkTypes.IMedusaInternalService<TOrderChangeAction>
  protected orderItemService_: ModulesSdkTypes.IMedusaInternalService<TOrderItem>
  protected orderSummaryService_: ModulesSdkTypes.IMedusaInternalService<TOrderSummary>
  protected orderShippingMethodService_: ModulesSdkTypes.IMedusaInternalService<TOrderShippingMethod>
  protected returnReasonService_: ModulesSdkTypes.IMedusaInternalService<TReturnReason>
  protected returnService_: ModulesSdkTypes.IMedusaInternalService<TReturn>
  protected returnItemService_: ModulesSdkTypes.IMedusaInternalService<TReturnItem>
  protected orderClaimService_: ModulesSdkTypes.IMedusaInternalService<TClaim>
  protected orderExchangeService_: ModulesSdkTypes.IMedusaInternalService<TExchange>

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
      returnService,
      returnItemService,
      orderClaimService,
      orderExchangeService,
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
    this.returnService_ = returnService
    this.returnItemService_ = returnItemService
    this.orderClaimService_ = orderClaimService
    this.orderExchangeService_ = orderExchangeService
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

  // @ts-expect-error
  async retrieveOrder(
    id: string,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderDTO> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const order = await super.retrieveOrder(id, config, sharedContext)

    const orderChange = await this.getActiveOrderChange_(
      order.id,
      false,
      sharedContext
    )

    order.order_change = orderChange

    return formatOrder(order, {
      entity: Order,
      includeTotals,
    }) as OrderTypes.OrderDTO
  }

  // @ts-expect-error
  async listOrders(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderDTO[]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const orders = await super.listOrders(filters, config, sharedContext)

    return formatOrder(orders, {
      entity: Order,
      includeTotals,
    }) as OrderTypes.OrderDTO[]
  }

  // @ts-expect-error
  async listAndCountOrders(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<[OrderTypes.OrderDTO[], number]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const [orders, count] = await super.listAndCountOrders(
      filters,
      config,
      sharedContext
    )

    return [
      formatOrder(orders, {
        entity: Order,
        includeTotals,
      }) as OrderTypes.OrderDTO[],
      count,
    ]
  }

  // @ts-ignore
  async retrieveReturn(
    id: string,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.ReturnDTO> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const returnOrder = await super.retrieveReturn(id, config, sharedContext)

    return formatOrder(returnOrder, {
      entity: Return,
      includeTotals,
    }) as OrderTypes.ReturnDTO
  }

  // @ts-ignore
  async listReturns(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.ReturnDTO[]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const returnOrders = await super.listReturns(filters, config, sharedContext)

    return formatOrder(returnOrders, {
      entity: Return,
      includeTotals,
    }) as OrderTypes.ReturnDTO[]
  }

  // @ts-ignore
  async listAndCountReturns(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<[OrderTypes.ReturnDTO[], number]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const [returnOrders, count] = await super.listAndCountReturns(
      filters,
      config,
      sharedContext
    )

    return [
      formatOrder(returnOrders, {
        entity: Return,
        includeTotals,
      }) as OrderTypes.ReturnDTO[],
      count,
    ]
  }

  // @ts-ignore
  async retrieveOrderClaim(
    id: string,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderClaimDTO> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const returnOrder = await super.retrieveOrderClaim(
      id,
      config,
      sharedContext
    )

    return formatOrder(returnOrder, {
      entity: OrderClaim,
      includeTotals,
    }) as OrderTypes.OrderClaimDTO
  }

  // @ts-ignore
  async listOrderClaims(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderClaimDTO[]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const returnOrders = await super.listOrderClaims(
      filters,
      config,
      sharedContext
    )

    return formatOrder(returnOrders, {
      entity: OrderClaim,
      includeTotals,
    }) as OrderTypes.OrderClaimDTO[]
  }

  // @ts-ignore
  async listAndCountOrderClaims(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<[OrderTypes.OrderClaimDTO[], number]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const [returnOrders, count] = await super.listAndCountOrderClaims(
      filters,
      config,
      sharedContext
    )

    return [
      formatOrder(returnOrders, {
        entity: OrderClaim,
        includeTotals,
      }) as OrderTypes.OrderClaimDTO[],
      count,
    ]
  }

  // @ts-ignore
  async retrieveOrderExchange(
    id: string,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderExchangeDTO> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const returnOrder = await super.retrieveOrderExchange(
      id,
      config,
      sharedContext
    )

    return formatOrder(returnOrder, {
      entity: OrderExchange,
      includeTotals,
    }) as OrderTypes.OrderExchangeDTO
  }

  // @ts-ignore
  async listOrderExchanges(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<OrderTypes.OrderExchangeDTO[]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const returnOrders = await super.listOrderExchanges(
      filters,
      config,
      sharedContext
    )

    return formatOrder(returnOrders, {
      entity: OrderExchange,
      includeTotals,
    }) as OrderTypes.OrderExchangeDTO[]
  }

  // @ts-ignore
  async listAndCountOrderExchanges(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ): Promise<[OrderTypes.OrderExchangeDTO[], number]> {
    config ??= {}
    const includeTotals = this.shouldIncludeTotals(config)

    const [returnOrders, count] = await super.listAndCountOrderExchanges(
      filters,
      config,
      sharedContext
    )

    return [
      formatOrder(returnOrders, {
        entity: OrderExchange,
        includeTotals,
      }) as OrderTypes.OrderExchangeDTO[],
      count,
    ]
  }

  // @ts-expect-error
  async createOrders(
    data: OrderTypes.CreateOrderDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  async createOrders(
    data: OrderTypes.CreateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>

  @InjectManager("baseRepository_")
  async createOrders(
    data: OrderTypes.CreateOrderDTO[] | OrderTypes.CreateOrderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[] | OrderTypes.OrderDTO> {
    const input = Array.isArray(data) ? data : [data]

    const orders = await this.createOrders_(input, sharedContext)

    const result = await this.listOrders(
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
  protected async createOrders_(
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

  // @ts-expect-error
  async updateOrders(
    data: OrderTypes.UpdateOrderDTO[]
  ): Promise<OrderTypes.OrderDTO[]>
  async updateOrders(
    orderId: string,
    data: OrderTypes.UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>
  async updateOrders(
    selector: Partial<OrderTypes.FilterableOrderProps>,
    data: OrderTypes.UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectManager("baseRepository_")
  async updateOrders(
    dataOrIdOrSelector:
      | OrderTypes.UpdateOrderDTO[]
      | string
      | Partial<OrderTypes.FilterableOrderProps>,
    data?: OrderTypes.UpdateOrderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[] | OrderTypes.OrderDTO> {
    const result = await this.updateOrders_(
      dataOrIdOrSelector,
      data,
      sharedContext
    )

    const serializedResult = await this.baseRepository_.serialize<
      OrderTypes.OrderDTO[]
    >(result, {
      populate: true,
    })

    return isString(dataOrIdOrSelector) ? serializedResult[0] : serializedResult
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateOrders_(
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

  // @ts-ignore
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
      const order = await this.listOrders(
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
    const order = await this.retrieveOrder(
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

  // @ts-ignore
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

  // @ts-ignore
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

  // @ts-ignore
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

  // @ts-ignore
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
      const order = await this.listOrders(
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
          return_id: dt.return_id,
          claim_id: dt.claim_id,
          exchange_id: dt.exchange_id,
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
    const order = await this.retrieveOrder(
      orderId,
      { select: ["id", "version"] },
      sharedContext
    )

    const methods = data.map((methodData) => {
      return {
        shipping_method: methodData,
        order_id: order.id,
        return_id: methodData.return_id,
        claim_id: methodData.claim_id,
        exchange_id: methodData.exchange_id,
        version: methodData.version ?? order.version ?? 1,
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

  // @ts-ignore
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
      const order = await this.retrieveOrder(
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
    const order = await this.retrieveOrder(
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
    const order = await this.retrieveOrder(
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

  // @ts-ignore
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
      const order = await this.retrieveOrder(
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

  // @ts-ignore
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
    const order = await this.retrieveOrder(
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

  // @ts-ignore
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
    const order = await this.retrieveOrder(
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

  // @ts-ignore
  async createReturns(
    data: OrderTypes.CreateOrderReturnDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO>

  async createReturns(
    data: OrderTypes.CreateOrderReturnDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createReturns(
    data: OrderTypes.CreateOrderReturnDTO | OrderTypes.CreateOrderReturnDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO | OrderTypes.ReturnDTO[]> {
    const created = await this.createOrderRelatedEntity_(
      data,
      this.returnService_,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.ReturnDTO>(
      !Array.isArray(data) ? created[0] : created,
      {
        populate: true,
      }
    )
  }

  // @ts-ignore
  async createOrderClaims(
    data: OrderTypes.CreateOrderClaimDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderClaimDTO>

  async createOrderClaims(
    data: OrderTypes.CreateOrderClaimDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderClaimDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createOrderClaims(
    data: OrderTypes.CreateOrderClaimDTO | OrderTypes.CreateOrderClaimDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderClaimDTO | OrderTypes.OrderClaimDTO[]> {
    const created = await this.createOrderRelatedEntity_(
      data,
      this.orderClaimService_,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderClaimDTO>(
      !Array.isArray(data) ? created[0] : created,
      {
        populate: true,
      }
    )
  }

  // @ts-ignore
  async createOrderExchanges(
    data: OrderTypes.CreateOrderExchangeDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderExchangeDTO>

  async createOrderExchanges(
    data: OrderTypes.CreateOrderExchangeDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderExchangeDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createOrderExchanges(
    data:
      | OrderTypes.CreateOrderExchangeDTO
      | OrderTypes.CreateOrderExchangeDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderExchangeDTO | OrderTypes.OrderExchangeDTO[]> {
    const created = await this.createOrderRelatedEntity_(
      data,
      this.orderExchangeService_,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderExchangeDTO>(
      !Array.isArray(data) ? created[0] : created,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  private async createOrderRelatedEntity_(
    data: any,
    service: any,
    sharedContext?: Context
  ) {
    const data_ = Array.isArray(data) ? data : [data]

    const inputDataMap = data_.reduce((acc, curr) => {
      acc[curr.order_id] = curr
      return acc
    }, {})

    const orderIds = data_.map((d) => d.order_id)
    const orders = await this.orderService_.list(
      { id: orderIds },
      { select: ["id", "version"] },
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

    for (const order of orders) {
      inputDataMap[order.id].order_version = order.version
    }

    return await service.create(data_, sharedContext)
  }

  async createOrderChange(
    data: CreateOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeDTO>

  async createOrderChange(
    data: CreateOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeDTO[]>

  @InjectManager("baseRepository_")
  async createOrderChange(
    data: CreateOrderChangeDTO | CreateOrderChangeDTO[],
    @MedusaContext() sharedContext?: Context
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
    data: CreateOrderChangeDTO | CreateOrderChangeDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderChange[]> {
    const dataArr = Array.isArray(data) ? data : [data]
    const orderIds: string[] = []
    const dataMap: Record<string, object> = {}

    const orderChanges = await this.listOrderChanges(
      {
        order_id: dataArr.map((data) => data.order_id),
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
      {},
      sharedContext
    )

    const orderChangesMap = new Map<string, OrderTypes.OrderChangeDTO>(
      orderChanges.map((item) => [item.order_id, item])
    )

    for (const change of dataArr) {
      orderIds.push(change.order_id)
      dataMap[change.order_id] = change
    }

    const orders = await this.orderService_.list(
      { id: orderIds },
      { select: ["id", "version"] },
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
      const existingOrderChange = orderChangesMap.get(order.id)

      if (existingOrderChange) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Order (${order.id}) already has an existing active order change`
        )
      }

      return {
        ...dataMap[order.id],
        version: order.version + 1,
      } as any
    })

    return await this.orderChangeService_.create(input, sharedContext)
  }

  @InjectManager("baseRepository_")
  async previewOrderChange(orderId: string, sharedContext?: Context) {
    const order = await this.retrieveOrder(
      orderId,
      {
        select: ["id", "version", "items.detail", "summary", "total"],
        relations: [
          "transactions",
          "items",
          "items.detail",
          "shipping_methods",
        ],
      },
      sharedContext
    )

    if (!order.order_change) {
      return order
    }

    const orderChange = await super.retrieveOrderChange(
      order.order_change.id,
      { relations: ["actions"] },
      sharedContext
    )

    orderChange.actions = orderChange.actions.map((action) => {
      return {
        ...action,
        version: orderChange.version,
        order_id: orderChange.order_id,
        return_id: orderChange.return_id,
        claim_id: orderChange.claim_id,
        exchange_id: orderChange.exchange_id,
      }
    })

    const { itemsToUpsert, calculatedOrders } = applyChangesToOrder(
      [order],
      { [order.id]: orderChange.actions },
      { addActionReferenceToObject: true }
    )

    const calculated = calculatedOrders[order.id]

    const addedItems = {}
    for (const item of calculated.order.items) {
      const isExistingItem = item.id === item.detail?.item_id

      if (!isExistingItem) {
        addedItems[item.id] = item
      }
    }
    if (Object.keys(addedItems).length > 0) {
      const addedItemDetails = await this.listLineItems(
        { id: Object.keys(addedItems) },
        {
          relations: ["adjustments", "tax_lines"],
        },
        sharedContext
      )

      calculated.order.items.forEach((item, idx) => {
        if (addedItems[item.id]) {
          const lineItem = addedItemDetails.find((d) => d.id === item.id) as any

          const actions = item.actions
          delete item.actions

          const newItem = itemsToUpsert.find((d) => d.item_id === item.id)!
          calculated.order.items[idx] = {
            ...lineItem,
            actions,
            quantity: newItem.quantity,
            detail: {
              ...newItem,
              ...item,
            },
          }
        }
      })
    }

    // TODO - add new shipping methods

    const calcOrder = calculated.order

    decorateCartTotals(calcOrder as DecorateCartLikeInputDTO)
    calcOrder.summary = calculated.summary

    createRawPropertiesFromBigNumber(calcOrder)

    return calcOrder
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
    @MedusaContext() sharedContext?: Context
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

  async confirmOrderChange(orderChangeId: string, sharedContext?: Context)
  async confirmOrderChange(orderChangeId: string[], sharedContext?: Context)
  async confirmOrderChange(
    data: OrderTypes.ConfirmOrderChangeDTO,
    sharedContext?: Context
  )
  async confirmOrderChange(
    data: OrderTypes.ConfirmOrderChangeDTO[],
    sharedContext?: Context
  )
  @InjectTransactionManager("baseRepository_")
  async confirmOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.ConfirmOrderChangeDTO
      | OrderTypes.ConfirmOrderChangeDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeReturn> {
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
          return_id: change.return_id,
          claim_id: change.claim_id,
          exchange_id: change.exchange_id,
        }
      })
      return change.actions
    })

    return await this.applyOrderChanges_(orderChanges.flat(), sharedContext)
  }

  async declineOrderChange(orderChangeId: string, sharedContext?: Context)
  async declineOrderChange(orderChangeId: string[], sharedContext?: Context)
  async declineOrderChange(
    data: OrderTypes.DeclineOrderChangeDTO,
    sharedContext?: Context
  )
  async declineOrderChange(
    data: OrderTypes.DeclineOrderChangeDTO[],
    sharedContext?: Context
  )
  @InjectTransactionManager("baseRepository_")
  async declineOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.DeclineOrderChangeDTO
      | OrderTypes.DeclineOrderChangeDTO[],
    @MedusaContext() sharedContext?: Context
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
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeReturn> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]

    const orders = await this.orderService_.list(
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
          "return_id",
          "exchange_id",
          "claim_id",
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

    return await this.applyOrderChanges_(
      changes as ApplyOrderChangeDTO[],
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async revertLastVersion(
    orderId: string,
    @MedusaContext() sharedContext?: Context
  ) {
    const order = await super.retrieveOrder(
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

    // Returns
    await this.returnService_.delete(
      {
        order_id: order.id,
        order_version: currentVersion,
      },
      sharedContext
    )
  }

  private async getActiveOrderChange_(
    orderId: string,
    includeActions: boolean,
    sharedContext?: Context
  ): Promise<any> {
    const options = {
      select: [
        "id",
        "change_type",
        "order_id",
        "return_id",
        "claim_id",
        "exchange_id",
        "version",
        "requested_at",
        "requested_by",
        "status",
      ],
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

    const [orderChange] = await this.listOrderChanges(
      {
        order_id: orderId,
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
      options,
      sharedContext
    )

    return orderChange
  }

  private async getAndValidateOrderChange_(
    orderChangeIds: string[],
    includeActions: boolean,
    sharedContext?: Context
  ): Promise<any> {
    orderChangeIds = deduplicate(orderChangeIds)
    const options = {
      select: [
        "id",
        "order_id",
        "return_id",
        "claim_id",
        "exchange_id",
        "version",
        "status",
      ],
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
    @MedusaContext() sharedContext?: Context
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
    changeActions: ApplyOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeReturn> {
    const actionsMap: Record<string, any[]> = {}
    const ordersIds: string[] = []
    const usedActions: any[] = []

    for (const action of changeActions) {
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
      return {
        items: [],
        shippingMethods: [],
      }
    }

    let orders = await super.listOrders(
      { id: deduplicate(ordersIds) },
      {
        select: ["id", "version", "items.detail", "summary", "total"],
        relations: [
          "transactions",
          "items",
          "items.detail",
          "shipping_methods",
        ],
      },
      sharedContext
    )
    orders = formatOrder(orders, {
      entity: Order,
    }) as OrderDTO[]

    const {
      itemsToUpsert,
      shippingMethodsToUpsert,
      summariesToUpsert,
      orderToUpdate,
    } = applyChangesToOrder(orders, actionsMap)

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
      shippingMethodsToUpsert.length
        ? this.orderShippingMethodService_.upsert(
            shippingMethodsToUpsert,
            sharedContext
          )
        : null,
    ])

    return {
      items: itemsToUpsert as any,
      shippingMethods: shippingMethodsToUpsert as any,
    }
  }

  async addTransactions(
    transactionData: OrderTypes.CreateOrderTransactionDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO>

  async addTransactions(
    transactionData: OrderTypes.CreateOrderTransactionDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO[]>

  @InjectManager("baseRepository_")
  async addTransactions(
    transactionData:
      | OrderTypes.CreateOrderTransactionDTO
      | OrderTypes.CreateOrderTransactionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<
    OrderTypes.OrderTransactionDTO | OrderTypes.OrderTransactionDTO[]
  > {
    const orders = await this.orderService_.list(
      {
        id: Array.isArray(transactionData)
          ? transactionData.map((t) => t.order_id)
          : transactionData.order_id,
      },
      {
        select: ["id", "version"],
      },
      sharedContext
    )

    const data = Array.isArray(transactionData)
      ? transactionData
      : [transactionData]

    for (const order of orders) {
      const trxs = data.filter((t) => t.order_id === order.id)
      for (const trx of trxs) {
        ;(trx as any).version = order.version
      }
    }

    const created = await this.transactionService_.create(data, sharedContext)

    await this.updateOrderPaidRefundableAmount_(created, false, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderTransactionDTO>(
      !Array.isArray(transactionData) ? created[0] : created,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  // @ts-ignore
  async deleteTransactions(
    transactionIds: string | object | string[] | object[],
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const data = Array.isArray(transactionIds)
      ? transactionIds
      : [transactionIds]

    const transactions = await super.listTransactions(
      {
        id: data,
      },
      {
        select: ["order_id", "version", "amount"],
      },
      sharedContext
    )

    await this.transactionService_.delete(data, sharedContext)

    await this.updateOrderPaidRefundableAmount_(
      transactions,
      true,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  // @ts-ignore
  async softDeleteTransactions<TReturnableLinkableKeys extends string>(
    transactionIds: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext?: Context
  ): Promise<Record<string, string[]> | void> {
    const transactions = await super.listTransactions(
      {
        id: transactionIds,
      },
      {
        select: ["order_id", "amount"],
      },
      sharedContext
    )

    const returned = await super.softDeleteTransactions(
      transactionIds,
      config,
      sharedContext
    )

    await this.updateOrderPaidRefundableAmount_(
      transactions,
      true,
      sharedContext
    )

    return returned
  }

  @InjectManager("baseRepository_")
  // @ts-ignore
  async restoreTransactions<TReturnableLinkableKeys extends string>(
    transactionIds: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext?: Context
  ): Promise<Record<string, string[]> | void> {
    const transactions = await super.listTransactions(
      {
        id: transactionIds,
      },
      {
        select: ["order_id", "amount"],
        withDeleted: true,
      },
      sharedContext
    )

    const returned = await super.restoreTransactions(
      transactionIds as string[],
      config,
      sharedContext
    )

    await this.updateOrderPaidRefundableAmount_(
      transactions,
      false,
      sharedContext
    )

    return returned
  }

  @InjectTransactionManager("baseRepository_")
  private async updateOrderPaidRefundableAmount_(
    transactionData: {
      order_id: string
      amount: BigNumber | number | BigNumberInput
    }[],
    isRemoved: boolean,
    sharedContext?: Context
  ) {
    const summaries: any = await super.listOrderSummaries(
      {
        order_id: transactionData.map((trx) => trx.order_id),
      },
      {},
      sharedContext
    )

    summaries.forEach((summary) => {
      let trxs = transactionData.filter(
        (trx) => trx.order_id === summary.order_id
      )

      if (!trxs.length) {
        return
      }
      transformPropertiesToBigNumber(trxs)

      const op = isRemoved ? MathBN.sub : MathBN.add
      for (const trx of trxs) {
        if (MathBN.gt(trx.amount, 0)) {
          summary.totals.paid_total = new BigNumber(
            op(summary.totals.paid_total, trx.amount)
          )
        } else {
          summary.totals.refunded_total = new BigNumber(
            op(summary.totals.refunded_total, MathBN.abs(trx.amount))
          )
        }
      }
    })

    createRawPropertiesFromBigNumber(summaries)

    await this.orderSummaryService_.update(summaries, sharedContext)
  }

  // @ts-ignore
  async createReturnReasons(
    transactionData: OrderTypes.CreateOrderReturnReasonDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderReturnReasonDTO>

  async createReturnReasons(
    transactionData: OrderTypes.CreateOrderReturnReasonDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderReturnReasonDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createReturnReasons(
    returnReasonData:
      | OrderTypes.CreateOrderReturnReasonDTO
      | OrderTypes.CreateOrderReturnReasonDTO[],
    @MedusaContext() sharedContext?: Context
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

  // @ts-ignore
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

  async archive(
    orderId: string,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>

  async archive(
    orderId: string[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectTransactionManager("baseRepository_")
  async archive(
    orderId: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO | OrderTypes.OrderDTO[]> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]
    const orders = await this.listOrders(
      {
        id: orderIds,
      },
      {},
      sharedContext
    )

    const notAllowed: string[] = []
    for (const order of orders) {
      if (
        ![
          OrderStatus.COMPLETED,
          OrderStatus.CANCELED,
          OrderStatus.DRAFT,
        ].includes(order.status as any)
      ) {
        notAllowed.push(order.id)
      }

      order.status = OrderStatus.ARCHIVED
    }

    if (notAllowed.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Orders ${notAllowed.join(
          ", "
        )} are completed, canceled, or in draft and cannot be archived`
      )
    }

    await this.orderService_.update(
      {
        id: orderIds,
        status: OrderStatus.ARCHIVED,
      },
      sharedContext
    )

    return Array.isArray(orderId) ? orders : orders[0]
  }

  async completeOrder(
    orderId: string,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>
  async completeOrder(
    orderId: string[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectTransactionManager("baseRepository_")
  async completeOrder(
    orderId: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO | OrderTypes.OrderDTO[]> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]
    const orders = await this.listOrders(
      {
        id: orderIds,
      },
      {},
      sharedContext
    )

    const notAllowed: string[] = []
    for (const order of orders) {
      if ([OrderStatus.CANCELED].includes(order.status as any)) {
        notAllowed.push(order.id)
      }

      order.status = OrderStatus.COMPLETED
    }

    if (notAllowed.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Orders ${notAllowed.join(", ")} are canceled and cannot be completed`
      )
    }

    await this.orderService_.update(
      orderIds.map((id) => {
        return {
          id,
          status: OrderStatus.COMPLETED,
        }
      }),
      sharedContext
    )

    return Array.isArray(orderId) ? orders : orders[0]
  }

  async cancel(
    orderId: string,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>
  async cancel(
    orderId: string[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectTransactionManager("baseRepository_")
  async cancel(
    orderId: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO | OrderTypes.OrderDTO[]> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]
    const orders = await this.listOrders(
      {
        id: orderIds,
      },
      {},
      sharedContext
    )

    const canceled_at = new Date()
    for (const order of orders) {
      order.status = OrderStatus.CANCELED
      order.canceled_at = canceled_at
    }

    await this.orderService_.update(
      orderIds.map((id) => {
        return {
          id,
          status: OrderStatus.CANCELED,
          canceled_at,
        }
      }),
      sharedContext
    )

    return Array.isArray(orderId) ? orders : orders[0]
  }

  // ------------------- Bundled Order Actions

  @InjectTransactionManager("baseRepository_")
  async createReturn(
    data: OrderTypes.CreateOrderReturnDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO> {
    const ret = await BundledActions.createReturn.bind(this)(
      data,
      sharedContext
    )

    return await this.retrieveReturn(
      ret.id,
      {
        relations: [
          "items",
          "shipping_methods",
          "shipping_methods.tax_lines",
          "shipping_methods.adjustments",
        ],
      },
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async receiveReturn(
    data: OrderTypes.ReceiveOrderReturnDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO> {
    const ret = await this.receiveReturn_(data, sharedContext)

    return await this.retrieveReturn(ret.id, {
      relations: [
        "items",
        "shipping_methods",
        "shipping_methods.tax_lines",
        "shipping_methods.adjustments",
      ],
    })
  }

  @InjectTransactionManager("baseRepository_")
  private async receiveReturn_(
    data: OrderTypes.ReceiveOrderReturnDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<any> {
    return await BundledActions.receiveReturn.bind(this)(data, sharedContext)
  }

  @InjectManager("baseRepository_")
  async cancelReturn(
    data: OrderTypes.CancelOrderReturnDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO> {
    const ret = await this.cancelReturn_(data, sharedContext)

    return await this.retrieveReturn(ret.id, {
      relations: [
        "items",
        "shipping_methods",
        "shipping_methods.tax_lines",
        "shipping_methods.adjustments",
      ],
    })
  }

  @InjectTransactionManager("baseRepository_")
  private async cancelReturn_(
    data: OrderTypes.CancelOrderReturnDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<any> {
    return await BundledActions.cancelReturn.bind(this)(data, sharedContext)
  }

  @InjectManager("baseRepository_")
  async createClaim(
    data: OrderTypes.CreateOrderClaimDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderClaimDTO> {
    const ret = await this.createClaim_(data, sharedContext)

    const claim = await this.retrieveOrderClaim(
      ret.id,
      {
        relations: [
          "additional_items",
          "additional_items.item",
          "claim_items",
          "claim_items.item",
          "return",
          "return.items",
          "shipping_methods",
          "shipping_methods.tax_lines",
          "shipping_methods.adjustments",
          "transactions",
        ],
      },
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderClaimDTO>(
      claim,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async createClaim_(
    data: OrderTypes.CreateOrderClaimDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<any> {
    return await BundledActions.createClaim.bind(this)(data, sharedContext)
  }

  @InjectManager("baseRepository_")
  async cancelClaim(
    data: OrderTypes.CancelOrderClaimDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderClaimDTO> {
    const ret = await this.cancelClaim_(data, sharedContext)

    return await this.retrieveOrderClaim(ret.id, {
      relations: ["items"],
    })
  }

  @InjectTransactionManager("baseRepository_")
  private async cancelClaim_(
    data: OrderTypes.CancelOrderClaimDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<any> {
    return await BundledActions.cancelClaim.bind(this)(data, sharedContext)
  }

  @InjectManager("baseRepository_")
  async createExchange(
    data: OrderTypes.CreateOrderExchangeDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderExchangeDTO> {
    const ret = await this.createExchange_(data, sharedContext)

    const claim = await this.retrieveOrderExchange(
      ret.id,
      {
        relations: [
          "additional_items",
          "additional_items.item",
          "return",
          "return.items",
          "shipping_methods",
          "shipping_methods.tax_lines",
          "shipping_methods.adjustments",
          "transactions",
        ],
      },
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderExchangeDTO>(
      claim,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async createExchange_(
    data: OrderTypes.CreateOrderExchangeDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<any> {
    return await BundledActions.createExchange.bind(this)(data, sharedContext)
  }

  @InjectManager("baseRepository_")
  async cancelExchange(
    data: OrderTypes.CancelOrderExchangeDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<OrderTypes.OrderExchangeDTO> {
    const ret = await this.cancelExchange_(data, sharedContext)

    return await this.retrieveOrderExchange(ret.id, {
      relations: ["items"],
    })
  }

  @InjectTransactionManager("baseRepository_")
  private async cancelExchange_(
    data: OrderTypes.CancelOrderExchangeDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<any> {
    return await BundledActions.cancelExchange.bind(this)(data, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async registerFulfillment(
    data: OrderTypes.RegisterOrderFulfillmentDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    return await BundledActions.registerFulfillment.bind(this)(
      data,
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async cancelFulfillment(
    data: OrderTypes.CancelOrderFulfillmentDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    return await BundledActions.cancelFulfillment.bind(this)(
      data,
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async registerShipment(
    data: OrderTypes.RegisterOrderShipmentDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    return await BundledActions.registerShipment.bind(this)(data, sharedContext)
  }
}
