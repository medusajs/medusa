import { BeforeCreate, OnInit } from "@medusajs/framework/mikro-orm/core"
import {
  BigNumberInput,
  Context,
  CreateOrderCreditLineDTO,
  DAL,
  FilterableOrderReturnReasonProps,
  FindConfig,
  InferEntityType,
  IOrderModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  OrderChangeDTO,
  OrderDTO,
  OrderReturnReasonDTO,
  OrderShippingMethodDTO,
  OrderTypes,
  RestoreReturn,
  SoftDeleteReturn,
  UpdateOrderItemWithSelectorDTO,
  UpdateOrderReturnReasonDTO,
} from "@medusajs/framework/types"
import {
  BigNumber,
  ChangeActionType,
  createRawPropertiesFromBigNumber,
  DecorateCartLikeInputDTO,
  decorateCartTotals,
  deduplicate,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isObject,
  isString,
  MathBN,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  OrderChangeStatus,
  OrderStatus,
  promiseAll,
  toMikroORMEntity,
  transformPropertiesToBigNumber,
} from "@medusajs/framework/utils"
import {
  Order,
  OrderAddress,
  OrderChange,
  OrderChangeAction,
  OrderClaim,
  OrderClaimItem,
  OrderClaimItemImage,
  OrderCreditLine,
  OrderExchange,
  OrderExchangeItem,
  OrderItem,
  OrderLineItem,
  OrderLineItemAdjustment,
  OrderLineItemTaxLine,
  OrderShipping,
  OrderShippingMethod,
  OrderShippingMethodAdjustment,
  OrderShippingMethodTaxLine,
  OrderSummary,
  OrderTransaction,
  Return,
  ReturnItem,
  ReturnReason,
} from "@models"
import {
  CreateOrderChangeDTO,
  CreateOrderItemDTO,
  CreateOrderLineItemDTO,
  CreateOrderLineItemTaxLineDTO,
  CreateOrderShippingMethodDTO,
  CreateOrderShippingMethodTaxLineDTO,
  UpdateOrderItemDTO,
  UpdateOrderLineItemDTO,
  UpdateOrderLineItemTaxLineDTO,
  UpdateOrderShippingMethodTaxLineDTO,
  UpdateReturnReasonDTO,
} from "@types"
import { joinerConfig } from "../joiner-config"
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
  orderAddressService: ModulesSdkTypes.IMedusaInternalService<any>
  orderLineItemService: ModulesSdkTypes.IMedusaInternalService<any>
  orderShippingMethodAdjustmentService: ModulesSdkTypes.IMedusaInternalService<any>
  orderShippingMethodService: ModulesSdkTypes.IMedusaInternalService<any>
  orderLineItemAdjustmentService: ModulesSdkTypes.IMedusaInternalService<any>
  orderLineItemTaxLineService: ModulesSdkTypes.IMedusaInternalService<any>
  orderShippingMethodTaxLineService: ModulesSdkTypes.IMedusaInternalService<any>
  orderTransactionService: ModulesSdkTypes.IMedusaInternalService<any>
  orderChangeService: ModulesSdkTypes.IMedusaInternalService<any>
  orderChangeActionService: ModulesSdkTypes.IMedusaInternalService<any>
  orderItemService: ModulesSdkTypes.IMedusaInternalService<any>
  orderSummaryService: ModulesSdkTypes.IMedusaInternalService<any>
  orderShippingService: ModulesSdkTypes.IMedusaInternalService<any>
  returnReasonService: ModulesSdkTypes.IMedusaInternalService<any>
  returnService: ModulesSdkTypes.IMedusaInternalService<any>
  returnItemService: ModulesSdkTypes.IMedusaInternalService<any>
  orderClaimService: ModulesSdkTypes.IMedusaInternalService<any>
  orderExchangeService: ModulesSdkTypes.IMedusaInternalService<any>
  orderCreditLineService: ModulesSdkTypes.IMedusaInternalService<any>
}

const generateMethodForModels = {
  Order,
  OrderAddress,
  OrderLineItem,
  OrderLineItemAdjustment,
  OrderLineItemTaxLine,
  OrderShippingMethod,
  OrderShippingMethodAdjustment,
  OrderShippingMethodTaxLine,
  OrderTransaction,
  OrderChange,
  OrderChangeAction,
  OrderItem,
  OrderSummary,
  OrderShipping,
  ReturnReason,
  Return,
  ReturnItem,
  OrderClaim,
  OrderClaimItem,
  OrderClaimItemImage,
  OrderExchange,
  OrderExchangeItem,
  OrderCreditLine,
}

{
  const MikroORMEntity = toMikroORMEntity(OrderChangeAction)
  MikroORMEntity.prototype["onInit_OrderChangeAction"] = function () {
    if (this.order_change) {
      this.version ??= this.order_change.version ?? null

      this.order_id ??= this.order_change.order_id ?? null
      this.claim_id ??= this.order_change.claim_id ?? null
      this.exchange_id ??= this.order_change.exchange_id ?? null
    }

    if (
      !this.claim_id &&
      !this.exchange_id &&
      (this.return || this.order_change)
    ) {
      this.return_id = this.return?.id ?? this.order_change?.return_id ?? null
    }
  }
  OnInit()(MikroORMEntity.prototype, "onInit_OrderChangeAction")
  BeforeCreate()(MikroORMEntity.prototype, "onInit_OrderChangeAction")
}
{
  const MikroORMEntity = toMikroORMEntity(OrderShipping)
  MikroORMEntity.prototype["onInit_OrderShipping"] = function () {
    if (this.order) {
      this.version ??= this.order.version ?? null
    }
  }
  OnInit()(MikroORMEntity.prototype, "onInit_OrderShipping")
  BeforeCreate()(MikroORMEntity.prototype, "onInit_OrderShipping")
}
{
  const MikroORMEntity = toMikroORMEntity(OrderItem)
  MikroORMEntity.prototype["onInit_OrderItem"] = function () {
    if (this.order) {
      this.version ??= this.order.version ?? null
    }
  }
  OnInit()(MikroORMEntity.prototype, "onInit_OrderItem")
  BeforeCreate()(MikroORMEntity.prototype, "onInit_OrderItem")
}

// TODO: rm template args here, keep it for later to not collide with carlos work at least as little as possible
export default class OrderModuleService
  extends ModulesSdkUtils.MedusaService<{
    Order: { dto: OrderTypes.OrderDTO }
    OrderAddress: { dto: OrderTypes.OrderAddressDTO }
    OrderLineItem: { dto: OrderTypes.OrderLineItemDTO }
    OrderLineItemAdjustment: { dto: OrderTypes.OrderLineItemAdjustmentDTO }
    OrderLineItemTaxLine: { dto: OrderTypes.OrderLineItemTaxLineDTO }
    OrderShippingMethod: { dto: OrderShippingMethodDTO }
    OrderShippingMethodAdjustment: {
      dto: OrderTypes.OrderShippingMethodAdjustmentDTO
    }
    OrderShippingMethodTaxLine: {
      dto: OrderTypes.OrderShippingMethodTaxLineDTO
    }
    OrderShipping: { dto: any }
    OrderChange: { dto: OrderTypes.OrderChangeDTO }
    OrderChangeAction: { dto: OrderTypes.OrderChangeActionDTO }
    OrderItem: { dto: OrderTypes.OrderItemDTO }
    ReturnReason: { dto: OrderTypes.OrderReturnReasonDTO }
    OrderSummary: { dto: OrderTypes.OrderSummaryDTO }
    OrderTransaction: { dto: OrderTypes.OrderTransactionDTO }
    Return: { dto: OrderTypes.ReturnDTO }
    ReturnItem: { dto: OrderTypes.OrderReturnItemDTO }
    OrderClaim: { dto: OrderTypes.OrderClaimDTO }
    OrderClaimItem: { dto: OrderTypes.OrderClaimItemDTO }
    OrderClaimItemImage: { dto: OrderTypes.OrderClaimItemImageDTO }
    OrderExchange: { dto: OrderTypes.OrderExchangeDTO }
    OrderExchangeItem: { dto: OrderTypes.OrderExchangeItemDTO }
    OrderCreditLine: { dto: OrderTypes.OrderCreditLineDTO }
  }>(generateMethodForModels)
  implements IOrderModuleService
{
  protected generateCustomDisplayId_: (
    this: OrderModuleService,
    order: OrderTypes.CreateOrderDTO,
    sharedContext: Context
  ) => Promise<string | undefined> = async () => {
    return undefined
  }

  protected baseRepository_: DAL.RepositoryService
  protected orderService_: OrderService
  protected orderAddressService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderAddress>
  >
  protected orderLineItemService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderLineItem>
  >
  protected orderShippingMethodAdjustmentService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderShippingMethodAdjustment>
  >
  protected orderShippingMethodService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderShippingMethod>
  >
  protected orderLineItemAdjustmentService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderLineItemAdjustment>
  >
  protected orderLineItemTaxLineService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderLineItemTaxLine>
  >
  protected orderShippingMethodTaxLineService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderShippingMethodTaxLine>
  >
  protected orderTransactionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderTransaction>
  >
  protected orderChangeService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderChange>
  >
  protected orderChangeActionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderChangeAction>
  >
  protected orderItemService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderItem>
  >
  protected orderSummaryService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderSummary>
  >
  protected orderShippingService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderShipping>
  >
  protected returnReasonService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ReturnReason>
  >
  protected returnService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Return>
  >
  protected returnItemService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ReturnItem>
  >
  protected orderClaimService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderClaim>
  >
  protected orderClaimItemService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderClaimItem>
  >
  protected orderClaimItemImageService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderClaimItemImage>
  >
  protected orderExchangeService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderExchange>
  >
  protected orderExchangeItemService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderExchangeItem>
  >
  protected orderCreditLineService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof OrderCreditLine>
  >

  constructor(
    {
      baseRepository,
      orderService,
      orderAddressService,
      orderLineItemService,
      orderShippingMethodAdjustmentService,
      orderShippingMethodService,
      orderLineItemAdjustmentService,
      orderShippingMethodTaxLineService,
      orderLineItemTaxLineService,
      orderTransactionService,
      orderChangeService,
      orderChangeActionService,
      orderItemService,
      orderSummaryService,
      orderShippingService,
      returnReasonService,
      returnService,
      returnItemService,
      orderClaimService,
      orderExchangeService,
      orderCreditLineService,
    }: InjectedDependencies,
    options?: {
      generateCustomDisplayId?: (
        order: OrderTypes.CreateOrderDTO,
        sharedContext: Context
      ) => Promise<string | undefined>
    }
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.orderService_ = orderService
    this.orderAddressService_ = orderAddressService
    this.orderLineItemService_ = orderLineItemService
    this.orderShippingMethodAdjustmentService_ =
      orderShippingMethodAdjustmentService
    this.orderShippingMethodService_ = orderShippingMethodService
    this.orderLineItemAdjustmentService_ = orderLineItemAdjustmentService
    this.orderShippingMethodTaxLineService_ = orderShippingMethodTaxLineService
    this.orderLineItemTaxLineService_ = orderLineItemTaxLineService
    this.orderTransactionService_ = orderTransactionService
    this.orderChangeService_ = orderChangeService
    this.orderChangeActionService_ = orderChangeActionService
    this.orderItemService_ = orderItemService
    this.orderSummaryService_ = orderSummaryService
    this.orderShippingService_ = orderShippingService
    this.returnReasonService_ = returnReasonService
    this.returnService_ = returnService
    this.returnItemService_ = returnItemService
    this.orderClaimService_ = orderClaimService
    this.orderExchangeService_ = orderExchangeService
    this.orderCreditLineService_ = orderCreditLineService

    this.generateCustomDisplayId_ =
      options?.generateCustomDisplayId ?? this.generateCustomDisplayId_
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
      "pending_difference",
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
      "original_total",
      "original_subtotal",
      "original_tax_total",
      "credit_line_total",
      "credit_line_tax_total",
      "credit_line_subtotal",
      "refundable_amount",
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

    const requiredRelationsForTotals = [
      "credit_lines",
      "items",
      "items.tax_lines",
      "items.adjustments",
      "shipping_methods",
      "shipping_methods.tax_lines",
      "shipping_methods.adjustments",
    ]

    config.relations = deduplicate([
      ...config.relations,
      ...requiredRelationsForTotals,
    ])

    config.select = config.select.filter((field) => {
      return (
        !requiredRelationsForTotals.some((val) =>
          val.startsWith(field as string)
        ) && !totalFields.includes(field)
      )
    })
  }

  // @ts-expect-error
  async retrieveOrder(
    id: string,
    config?: FindConfig<any> | undefined,
    sharedContext?: Context
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
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]> {
    const orders = await this.listOrders_(filters, config, sharedContext)

    return this.baseRepository_.serialize<OrderTypes.OrderDTO[]>(orders)
  }

  protected async listOrders_(
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
    sharedContext?: Context
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
  // @ts-expect-error
  async createOrders(
    data: OrderTypes.CreateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
          "credit_lines",
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

  @InjectTransactionManager()
  protected async createOrders_(
    data: OrderTypes.CreateOrderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    await this.createOrderAddresses_(data, sharedContext)

    const lineItemsToCreate: CreateOrderLineItemDTO[] = []
    const creditLinesToCreate: CreateOrderCreditLineDTO[] = []
    const createdOrders: InferEntityType<typeof Order>[] = []

    for (const data_ of data) {
      const {
        items,
        shipping_methods,
        credit_lines,
        shipping_address,
        billing_address,
        ...order
      } = data_
      const ord = order as any

      const shippingMethods = shipping_methods?.map((sm: any) => {
        return {
          shipping_method: { ...sm },
        }
      })

      ord.shipping_methods = shippingMethods

      const orderWithTotals = decorateCartTotals({
        ...ord,
        shipping_methods,
        items,
        credit_lines,
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

      ord.custom_display_id = await this.generateCustomDisplayId_.bind(this)(
        data_,
        sharedContext
      )

      const created = await this.orderService_.create(ord, sharedContext)

      creditLinesToCreate.push(
        ...(credit_lines ?? []).map((creditLine) => ({
          amount: MathBN.convert(creditLine.amount),
          reference: creditLine.reference,
          reference_id: creditLine.reference_id,
          metadata: creditLine.metadata,
          order_id: created.id,
        }))
      )

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
      await this.createOrderLineItemsBulk_(lineItemsToCreate, sharedContext)
    }

    if (creditLinesToCreate.length) {
      await this.orderCreditLineService_.create(
        creditLinesToCreate,
        sharedContext
      )
    }

    return createdOrders
  }

  @InjectTransactionManager()
  protected async createOrderAddresses_(
    input: OrderTypes.CreateOrderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const allAddresses: {
      data: any
      type: "billing" | "shipping"
      source: OrderTypes.CreateOrderDTO
    }[] = []

    input.forEach((inputData) => {
      if (inputData.billing_address) {
        allAddresses.push({
          data: inputData.billing_address,
          type: "billing",
          source: inputData,
        })
      }

      if (inputData.shipping_address) {
        allAddresses.push({
          data: inputData.shipping_address,
          type: "shipping",
          source: inputData,
        })
      }
    })

    const createdAddresses = allAddresses.length
      ? await this.orderAddressService_.create(
          allAddresses.map((a) => a.data),
          sharedContext
        )
      : []

    createdAddresses.forEach((createdAddress, index) => {
      const { type, source } = allAddresses[index]
      if (type === "billing") {
        source.billing_address_id = createdAddress.id
      } else if (type === "shipping") {
        source.shipping_address_id = createdAddress.id
      }
    })
  }

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-expect-error
  async deleteOrders(
    orderIds: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds]

    const orders = await this.orderService_.list(
      { id: ids },
      {
        select: ["id", "shipping_address_id", "billing_address_id"],
      },
      sharedContext
    )

    const orderAddressIds = orders
      .map((order) => [order.shipping_address_id, order.billing_address_id])
      .flat(1)
      .filter(Boolean)

    const orderChanges = await this.orderChangeService_.list(
      { order_id: ids },
      { select: ["id"] },
      sharedContext
    )

    const orderChangeIds = orderChanges.map((orderChange) => orderChange.id)

    const orderItems = await this.orderItemService_.list(
      { order_id: ids },
      { select: ["id", "item_id"] },
      sharedContext
    )

    const lineItemIds = orderItems.map((orderItem) => orderItem.item_id)

    const orderShipping = await this.orderShippingService_.list(
      { order_id: ids },
      { select: ["shipping_method_id"] },
      sharedContext
    )

    const orderShippingMethodIds = orderShipping.map(
      (orderShipping) => orderShipping.shipping_method_id
    )

    const deletions: Promise<string[]>[] = []

    if (orderAddressIds.length) {
      deletions.push(this.orderAddressService_.delete(orderAddressIds, sharedContext))
    }

    if (orderChangeIds.length) {
      deletions.push(this.orderChangeService_.delete(orderChangeIds, sharedContext))
    }

    if (deletions.length) {
      await promiseAll(deletions)
    }

    // Delete order, order items, summary, shipping methods, transactions and credit lines
    await super.deleteOrders(ids, sharedContext)

    await promiseAll([
      this.orderLineItemService_.delete(lineItemIds, sharedContext),
      this.orderShippingMethodService_.delete(
        orderShippingMethodIds,
        sharedContext
      ),
    ])
  }

  // @ts-expect-error
  async updateOrders(
    data: OrderTypes.UpdateOrderDTO[]
  ): Promise<OrderTypes.OrderDTO[]>
  // @ts-expect-error
  async updateOrders(
    orderId: string,
    data: OrderTypes.UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>
  // @ts-expect-error
  async updateOrders(
    selector: Partial<OrderTypes.FilterableOrderProps>,
    data: OrderTypes.UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
    >(result)

    return isString(dataOrIdOrSelector) ? serializedResult[0] : serializedResult
  }

  @InjectTransactionManager()
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
  createOrderLineItems(
    data: OrderTypes.CreateOrderLineItemForOrderDTO
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  // @ts-expect-error
  createOrderLineItems(
    data: OrderTypes.CreateOrderLineItemForOrderDTO[]
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  // @ts-expect-error
  createOrderLineItems(
    orderId: string,
    items: OrderTypes.CreateOrderLineItemDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderLineItems(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderLineItemForOrderDTO[]
      | OrderTypes.CreateOrderLineItemForOrderDTO,
    data?:
      | OrderTypes.CreateOrderLineItemDTO[]
      | OrderTypes.CreateOrderLineItemDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemDTO[]> {
    let items: InferEntityType<typeof OrderLineItem>[] = []
    if (isString(orderIdOrData)) {
      items = await this.createOrderLineItems_(
        orderIdOrData,
        data as OrderTypes.CreateOrderLineItemDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      const allOrderIds = data.map((dt) => dt.order_id)
      const order = await this.listOrders_(
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

      items = await this.createOrderLineItemsBulk_(lineItems, sharedContext)
    }

    return await this.baseRepository_.serialize<OrderTypes.OrderLineItemDTO[]>(
      items
    )
  }

  @InjectTransactionManager()
  protected async createOrderLineItems_(
    orderId: string,
    items: OrderTypes.CreateOrderLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItem>[]> {
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

    return await this.createOrderLineItemsBulk_(toUpdate, sharedContext)
  }

  @InjectTransactionManager()
  protected async createOrderLineItemsBulk_(
    data: CreateOrderLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItem>[]> {
    const orderItemToCreate: CreateOrderItemDTO[] = []

    const lineItems = await this.orderLineItemService_.create(
      data,
      sharedContext
    )

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
  updateOrderLineItems(
    data: OrderTypes.UpdateOrderLineItemWithSelectorDTO[]
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  // @ts-expect-error
  updateOrderLineItems(
    selector: Partial<OrderTypes.FilterableOrderLineItemProps>,
    data: OrderTypes.UpdateOrderLineItemDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  // @ts-expect-error
  updateOrderLineItems(
    lineItemId: string,
    data: Partial<OrderTypes.UpdateOrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateOrderLineItems(
    lineItemIdOrDataOrSelector:
      | string
      | OrderTypes.UpdateOrderLineItemWithSelectorDTO[]
      | Partial<OrderTypes.FilterableOrderLineItemProps>,
    data?:
      | OrderTypes.UpdateOrderLineItemDTO
      | Partial<OrderTypes.UpdateOrderLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemDTO[] | OrderTypes.OrderLineItemDTO> {
    let items: InferEntityType<typeof OrderLineItem>[] = []
    if (isString(lineItemIdOrDataOrSelector)) {
      const item = await this.updateOrderLineItem_(
        lineItemIdOrDataOrSelector,
        data as Partial<OrderTypes.UpdateOrderLineItemDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<OrderTypes.OrderLineItemDTO>(
        item
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

    items = await this.updateOrderLineItemsWithSelector_(
      toUpdate,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderLineItemDTO[]>(
      items
    )
  }

  @InjectTransactionManager()
  protected async updateOrderLineItem_(
    lineItemId: string,
    data: Partial<OrderTypes.UpdateOrderLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItem>> {
    const [item] = await this.orderLineItemService_.update(
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

  @InjectTransactionManager()
  protected async updateOrderLineItemsWithSelector_(
    updates: OrderTypes.UpdateOrderLineItemWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItem>[]> {
    let toUpdate: UpdateOrderLineItemDTO[] = []
    const detailsToUpdate: UpdateOrderItemWithSelectorDTO[] = []
    for (const { selector, data } of updates) {
      const items = await this.orderLineItemService_.list(
        { ...selector },
        {},
        sharedContext
      )

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

    return await this.orderLineItemService_.update(toUpdate, sharedContext)
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

  @InjectManager()
  @EmitEvents()
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
    let items: InferEntityType<typeof OrderItem>[] = []
    if (isString(orderItemIdOrDataOrSelector)) {
      const item = await this.updateOrderItem_(
        orderItemIdOrDataOrSelector,
        data as Partial<OrderTypes.UpdateOrderItemDTO>,
        sharedContext
      )

      return await this.baseRepository_.serialize<OrderTypes.OrderItemDTO>(item)
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
      items
    )
  }

  @InjectTransactionManager()
  protected async updateOrderItem_(
    orderItemId: string,
    data: Partial<OrderTypes.UpdateOrderItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderItem>> {
    const [detail] = await this.orderItemService_.update(
      [{ id: orderItemId, ...data }],
      sharedContext
    )

    return detail
  }

  @InjectTransactionManager()
  protected async updateOrderItemWithSelector_(
    updates: OrderTypes.UpdateOrderItemWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderItem>[]> {
    let toUpdate: UpdateOrderItemDTO[] = []
    for (const { selector, data } of updates) {
      const details = await this.orderItemService_.list(
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

  // @ts-expect-error
  async createOrderShippingMethods(
    data: OrderTypes.CreateOrderShippingMethodDTO
  ): Promise<OrderTypes.OrderShippingMethodDTO>
  // @ts-expect-error
  async createOrderShippingMethods(
    data: OrderTypes.CreateOrderShippingMethodDTO[]
  ): Promise<OrderTypes.OrderShippingMethodDTO[]>
  // @ts-expect-error
  async createOrderShippingMethods(
    orderId: string,
    methods: OrderTypes.CreateOrderShippingMethodDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderShippingMethods(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderShippingMethodDTO[]
      | OrderTypes.CreateOrderShippingMethodDTO,
    data?: OrderTypes.CreateOrderShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderShippingMethodDTO[] | OrderTypes.OrderShippingMethodDTO
  > {
    let methods: InferEntityType<typeof OrderShippingMethod>[]
    if (isString(orderIdOrData)) {
      methods = await this.createOrderShippingMethods_(
        orderIdOrData,
        data!,
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      const allOrderIds = data.map((dt) => dt.order_id)
      const order = await this.listOrders_(
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
          version: dt.version ?? mapOrderVersion[dt.order_id],
        }
      })

      methods = await this.createOrderShippingMethodsBulk_(
        orderShippingMethodData as any,
        sharedContext
      )
    }

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodDTO[]
    >(methods)
  }

  @InjectTransactionManager()
  protected async createOrderShippingMethods_(
    orderId: string,
    data: CreateOrderShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderShippingMethod>[]> {
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

    return await this.createOrderShippingMethodsBulk_(methods, sharedContext)
  }

  @InjectTransactionManager()
  protected async createOrderShippingMethodsBulk_(
    data: {
      shipping_method: OrderTypes.CreateOrderShippingMethodDTO
      order_id: string
      version: number
    }[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderShippingMethod>[]> {
    const sm = await this.orderShippingService_.create(data, sharedContext)

    return sm.map((s) => s.shipping_method) as any
  }

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async softDeleteOrderShippingMethods<TReturnableLinkableKeys extends string>(
    ids: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    return await this.softDeleteOrderShippingMethods_(
      ids,
      config,
      sharedContext
    )
  }

  @InjectTransactionManager()
  protected async softDeleteOrderShippingMethods_<
    TReturnableLinkableKeys extends string
  >(
    ids: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const rel = await super.listOrderShippings(
      {
        shipping_method_id: ids,
      },
      {
        select: ["id"],
      },
      sharedContext
    )
    const orderShippingIds = rel.map((r) => r.id)

    const [returned] = await promiseAll([
      super.softDeleteOrderShippingMethods(ids, config, sharedContext),
      super.softDeleteOrderShippings(orderShippingIds, config, sharedContext),
    ])

    return returned
  }

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async restoreOrderShippingMethods<TReturnableLinkableKeys extends string>(
    ids: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    return await this.restoreOrderShippingMethods_(ids, config, sharedContext)
  }

  @InjectTransactionManager()
  protected async restoreOrderShippingMethods_<
    TReturnableLinkableKeys extends string
  >(
    ids: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const rel = await super.listOrderShippings(
      {
        shipping_method_id: ids,
      },
      {
        select: ["id"],
      },
      sharedContext
    )
    const shippingIds = rel.map((r) => r.id)

    const [returned] = await promiseAll([
      super.restoreOrderShippingMethods(ids, config, sharedContext),
      super.restoreOrderShippings(shippingIds, config, sharedContext),
    ])

    return returned
  }

  // @ts-ignore
  async createOrderLineItemAdjustments(
    adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[]
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>
  // @ts-expect-error
  async createOrderLineItemAdjustments(
    adjustment: OrderTypes.CreateOrderLineItemAdjustmentDTO
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>
  // @ts-expect-error
  async createOrderLineItemAdjustments(
    orderId: string,
    adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderLineItemAdjustments(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderLineItemAdjustmentDTO[]
      | OrderTypes.CreateOrderLineItemAdjustmentDTO,
    adjustments?: OrderTypes.CreateOrderLineItemAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]> {
    const addedAdjustments = await this.createOrderLineItemAdjustments_(
      orderIdOrData,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemAdjustmentDTO[]
    >(addedAdjustments)
  }

  @InjectTransactionManager()
  protected async createOrderLineItemAdjustments_(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderLineItemAdjustmentDTO[]
      | OrderTypes.CreateOrderLineItemAdjustmentDTO,
    adjustments?: OrderTypes.CreateOrderLineItemAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItemAdjustment>[]> {
    let addedAdjustments: InferEntityType<typeof OrderLineItemAdjustment>[] = []
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

      addedAdjustments = await this.orderLineItemAdjustmentService_.create(
        adjustments as OrderTypes.CreateOrderLineItemAdjustmentDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      addedAdjustments = await this.orderLineItemAdjustmentService_.create(
        data as OrderTypes.CreateOrderLineItemAdjustmentDTO[],
        sharedContext
      )
    }

    return addedAdjustments
  }

  @InjectManager()
  @EmitEvents()
  async upsertOrderLineItemAdjustments(
    adjustments: (
      | OrderTypes.CreateOrderLineItemAdjustmentDTO
      | OrderTypes.UpdateOrderLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]> {
    let result = await this.upsertOrderLineItemAdjustments_(
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async upsertOrderLineItemAdjustments_(
    adjustments: (
      | OrderTypes.CreateOrderLineItemAdjustmentDTO
      | OrderTypes.UpdateOrderLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItemAdjustment>[]> {
    return await this.orderLineItemAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )
  }

  @InjectManager()
  @EmitEvents()
  async setOrderLineItemAdjustments(
    orderId: string,
    adjustments: (
      | OrderTypes.CreateOrderLineItemAdjustmentDTO
      | OrderTypes.UpdateOrderLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]> {
    const result = await this.setOrderLineItemAdjustments_(
      orderId,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async setOrderLineItemAdjustments_(
    orderId: string,
    adjustments: (
      | OrderTypes.CreateOrderLineItemAdjustmentDTO
      | OrderTypes.UpdateOrderLineItemAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItemAdjustment>[]> {
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
      await this.orderLineItemAdjustmentService_.delete(toDelete, sharedContext)
    }

    const result = await this.orderLineItemAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return result
  }

  @InjectManager()
  @EmitEvents()
  async upsertOrderShippingMethodAdjustments(
    adjustments: (
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO
      | OrderTypes.UpdateOrderShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]> {
    const result = await this.upsertOrderShippingMethodAdjustments_(
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async upsertOrderShippingMethodAdjustments_(
    adjustments: (
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO
      | OrderTypes.UpdateOrderShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderShippingMethodAdjustment>[]> {
    return await this.orderShippingMethodAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )
  }

  @InjectManager()
  @EmitEvents()
  async setOrderShippingMethodAdjustments(
    orderId: string,
    adjustments: (
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO
      | OrderTypes.UpdateOrderShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]> {
    const result = await this.setOrderShippingMethodAdjustments_(
      orderId,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodAdjustmentDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async setOrderShippingMethodAdjustments_(
    orderId: string,
    adjustments: (
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO
      | OrderTypes.UpdateOrderShippingMethodAdjustmentDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderShippingMethodAdjustment>[]> {
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
      await this.orderShippingMethodAdjustmentService_.delete(
        toDelete,
        sharedContext
      )
    }

    const result = await this.orderShippingMethodAdjustmentService_.upsert(
      adjustments,
      sharedContext
    )

    return result
  }

  // @ts-ignore
  async createOrderShippingMethodAdjustments(
    adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[]
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>
  // @ts-expect-error
  async createOrderShippingMethodAdjustments(
    adjustment: OrderTypes.CreateOrderShippingMethodAdjustmentDTO
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO>
  // @ts-expect-error
  async createOrderShippingMethodAdjustments(
    orderId: string,
    adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderShippingMethodAdjustments(
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
    const addedAdjustments = await this.createOrderShippingMethodAdjustments_(
      orderIdOrData,
      adjustments,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      | OrderTypes.OrderShippingMethodAdjustmentDTO[]
      | OrderTypes.OrderShippingMethodAdjustmentDTO
    >(addedAdjustments)
  }

  @InjectTransactionManager()
  protected async createOrderShippingMethodAdjustments_(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO[]
      | OrderTypes.CreateOrderShippingMethodAdjustmentDTO,
    adjustments?: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof OrderShippingMethodAdjustment>[]
    | InferEntityType<typeof OrderShippingMethodAdjustment>
  > {
    let addedAdjustments: InferEntityType<
      typeof OrderShippingMethodAdjustment
    >[] = []
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

      addedAdjustments =
        await this.orderShippingMethodAdjustmentService_.create(
          adjustments as OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
          sharedContext
        )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      addedAdjustments =
        await this.orderShippingMethodAdjustmentService_.create(
          data as OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
          sharedContext
        )
    }

    if (isObject(orderIdOrData)) {
      return addedAdjustments[0]
    }

    return addedAdjustments
  }

  // @ts-ignore
  createOrderLineItemTaxLines(
    taxLines: OrderTypes.CreateOrderLineItemTaxLineDTO[]
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>
  // @ts-expect-error
  createOrderLineItemTaxLines(
    taxLine: OrderTypes.CreateOrderLineItemTaxLineDTO
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO>
  // @ts-expect-error
  createOrderLineItemTaxLines(
    orderId: string,
    taxLines:
      | OrderTypes.CreateOrderLineItemTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderLineItemTaxLines(
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
    const addedTaxLines = await this.createOrderLineItemTaxLines_(
      orderIdOrData,
      taxLines,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemTaxLineDTO[] | OrderTypes.OrderLineItemTaxLineDTO
    >(addedTaxLines)

    if (isObject(orderIdOrData)) {
      return serialized[0]
    }

    return serialized
  }

  @InjectTransactionManager()
  protected async createOrderLineItemTaxLines_(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderLineItemTaxLineDTO[]
      | OrderTypes.CreateOrderLineItemTaxLineDTO,
    taxLines?:
      | OrderTypes.CreateOrderLineItemTaxLineDTO[]
      | OrderTypes.CreateOrderLineItemTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof OrderLineItemTaxLine>[]
    | InferEntityType<typeof OrderLineItemTaxLine>
  > {
    let addedTaxLines: InferEntityType<typeof OrderLineItemTaxLine>[]
    if (isString(orderIdOrData)) {
      const lines = Array.isArray(taxLines) ? taxLines : [taxLines]

      addedTaxLines = await this.orderLineItemTaxLineService_.create(
        lines as CreateOrderLineItemTaxLineDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]

      addedTaxLines = await this.orderLineItemTaxLineService_.create(
        data as CreateOrderLineItemTaxLineDTO[],
        sharedContext
      )
    }

    if (isObject(orderIdOrData)) {
      return addedTaxLines[0]
    }

    return addedTaxLines
  }

  @InjectManager()
  @EmitEvents()
  async upsertOrderLineItemTaxLines(
    taxLines: (
      | OrderTypes.CreateOrderLineItemTaxLineDTO
      | OrderTypes.UpdateOrderLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]> {
    const result = await this.upsertOrderLineItemTaxLines_(
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemTaxLineDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async upsertOrderLineItemTaxLines_(
    taxLines: (
      | OrderTypes.CreateOrderLineItemTaxLineDTO
      | OrderTypes.UpdateOrderLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItemTaxLine>[]> {
    const result = await this.orderLineItemTaxLineService_.upsert(
      taxLines as UpdateOrderLineItemTaxLineDTO[],
      sharedContext
    )

    return result
  }

  @InjectManager()
  @EmitEvents()
  async setOrderLineItemTaxLines(
    orderId: string,
    taxLines: (
      | OrderTypes.CreateOrderLineItemTaxLineDTO
      | OrderTypes.UpdateOrderLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]> {
    const result = await this.setOrderLineItemTaxLines_(
      orderId,
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderLineItemTaxLineDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async setOrderLineItemTaxLines_(
    orderId: string,
    taxLines: (
      | OrderTypes.CreateOrderLineItemTaxLineDTO
      | OrderTypes.UpdateOrderLineItemTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderLineItemTaxLine>[]> {
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
      await this.orderLineItemTaxLineService_.delete(toDelete, sharedContext)
    }

    const result = await this.orderLineItemTaxLineService_.upsert(
      taxLines as UpdateOrderLineItemTaxLineDTO[],
      sharedContext
    )

    return result
  }

  // @ts-ignore
  createOrderShippingMethodTaxLines(
    taxLines: OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>
  // @ts-expect-error
  createOrderShippingMethodTaxLines(
    taxLine: OrderTypes.CreateOrderShippingMethodTaxLineDTO
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO>
  // @ts-expect-error
  createOrderShippingMethodTaxLines(
    orderId: string,
    taxLines:
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderShippingMethodTaxLines(
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
    const addedTaxLines = await this.createOrderShippingMethodTaxLines_(
      orderIdOrData,
      taxLines,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      | OrderTypes.OrderShippingMethodTaxLineDTO[]
      | OrderTypes.OrderShippingMethodTaxLineDTO
    >(addedTaxLines)

    if (isObject(orderIdOrData)) {
      return serialized[0]
    }

    return serialized
  }

  @InjectTransactionManager()
  protected async createOrderShippingMethodTaxLines_(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    taxLines?:
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderShippingMethodTaxLine>[]> {
    let addedTaxLines: InferEntityType<typeof OrderShippingMethodTaxLine>[]
    if (isString(orderIdOrData)) {
      const lines = Array.isArray(taxLines) ? taxLines : [taxLines]

      addedTaxLines = await this.orderShippingMethodTaxLineService_.create(
        lines as CreateOrderShippingMethodTaxLineDTO[],
        sharedContext
      )
    } else {
      addedTaxLines = await this.orderShippingMethodTaxLineService_.create(
        taxLines as CreateOrderShippingMethodTaxLineDTO[],
        sharedContext
      )
    }

    return addedTaxLines
  }

  @InjectManager()
  @EmitEvents()
  async upsertOrderShippingMethodTaxLines(
    taxLines: (
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO
      | OrderTypes.UpdateOrderShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]> {
    const result = await this.orderShippingMethodTaxLineService_.upsert(
      taxLines as UpdateOrderShippingMethodTaxLineDTO[],
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodTaxLineDTO[]
    >(result)
  }

  @InjectManager()
  @EmitEvents()
  async setOrderShippingMethodTaxLines(
    orderId: string,
    taxLines: (
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO
      | OrderTypes.UpdateOrderShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]> {
    const result = await this.setOrderShippingMethodTaxLines_(
      orderId,
      taxLines,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodTaxLineDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async setOrderShippingMethodTaxLines_(
    orderId: string,
    taxLines: (
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO
      | OrderTypes.UpdateOrderShippingMethodTaxLineDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderShippingMethodTaxLine>[]> {
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
      await this.orderShippingMethodTaxLineService_.delete(
        toDelete,
        sharedContext
      )
    }

    const result = await this.orderShippingMethodTaxLineService_.upsert(
      taxLines as UpdateOrderShippingMethodTaxLineDTO[],
      sharedContext
    )

    return result
  }

  // @ts-ignore
  async createReturns(
    data: OrderTypes.CreateOrderReturnDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO>

  // @ts-expect-error
  async createReturns(
    data: OrderTypes.CreateOrderReturnDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.ReturnDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createReturns(
    data: OrderTypes.CreateOrderReturnDTO | OrderTypes.CreateOrderReturnDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.ReturnDTO | OrderTypes.ReturnDTO[]> {
    const created = await this.createOrderRelatedEntity_(
      data,
      this.returnService_,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.ReturnDTO>(
      !Array.isArray(data) ? created[0] : created
    )
  }

  // @ts-ignore
  async createOrderClaims(
    data: OrderTypes.CreateOrderClaimDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderClaimDTO>

  // @ts-expect-error
  async createOrderClaims(
    data: OrderTypes.CreateOrderClaimDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderClaimDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderClaims(
    data: OrderTypes.CreateOrderClaimDTO | OrderTypes.CreateOrderClaimDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderClaimDTO | OrderTypes.OrderClaimDTO[]> {
    const created = await this.createOrderRelatedEntity_(
      data,
      this.orderClaimService_,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderClaimDTO>(
      !Array.isArray(data) ? created[0] : created
    )
  }

  // @ts-ignore
  async createOrderExchanges(
    data: OrderTypes.CreateOrderExchangeDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderExchangeDTO>

  // @ts-expect-error
  async createOrderExchanges(
    data: OrderTypes.CreateOrderExchangeDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderExchangeDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createOrderExchanges(
    data:
      | OrderTypes.CreateOrderExchangeDTO
      | OrderTypes.CreateOrderExchangeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderExchangeDTO | OrderTypes.OrderExchangeDTO[]> {
    const created = await this.createOrderRelatedEntity_(
      data,
      this.orderExchangeService_,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderExchangeDTO>(
      !Array.isArray(data) ? created[0] : created
    )
  }

  @InjectTransactionManager()
  private async createOrderRelatedEntity_(
    data: any,
    service: any,
    @MedusaContext() sharedContext: Context = {}
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

  @InjectManager()
  @EmitEvents()
  async createOrderChange(
    data: CreateOrderChangeDTO | CreateOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderChangeDTO | OrderTypes.OrderChangeDTO[]> {
    const changes = await this.createOrderChange_(data, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderChangeDTO>(
      Array.isArray(data) ? changes : changes[0]
    )
  }

  @InjectTransactionManager()
  protected async createOrderChange_(
    data: CreateOrderChangeDTO | CreateOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderChange>[]> {
    const dataArr = Array.isArray(data) ? data : [data]
    const orderIds: string[] = []
    const dataMap: Record<string, object> = {}

    const orderChanges = await this.orderChangeService_.list(
      {
        order_id: dataArr.map((data) => data.order_id),
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
      {},
      sharedContext
    )

    const orderChangesMap = new Map<
      string,
      InferEntityType<typeof OrderChange>
    >(orderChanges.map((item) => [item.order_id, item]))

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
        version: order.version! + 1,
      } as any
    })

    return await this.orderChangeService_.create(input, sharedContext)
  }

  @InjectManager()
  async previewOrderChange(
    orderId: string,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const order = await this.retrieveOrder(
      orderId,
      {
        select: ["id", "version", "items.detail", "summary", "total", "email"],
        relations: ["transactions", "credit_lines"],
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

    // We need to apply the latest ordering actions last
    const sortedActions = orderChange.actions.sort((a, b) => {
      return a.ordering - b.ordering
    })

    const {
      itemsToUpsert,
      shippingMethodsToUpsert,
      calculatedOrders,
      lineItemAdjustmentsToCreate,
    } = await applyChangesToOrder(
      [order],
      { [order.id]: sortedActions },
      { addActionReferenceToObject: true }
    )

    const calculated = calculatedOrders[order.id]

    await this.includeTaxLinesAndAdjustmentsToPreview(
      calculated.order,
      itemsToUpsert,
      shippingMethodsToUpsert,
      lineItemAdjustmentsToCreate, // this will add "virtual" adjustments for the preview version but no actual adjustments will be created in the DB
      sharedContext
    )

    const calcOrder = calculated.order

    const orderWithTotals = decorateCartTotals(
      calcOrder as DecorateCartLikeInputDTO
    )
    calcOrder.summary = calculated.getSummaryFromOrder(orderWithTotals)

    createRawPropertiesFromBigNumber(calcOrder)

    return calcOrder
  }

  private async includeTaxLinesAndAdjustmentsToPreview(
    order,
    itemsToUpsert,
    shippingMethodsToUpsert,
    lineItemAdjustmentsToCreate,
    sharedContext: Context = {}
  ) {
    const addedItems = {}
    const addedShippingMethods = {}

    for (const item of order.items) {
      const isExistingItem = item.id === item.detail?.item_id
      if (!isExistingItem) {
        addedItems[item.id] = {
          ...item,
          quantity: item.detail?.quantity ?? item.quantity,
          unit_price: item.detail?.unit_price || item.unit_price,
          compare_at_unit_price:
            item.detail?.compare_at_unit_price ||
            item.compare_at_unit_price ||
            null,
        }
      }
    }

    for (const sm of order.shipping_methods) {
      if (!isDefined(sm.shipping_option_id)) {
        addedShippingMethods[sm.id] = sm
      }
    }

    if (Object.keys(addedItems).length > 0) {
      const addedItemDetails = await this.listOrderLineItems(
        { id: Object.keys(addedItems) },
        {
          relations: ["adjustments", "tax_lines"],
        },
        sharedContext
      )

      order.items.forEach((item, idx) => {
        if (!addedItems[item.id]) {
          return
        }

        const lineItem = addedItemDetails.find((d) => d.id === item.id) as any

        const actions = item.actions
        delete item.actions

        //@ts-ignore
        const newItem = itemsToUpsert.find((d) => d.item_id === item.id)!

        const adjustments = lineItemAdjustmentsToCreate.filter(
          (d) => d.item_id === newItem.item_id
        )

        const unitPrice = newItem?.unit_price ?? item.unit_price
        const compareAtUnitPrice =
          newItem?.compare_at_unit_price ?? item.compare_at_unit_price

        delete lineItem.raw_unit_price
        delete lineItem.raw_compare_at_unit_price

        order.items[idx] = {
          ...lineItem,
          actions,
          quantity: newItem.quantity,
          unit_price: unitPrice,
          compare_at_unit_price: compareAtUnitPrice || null,
          adjustments: adjustments,
          detail: {
            ...newItem,
            ...item,
          },
        }
      })
    }

    if (Object.keys(addedShippingMethods).length > 0) {
      const addedShippingDetails = await this.listOrderShippingMethods(
        { id: Object.keys(addedShippingMethods) },
        {
          relations: ["adjustments", "tax_lines"],
        },
        sharedContext
      )

      order.shipping_methods.forEach((sm, idx) => {
        if (!addedShippingMethods[sm.id]) {
          return
        }

        const shippingMethod = addedShippingDetails.find(
          (d) => d.id === sm.id
        ) as any

        const actions = sm.actions
        delete sm.actions

        const newItem = shippingMethodsToUpsert.find((d) => d.id === sm.id)!

        sm.shipping_method_id = sm.id
        delete sm.id

        order.shipping_methods[idx] = {
          ...shippingMethod,
          actions,
          detail: {
            ...sm,
            ...newItem,
          },
        }
      })
    }
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

  @InjectTransactionManager()
  @EmitEvents()
  async cancelOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.CancelOrderChangeDTO
      | OrderTypes.CancelOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
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

  @InjectManager()
  @EmitEvents()
  async confirmOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.ConfirmOrderChangeDTO
      | OrderTypes.ConfirmOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderChangeReturn> {
    const result = await this.confirmOrderChange_(
      orderChangeIdOrData,
      sharedContext
    )

    return await this.baseRepository_.serialize<OrderTypes.OrderChangeReturn>(
      result
    )
  }

  @InjectTransactionManager()
  protected async confirmOrderChange_(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.ConfirmOrderChangeDTO
      | OrderTypes.ConfirmOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
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

  @InjectManager()
  @EmitEvents()
  async declineOrderChange(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.DeclineOrderChangeDTO
      | OrderTypes.DeclineOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.declineOrderChange_(orderChangeIdOrData, sharedContext)
  }

  @InjectTransactionManager()
  protected async declineOrderChange_(
    orderChangeIdOrData:
      | string
      | string[]
      | OrderTypes.DeclineOrderChangeDTO
      | OrderTypes.DeclineOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
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

  async registerOrderChange(
    data: OrderTypes.RegisterOrderChangeDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeDTO>
  async registerOrderChange(
    data: OrderTypes.RegisterOrderChangeDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderChangeDTO[]>

  @InjectManager()
  @EmitEvents()
  async registerOrderChange(
    data:
      | OrderTypes.RegisterOrderChangeDTO
      | OrderTypes.RegisterOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderChangeDTO | OrderTypes.OrderChangeDTO[]> {
    const result = await this.registerOrderChange_(data, sharedContext)

    return await this.baseRepository_.serialize<
      OrderTypes.OrderChangeDTO | OrderTypes.OrderChangeDTO[]
    >(result)
  }

  @InjectTransactionManager()
  protected async registerOrderChange_(
    data:
      | OrderTypes.RegisterOrderChangeDTO
      | OrderTypes.RegisterOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    InferEntityType<typeof OrderChange> | InferEntityType<typeof OrderChange>[]
  > {
    const inputData = Array.isArray(data) ? data : [data]

    const orders = await this.orderService_.list(
      { id: inputData.map((d) => d.order_id) },
      { select: ["id", "version"] },
      sharedContext
    )

    const orderVersionsMap = new Map(orders.map((o) => [o.id, o.version]))

    const changes = await this.orderChangeService_.create(
      inputData.map((d) => ({
        order_id: d.order_id,
        change_type: d.change_type,
        internal_note: d.internal_note,
        description: d.description,
        metadata: d.metadata,
        confirmed_at: new Date(),
        created_by: d.created_by,
        confirmed_by: d.confirmed_by,
        status: OrderChangeStatus.CONFIRMED,
        version: orderVersionsMap.get(d.order_id)!,
        actions: [
          {
            action: ChangeActionType.UPDATE_ORDER_PROPERTIES,
            details: d.details,
            version: orderVersionsMap.get(d.order_id)!,
            applied: true,
          },
        ],
      })),
      sharedContext
    )

    return changes
  }

  @InjectManager()
  @EmitEvents()
  async applyPendingOrderActions(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderChangeReturn> {
    const result = await this.applyPendingOrderActions_(orderId, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.OrderChangeReturn>(
      result
    )
  }

  @InjectTransactionManager()
  protected async applyPendingOrderActions_(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
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
      changes as unknown as ApplyOrderChangeDTO[],
      sharedContext
    )
  }

  @InjectManager()
  @EmitEvents()
  async revertLastVersion(
    orderId: string,
    @MedusaContext() sharedContext: Context = {}
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

  @InjectManager()
  @EmitEvents()
  async undoLastChange(
    orderId: string,
    lastOrderChange?: Partial<OrderChangeDTO>,
    @MedusaContext() sharedContext: Context = {}
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

    return await this.undoLastChange_(order, lastOrderChange, sharedContext)
  }

  @InjectTransactionManager()
  protected async undoLastChange_(
    order: OrderDTO,
    lastOrderChange?: Partial<OrderChangeDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const currentVersion = order.version

    const updatePromises: Promise<any>[] = []
    // Order Changes
    const orderChanges = await this.orderChangeService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )

    const orderChangesIds = orderChanges.map((change) => {
      return {
        id: change.id,
        status: lastOrderChange?.status ?? OrderChangeStatus.PENDING,
        confirmed_at: null,
      }
    })

    updatePromises.push(
      this.orderChangeService_.update(orderChangesIds, sharedContext)
    )

    // Order Changes Actions
    const orderChangesActions = await this.orderChangeActionService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderChangeActionsIds = orderChangesActions.map((action) => {
      return {
        id: action.id,
        applied: false,
      }
    })

    updatePromises.push(
      this.orderChangeActionService_.update(
        orderChangeActionsIds,
        sharedContext
      )
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

    updatePromises.push(
      this.orderSummaryService_.softDelete(orderSummaryIds, sharedContext)
    )

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

    updatePromises.push(
      this.orderItemService_.softDelete(orderItemIds, sharedContext)
    )

    // Order Shipping
    const orderShippings = await this.orderShippingService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderShippingIds = orderShippings.map((sh) => sh.id)

    updatePromises.push(
      this.orderShippingService_.softDelete(orderShippingIds, sharedContext)
    )

    // Order Credit Lines
    const orderCreditLines = await this.orderCreditLineService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderCreditLineIds = orderCreditLines.map((cl) => cl.id)

    updatePromises.push(
      this.orderCreditLineService_.softDelete(orderCreditLineIds, sharedContext)
    )

    // Order
    updatePromises.push(
      this.orderService_.update(
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
    )

    await promiseAll(updatePromises)
  }

  @InjectTransactionManager()
  protected async revertLastChange_(
    order: OrderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const currentVersion = order.version

    const updatePromises: Promise<any>[] = []
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

    updatePromises.push(
      this.orderChangeService_.softDelete(orderChangesIds, sharedContext)
    )

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

    updatePromises.push(
      this.orderChangeActionService_.softDelete(
        orderChangeActionsIds,
        sharedContext
      )
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

    updatePromises.push(
      this.orderSummaryService_.softDelete(orderSummaryIds, sharedContext)
    )

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

    updatePromises.push(
      this.orderItemService_.softDelete(orderItemIds, sharedContext)
    )

    // Order Shipping
    const orderShippings = await this.orderShippingService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderShippingIds = orderShippings.map((sh) => sh.id)

    updatePromises.push(
      this.orderShippingService_.softDelete(orderShippingIds, sharedContext)
    )

    // Order Credit Lines
    const orderCreditLines = await this.orderCreditLineService_.list(
      {
        order_id: order.id,
        version: currentVersion,
      },
      { select: ["id", "version"] },
      sharedContext
    )
    const orderCreditLineIds = orderCreditLines.map((cl) => cl.id)

    updatePromises.push(
      this.orderCreditLineService_.softDelete(orderCreditLineIds, sharedContext)
    )

    // Order
    updatePromises.push(
      this.orderService_.update(
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
    )

    // Returns
    updatePromises.push(
      this.returnService_.delete(
        {
          order_id: order.id,
          order_version: currentVersion,
        },
        sharedContext
      )
    )

    await promiseAll(updatePromises)
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
        "description",
        "internal_note",
        "carry_over_promotions",
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

  @InjectManager()
  @EmitEvents()
  async addOrderAction(
    data:
      | OrderTypes.CreateOrderChangeActionDTO
      | OrderTypes.CreateOrderChangeActionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderChangeActionDTO | OrderTypes.OrderChangeActionDTO[]
  > {
    const actions = await this.addOrderAction_(data, sharedContext)

    const serializedActions = await this.baseRepository_.serialize<
      OrderTypes.OrderChangeActionDTO | OrderTypes.OrderChangeActionDTO[]
    >(actions)

    return Array.isArray(data) ? serializedActions : serializedActions[0]
  }

  @InjectTransactionManager()
  protected async addOrderAction_(
    data:
      | OrderTypes.CreateOrderChangeActionDTO
      | OrderTypes.CreateOrderChangeActionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderChangeAction>[]> {
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

    const actions = await this.orderChangeActionService_.create(
      dataArr,
      sharedContext
    )

    return actions
  }

  @InjectTransactionManager()
  private async applyOrderChanges_(
    changeActions: ApplyOrderChangeDTO[],
    @MedusaContext() sharedContext: Context = {}
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
        shipping_methods: [],
        credit_lines: [],
      }
    }

    let orders = await this.listOrders_(
      { id: deduplicate(ordersIds) },
      {
        select: ["id", "version", "items.detail", "summary", "total", "email"],
        relations: ["transactions", "credit_lines"],
      },
      sharedContext
    )

    const {
      itemsToUpsert,
      shippingMethodsToUpsert,
      summariesToUpsert,
      orderToUpdate,
      creditLinesToUpsert,
      lineItemAdjustmentsToCreate,
    } = await applyChangesToOrder(orders, actionsMap, {
      addActionReferenceToObject: true,
      includeTaxLinesAndAdjustmentsToPreview: async (...args) => {
        args.push(sharedContext)
        return await this.includeTaxLinesAndAdjustmentsToPreview.apply(
          this,
          args
        )
      },
    })

    const [
      _orderUpdate,
      _orderChangeActionUpdate,
      orderItems,
      _orderSummaryUpdate,
      orderShippingMethods,
      orderCreditLines,
    ] = await promiseAll([
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
        ? this.orderShippingService_.upsert(
            shippingMethodsToUpsert,
            sharedContext
          )
        : null,
      creditLinesToUpsert.length
        ? this.orderCreditLineService_.upsert(
            creditLinesToUpsert,
            sharedContext
          )
        : null,
      lineItemAdjustmentsToCreate.length
        ? this.orderLineItemAdjustmentService_.create(
            // this is called when a new order version is confirmed so we only create a new set of adjustments for that version
            // there is no removal or upsert
            lineItemAdjustmentsToCreate,
            sharedContext
          )
        : null,
    ])

    return {
      items: orderItems ?? [],
      shipping_methods: orderShippingMethods ?? [],
      credit_lines: orderCreditLines ?? ([] as any),
    }
  }

  async addOrderTransactions(
    transactionData: OrderTypes.CreateOrderTransactionDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO>

  async addOrderTransactions(
    transactionData: OrderTypes.CreateOrderTransactionDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderTransactionDTO[]>

  @InjectManager()
  @EmitEvents()
  async addOrderTransactions(
    transactionData:
      | OrderTypes.CreateOrderTransactionDTO
      | OrderTypes.CreateOrderTransactionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderTransactionDTO | OrderTypes.OrderTransactionDTO[]
  > {
    const created = await this.addOrderTransactions_(
      transactionData,
      sharedContext
    )

    const serializedTransactions = await this.baseRepository_.serialize<
      OrderTypes.OrderTransactionDTO | OrderTypes.OrderTransactionDTO[]
    >(created)

    return Array.isArray(transactionData)
      ? serializedTransactions
      : (serializedTransactions[0] as OrderTypes.OrderTransactionDTO)
  }

  @InjectTransactionManager()
  private async addOrderTransactions_(
    transactionData:
      | OrderTypes.CreateOrderTransactionDTO
      | OrderTypes.CreateOrderTransactionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof OrderTransaction>[]> {
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

    const created = (await this.orderTransactionService_.create(
      data,
      sharedContext
    )) as (InferEntityType<typeof OrderTransaction> & { order_id: string })[]

    await this.updateOrderPaidRefundableAmount_(created, false, sharedContext)

    return created
  }

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-ignore
  async deleteOrderTransactions(
    transactionIds: string | object | string[] | object[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const data = Array.isArray(transactionIds)
      ? transactionIds
      : [transactionIds]

    const transactions = await super.listOrderTransactions(
      {
        id: data,
      },
      {
        select: ["order_id", "version", "amount"],
      },
      sharedContext
    )

    await this.orderTransactionService_.delete(data, sharedContext)

    await this.updateOrderPaidRefundableAmount_(
      transactions,
      true,
      sharedContext
    )
  }

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async softDeleteOrderTransactions<TReturnableLinkableKeys extends string>(
    transactionIds: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const returned = await this.softDeleteOrderTransactions_(
      transactionIds,
      config,
      sharedContext
    )

    return returned
  }

  @InjectTransactionManager()
  private async softDeleteOrderTransactions_<
    TReturnableLinkableKeys extends string
  >(
    transactionIds: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const transactions = await super.listOrderTransactions(
      {
        id: transactionIds,
      },
      {
        select: ["order_id", "version", "amount"],
      },
      sharedContext
    )

    const returned = await super.softDeleteOrderTransactions(
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

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async restoreOrderTransactions<TReturnableLinkableKeys extends string>(
    transactionIds: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const returned = await this.restoreOrderTransactions_(
      transactionIds,
      config,
      sharedContext
    )

    return returned
  }

  @InjectTransactionManager()
  private async restoreOrderTransactions_<
    TReturnableLinkableKeys extends string
  >(
    transactionIds: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const transactions = await super.listOrderTransactions(
      {
        id: transactionIds,
      },
      {
        select: ["order_id", "version", "amount"],
        withDeleted: true,
      },
      sharedContext
    )

    const returned = await super.restoreOrderTransactions(
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

  @InjectTransactionManager()
  private async updateOrderPaidRefundableAmount_(
    transactionData: {
      order_id: string
      version: number
      amount: BigNumber | number | BigNumberInput
    }[],
    isRemoved: boolean,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const summaries: any = await this.listOrderSummaries(
      {
        order_id: transactionData.map((trx) => trx.order_id),
        version: transactionData[0].version,
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

      const initialTrxTotal = summary.totals.transaction_total

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

        summary.totals.transaction_total = new BigNumber(
          op(summary.totals.transaction_total, trx.amount)
        )
      }

      const initialDiff = MathBN.sub(
        summary.totals.transaction_total,
        initialTrxTotal
      )
      summary.totals.pending_difference = new BigNumber(
        MathBN.sub(summary.totals.pending_difference, initialDiff)
      )
    })

    createRawPropertiesFromBigNumber(summaries)

    await this.orderSummaryService_.update(summaries, sharedContext)
  }

  async archive(
    orderId: string,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>

  async archive(
    orderId: string[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectManager()
  @EmitEvents()
  async archive(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO | OrderTypes.OrderDTO[]> {
    const orders = await this.archive_(orderId, sharedContext)

    return await this.baseRepository_.serialize<
      OrderTypes.OrderDTO | OrderTypes.OrderDTO[]
    >(Array.isArray(orderId) ? orders : orders[0])
  }

  @InjectTransactionManager()
  private async archive_(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[]> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]
    const orders = await this.listOrders_(
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
      orderIds.map((id) => {
        return {
          id,
          status: OrderStatus.ARCHIVED,
        }
      }),
      sharedContext
    )

    return orders
  }

  async completeOrder(
    orderId: string,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>
  async completeOrder(
    orderId: string[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectManager()
  @EmitEvents()
  async completeOrder(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO | OrderTypes.OrderDTO[]> {
    const orders = await this.completeOrder_(orderId, sharedContext)

    return await this.baseRepository_.serialize<
      OrderTypes.OrderDTO | OrderTypes.OrderDTO[]
    >(Array.isArray(orderId) ? orders : orders[0])
  }

  @InjectTransactionManager()
  private async completeOrder_(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[]> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]
    const orders = await this.listOrders_(
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

    return orders
  }

  async cancel(
    orderId: string,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>
  async cancel(
    orderId: string[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  @InjectManager()
  @EmitEvents()
  async cancel(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO | OrderTypes.OrderDTO[]> {
    const orders = await this.cancel_(orderId, sharedContext)

    return await this.baseRepository_.serialize<
      OrderTypes.OrderDTO | OrderTypes.OrderDTO[]
    >(Array.isArray(orderId) ? orders : orders[0])
  }

  @InjectTransactionManager()
  private async cancel_(
    orderId: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[]> {
    const orderIds = Array.isArray(orderId) ? orderId : [orderId]
    const orders = await this.listOrders_(
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

    return orders
  }

  // ------------------- Bundled Order Actions

  @InjectManager()
  @EmitEvents()
  async createReturn(
    data: OrderTypes.CreateOrderReturnDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.ReturnDTO> {
    const ret = await this.createReturn_(data, sharedContext)

    return await this.baseRepository_.serialize<OrderTypes.ReturnDTO>(ret)
  }

  @InjectTransactionManager()
  private async createReturn_(
    data: OrderTypes.CreateOrderReturnDTO,
    @MedusaContext() sharedContext: Context = {}
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

  @InjectManager()
  @EmitEvents()
  async receiveReturn(
    data: OrderTypes.ReceiveOrderReturnDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.ReturnDTO> {
    const ret = await this.receiveReturn_(data, sharedContext)

    const returned = await this.retrieveReturn(ret[0].id, {
      relations: [
        "items",
        "items.item",
        "shipping_methods",
        "shipping_methods.tax_lines",
        "shipping_methods.adjustments",
      ],
    })

    return await this.baseRepository_.serialize<OrderTypes.ReturnDTO>(returned)
  }

  @InjectTransactionManager()
  private async receiveReturn_(
    data: OrderTypes.ReceiveOrderReturnDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any[]> {
    return await BundledActions.receiveReturn.bind(this)(data, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
  async cancelReturn(
    data: OrderTypes.CancelOrderReturnDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.ReturnDTO> {
    const ret = await this.cancelReturn_(data, sharedContext)

    const returned = await this.retrieveReturn(ret.id, {
      relations: [
        "items",
        "shipping_methods",
        "shipping_methods.tax_lines",
        "shipping_methods.adjustments",
      ],
    })

    return await this.baseRepository_.serialize<OrderTypes.ReturnDTO>(returned)
  }

  @InjectTransactionManager()
  private async cancelReturn_(
    data: OrderTypes.CancelOrderReturnDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any> {
    return await BundledActions.cancelReturn.bind(this)(data, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
  async createClaim(
    data: OrderTypes.CreateOrderClaimDTO,
    @MedusaContext() sharedContext: Context = {}
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

    return await this.baseRepository_.serialize<OrderTypes.OrderClaimDTO>(claim)
  }

  @InjectTransactionManager()
  async createClaim_(
    data: OrderTypes.CreateOrderClaimDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any> {
    return await BundledActions.createClaim.bind(this)(data, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
  async cancelClaim(
    data: OrderTypes.CancelOrderClaimDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderClaimDTO> {
    const ret = await this.cancelClaim_(data, sharedContext)

    const claim = await this.retrieveOrderClaim(ret.id, {
      relations: ["additional_items", "claim_items", "return", "return.items"],
    })

    return await this.baseRepository_.serialize<OrderTypes.OrderClaimDTO>(claim)
  }

  @InjectTransactionManager()
  private async cancelClaim_(
    data: OrderTypes.CancelOrderClaimDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any> {
    return await BundledActions.cancelClaim.bind(this)(data, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
  async createExchange(
    data: OrderTypes.CreateOrderExchangeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderExchangeDTO> {
    const ret = await this.createExchange_(data, sharedContext)

    const exchange = await this.retrieveOrderExchange(
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
      exchange
    )
  }

  // @ts-expect-error
  updateReturnReasons(
    id: string,
    data: UpdateOrderReturnReasonDTO,
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO>
  // @ts-expect-error
  updateReturnReasons(
    selector: FilterableOrderReturnReasonProps,
    data: Partial<UpdateOrderReturnReasonDTO>,
    sharedContext?: Context
  ): Promise<OrderReturnReasonDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateReturnReasons(
    idOrSelector: string | FilterableOrderReturnReasonProps,
    data: UpdateOrderReturnReasonDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderReturnReasonDTO[] | OrderReturnReasonDTO> {
    const reasons = await this.updateReturnReasons_(
      idOrSelector,
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      OrderReturnReasonDTO[] | OrderReturnReasonDTO
    >(isString(idOrSelector) ? reasons[0] : reasons)
  }

  @InjectTransactionManager()
  private async updateReturnReasons_(
    idOrSelector: string | FilterableOrderReturnReasonProps,
    data: UpdateOrderReturnReasonDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ReturnReason>[]> {
    let normalizedInput: UpdateReturnReasonDTO[] = []
    if (isString(idOrSelector)) {
      // Check if the return reason exists in the first place
      await this.returnReasonService_.retrieve(idOrSelector, {}, sharedContext)
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const reasons = await this.returnReasonService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = reasons.map((reason) => ({
        id: reason.id,
        ...data,
      }))
    }

    const reasons = await this.returnReasonService_.update(
      normalizedInput,
      sharedContext
    )

    return reasons
  }

  @InjectTransactionManager()
  async createExchange_(
    data: OrderTypes.CreateOrderExchangeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any> {
    return await BundledActions.createExchange.bind(this)(data, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
  async cancelExchange(
    data: OrderTypes.CancelOrderExchangeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderExchangeDTO> {
    const ret = await this.cancelExchange_(data, sharedContext)

    const exchange = await this.retrieveOrderExchange(ret.id, {
      relations: ["additional_items", "return", "return.items"],
    })

    return await this.baseRepository_.serialize<OrderTypes.OrderExchangeDTO>(
      exchange
    )
  }

  @InjectTransactionManager()
  private async cancelExchange_(
    data: OrderTypes.CancelOrderExchangeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any> {
    return await BundledActions.cancelExchange.bind(this)(data, sharedContext)
  }

  @InjectTransactionManager()
  @EmitEvents()
  async registerFulfillment(
    data: OrderTypes.RegisterOrderFulfillmentDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await BundledActions.registerFulfillment.bind(this)(data, sharedContext)
  }

  @InjectTransactionManager()
  @EmitEvents()
  async cancelFulfillment(
    data: OrderTypes.CancelOrderFulfillmentDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await BundledActions.cancelFulfillment.bind(this)(data, sharedContext)
  }

  @InjectTransactionManager()
  @EmitEvents()
  async registerShipment(
    data: OrderTypes.RegisterOrderShipmentDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await BundledActions.registerShipment.bind(this)(data, sharedContext)
  }

  @InjectTransactionManager()
  @EmitEvents()
  async registerDelivery(
    data: OrderTypes.RegisterOrderDeliveryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await BundledActions.registerDelivery.bind(this)(data, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createReturnItems(
    data: OrderTypes.CreateOrderReturnItemDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderReturnItemDTO> {
    return super.createReturnItems(
      data as unknown as OrderTypes.OrderReturnItemDTO,
      sharedContext
    )
  }
}
