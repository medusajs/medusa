import {
  Context,
  DAL,
  FilterableLineItemTaxLineProps,
  IOrderModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  OrderTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  isObject,
  isString,
} from "@medusajs/utils"
import {
  Address,
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  Order,
  OrderChange,
  OrderChangeAction,
  OrderDetail,
  ShippingMethod,
  ShippingMethodAdjustment,
  ShippingMethodTaxLine,
  Transaction,
} from "@models"
import {
  CreateOrderLineItemDTO,
  CreateOrderLineItemTaxLineDTO,
  CreateOrderShippingMethodDTO,
  CreateOrderShippingMethodTaxLineDTO,
  UpdateOrderLineItemDTO,
  UpdateOrderLineItemTaxLineDTO,
  UpdateOrderShippingMethodTaxLineDTO,
} from "@types"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  orderService: ModulesSdkTypes.InternalModuleService<any>
  addressService: ModulesSdkTypes.InternalModuleService<any>
  lineItemService: ModulesSdkTypes.InternalModuleService<any>
  shippingMethodAdjustmentService: ModulesSdkTypes.InternalModuleService<any>
  shippingMethodService: ModulesSdkTypes.InternalModuleService<any>
  lineItemAdjustmentService: ModulesSdkTypes.InternalModuleService<any>
  lineItemTaxLineService: ModulesSdkTypes.InternalModuleService<any>
  shippingMethodTaxLineService: ModulesSdkTypes.InternalModuleService<any>
  transactionService: ModulesSdkTypes.InternalModuleService<any>
  orderChangeService: ModulesSdkTypes.InternalModuleService<any>
  orderChangeActionService: ModulesSdkTypes.InternalModuleService<any>
  orderDetailService: ModulesSdkTypes.InternalModuleService<any>
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
  OrderDetail,
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
    TOrderDetail extends OrderDetail = OrderDetail
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
      Change: { dto: OrderTypes.OrderChangeDTO }
      ChangeAction: { dto: OrderTypes.OrderChangeActionDTO }
    }
  >(Order, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IOrderModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected orderService_: ModulesSdkTypes.InternalModuleService<TOrder>
  protected addressService_: ModulesSdkTypes.InternalModuleService<TAddress>
  protected lineItemService_: ModulesSdkTypes.InternalModuleService<TLineItem>
  protected shippingMethodAdjustmentService_: ModulesSdkTypes.InternalModuleService<TShippingMethodAdjustment>
  protected shippingMethodService_: ModulesSdkTypes.InternalModuleService<TShippingMethod>
  protected lineItemAdjustmentService_: ModulesSdkTypes.InternalModuleService<TLineItemAdjustment>
  protected lineItemTaxLineService_: ModulesSdkTypes.InternalModuleService<TLineItemTaxLine>
  protected shippingMethodTaxLineService_: ModulesSdkTypes.InternalModuleService<TShippingMethodTaxLine>
  protected transactionService_: ModulesSdkTypes.InternalModuleService<TTransaction>
  protected orderChangeService_: ModulesSdkTypes.InternalModuleService<TOrderChange>
  protected orderChangeActionService_: ModulesSdkTypes.InternalModuleService<TOrderChangeAction>
  protected orderDetailService_: ModulesSdkTypes.InternalModuleService<TOrderDetail>

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
      orderDetailService,
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
    this.orderDetailService_ = orderDetailService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
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
      { id: orders.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
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
    for (const { items, ...order } of data) {
      const [created] = await this.orderService_.create([order], sharedContext)

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
      await this.addLineItemsBulk_(lineItemsToCreate, sharedContext)
    }

    return createdOrders
  }

  async update(
    data: OrderTypes.UpdateOrderDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO[]>

  async update(
    data: OrderTypes.UpdateOrderDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderDTO>

  @InjectManager("baseRepository_")
  async update(
    data: OrderTypes.UpdateOrderDTO[] | OrderTypes.UpdateOrderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<OrderTypes.OrderDTO[] | OrderTypes.OrderDTO> {
    const input = Array.isArray(data) ? data : [data]
    const orders = await this.update_(input, sharedContext)

    const result = await this.list(
      { id: orders.map((p) => p!.id) },
      {
        relations: ["shipping_address", "billing_address"],
      },
      sharedContext
    )

    return (Array.isArray(data) ? result : result[0]) as
      | OrderTypes.OrderDTO
      | OrderTypes.OrderDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: OrderTypes.UpdateOrderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.orderService_.update(data, sharedContext)
  }

  addLineItems(
    data: OrderTypes.CreateOrderLineItemForOrderDTO
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  addLineItems(
    data: OrderTypes.CreateOrderLineItemForOrderDTO[]
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  addLineItems(
    orderId: string,
    items: OrderTypes.CreateOrderLineItemDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemDTO[]>

  @InjectManager("baseRepository_")
  async addLineItems(
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
      items = await this.addLineItems_(
        orderIdOrData,
        data as OrderTypes.CreateOrderLineItemDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]
      items = await this.addLineItemsBulk_(data, sharedContext)
    }

    return await this.baseRepository_.serialize<OrderTypes.OrderLineItemDTO[]>(
      items,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItems_(
    orderId: string,
    items: OrderTypes.CreateOrderLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id"] },
      sharedContext
    )

    const toUpdate: CreateOrderLineItemDTO[] = items.map((item) => {
      return {
        ...item,
        order_id: order.id,
      }
    })

    return await this.addLineItemsBulk_(toUpdate, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async addLineItemsBulk_(
    data: CreateOrderLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    return await this.lineItemService_.create(data, sharedContext)
  }

  updateLineItems(
    data: OrderTypes.UpdateOrderLineItemWithSelectorDTO[]
  ): Promise<OrderTypes.OrderLineItemDTO[]>
  updateLineItems(
    selector: Partial<OrderTypes.OrderLineItemDTO>,
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
      | Partial<OrderTypes.OrderLineItemDTO>,
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

    return item
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateLineItemsWithSelector_(
    updates: OrderTypes.UpdateOrderLineItemWithSelectorDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<LineItem[]> {
    let toUpdate: UpdateOrderLineItemDTO[] = []
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
    selector: Partial<OrderTypes.OrderLineItemDTO>,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async removeLineItems(
    itemIdsOrSelector: string | string[] | Partial<OrderTypes.OrderLineItemDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let toDelete: string[]

    if (isObject(itemIdsOrSelector)) {
      const items = await this.listLineItems(
        { ...itemIdsOrSelector } as Partial<OrderTypes.OrderLineItemDTO>,
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

  async addShippingMethods(
    data: OrderTypes.CreateOrderShippingMethodDTO
  ): Promise<OrderTypes.OrderShippingMethodDTO>
  async addShippingMethods(
    data: OrderTypes.CreateOrderShippingMethodDTO[]
  ): Promise<OrderTypes.OrderShippingMethodDTO[]>
  async addShippingMethods(
    orderId: string,
    methods: OrderTypes.CreateOrderShippingMethodForSingleOrderDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodDTO[]>

  @InjectManager("baseRepository_")
  async addShippingMethods(
    orderIdOrData:
      | string
      | OrderTypes.CreateOrderShippingMethodDTO[]
      | OrderTypes.CreateOrderShippingMethodDTO,
    data?:
      | OrderTypes.CreateOrderShippingMethodDTO[]
      | OrderTypes.CreateOrderShippingMethodForSingleOrderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    OrderTypes.OrderShippingMethodDTO[] | OrderTypes.OrderShippingMethodDTO
  > {
    let methods: ShippingMethod[]
    if (isString(orderIdOrData)) {
      methods = await this.addShippingMethods_(
        orderIdOrData,
        data as OrderTypes.CreateOrderShippingMethodForSingleOrderDTO[],
        sharedContext
      )
    } else {
      const data = Array.isArray(orderIdOrData)
        ? orderIdOrData
        : [orderIdOrData]
      methods = await this.addShippingMethodsBulk_(
        data as OrderTypes.CreateOrderShippingMethodDTO[],
        sharedContext
      )
    }

    return await this.baseRepository_.serialize<
      OrderTypes.OrderShippingMethodDTO[]
    >(methods, { populate: true })
  }

  @InjectTransactionManager("baseRepository_")
  protected async addShippingMethods_(
    orderId: string,
    data: OrderTypes.CreateOrderShippingMethodForSingleOrderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ShippingMethod[]> {
    const order = await this.retrieve(
      orderId,
      { select: ["id"] },
      sharedContext
    )

    const methods = data.map((method) => {
      return {
        ...method,
        order_id: order.id,
      }
    })

    return await this.addShippingMethodsBulk_(methods, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async addShippingMethodsBulk_(
    data: OrderTypes.CreateOrderShippingMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ShippingMethod[]> {
    return await this.shippingMethodService_.create(
      data as unknown as CreateOrderShippingMethodDTO[],
      sharedContext
    )
  }

  async removeShippingMethods(
    methodIds: string[],
    sharedContext?: Context
  ): Promise<void>
  async removeShippingMethods(
    methodIds: string,
    sharedContext?: Context
  ): Promise<void>
  async removeShippingMethods(
    selector: Partial<OrderTypes.OrderShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async removeShippingMethods(
    methodIdsOrSelector:
      | string
      | string[]
      | Partial<OrderTypes.OrderShippingMethodDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let toDelete: string[]
    if (isObject(methodIdsOrSelector)) {
      const methods = await this.listShippingMethods(
        {
          ...(methodIdsOrSelector as Partial<OrderTypes.OrderShippingMethodDTO>),
        },
        {},
        sharedContext
      )

      toDelete = methods.map((m) => m.id)
    } else {
      toDelete = Array.isArray(methodIdsOrSelector)
        ? methodIdsOrSelector
        : [methodIdsOrSelector]
    }
    await this.shippingMethodService_.delete(toDelete, sharedContext)
  }

  async addLineItemAdjustments(
    adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[]
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>
  async addLineItemAdjustments(
    adjustment: OrderTypes.CreateOrderLineItemAdjustmentDTO
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>
  async addLineItemAdjustments(
    orderId: string,
    adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addLineItemAdjustments(
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
        { select: ["id"], relations: ["items"] },
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
      { select: ["id"], relations: ["items.adjustments"] },
      sharedContext
    )

    const existingAdjustments = await this.listLineItemAdjustments(
      { item: { order_id: order.id } },
      { select: ["id"] },
      sharedContext
    )

    const adjustmentsSet = new Set(
      adjustments
        .map((a) => (a as OrderTypes.UpdateOrderLineItemAdjustmentDTO).id)
        .filter(Boolean)
    )

    const toDelete: OrderTypes.OrderLineItemAdjustmentDTO[] = []

    // From the existing adjustments, find the ones that are not passed in adjustments
    existingAdjustments.forEach(
      (adj: OrderTypes.OrderLineItemAdjustmentDTO) => {
        if (!adjustmentsSet.has(adj.id)) {
          toDelete.push(adj)
        }
      }
    )

    if (toDelete.length) {
      await this.lineItemAdjustmentService_.delete(
        toDelete.map((adj) => adj!.id),
        sharedContext
      )
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

  async removeLineItemAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  async removeLineItemAdjustments(
    adjustmentId: string,
    sharedContext?: Context
  ): Promise<void>
  async removeLineItemAdjustments(
    selector: Partial<OrderTypes.OrderLineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  async removeLineItemAdjustments(
    adjustmentIdsOrSelector:
      | string
      | string[]
      | Partial<OrderTypes.OrderLineItemAdjustmentDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let ids: string[]
    if (isObject(adjustmentIdsOrSelector)) {
      const adjustments = await this.listLineItemAdjustments(
        {
          ...adjustmentIdsOrSelector,
        } as Partial<OrderTypes.OrderLineItemAdjustmentDTO>,
        { select: ["id"] },
        sharedContext
      )

      ids = adjustments.map((adj) => adj.id)
    } else {
      ids = Array.isArray(adjustmentIdsOrSelector)
        ? adjustmentIdsOrSelector
        : [adjustmentIdsOrSelector]
    }

    await this.lineItemAdjustmentService_.delete(ids, sharedContext)
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

    const existingAdjustments = await this.listShippingMethodAdjustments(
      { shipping_method: { order_id: order.id } },
      { select: ["id"] },
      sharedContext
    )

    const adjustmentsSet = new Set(
      adjustments
        .map(
          (a) => (a as OrderTypes.UpdateOrderShippingMethodAdjustmentDTO)?.id
        )
        .filter(Boolean)
    )

    const toDelete: OrderTypes.OrderShippingMethodAdjustmentDTO[] = []

    // From the existing adjustments, find the ones that are not passed in adjustments
    existingAdjustments.forEach(
      (adj: OrderTypes.OrderShippingMethodAdjustmentDTO) => {
        if (!adjustmentsSet.has(adj.id)) {
          toDelete.push(adj)
        }
      }
    )

    if (toDelete.length) {
      await this.shippingMethodAdjustmentService_.delete(
        toDelete.map((adj) => adj!.id),
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

  async addShippingMethodAdjustments(
    adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[]
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>
  async addShippingMethodAdjustments(
    adjustment: OrderTypes.CreateOrderShippingMethodAdjustmentDTO
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO>
  async addShippingMethodAdjustments(
    orderId: string,
    adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addShippingMethodAdjustments(
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

  async removeShippingMethodAdjustments(
    adjustmentIds: string[],
    sharedContext?: Context
  ): Promise<void>
  async removeShippingMethodAdjustments(
    adjustmentId: string,
    sharedContext?: Context
  ): Promise<void>
  async removeShippingMethodAdjustments(
    selector: Partial<OrderTypes.OrderShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<void>

  async removeShippingMethodAdjustments(
    adjustmentIdsOrSelector:
      | string
      | string[]
      | Partial<OrderTypes.OrderShippingMethodAdjustmentDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let ids: string[]
    if (isObject(adjustmentIdsOrSelector)) {
      const adjustments = await this.listShippingMethodAdjustments(
        {
          ...adjustmentIdsOrSelector,
        } as Partial<OrderTypes.OrderShippingMethodAdjustmentDTO>,
        { select: ["id"] },
        sharedContext
      )

      ids = adjustments.map((adj) => adj.id)
    } else {
      ids = Array.isArray(adjustmentIdsOrSelector)
        ? adjustmentIdsOrSelector
        : [adjustmentIdsOrSelector]
    }

    await this.shippingMethodAdjustmentService_.delete(ids, sharedContext)
  }

  addLineItemTaxLines(
    taxLines: OrderTypes.CreateOrderLineItemTaxLineDTO[]
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>
  addLineItemTaxLines(
    taxLine: OrderTypes.CreateOrderLineItemTaxLineDTO
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO>
  addLineItemTaxLines(
    orderId: string,
    taxLines:
      | OrderTypes.CreateOrderLineItemTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addLineItemTaxLines(
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
      // existence check
      await this.retrieve(orderIdOrData, { select: ["id"] }, sharedContext)

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
      { select: ["id"], relations: ["items.tax_lines"] },
      sharedContext
    )

    const existingTaxLines = await this.listLineItemTaxLines(
      { item: { order_id: order.id } },
      { select: ["id"] },
      sharedContext
    )

    const taxLinesSet = new Set(
      taxLines
        .map(
          (taxLine) => (taxLine as OrderTypes.UpdateOrderLineItemTaxLineDTO)?.id
        )
        .filter(Boolean)
    )

    const toDelete: OrderTypes.OrderLineItemTaxLineDTO[] = []

    // From the existing tax lines, find the ones that are not passed in taxLines
    existingTaxLines.forEach((taxLine: OrderTypes.OrderLineItemTaxLineDTO) => {
      if (!taxLinesSet.has(taxLine.id)) {
        toDelete.push(taxLine)
      }
    })

    if (toDelete.length) {
      await this.lineItemTaxLineService_.delete(
        toDelete.map((taxLine) => taxLine!.id),
        sharedContext
      )
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

  removeLineItemTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeLineItemTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeLineItemTaxLines(
    selector: FilterableLineItemTaxLineProps,
    sharedContext?: Context
  ): Promise<void>

  async removeLineItemTaxLines(
    taxLineIdsOrSelector:
      | string
      | string[]
      | OrderTypes.FilterableOrderShippingMethodTaxLineProps,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let ids: string[]
    if (isObject(taxLineIdsOrSelector)) {
      const taxLines = await this.listLineItemTaxLines(
        {
          ...(taxLineIdsOrSelector as OrderTypes.FilterableOrderLineItemTaxLineProps),
        },
        { select: ["id"] },
        sharedContext
      )

      ids = taxLines.map((taxLine) => taxLine.id)
    } else {
      ids = Array.isArray(taxLineIdsOrSelector)
        ? taxLineIdsOrSelector
        : [taxLineIdsOrSelector]
    }

    await this.lineItemTaxLineService_.delete(ids, sharedContext)
  }

  addShippingMethodTaxLines(
    taxLines: OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>
  addShippingMethodTaxLines(
    taxLine: OrderTypes.CreateOrderShippingMethodTaxLineDTO
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO>
  addShippingMethodTaxLines(
    orderId: string,
    taxLines:
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO[]
      | OrderTypes.CreateOrderShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>

  @InjectTransactionManager("baseRepository_")
  async addShippingMethodTaxLines(
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
      // existence check
      await this.retrieve(orderIdOrData, { select: ["id"] }, sharedContext)

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

    const existingTaxLines = await this.listShippingMethodTaxLines(
      { shipping_method: { order_id: order.id } },
      { select: ["id"] },
      sharedContext
    )

    const taxLinesSet = new Set(
      taxLines
        .map(
          (taxLine) =>
            (taxLine as OrderTypes.UpdateOrderShippingMethodTaxLineDTO)?.id
        )
        .filter(Boolean)
    )

    const toDelete: OrderTypes.OrderShippingMethodTaxLineDTO[] = []

    // From the existing tax lines, find the ones that are not passed in taxLines
    existingTaxLines.forEach(
      (taxLine: OrderTypes.OrderShippingMethodTaxLineDTO) => {
        if (!taxLinesSet.has(taxLine.id)) {
          toDelete.push(taxLine)
        }
      }
    )

    if (toDelete.length) {
      await this.shippingMethodTaxLineService_.delete(
        toDelete.map((taxLine) => taxLine!.id),
        sharedContext
      )
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

  removeShippingMethodTaxLines(
    taxLineIds: string[],
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodTaxLines(
    taxLineIds: string,
    sharedContext?: Context
  ): Promise<void>
  removeShippingMethodTaxLines(
    selector: Partial<OrderTypes.OrderShippingMethodTaxLineDTO>,
    sharedContext?: Context
  ): Promise<void>

  async removeShippingMethodTaxLines(
    taxLineIdsOrSelector:
      | string
      | string[]
      | OrderTypes.FilterableOrderShippingMethodTaxLineProps,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    let ids: string[]
    if (isObject(taxLineIdsOrSelector)) {
      const taxLines = await this.listShippingMethodTaxLines(
        {
          ...(taxLineIdsOrSelector as OrderTypes.FilterableOrderShippingMethodTaxLineProps),
        },
        { select: ["id"] },
        sharedContext
      )

      ids = taxLines.map((taxLine) => taxLine.id)
    } else {
      ids = Array.isArray(taxLineIdsOrSelector)
        ? taxLineIdsOrSelector
        : [taxLineIdsOrSelector]
    }

    await this.shippingMethodTaxLineService_.delete(ids, sharedContext)
  }
}
