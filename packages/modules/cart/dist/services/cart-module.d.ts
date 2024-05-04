import { CartDTO, CartTypes, Context, DAL, FindConfig, ICartModuleService, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Address, Cart, LineItem, LineItemAdjustment, LineItemTaxLine, ShippingMethod, ShippingMethodAdjustment, ShippingMethodTaxLine } from "../models";
import { CreateLineItemDTO } from "../types";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    cartService: ModulesSdkTypes.InternalModuleService<any>;
    addressService: ModulesSdkTypes.InternalModuleService<any>;
    lineItemService: ModulesSdkTypes.InternalModuleService<any>;
    shippingMethodAdjustmentService: ModulesSdkTypes.InternalModuleService<any>;
    shippingMethodService: ModulesSdkTypes.InternalModuleService<any>;
    lineItemAdjustmentService: ModulesSdkTypes.InternalModuleService<any>;
    lineItemTaxLineService: ModulesSdkTypes.InternalModuleService<any>;
    shippingMethodTaxLineService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const CartModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, CartDTO, {
    Address: {
        dto: CartTypes.CartAddressDTO;
    };
    LineItem: {
        dto: CartTypes.CartLineItemDTO;
    };
    LineItemAdjustment: {
        dto: CartTypes.LineItemAdjustmentDTO;
    };
    LineItemTaxLine: {
        dto: CartTypes.LineItemTaxLineDTO;
    };
    ShippingMethod: {
        dto: CartTypes.CartShippingMethodDTO;
    };
    ShippingMethodAdjustment: {
        dto: CartTypes.ShippingMethodAdjustmentDTO;
    };
    ShippingMethodTaxLine: {
        dto: CartTypes.ShippingMethodTaxLineDTO;
    };
}>;
export default class CartModuleService<TCart extends Cart = Cart, TAddress extends Address = Address, TLineItem extends LineItem = LineItem, TLineItemAdjustment extends LineItemAdjustment = LineItemAdjustment, TLineItemTaxLine extends LineItemTaxLine = LineItemTaxLine, TShippingMethodAdjustment extends ShippingMethodAdjustment = ShippingMethodAdjustment, TShippingMethodTaxLine extends ShippingMethodTaxLine = ShippingMethodTaxLine, TShippingMethod extends ShippingMethod = ShippingMethod> extends CartModuleService_base implements ICartModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected cartService_: ModulesSdkTypes.InternalModuleService<TCart>;
    protected addressService_: ModulesSdkTypes.InternalModuleService<TAddress>;
    protected lineItemService_: ModulesSdkTypes.InternalModuleService<TLineItem>;
    protected shippingMethodAdjustmentService_: ModulesSdkTypes.InternalModuleService<TShippingMethodAdjustment>;
    protected shippingMethodService_: ModulesSdkTypes.InternalModuleService<TShippingMethod>;
    protected lineItemAdjustmentService_: ModulesSdkTypes.InternalModuleService<TLineItemAdjustment>;
    protected lineItemTaxLineService_: ModulesSdkTypes.InternalModuleService<TLineItemTaxLine>;
    protected shippingMethodTaxLineService_: ModulesSdkTypes.InternalModuleService<TShippingMethodTaxLine>;
    constructor({ baseRepository, cartService, addressService, lineItemService, shippingMethodAdjustmentService, shippingMethodService, lineItemAdjustmentService, shippingMethodTaxLineService, lineItemTaxLineService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    private shouldIncludeTotals;
    private addRelationsToCalculateTotals;
    retrieve(id: string, config?: FindConfig<any> | undefined, sharedContext?: Context | undefined): Promise<CartDTO>;
    list(filters?: any, config?: FindConfig<any> | undefined, sharedContext?: Context | undefined): Promise<CartDTO[]>;
    listAndCount(filters?: any, config?: FindConfig<any> | undefined, sharedContext?: Context | undefined): Promise<[CartDTO[], number]>;
    create(data: CartTypes.CreateCartDTO[], sharedContext?: Context): Promise<CartTypes.CartDTO[]>;
    create(data: CartTypes.CreateCartDTO, sharedContext?: Context): Promise<CartTypes.CartDTO>;
    protected create_(data: CartTypes.CreateCartDTO[], sharedContext?: Context): Promise<Cart[]>;
    update(data: CartTypes.UpdateCartDTO[]): Promise<CartTypes.CartDTO[]>;
    update(cartId: string, data: CartTypes.UpdateCartDataDTO, sharedContext?: Context): Promise<CartTypes.CartDTO>;
    update(selector: Partial<CartTypes.CartDTO>, data: CartTypes.UpdateCartDataDTO, sharedContext?: Context): Promise<CartTypes.CartDTO[]>;
    protected update_(dataOrIdOrSelector: CartTypes.UpdateCartDTO[] | string | Partial<CartTypes.CartDTO>, data?: CartTypes.UpdateCartDataDTO, sharedContext?: Context): Promise<TCart[]>;
    addLineItems(data: CartTypes.CreateLineItemForCartDTO): Promise<CartTypes.CartLineItemDTO[]>;
    addLineItems(data: CartTypes.CreateLineItemForCartDTO[]): Promise<CartTypes.CartLineItemDTO[]>;
    addLineItems(cartId: string, items: CartTypes.CreateLineItemDTO[], sharedContext?: Context): Promise<CartTypes.CartLineItemDTO[]>;
    protected addLineItems_(cartId: string, items: CartTypes.CreateLineItemDTO[], sharedContext?: Context): Promise<LineItem[]>;
    protected addLineItemsBulk_(data: CreateLineItemDTO[], sharedContext?: Context): Promise<LineItem[]>;
    updateLineItems(data: CartTypes.UpdateLineItemWithSelectorDTO[]): Promise<CartTypes.CartLineItemDTO[]>;
    updateLineItems(selector: Partial<CartTypes.CartLineItemDTO>, data: CartTypes.UpdateLineItemDTO, sharedContext?: Context): Promise<CartTypes.CartLineItemDTO[]>;
    updateLineItems(lineItemId: string, data: Partial<CartTypes.UpdateLineItemDTO>, sharedContext?: Context): Promise<CartTypes.CartLineItemDTO>;
    protected updateLineItem_(lineItemId: string, data: Partial<CartTypes.UpdateLineItemDTO>, sharedContext?: Context): Promise<LineItem>;
    protected updateLineItemsWithSelector_(updates: CartTypes.UpdateLineItemWithSelectorDTO[], sharedContext?: Context): Promise<LineItem[]>;
    createAddresses(data: CartTypes.CreateAddressDTO, sharedContext?: Context): Promise<CartTypes.CartAddressDTO>;
    createAddresses(data: CartTypes.CreateAddressDTO[], sharedContext?: Context): Promise<CartTypes.CartAddressDTO[]>;
    protected createAddresses_(data: CartTypes.CreateAddressDTO[], sharedContext?: Context): Promise<TAddress[]>;
    updateAddresses(data: CartTypes.UpdateAddressDTO, sharedContext?: Context): Promise<CartTypes.CartAddressDTO>;
    updateAddresses(data: CartTypes.UpdateAddressDTO[], sharedContext?: Context): Promise<CartTypes.CartAddressDTO[]>;
    protected updateAddresses_(data: CartTypes.UpdateAddressDTO[], sharedContext?: Context): Promise<TAddress[]>;
    addShippingMethods(data: CartTypes.CreateShippingMethodDTO): Promise<CartTypes.CartShippingMethodDTO>;
    addShippingMethods(data: CartTypes.CreateShippingMethodDTO[]): Promise<CartTypes.CartShippingMethodDTO[]>;
    addShippingMethods(cartId: string, methods: CartTypes.CreateShippingMethodForSingleCartDTO[], sharedContext?: Context): Promise<CartTypes.CartShippingMethodDTO[]>;
    protected addShippingMethods_(cartId: string, data: CartTypes.CreateShippingMethodForSingleCartDTO[], sharedContext?: Context): Promise<ShippingMethod[]>;
    protected addShippingMethodsBulk_(data: CartTypes.CreateShippingMethodDTO[], sharedContext?: Context): Promise<ShippingMethod[]>;
    addLineItemAdjustments(adjustments: CartTypes.CreateLineItemAdjustmentDTO[]): Promise<CartTypes.LineItemAdjustmentDTO[]>;
    addLineItemAdjustments(adjustment: CartTypes.CreateLineItemAdjustmentDTO): Promise<CartTypes.LineItemAdjustmentDTO[]>;
    addLineItemAdjustments(cartId: string, adjustments: CartTypes.CreateLineItemAdjustmentDTO[], sharedContext?: Context): Promise<CartTypes.LineItemAdjustmentDTO[]>;
    setLineItemAdjustments(cartId: string, adjustments: (CartTypes.CreateLineItemAdjustmentDTO | CartTypes.UpdateLineItemAdjustmentDTO)[], sharedContext?: Context): Promise<CartTypes.LineItemAdjustmentDTO[]>;
    setShippingMethodAdjustments(cartId: string, adjustments: (CartTypes.CreateShippingMethodAdjustmentDTO | CartTypes.UpdateShippingMethodAdjustmentDTO)[], sharedContext?: Context): Promise<CartTypes.ShippingMethodAdjustmentDTO[]>;
    addShippingMethodAdjustments(adjustments: CartTypes.CreateShippingMethodAdjustmentDTO[]): Promise<CartTypes.ShippingMethodAdjustmentDTO[]>;
    addShippingMethodAdjustments(adjustment: CartTypes.CreateShippingMethodAdjustmentDTO): Promise<CartTypes.ShippingMethodAdjustmentDTO>;
    addShippingMethodAdjustments(cartId: string, adjustments: CartTypes.CreateShippingMethodAdjustmentDTO[], sharedContext?: Context): Promise<CartTypes.ShippingMethodAdjustmentDTO[]>;
    addLineItemTaxLines(taxLines: CartTypes.CreateLineItemTaxLineDTO[]): Promise<CartTypes.LineItemTaxLineDTO[]>;
    addLineItemTaxLines(taxLine: CartTypes.CreateLineItemTaxLineDTO): Promise<CartTypes.LineItemTaxLineDTO>;
    addLineItemTaxLines(cartId: string, taxLines: CartTypes.CreateLineItemTaxLineDTO[] | CartTypes.CreateShippingMethodTaxLineDTO, sharedContext?: Context): Promise<CartTypes.LineItemTaxLineDTO[]>;
    setLineItemTaxLines(cartId: string, taxLines: (CartTypes.CreateLineItemTaxLineDTO | CartTypes.UpdateLineItemTaxLineDTO)[], sharedContext?: Context): Promise<CartTypes.LineItemTaxLineDTO[]>;
    addShippingMethodTaxLines(taxLines: CartTypes.CreateShippingMethodTaxLineDTO[]): Promise<CartTypes.ShippingMethodTaxLineDTO[]>;
    addShippingMethodTaxLines(taxLine: CartTypes.CreateShippingMethodTaxLineDTO): Promise<CartTypes.ShippingMethodTaxLineDTO>;
    addShippingMethodTaxLines(cartId: string, taxLines: CartTypes.CreateShippingMethodTaxLineDTO[] | CartTypes.CreateShippingMethodTaxLineDTO, sharedContext?: Context): Promise<CartTypes.ShippingMethodTaxLineDTO[]>;
    setShippingMethodTaxLines(cartId: string, taxLines: (CartTypes.CreateShippingMethodTaxLineDTO | CartTypes.UpdateShippingMethodTaxLineDTO)[], sharedContext?: Context): Promise<CartTypes.ShippingMethodTaxLineDTO[]>;
}
export {};
