import { Context, DAL, FindConfig, InternalModuleDeclaration, IOrderModuleService, ModuleJoinerConfig, ModulesSdkTypes, OrderDTO, OrderTypes } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Address, LineItem, LineItemAdjustment, LineItemTaxLine, Order, OrderChange, OrderChangeAction, OrderItem, OrderShippingMethod, OrderSummary, ShippingMethod, ShippingMethodAdjustment, ShippingMethodTaxLine, Transaction } from "../models";
import { CreateOrderLineItemDTO, CreateOrderShippingMethodDTO } from "../types";
import OrderChangeService from "./order-change-service";
import OrderService from "./order-service";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    orderService: OrderService<any>;
    addressService: ModulesSdkTypes.InternalModuleService<any>;
    lineItemService: ModulesSdkTypes.InternalModuleService<any>;
    shippingMethodAdjustmentService: ModulesSdkTypes.InternalModuleService<any>;
    shippingMethodService: ModulesSdkTypes.InternalModuleService<any>;
    lineItemAdjustmentService: ModulesSdkTypes.InternalModuleService<any>;
    lineItemTaxLineService: ModulesSdkTypes.InternalModuleService<any>;
    shippingMethodTaxLineService: ModulesSdkTypes.InternalModuleService<any>;
    transactionService: ModulesSdkTypes.InternalModuleService<any>;
    orderChangeService: OrderChangeService<any>;
    orderChangeActionService: ModulesSdkTypes.InternalModuleService<any>;
    orderItemService: ModulesSdkTypes.InternalModuleService<any>;
    orderSummaryService: ModulesSdkTypes.InternalModuleService<any>;
    orderShippingMethodService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const OrderModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, OrderDTO, {
    Address: {
        dto: OrderTypes.OrderAddressDTO;
    };
    LineItem: {
        dto: OrderTypes.OrderLineItemDTO;
    };
    LineItemAdjustment: {
        dto: OrderTypes.OrderLineItemAdjustmentDTO;
    };
    LineItemTaxLine: {
        dto: OrderTypes.OrderLineItemTaxLineDTO;
    };
    ShippingMethod: {
        dto: OrderTypes.OrderShippingMethodDTO;
    };
    ShippingMethodAdjustment: {
        dto: OrderTypes.OrderShippingMethodAdjustmentDTO;
    };
    ShippingMethodTaxLine: {
        dto: OrderTypes.OrderShippingMethodTaxLineDTO;
    };
    Transaction: {
        dto: OrderTypes.OrderTransactionDTO;
    };
    OrderChange: {
        dto: OrderTypes.OrderChangeDTO;
    };
    OrderChangeAction: {
        dto: OrderTypes.OrderChangeActionDTO;
    };
    OrderItem: {
        dto: OrderTypes.OrderItemDTO;
    };
    OrderSummary: {
        dto: OrderTypes.OrderSummaryDTO;
    };
    OrderShippingMethod: {
        dto: OrderShippingMethod;
    };
}>;
export default class OrderModuleService<TOrder extends Order = Order, TAddress extends Address = Address, TLineItem extends LineItem = LineItem, TLineItemAdjustment extends LineItemAdjustment = LineItemAdjustment, TLineItemTaxLine extends LineItemTaxLine = LineItemTaxLine, TShippingMethodAdjustment extends ShippingMethodAdjustment = ShippingMethodAdjustment, TShippingMethodTaxLine extends ShippingMethodTaxLine = ShippingMethodTaxLine, TShippingMethod extends ShippingMethod = ShippingMethod, TTransaction extends Transaction = Transaction, TOrderChange extends OrderChange = OrderChange, TOrderChangeAction extends OrderChangeAction = OrderChangeAction, TOrderItem extends OrderItem = OrderItem, TOrderSummary extends OrderSummary = OrderSummary, TOrderShippingMethod extends OrderShippingMethod = OrderShippingMethod> extends OrderModuleService_base implements IOrderModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected orderService_: OrderService<TOrder>;
    protected addressService_: ModulesSdkTypes.InternalModuleService<TAddress>;
    protected lineItemService_: ModulesSdkTypes.InternalModuleService<TLineItem>;
    protected shippingMethodAdjustmentService_: ModulesSdkTypes.InternalModuleService<TShippingMethodAdjustment>;
    protected shippingMethodService_: ModulesSdkTypes.InternalModuleService<TShippingMethod>;
    protected lineItemAdjustmentService_: ModulesSdkTypes.InternalModuleService<TLineItemAdjustment>;
    protected lineItemTaxLineService_: ModulesSdkTypes.InternalModuleService<TLineItemTaxLine>;
    protected shippingMethodTaxLineService_: ModulesSdkTypes.InternalModuleService<TShippingMethodTaxLine>;
    protected transactionService_: ModulesSdkTypes.InternalModuleService<TTransaction>;
    protected orderChangeService_: OrderChangeService<TOrderChange>;
    protected orderChangeActionService_: ModulesSdkTypes.InternalModuleService<TOrderChangeAction>;
    protected orderItemService_: ModulesSdkTypes.InternalModuleService<TOrderItem>;
    protected orderSummaryService_: ModulesSdkTypes.InternalModuleService<TOrderSummary>;
    protected orderShippingMethodService_: ModulesSdkTypes.InternalModuleService<TOrderShippingMethod>;
    constructor({ baseRepository, orderService, addressService, lineItemService, shippingMethodAdjustmentService, shippingMethodService, lineItemAdjustmentService, shippingMethodTaxLineService, lineItemTaxLineService, transactionService, orderChangeService, orderChangeActionService, orderItemService, orderSummaryService, orderShippingMethodService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    private shouldIncludeTotals;
    private addRelationsToCalculateTotals;
    retrieve(id: string, config?: FindConfig<any> | undefined, sharedContext?: Context | undefined): Promise<OrderTypes.OrderDTO>;
    list(filters?: any, config?: FindConfig<any> | undefined, sharedContext?: Context | undefined): Promise<OrderTypes.OrderDTO[]>;
    listAndCount(filters?: any, config?: FindConfig<any> | undefined, sharedContext?: Context | undefined): Promise<[OrderTypes.OrderDTO[], number]>;
    create(data: OrderTypes.CreateOrderDTO[], sharedContext?: Context): Promise<OrderTypes.OrderDTO[]>;
    create(data: OrderTypes.CreateOrderDTO, sharedContext?: Context): Promise<OrderTypes.OrderDTO>;
    protected create_(data: OrderTypes.CreateOrderDTO[], sharedContext?: Context): Promise<Order[]>;
    update(data: OrderTypes.UpdateOrderDTO[]): Promise<OrderTypes.OrderDTO[]>;
    update(orderId: string, data: OrderTypes.UpdateOrderDTO, sharedContext?: Context): Promise<OrderTypes.OrderDTO>;
    update(selector: Partial<OrderTypes.FilterableOrderProps>, data: OrderTypes.UpdateOrderDTO, sharedContext?: Context): Promise<OrderTypes.OrderDTO[]>;
    protected update_(dataOrIdOrSelector: OrderTypes.UpdateOrderDTO[] | string | Partial<OrderTypes.FilterableOrderProps>, data?: OrderTypes.UpdateOrderDTO, sharedContext?: Context): Promise<TOrder[]>;
    createLineItems(data: OrderTypes.CreateOrderLineItemForOrderDTO): Promise<OrderTypes.OrderLineItemDTO[]>;
    createLineItems(data: OrderTypes.CreateOrderLineItemForOrderDTO[]): Promise<OrderTypes.OrderLineItemDTO[]>;
    createLineItems(orderId: string, items: OrderTypes.CreateOrderLineItemDTO[], sharedContext?: Context): Promise<OrderTypes.OrderLineItemDTO[]>;
    protected createLineItems_(orderId: string, items: OrderTypes.CreateOrderLineItemDTO[], sharedContext?: Context): Promise<LineItem[]>;
    protected createLineItemsBulk_(data: CreateOrderLineItemDTO[], sharedContext?: Context): Promise<LineItem[]>;
    updateLineItems(data: OrderTypes.UpdateOrderLineItemWithSelectorDTO[]): Promise<OrderTypes.OrderLineItemDTO[]>;
    updateLineItems(selector: Partial<OrderTypes.FilterableOrderLineItemProps>, data: OrderTypes.UpdateOrderLineItemDTO, sharedContext?: Context): Promise<OrderTypes.OrderLineItemDTO[]>;
    updateLineItems(lineItemId: string, data: Partial<OrderTypes.UpdateOrderLineItemDTO>, sharedContext?: Context): Promise<OrderTypes.OrderLineItemDTO>;
    protected updateLineItem_(lineItemId: string, data: Partial<OrderTypes.UpdateOrderLineItemDTO>, sharedContext?: Context): Promise<LineItem>;
    protected updateLineItemsWithSelector_(updates: OrderTypes.UpdateOrderLineItemWithSelectorDTO[], sharedContext?: Context): Promise<LineItem[]>;
    updateOrderItem(selector: Partial<OrderTypes.OrderItemDTO>, data: OrderTypes.UpdateOrderItemDTO, sharedContext?: Context): Promise<OrderTypes.OrderItemDTO[]>;
    updateOrderItem(orderItemId: string, data: Partial<OrderTypes.UpdateOrderItemDTO>, sharedContext?: Context): Promise<OrderTypes.OrderItemDTO>;
    protected updateOrderItem_(orderItemId: string, data: Partial<OrderTypes.UpdateOrderItemDTO>, sharedContext?: Context): Promise<OrderItem>;
    protected updateOrderItemWithSelector_(updates: OrderTypes.UpdateOrderItemWithSelectorDTO[], sharedContext?: Context): Promise<OrderItem[]>;
    createAddresses(data: OrderTypes.CreateOrderAddressDTO, sharedContext?: Context): Promise<OrderTypes.OrderAddressDTO>;
    createAddresses(data: OrderTypes.CreateOrderAddressDTO[], sharedContext?: Context): Promise<OrderTypes.OrderAddressDTO[]>;
    protected createAddresses_(data: OrderTypes.CreateOrderAddressDTO[], sharedContext?: Context): Promise<TAddress[]>;
    updateAddresses(data: OrderTypes.UpdateOrderAddressDTO, sharedContext?: Context): Promise<OrderTypes.OrderAddressDTO>;
    updateAddresses(data: OrderTypes.UpdateOrderAddressDTO[], sharedContext?: Context): Promise<OrderTypes.OrderAddressDTO[]>;
    protected updateAddresses_(data: OrderTypes.UpdateOrderAddressDTO[], sharedContext?: Context): Promise<TAddress[]>;
    createShippingMethods(data: OrderTypes.CreateOrderShippingMethodDTO): Promise<OrderTypes.OrderShippingMethodDTO>;
    createShippingMethods(data: OrderTypes.CreateOrderShippingMethodDTO[]): Promise<OrderTypes.OrderShippingMethodDTO[]>;
    createShippingMethods(orderId: string, methods: OrderTypes.CreateOrderShippingMethodDTO[], sharedContext?: Context): Promise<OrderTypes.OrderShippingMethodDTO[]>;
    protected createShippingMethods_(orderId: string, data: CreateOrderShippingMethodDTO[], sharedContext?: Context): Promise<ShippingMethod[]>;
    protected createShippingMethodsBulk_(data: {
        shipping_method: OrderTypes.CreateOrderShippingMethodDTO;
        order_id: string;
        version: number;
    }[], sharedContext?: Context): Promise<ShippingMethod[]>;
    createLineItemAdjustments(adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[]): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>;
    createLineItemAdjustments(adjustment: OrderTypes.CreateOrderLineItemAdjustmentDTO): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>;
    createLineItemAdjustments(orderId: string, adjustments: OrderTypes.CreateOrderLineItemAdjustmentDTO[], sharedContext?: Context): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>;
    setLineItemAdjustments(orderId: string, adjustments: (OrderTypes.CreateOrderLineItemAdjustmentDTO | OrderTypes.UpdateOrderLineItemAdjustmentDTO)[], sharedContext?: Context): Promise<OrderTypes.OrderLineItemAdjustmentDTO[]>;
    setShippingMethodAdjustments(orderId: string, adjustments: (OrderTypes.CreateOrderShippingMethodAdjustmentDTO | OrderTypes.UpdateOrderShippingMethodAdjustmentDTO)[], sharedContext?: Context): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>;
    createShippingMethodAdjustments(adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[]): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>;
    createShippingMethodAdjustments(adjustment: OrderTypes.CreateOrderShippingMethodAdjustmentDTO): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO>;
    createShippingMethodAdjustments(orderId: string, adjustments: OrderTypes.CreateOrderShippingMethodAdjustmentDTO[], sharedContext?: Context): Promise<OrderTypes.OrderShippingMethodAdjustmentDTO[]>;
    createLineItemTaxLines(taxLines: OrderTypes.CreateOrderLineItemTaxLineDTO[]): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>;
    createLineItemTaxLines(taxLine: OrderTypes.CreateOrderLineItemTaxLineDTO): Promise<OrderTypes.OrderLineItemTaxLineDTO>;
    createLineItemTaxLines(orderId: string, taxLines: OrderTypes.CreateOrderLineItemTaxLineDTO[] | OrderTypes.CreateOrderShippingMethodTaxLineDTO, sharedContext?: Context): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>;
    setLineItemTaxLines(orderId: string, taxLines: (OrderTypes.CreateOrderLineItemTaxLineDTO | OrderTypes.UpdateOrderLineItemTaxLineDTO)[], sharedContext?: Context): Promise<OrderTypes.OrderLineItemTaxLineDTO[]>;
    createShippingMethodTaxLines(taxLines: OrderTypes.CreateOrderShippingMethodTaxLineDTO[]): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>;
    createShippingMethodTaxLines(taxLine: OrderTypes.CreateOrderShippingMethodTaxLineDTO): Promise<OrderTypes.OrderShippingMethodTaxLineDTO>;
    createShippingMethodTaxLines(orderId: string, taxLines: OrderTypes.CreateOrderShippingMethodTaxLineDTO[] | OrderTypes.CreateOrderShippingMethodTaxLineDTO, sharedContext?: Context): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>;
    setShippingMethodTaxLines(orderId: string, taxLines: (OrderTypes.CreateOrderShippingMethodTaxLineDTO | OrderTypes.UpdateOrderShippingMethodTaxLineDTO)[], sharedContext?: Context): Promise<OrderTypes.OrderShippingMethodTaxLineDTO[]>;
    createOrderChange(data: OrderTypes.CreateOrderChangeDTO, sharedContext?: Context): Promise<OrderTypes.OrderChangeDTO>;
    createOrderChange(data: OrderTypes.CreateOrderChangeDTO[], sharedContext?: Context): Promise<OrderTypes.OrderChangeDTO[]>;
    protected createOrderChange_(data: OrderTypes.CreateOrderChangeDTO | OrderTypes.CreateOrderChangeDTO[], sharedContext?: Context): Promise<OrderChange[]>;
    cancelOrderChange(orderId: string, sharedContext?: Context): Promise<void>;
    cancelOrderChange(orderId: string[], sharedContext?: Context): Promise<void>;
    cancelOrderChange(data: OrderTypes.CancelOrderChangeDTO, sharedContext?: Context): Promise<void>;
    cancelOrderChange(data: OrderTypes.CancelOrderChangeDTO[], sharedContext?: Context): Promise<void>;
    confirmOrderChange(orderChangeId: string, sharedContext?: Context): Promise<void>;
    confirmOrderChange(orderChangeId: string[], sharedContext?: Context): Promise<void>;
    confirmOrderChange(data: OrderTypes.ConfirmOrderChangeDTO, sharedContext?: Context): Promise<void>;
    confirmOrderChange(data: OrderTypes.ConfirmOrderChangeDTO[], sharedContext?: Context): Promise<void>;
    declineOrderChange(orderChangeId: string, sharedContext?: Context): Promise<void>;
    declineOrderChange(orderChangeId: string[], sharedContext?: Context): Promise<void>;
    declineOrderChange(data: OrderTypes.DeclineOrderChangeDTO, sharedContext?: Context): Promise<void>;
    declineOrderChange(data: OrderTypes.DeclineOrderChangeDTO[], sharedContext?: Context): Promise<void>;
    applyPendingOrderActions(orderId: string | string[], sharedContext?: Context): Promise<void>;
    revertLastVersion(orderId: string, sharedContext?: Context): Promise<void>;
    protected revertLastChange_(order: OrderDTO, sharedContext?: Context): Promise<void>;
    private getAndValidateOrderChange_;
    addOrderAction(data: OrderTypes.CreateOrderChangeActionDTO, sharedContext?: Context): Promise<OrderTypes.OrderChangeActionDTO>;
    addOrderAction(data: OrderTypes.CreateOrderChangeActionDTO[], sharedContext?: Context): Promise<OrderTypes.OrderChangeActionDTO[]>;
    private applyOrderChanges_;
    registerFulfillment(data: OrderTypes.RegisterOrderFulfillmentDTO, sharedContext?: Context): Promise<void>;
    registerShipment(data: OrderTypes.RegisterOrderShipmentDTO, sharedContext?: Context): Promise<void>;
    createReturn(data: OrderTypes.CreateOrderReturnDTO, sharedContext?: Context): Promise<void>;
}
export {};
