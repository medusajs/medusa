import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CartAddressDTO,
  CartDTO,
  CartLineItemDTO,
  CartShippingMethodDTO,
  FilterableAddressProps,
  FilterableCartProps,
  FilterableLineItemAdjustmentProps,
  FilterableLineItemProps,
  FilterableLineItemTaxLineProps,
  FilterableShippingMethodAdjustmentProps,
  FilterableShippingMethodProps,
  FilterableShippingMethodTaxLineProps,
  LineItemAdjustmentDTO,
  LineItemTaxLineDTO,
  ShippingMethodAdjustmentDTO,
  ShippingMethodTaxLineDTO,
} from "./common"
import {
  CreateAddressDTO,
  CreateCartDTO,
  CreateLineItemAdjustmentDTO,
  CreateLineItemDTO,
  CreateLineItemForCartDTO,
  CreateLineItemTaxLineDTO,
  CreateShippingMethodAdjustmentDTO,
  CreateShippingMethodDTO,
  CreateShippingMethodForSingleCartDTO,
  CreateShippingMethodTaxLineDTO,
  UpdateAddressDTO,
  UpdateCartDataDTO,
  UpdateCartDTO,
  UpdateLineItemDTO,
  UpdateLineItemTaxLineDTO,
  UpdateLineItemWithSelectorDTO,
  UpdateShippingMethodAdjustmentDTO,
  UpdateShippingMethodTaxLineDTO,
  UpsertLineItemAdjustmentDTO,
} from "./mutations"

/**
 * The main service interface for the Cart Module.
 */
export interface ICartModuleService extends IModuleService {
  /**
   * This method retrieves a cart by its ID.
   *
   * @param {string} cartId - The cart's ID.
   * @param {FindConfig<CartDTO>} config - The configurations determining how the cart is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a cart.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartDTO>} The retrieved cart.
   *
   * @example
   * A simple example that retrieves a cart by its ID:
   *
   * ```ts
   * const cart = await cartModuleService.retrieveCart("cart_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const cart = await cartModuleService.retrieveCart("cart_123", {
   *   relations: ["shipping_address"],
   * })
   * ```
   */
  retrieveCart(
    cartId: string,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO>

  /**
   * This method retrieves a paginated list of carts based on optional filters and configuration.
   *
   * @param {FilterableCartProps} filters - The filters to apply on the retrieved carts.
   * @param {FindConfig<CartDTO>} config - The configurations determining how the cart is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a cart.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartDTO[]>} The list of carts.
   *
   * @example
   * To retrieve a list of carts using their IDs:
   *
   * ```ts
   * const carts = await cartModuleService.listCarts({
   *   id: ["cart_123", "cart_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the carts:
   *
   * ```ts
   * const carts = await cartModuleService.listCarts(
   *   {
   *     id: ["cart_123", "cart_321"],
   *   },
   *   {
   *     relations: ["shipping_address"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const carts = await cartModuleService.listCarts(
   *   {
   *     id: ["cart_123", "cart_321"],
   *   },
   *   {
   *     relations: ["shipping_address"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listCarts(
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<CartDTO[]>

  /**
   * This method retrieves a paginated list of carts along with the total count of available carts satisfying the provided filters.
   *
   * @param {FilterableCartProps} filters - The filters to apply on the retrieved carts.
   * @param {FindConfig<CartDTO>} config - The configurations determining how the cart is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a cart.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CartDTO[], number]>} The list of carts along with their total count.
   *
   * @example
   * To retrieve a list of carts using their IDs:
   *
   * ```ts
   * const [carts, count] = await cartModuleService.listAndCountCarts({
   *   id: ["cart_123", "cart_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the carts:
   *
   * ```ts
   * const [carts, count] = await cartModuleService.listAndCountCarts(
   *   {
   *     id: ["cart_123", "cart_321"],
   *   },
   *   {
   *     relations: ["shipping_address"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [carts, count] = await cartModuleService.listAndCountCarts(
   *   {
   *     id: ["cart_123", "cart_321"],
   *   },
   *   {
   *     relations: ["shipping_address"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAndCountCarts(
    filters?: FilterableCartProps,
    config?: FindConfig<CartDTO>,
    sharedContext?: Context
  ): Promise<[CartDTO[], number]>

  /**
   * This method creates carts.
   *
   * @param {CreateCartDTO[]} data - The carts to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartDTO[]>} The created carts.
   *
   * @example
   * const carts = await cartModuleService.createCarts([
   *   {
   *     currency_code: "usd",
   *   },
   *   {
   *     currency_code: "eur",
   *   },
   * ])
   */
  createCarts(
    data: CreateCartDTO[],
    sharedContext?: Context
  ): Promise<CartDTO[]>

  /**
   * This method creates a cart.
   *
   * @param {CreateCartDTO} data - The cart to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartDTO>} The created cart.
   *
   * @example
   * const cart = await cartModuleService.createCarts({
   *   currency_code: "usd",
   * })
   */
  createCarts(data: CreateCartDTO, sharedContext?: Context): Promise<CartDTO>

  /**
   * This method updates existing carts.
   *
   * @param {UpdateCartDTO[]} data - The attributes to update in the carts.
   * @returns {Promise<CartDTO[]>} The updated carts.
   *
   * @example
   * const carts = await cartModuleService.updateCarts([
   *   {
   *     id: "cart_123",
   *     region_id: "reg_123",
   *   },
   *   {
   *     id: "cart_321",
   *     customer_id: "cus_123",
   *   },
   * ])
   */
  updateCarts(data: UpdateCartDTO[]): Promise<CartDTO[]>

  /**
   * This method updates an existing cart.
   *
   * @param {string} cartId - The cart's ID.
   * @param {UpdateCartDataDTO} data - The attributes to update in the cart data.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartDTO>} The updated cart.
   *
   * @example
   * const cart = await cartModuleService.updateCarts("cart_123", {
   *   region_id: "reg_123",
   * })
   */
  updateCarts(
    cartId: string,
    data: UpdateCartDataDTO,
    sharedContext?: Context
  ): Promise<CartDTO>

  /**
   * This method updates existing carts matching the specified filters.
   *
   * @param {Partial<CartDTO>} selector - The filters that specify which carts to update.
   * @param {UpdateCartDataDTO} data - The attributes to update in the carts.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartDTO[]>} The updated carts.
   *
   * @example
   * const carts = await cartModuleService.updateCarts(
   *   {
   *     currency_code: "usd",
   *   },
   *   {
   *     region_id: "reg_123",
   *   }
   * )
   */
  updateCarts(
    selector: Partial<CartDTO>,
    data: UpdateCartDataDTO,
    sharedContext?: Context
  ): Promise<CartDTO[]>

  /**
   * This method deletes carts by their IDs.
   *
   * @param {string[]} cartIds - The list of cart IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the carts are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteCarts(["cart_123", "cart_321"])
   */
  deleteCarts(cartIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a cart by its ID.
   *
   * @param {string} cartId - The cart's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the carts are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteCarts("cart_123")
   */
  deleteCarts(cartId: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a paginated list of addresses based on optional filters and configuration.
   *
   * @param {FilterableAddressProps} filters - The filters to apply on the retrieved addresss.
   * @param {FindConfig<CartAddressDTO>} config - The configurations determining how the address is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartAddressDTO[]>} The list of addresses.
   *
   * @example
   * To retrieve a list of addresses using their IDs:
   *
   * ```ts
   * const addresses = await cartModuleService.listAddresses({
   *   id: ["caaddr_123", "caaddr_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const addresses = await cartModuleService.listAddresses(
   *   {
   *     id: ["caaddr_123", "caaddr_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAddresses(
    filters?: FilterableAddressProps,
    config?: FindConfig<CartAddressDTO>,
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  /**
   * This method creates addresses.
   *
   * @param {CreateAddressDTO[]} data - The addresss to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartAddressDTO[]>} The created addresses.
   *
   * @example
   * const addresses = await cartModuleService.createAddresses([
   *   {
   *     address_1: "412 E Cheyenne Rd",
   *     country_code: "us",
   *   },
   *   {
   *     first_name: "Genevieve",
   *     last_name: "Fox",
   *     address_1: "17350 Northwest Fwy",
   *     country_code: "us",
   *   },
   * ])
   */
  createAddresses(
    data: CreateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  /**
   * This method creates a address.
   *
   * @param {CreateAddressDTO} data - The address to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartAddressDTO>} The created address.
   *
   * @example
   * const address = await cartModuleService.createAddresses({
   *   first_name: "Genevieve",
   *   last_name: "Fox",
   *   address_1: "17350 Northwest Fwy",
   *   country_code: "us",
   * })
   */
  createAddresses(
    data: CreateAddressDTO,
    sharedContext?: Context
  ): Promise<CartAddressDTO>

  /**
   * This method updates existing addresses.
   *
   * @param {UpdateAddressDTO[]} data - The attributes to update in the addresss.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartAddressDTO[]>} The updated addresses.
   *
   * @example
   * const addresses = await cartModuleService.updateAddresses([
   *   {
   *     id: "caaddr_123",
   *     first_name: "Leroy",
   *   },
   *   {
   *     id: "caaddr_321",
   *     last_name: "Hunt",
   *   },
   * ])
   */
  updateAddresses(
    data: UpdateAddressDTO[],
    sharedContext?: Context
  ): Promise<CartAddressDTO[]>

  /**
   * This method updates an existing address.
   *
   * @param {UpdateAddressDTO} data - The attributes to update in the address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartAddressDTO>} The updated address.
   *
   * @example
   * const address = await cartModuleService.updateAddresses({
   *   id: "caaddr_123",
   *   first_name: "Leroy",
   * })
   */
  updateAddresses(
    data: UpdateAddressDTO,
    sharedContext?: Context
  ): Promise<CartAddressDTO>

  /**
   * This method deletes addresses by their IDs.
   *
   * @param {string[]} ids - The IDs of the cart.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the addresses are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteAddresses([
   *   "caaddr_123",
   *   "caaddr_321",
   * ])
   */
  deleteAddresses(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes an address by its ID.
   *
   * @param {string} ids - The IDs of the cart.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the address are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteAddresses("caaddr_123")
   */
  deleteAddresses(ids: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a line item by its ID.
   *
   * @param {string} itemId - The item's ID.
   * @param {FindConfig<CartLineItemDTO>} config - The configurations determining how the line item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartLineItemDTO>} The retrieved line item.
   *
   * @example
   * A simple example that retrieves a line item by its ID:
   *
   * ```ts
   * const lineItem =
   *   await cartModuleService.retrieveLineItem("cali_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const lineItem = await cartModuleService.retrieveLineItem(
   *   "cali_123",
   *   {
   *     relations: ["cart"],
   *   }
   * )
   * ```
   */
  retrieveLineItem(
    itemId: string,
    config?: FindConfig<CartLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO>

  /**
   * This method retrieves a paginated list of line items based on optional filters and configuration.
   *
   * @param {FilterableLineItemProps} filters - The filters to apply on the retrieved line items.
   * @param {FindConfig<CartLineItemDTO>} config - The configurations determining how the line item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartLineItemDTO[]>} The list of line items.
   *
   * @example
   * To retrieve a list of line items using their IDs:
   *
   * ```ts
   * const lineItems = await cartModuleService.listLineItems({
   *   id: ["cali_123", "cali_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the line items:
   *
   * ```ts
   * const lineItems = await cartModuleService.listLineItems(
   *   {
   *     id: ["cali_123", "cali_321"],
   *   },
   *   {
   *     relations: ["cart"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const lineItems = await cartModuleService.listLineItems(
   *   {
   *     id: ["cali_123", "cali_321"],
   *   },
   *   {
   *     relations: ["cart"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listLineItems(
    filters: FilterableLineItemProps,
    config?: FindConfig<CartLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>

  /**
   * This method adds a line item to a cart
   *
   * @param {CreateLineItemForCartDTO} data - The line item to create and add to the cart.
   * The cart is specified in the `cart_id` field.
   * @returns {Promise<CartLineItemDTO[]>} The added line item.
   *
   * @example
   * const lineItem = await cartModuleService.addLineItems({
   *   cart_id: "cart_123",
   *   title: "Shirt",
   *   quantity: 2,
   *   unit_price: 4000,
   * })
   */
  addLineItems(data: CreateLineItemForCartDTO): Promise<CartLineItemDTO[]>

  /**
   * This method adds line items to carts.
   *
   * @param {CreateLineItemForCartDTO[]} data - The line item to create and add to the carts.
   * The cart is specified in the `cart_id` field.
   * @returns {Promise<CartLineItemDTO[]>} The added line items.
   *
   * @example
   * const lineItems = await cartModuleService.addLineItems([
   *   {
   *     cart_id: "cart_123",
   *     title: "Shirt",
   *     quantity: 2,
   *     unit_price: 4000,
   *   },
   *   {
   *     cart_id: "cart_123",
   *     title: "Pants",
   *     quantity: 1,
   *     unit_price: 3000,
   *   },
   * ])
   */
  addLineItems(data: CreateLineItemForCartDTO[]): Promise<CartLineItemDTO[]>

  /**
   * This method adds line items to a cart.
   *
   * @param {string} cartId - The cart's ID.
   * @param {CreateLineItemDTO[]} items - The line items to be created and added.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartLineItemDTO[]>} The added line items.
   *
   * @example
   * const lineItems = await cartModuleService.addLineItems(
   *   "cart_123",
   *   [
   *     {
   *       title: "Shirt",
   *       quantity: 2,
   *       unit_price: 4000,
   *     },
   *     {
   *       title: "Pants",
   *       quantity: 1,
   *       unit_price: 3000,
   *     },
   *   ]
   * )
   */
  addLineItems(
    cartId: string,
    items: CreateLineItemDTO[],
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>

  /**
   * This method updates existing line items.
   *
   * @param {UpdateLineItemWithSelectorDTO[]} data - A list of objects, each holding the filters that specify which items
   * to update, and the attributes to update in the items.
   * @returns {Promise<CartLineItemDTO[]>} The updated line items.
   *
   * @example
   * const lineItems = await cartModuleService.updateLineItems([
   *   {
   *     selector: {
   *       id: "cali_123",
   *     },
   *     data: {
   *       quantity: 2,
   *     },
   *   },
   *   {
   *     selector: {
   *       variant_sku: "PANTS",
   *     },
   *     data: {
   *       unit_price: 3000,
   *     },
   *   },
   * ])
   */
  updateLineItems(
    data: UpdateLineItemWithSelectorDTO[]
  ): Promise<CartLineItemDTO[]>

  /**
   * This method updates existing line items matching the specified filters.
   *
   * @param {Partial<CartLineItemDTO>} selector - The filters that specify which line items to update.
   * @param {Partial<UpdateLineItemDTO>} data - The attributes to update in the line items.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartLineItemDTO[]>} The updated line items.
   *
   * @example
   * const lineItems = await cartModuleService.updateLineItems(
   *   {
   *     variant_sku: "PANTS",
   *   },
   *   {
   *     unit_price: 4000,
   *   }
   * )
   */
  updateLineItems(
    selector: Partial<CartLineItemDTO>,
    data: Partial<UpdateLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO[]>

  /**
   * This method updates an existing line item.
   *
   * @param {string} lineId - The line item's ID.
   * @param {Partial<UpdateLineItemDTO>} data - The attributes to update in the line item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartLineItemDTO>} The updated line item.
   *
   * @example
   * const lineItem = await cartModuleService.updateLineItems(
   *   "cali_123",
   *   {
   *     unit_price: 3000,
   *   }
   * )
   */
  updateLineItems(
    lineId: string,
    data: Partial<UpdateLineItemDTO>,
    sharedContext?: Context
  ): Promise<CartLineItemDTO>

  /**
   * This method retrieves a paginated list of shipping methods based on optional filters and configuration.
   *
   * @param {FilterableShippingMethodProps} filters - The filters to apply on the retrieved shipping methods.
   * @param {FindConfig<CartShippingMethodDTO>} config - The configurations determining how the shipping method is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping method.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartShippingMethodDTO[]>} The list of shipping methods.
   *
   * @example
   * To retrieve a list of shipping methods using their IDs:
   *
   * ```ts
   * const shippingMethods =
   *   await cartModuleService.listShippingMethods(
   *     {
   *       id: ["casm_123", "casm_321"],
   *     },
   *     {}
   *   )
   * ```
   *
   * To specify relations that should be retrieved within the shipping methods:
   *
   * ```ts
   * const shippingMethods =
   *   await cartModuleService.listShippingMethods(
   *     {
   *       id: ["casm_123", "casm_321"],
   *     },
   *     {
   *       relations: ["cart"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingMethods =
   *   await cartModuleService.listShippingMethods(
   *     {
   *       id: ["casm_123", "casm_321"],
   *     },
   *     {
   *       relations: ["cart"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listShippingMethods(
    filters: FilterableShippingMethodProps,
    config?: FindConfig<CartShippingMethodDTO>,
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>

  /**
   * This method adds a shipping method to carts.
   *
   * @param {CreateShippingMethodDTO} data - The shipping method to be created and added to the carts.
   * The cart is specified in the `cart_id` field.
   * @returns {Promise<CartShippingMethodDTO>} The added shipping method.
   *
   * @example
   * const shippingMethod =
   *   await cartModuleService.addShippingMethods({
   *     cart_id: "cart_123",
   *     name: "UPS",
   *     amount: 3000,
   *   })
   */
  addShippingMethods(
    data: CreateShippingMethodDTO
  ): Promise<CartShippingMethodDTO>

  /**
   * This method adds shipping methods to carts.
   *
   * @param {CreateShippingMethodDTO[]} data - The shipping methods to be created and added to the carts.
   * The cart is specified in the `cart_id` field.
   * @returns {Promise<CartShippingMethodDTO[]>} The added shipping methods.
   *
   * @example
   * const shippingMethods =
   *   await cartModuleService.addShippingMethods([
   *     {
   *       cart_id: "cart_123",
   *       name: "UPS",
   *       amount: 3000,
   *     },
   *     {
   *       cart_id: "cart_123",
   *       name: "FedEx",
   *       amount: 2000,
   *     },
   *   ])
   */
  addShippingMethods(
    data: CreateShippingMethodDTO[]
  ): Promise<CartShippingMethodDTO[]>

  /**
   * This method adds shipping methods to a cart.
   *
   * @param {string} cartId - The cart's ID.
   * @param {CreateShippingMethodForSingleCartDTO[]} methods - The shipping methods to be created and added.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CartShippingMethodDTO[]>} The added shipping methods.
   *
   * @example
   * const shippingMethods =
   *   await cartModuleService.addShippingMethods("cart_123", [
   *     {
   *       name: "UPS",
   *       amount: 3000,
   *     },
   *     {
   *       name: "FedEx",
   *       amount: 2000,
   *     },
   *   ])
   */
  addShippingMethods(
    cartId: string,
    methods: CreateShippingMethodForSingleCartDTO[],
    sharedContext?: Context
  ): Promise<CartShippingMethodDTO[]>

  /**
   * This method retrieves a paginated list of line item adjustments based on optional filters and configuration.
   *
   * @param {FilterableLineItemAdjustmentProps} filters - The filters to apply on the retrieved line item adjustments.
   * @param {FindConfig<LineItemAdjustmentDTO>} config - The configurations determining how the line item adjustment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item adjustment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LineItemAdjustmentDTO[]>} The list of line item adjustments.
   *
   * @example
   * To retrieve a list of line item adjustments using their IDs:
   *
   * ```ts
   * const lineItemAdjustments =
   *   await cartModuleService.listLineItemAdjustments({
   *     id: ["caliadj_123", "caliadj_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the line item adjustments:
   *
   * ```ts
   * const lineItemAdjustments =
   *   await cartModuleService.listLineItemAdjustments(
   *     {
   *       id: ["caliadj_123", "caliadj_321"],
   *     },
   *     {
   *       relations: ["item"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const lineItemAdjustments =
   *   await cartModuleService.listLineItemAdjustments(
   *     {
   *       id: ["caliadj_123", "caliadj_321"],
   *     },
   *     {
   *       relations: ["item"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listLineItemAdjustments(
    filters: FilterableLineItemAdjustmentProps,
    config?: FindConfig<LineItemAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<LineItemAdjustmentDTO[]>

  /**
   * This method adds line item adjustments to line items.
   *
   * @param {CreateLineItemAdjustmentDTO[]} data - The line item adjustments to be created and added to line items.
   * The line item is specified by the `item_id` field.
   * @returns {Promise<LineItemAdjustmentDTO[]>} The added line item adjustments.
   *
   * @example
   * const lineItemAdjustments =
   *   await cartModuleService.addLineItemAdjustments([
   *     {
   *       item_id: "caliadj_123",
   *       code: "50%OFF",
   *       amount: 3000,
   *     },
   *     {
   *       item_id: "caliadj_321",
   *       code: "10%OFF",
   *       amount: 3000,
   *     },
   *   ])
   */
  addLineItemAdjustments(
    data: CreateLineItemAdjustmentDTO[]
  ): Promise<LineItemAdjustmentDTO[]>

  /**
   * This method adds a line item adjustment to a line item.
   *
   * @param {CreateLineItemAdjustmentDTO} data - The line item adjustment to be created and added to a line item.
   * The line item is specified by the `item_id` field.
   * @returns {Promise<LineItemAdjustmentDTO[]>} The added line item adjustment.
   *
   * @example
   * const lineItemAdjustments =
   *   await cartModuleService.addLineItemAdjustments({
   *     item_id: "caliadj_123",
   *     code: "50%OFF",
   *     amount: 3000,
   *   })
   */
  addLineItemAdjustments(
    data: CreateLineItemAdjustmentDTO
  ): Promise<LineItemAdjustmentDTO[]>

  /**
   * This method adds line item adjustments to line items in a cart.
   *
   * @param {string} cartId - The cart's ID.
   * @param {CreateLineItemAdjustmentDTO[]} data - The line item adjustments to be created and added to line items.
   * The line item is specified by the `item_id` field.
   * @returns {Promise<LineItemAdjustmentDTO[]>} The added line item adjustment.
   *
   * @example
   * const lineItemAdjustments =
   *   await cartModuleService.addLineItemAdjustments("cart_123", [
   *     {
   *       item_id: "caliadj_123",
   *       code: "50%OFF",
   *       amount: 3000,
   *     },
   *     {
   *       item_id: "caliadj_321",
   *       code: "10%OFF",
   *       amount: 2000,
   *     },
   *   ])
   */
  addLineItemAdjustments(
    cartId: string,
    data: CreateLineItemAdjustmentDTO[]
  ): Promise<LineItemAdjustmentDTO[]>

  /**
   * This method set the line item adjustments of line items in a cart. The existing line item adjustments, except those
   * included in the specified list, of an item are removed and replaced with the specified adjustments.
   *
   * @param {string} cartId - The cart's ID.
   * @param {UpsertLineItemAdjustmentDTO[]} data - The line item adjustments to add to the line items.
   * The line item is specified by the `item_id` field. If the `id` field is specified, the adjustment
   * is kept in the line item's adjustment and its attributes can be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LineItemAdjustmentDTO[]>} The added line item adjustments.
   *
   * @example
   * const lineItemAdjustments =
   *   await cartModuleService.setLineItemAdjustments("cart_123", [
   *     {
   *       id: "adj_123",
   *       item_id: "caliadj_123",
   *     },
   *     {
   *       item_id: "caliadj_123",
   *       code: "10%OFF",
   *       amount: 2000,
   *     },
   *     {
   *       item_id: "caliadj_321",
   *       code: "50%OFF",
   *       amount: 3000,
   *     },
   *   ])
   */
  setLineItemAdjustments(
    cartId: string,
    data: UpsertLineItemAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<LineItemAdjustmentDTO[]>

  /**
   * This method retrieves a paginated list of shipping method adjustments based on optional filters and configuration.
   *
   * @param {FilterableShippingMethodAdjustmentProps} filters - The filters to apply on the retrieved shipping method adjustments.
   * @param {FindConfig<ShippingMethodAdjustmentDTO>} config - The configurations determining how the shipping method adjustment is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping method adjustment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingMethodAdjustmentDTO[]>} The list of shipping method adjustments.
   *
   * @example
   * To retrieve a list of shipping method adjustments using their IDs:
   *
   * ```ts
   * const shippingMethodAdjustments =
   *   await cartModuleService.listShippingMethodAdjustments({
   *     id: ["casmadj_123", "casmadj_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping method adjustments:
   *
   * ```ts
   * const shippingMethodAdjustments =
   *   await cartModuleService.listShippingMethodAdjustments(
   *     {
   *       id: ["casmadj_123", "casmadj_321"],
   *     },
   *     {
   *       relations: ["shipping_method"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingMethodAdjustments =
   *   await cartModuleService.listShippingMethodAdjustments(
   *     {
   *       id: ["casmadj_123", "casmadj_321"],
   *     },
   *     {
   *       relations: ["shipping_method"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listShippingMethodAdjustments(
    filters: FilterableShippingMethodAdjustmentProps,
    config?: FindConfig<ShippingMethodAdjustmentDTO>,
    sharedContext?: Context
  ): Promise<ShippingMethodAdjustmentDTO[]>

  /**
   * This method adds shipping method adjustments to shipping methods.
   *
   * @param {CreateShippingMethodAdjustmentDTO[]} data - The shipping method adjustments to be created and added to
   * shipping methods. The shipping method is specified by the `shipping_method_id` field.
   * @returns {Promise<ShippingMethodAdjustmentDTO[]>} The added shipping method adjustments.
   *
   * @example
   * const shippingMethodAdjustments =
   *   await cartModuleService.addShippingMethodAdjustments([
   *     {
   *       shipping_method_id: "casm_123",
   *       code: "FREESHIPPING",
   *       amount: 3000,
   *     },
   *     {
   *       shipping_method_id: "casm_321",
   *       code: "10%OFF",
   *       amount: 1500,
   *     },
   *   ])
   */
  addShippingMethodAdjustments(
    data: CreateShippingMethodAdjustmentDTO[]
  ): Promise<ShippingMethodAdjustmentDTO[]>

  /**
   * This method adds a shipping method adjustment to a shipping method.
   *
   * @param {CreateShippingMethodAdjustmentDTO} data - The shipping method adjustment to be created and added to a
   * shipping method. The shipping method is specified by the `shipping_method_id` field.
   * @returns {Promise<ShippingMethodAdjustmentDTO>} The added shipping method adjustment.
   *
   * @example
   * const shippingMethodAdjustment =
   *   await cartModuleService.addShippingMethodAdjustments({
   *     shipping_method_id: "casm_123",
   *     code: "FREESHIPPING",
   *     amount: 3000,
   *   })
   */
  addShippingMethodAdjustments(
    data: CreateShippingMethodAdjustmentDTO
  ): Promise<ShippingMethodAdjustmentDTO>

  /**
   * This method adds shipping method adjustments to shipping methods in a cart.
   *
   * @param {string} cartId - The cart's ID.
   * @param {CreateShippingMethodAdjustmentDTO[]} data - The shipping method adjustments to be created and added to
   * shipping methods. The shipping method is specified by the `shipping_method_id` field.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingMethodAdjustmentDTO[]>} The added shipping method adjustments.
   *
   * @example
   * const shippingMethodAdjustments =
   *   await cartModuleService.addShippingMethodAdjustments(
   *     "cart_123",
   *     [
   *       {
   *         shipping_method_id: "casm_123",
   *         code: "FREESHIPPING",
   *         amount: 3000,
   *       },
   *       {
   *         shipping_method_id: "casm_321",
   *         code: "10%OFF",
   *         amount: 1500,
   *       },
   *     ]
   *   )
   */
  addShippingMethodAdjustments(
    cartId: string,
    data: CreateShippingMethodAdjustmentDTO[],
    sharedContext?: Context
  ): Promise<ShippingMethodAdjustmentDTO[]>

  /**
   * This method sets the shipping method adjustment of shipping methods in a cart. The existing shipping method adjustments,
   * except those included in the specified list, of an item are removed and replaced with the specified adjustments.
   *
   * @param {string} cartId - The cart's ID.
   * @param {(CreateShippingMethodAdjustmentDTO | UpdateShippingMethodAdjustmentDTO)[]} data - The shipping method adjustments to add to the shipping
   * method. If the `id` field is specified, the adjustment is kept in the shipping method's adjustment and its attributes can be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingMethodAdjustmentDTO[]>} The added shipping method adjustments.
   *
   * @example
   * const shippingMethodAdjustments =
   *   await cartModuleService.setShippingMethodAdjustments(
   *     "cart_123",
   *     [
   *       {
   *         id: "casmadj_123",
   *         shipping_method_id: "casm_123",
   *         code: "FREESHIPPING",
   *       },
   *       {
   *         shipping_method_id: "casm_321",
   *         code: "10%OFF",
   *         amount: 1500,
   *       },
   *     ]
   *   )
   */
  setShippingMethodAdjustments(
    cartId: string,
    data: (
      | CreateShippingMethodAdjustmentDTO
      | UpdateShippingMethodAdjustmentDTO
    )[],
    sharedContext?: Context
  ): Promise<ShippingMethodAdjustmentDTO[]>

  /**
   * This method retrieves a paginated list of line item tax lines based on optional filters and configuration.
   *
   * @param {FilterableLineItemTaxLineProps} filters - The filters to apply on the retrieved line item tax lines.
   * @param {FindConfig<LineItemTaxLineDTO>} config - The configurations determining how the line item tax line is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a line item tax line.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LineItemTaxLineDTO[]>} The list of line item tax lines.
   *
   * @example
   * To retrieve a list of line item tax lines using their IDs:
   *
   * ```ts
   * const lineItemTaxLines =
   *   await cartModuleService.listLineItemTaxLines({
   *     id: ["calitxl_123", "calitxl_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the line item tax lines:
   *
   * ```ts
   * const lineItemTaxLines =
   *   await cartModuleService.listLineItemTaxLines(
   *     {
   *       id: ["calitxl_123", "calitxl_321"],
   *     },
   *     {
   *       relations: ["item"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const lineItemTaxLines =
   *   await cartModuleService.listLineItemTaxLines(
   *     {
   *       id: ["calitxl_123", "calitxl_321"],
   *     },
   *     {
   *       relations: ["item"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listLineItemTaxLines(
    filters: FilterableLineItemTaxLineProps,
    config?: FindConfig<LineItemTaxLineDTO>,
    sharedContext?: Context
  ): Promise<LineItemTaxLineDTO[]>

  /**
   * This method creates and adds line item tax lines.
   *
   * @param {CreateLineItemTaxLineDTO[]} taxLines - The line item tax lines to be created.
   * @returns {Promise<LineItemTaxLineDTO[]>} The added line item tax lines.
   *
   * @example
   * const lineItemTaxLines =
   *   await cartModuleService.addLineItemTaxLines([
   *     {
   *       code: "1000",
   *       rate: 10,
   *     },
   *     {
   *       code: "1234",
   *       rate: 20,
   *     },
   *   ])
   */
  addLineItemTaxLines(
    taxLines: CreateLineItemTaxLineDTO[]
  ): Promise<LineItemTaxLineDTO[]>

  /**
   * This method creates and adds a line item tax line.
   *
   * @param {CreateLineItemTaxLineDTO} taxLine - The line item tax line to be created.
   * @returns {Promise<LineItemTaxLineDTO>} The added line item tax line.
   *
   * @example
   * const lineItemTaxLines =
   *   await cartModuleService.addLineItemTaxLines({
   *     code: "1000",
   *     rate: 10,
   *   })
   */
  addLineItemTaxLines(
    taxLine: CreateLineItemTaxLineDTO
  ): Promise<LineItemTaxLineDTO>

  /**
   * This method creates and adds one or more line item tax lines to a cart.
   *
   * @param {string} cartId - The cart's ID.
   * @param {CreateLineItemTaxLineDTO | CreateLineItemTaxLineDTO[]} taxLines - The line item tax lines to add.
   * You can specify one or more items.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LineItemTaxLineDTO[]>} The added line item tax lines.
   *
   * @example
   * const lineItemTaxLines =
   *   await cartModuleService.addLineItemTaxLines("cart_123", {
   *     code: "1000",
   *     rate: 10,
   *   })
   */
  addLineItemTaxLines(
    cartId: string,
    taxLines: CreateLineItemTaxLineDTO[] | CreateLineItemTaxLineDTO,
    sharedContext?: Context
  ): Promise<LineItemTaxLineDTO[]>

  /**
   * This method sets the line item tax lines in a cart. The existing line item tax lines,
   * except those included in the specified list, are removed and replaced with the specified tax lines.
   *
   * @param {string} cartId - The cart's ID.
   * @param {(CreateLineItemTaxLineDTO | UpdateLineItemTaxLineDTO)[]} taxLines - The line item tax lines to add.
   * If the `id` field is specified, the tax line is kept and its attributes can be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LineItemTaxLineDTO[]>} The added line item tax lines.
   *
   * @example
   * const lineItemTaxLines =
   *   await cartModuleService.setLineItemTaxLines("cart_123", [
   *     {
   *       code: "1000",
   *       rate: 10,
   *     },
   *     {
   *       code: "1234",
   *       rate: 20,
   *     },
   *   ])
   */
  setLineItemTaxLines(
    cartId: string,
    taxLines: (CreateLineItemTaxLineDTO | UpdateLineItemTaxLineDTO)[],
    sharedContext?: Context
  ): Promise<LineItemTaxLineDTO[]>

  /**
   * This method retrieves a paginated list of shipping method tax lines based on optional filters and configuration.
   *
   * @param {FilterableShippingMethodTaxLineProps} filters - The filters to apply on the retrieved shipping method tax lines.
   * @param {FindConfig<ShippingMethodTaxLineDTO>} config - The configurations determining how the shipping method tax line is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a shipping method tax line.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingMethodTaxLineDTO[]>} The list of shipping method tax lines.
   *
   * @example
   * To retrieve a list of shipping method tax lines using their IDs:
   *
   * ```ts
   * const shippingMethodTaxLines =
   *   await cartModuleService.listShippingMethodTaxLines({
   *     id: ["casmtxl_123", "casmtxl_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the shipping method tax lines:
   *
   * ```ts
   * const shippingMethodTaxLines =
   *   await cartModuleService.listShippingMethodTaxLines(
   *     {
   *       id: ["casmtxl_123", "casmtxl_321"],
   *     },
   *     {
   *       relations: ["shipping_method"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const shippingMethodTaxLines =
   *   await cartModuleService.listShippingMethodTaxLines(
   *     {
   *       id: ["casmtxl_123", "casmtxl_321"],
   *     },
   *     {
   *       relations: ["shipping_method"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listShippingMethodTaxLines(
    filters: FilterableShippingMethodTaxLineProps,
    config?: FindConfig<ShippingMethodTaxLineDTO>,
    sharedContext?: Context
  ): Promise<ShippingMethodTaxLineDTO[]>

  /**
   * This method creates and adds shipping method tax lines.
   *
   * @param {CreateShippingMethodTaxLineDTO[]} taxLines - The shipping method tax lines to be created.
   * @returns {Promise<ShippingMethodTaxLineDTO[]>} The added shipping method tax lines.
   *
   * @example
   * const shippingMethodTaxLines =
   *   await cartModuleService.addShippingMethodTaxLines([
   *     {
   *       code: "1000",
   *       rate: 10,
   *     },
   *     {
   *       code: "1234",
   *       rate: 20,
   *     },
   *   ])
   */
  addShippingMethodTaxLines(
    taxLines: CreateShippingMethodTaxLineDTO[]
  ): Promise<ShippingMethodTaxLineDTO[]>

  /**
   * This method creates and adds a shipping method tax line.
   *
   * @param {CreateShippingMethodTaxLineDTO} taxLine - The shipping method tax line to be created.
   * @returns {Promise<ShippingMethodTaxLineDTO>} The added shipping method tax line.
   *
   * @example
   * const shippingMethodTaxLine =
   *   await cartModuleService.addShippingMethodTaxLines({
   *     code: "1000",
   *     rate: 10,
   *   })
   */
  addShippingMethodTaxLines(
    taxLine: CreateShippingMethodTaxLineDTO
  ): Promise<ShippingMethodTaxLineDTO>

  /**
   * This method creates and adds one or more shipping method tax lines to a cart.
   *
   * @param {string} cartId - The cart's ID.
   * @param {CreateShippingMethodTaxLineDTO | CreateShippingMethodTaxLineDTO[]} taxLines - The shipping item tax lines to add.
   * If the `id` field is specified, the tax line is kept and its attributes can be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingMethodTaxLineDTO[]>} The added shipping method tax lines.
   *
   * @example
   * const shippingMethodTaxLines =
   *   await cartModuleService.addShippingMethodTaxLines(
   *     "cart_123",
   *     [
   *       {
   *         code: "1000",
   *         rate: 10,
   *       },
   *       {
   *         code: "1234",
   *         rate: 20,
   *       },
   *     ]
   *   )
   */
  addShippingMethodTaxLines(
    cartId: string,
    taxLines: CreateShippingMethodTaxLineDTO[] | CreateShippingMethodTaxLineDTO,
    sharedContext?: Context
  ): Promise<ShippingMethodTaxLineDTO[]>

  /**
   * This method sets the shipping item tax lines in a cart. The shipping line item tax lines,
   * except those included in the specified list, are removed and replaced with the specified tax lines.
   *
   * @param {string} cartId - The cart's ID.
   * @param {(CreateShippingMethodTaxLineDTO | UpdateShippingMethodTaxLineDTO)[]} taxLines - The shipping item tax lines to add.
   * If the `id` field is specified, the tax line is kept and its attributes can be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ShippingMethodTaxLineDTO[]>} The added shipping method tax lines.
   *
   * @example
   * const shippingMethodTaxLines =
   *   await cartModuleService.setShippingMethodTaxLines(
   *     "cart_123",
   *     [
   *       {
   *         code: "1000",
   *         rate: 10,
   *       },
   *       {
   *         code: "1234",
   *         rate: 20,
   *       },
   *     ]
   *   )
   */
  setShippingMethodTaxLines(
    cartId: string,
    taxLines: (
      | CreateShippingMethodTaxLineDTO
      | UpdateShippingMethodTaxLineDTO
    )[],
    sharedContext?: Context
  ): Promise<ShippingMethodTaxLineDTO[]>

  /**
   * This method deletes line items by their IDs.
   *
   * @param {string[]} ids - The IDs of the line items.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line items are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteLineItems([
   *   "cali_123",
   *   "cali_321",
   * ])
   */
  deleteLineItems(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a line item by its ID.
   *
   * @param {string} id - The ID of the line item.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when a line item is deleted successfully.
   *
   * @example
   * await cartModuleService.deleteLineItems("cali_123")
   */
  deleteLineItems(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes shipping methods by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping methods.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping methods are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteShippingMethods([
   *   "casm_123",
   *   "casm_321",
   * ])
   */
  deleteShippingMethods(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a shipping method by its ID.
   *
   * @param {string} id - The ID of the shipping method.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method is deleted successfully.
   *
   * @example
   * await cartModuleService.deleteShippingMethods("casm_123")
   */
  deleteShippingMethods(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes line item adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item adjustments.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item adjustments are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteLineItemAdjustments([
   *   "caliadj_123",
   *   "caliadj_321",
   * ])
   */
  deleteLineItemAdjustments(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a line item adjustment by its ID.
   *
   * @param {string} id - The ID of the line item adjustment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item adjustment is deleted successfully.
   *
   * @example
   * await cartModuleService.deleteLineItemAdjustments(
   *   "caliadj_123"
   * )
   */
  deleteLineItemAdjustments(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes shipping method adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method adjustments.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method adjustments are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteShippingMethodAdjustments([
   *   "casmadj_123",
   *   "casmadj_321",
   * ])
   */
  deleteShippingMethodAdjustments(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a shipping method adjustment by its ID.
   *
   * @param {string} id - The ID of the shipping method adjustment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when shipping method adjustment is deleted successfully.
   *
   * @example
   * await cartModuleService.deleteShippingMethodAdjustments(
   *   "casmadj_123"
   * )
   */
  deleteShippingMethodAdjustments(
    id: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes line item tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item tax lines.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item tax lines are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteLineItemTaxLines([
   *   "calitxl_123",
   *   "calitxl_321",
   * ])
   */
  deleteLineItemTaxLines(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a line item tax line by its ID.
   *
   * @param {string} id - The ID of the line item tax line.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the line item tax line is deleted successfully.
   *
   * @example
   * await cartModuleService.deleteLineItemTaxLines("calitxl_123")
   */
  deleteLineItemTaxLines(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes shipping method tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method tax lines.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method tax lines are deleted successfully.
   *
   * @example
   * await cartModuleService.deleteShippingMethodTaxLines([
   *   "casmtxl_123",
   *   "casmtxl_321",
   * ])
   */
  deleteShippingMethodTaxLines(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a shipping method tax line by its ID.
   *
   * @param {string} id - The ID of the shipping method tax line.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the shipping method tax line is deleted successfully.
   *
   * @example
   * await cartModuleService.deleteShippingMethodTaxLines(
   *   "casmtxl_123"
   * )
   */
  deleteShippingMethodTaxLines(
    id: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes carts by their IDs.
   *
   * @param {string[]} ids - The IDs of the carts.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated line item.
   * The object's keys are the ID attribute names of the cart entity's relations, such as `item_id`, and its value is an array of strings, each being the ID of a record associated
   * with the cart through this relation, such as the IDs of associated line item.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteCarts(["cart_123", "cart_321"])
   */
  softDeleteCarts<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted carts by their IDs.
   *
   * @param {string[]} ids - The IDs of the carts.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the carts. You can pass to its `returnLinkableKeys`
   * property any of the cart's relation attribute names, such as `items`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated line item.
   * The object's keys are the ID attribute names of the cart entity's relations, such as `item_id`,
   * and its value is an array of strings, each being the ID of the record associated with the cart through this relation,
   * such as the IDs of associated line item.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreCarts(["cart_123", "cart_321"])
   */
  restoreCarts<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes addresses by their IDs.
   *
   * @param {string[]} ids - The IDs of the addresses.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteAddresses([
   *   "caaddr_123",
   *   "caaddr_321",
   * ])
   */
  softDeleteAddresses<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted addresses by their IDs.
   *
   * @param {string[]} ids - The IDs of the addresses.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the addresses. You can pass to its `returnLinkableKeys`
   * property any of the address's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreAddresses([
   *   "caaddr_123",
   *   "caaddr_321",
   * ])
   */
  restoreAddresses<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes line items by their IDs.
   *
   * @param {string[]} ids - The IDs of the line items.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated tax lines.
   * The object's keys are the ID attribute names of the line item entity's relations, such as `tax_line_id`, and its value is an array of strings, each being the ID of a record associated
   * with the line item through this relation, such as the IDs of associated tax lines.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteLineItems([
   *   "cali_123",
   *   "cali_321",
   * ])
   */
  softDeleteLineItems<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted line items by their IDs.
   *
   * @param {string[]} ids - The IDs of the line items.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the line items. You can pass to its `returnLinkableKeys`
   * property any of the line item's relation attribute names, such as `tax_lines`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated tax line.
   * The object's keys are the ID attribute names of the line item entity's relations, such as `tax_line_id`,
   * and its value is an array of strings, each being the ID of the record associated with the line item through this relation,
   * such as the IDs of associated tax line.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreLineItems([
   *   "cali_123",
   *   "cali_321",
   * ])
   */
  restoreLineItems<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes shipping methods by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping methods.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated tax lines.
   * The object's keys are the ID attribute names of the shipping method entity's relations, such as `tax_line_id`, and its value is an array of strings, each being the ID of a record associated
   * with the shipping method through this relation, such as the IDs of associated tax line.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteShippingMethods([
   *   "casm_123",
   *   "casm_321",
   * ])
   */
  softDeleteShippingMethods<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted shipping methods by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping methods.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping methods. You can pass to its `returnLinkableKeys`
   * property any of the shipping method's relation attribute names, such as `tax_lines`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated tax lines.
   * The object's keys are the ID attribute names of the shipping method entity's relations, such as `tax_line_id`,
   * and its value is an array of strings, each being the ID of the record associated with the shipping method through this relation,
   * such as the IDs of associated tax lines.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreShippingMethods([
   *   "casm_123",
   *   "casm_321",
   * ])
   */
  restoreShippingMethods<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes line item adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item adjustments.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteLineItemAdjustments([
   *   "caliadj_123",
   *   "caliadj_321",
   * ])
   */
  softDeleteLineItemAdjustments<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted line item adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item adjustments.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the line item adjustments. You can pass to its `returnLinkableKeys`
   * property any of the line item adjustment's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreLineItemAdjustments([
   *   "caliadj_123",
   *   "caliadj_321",
   * ])
   */
  restoreLineItemAdjustments<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes shipping method adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method adjustments.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteShippingMethodAdjustments([
   *   "casmadj_123",
   *   "casmadj_321",
   * ])
   */
  softDeleteShippingMethodAdjustments<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted shipping method adjustments by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method adjustments.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping method adjustment. You can pass to its `returnLinkableKeys`
   * property any of the shipping method adjustment's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreShippingMethodAdjustments([
   *   "casmadj_123",
   *   "casmadj_321",
   * ])
   */
  restoreShippingMethodAdjustments<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes line item tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the line item tax lines.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteLineItemTaxLines([
   *   "calitxl_123",
   *   "calitxl_321",
   * ])
   */
  softDeleteLineItemTaxLines<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted line item tax lines by its IDs.
   *
   * @param {string[]} ids - The IDs of the line item tax lines.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the line item tax lines. You can pass to its `returnLinkableKeys`
   * property any of the line item tax line's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreLineItemTaxLines([
   *   "calitxl_123",
   *   "calitxl_321",
   * ])
   */
  restoreLineItemTaxLines<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes shipping method tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method tax lines.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.softDeleteShippingMethodTaxLines([
   *   "casmtxl_123",
   *   "casmtxl_321",
   * ])
   */
  softDeleteShippingMethodTaxLines<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted shipping method tax lines by their IDs.
   *
   * @param {string[]} ids - The IDs of the shipping method tax lines.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the shipping method tax lines. You can pass to its `returnLinkableKeys`
   * property any of the shipping method tax line's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await cartModuleService.restoreShippingMethodTaxLines([
   *   "casmtxl_123",
   *   "casmtxl_321",
   * ])
   */
  restoreShippingMethodTaxLines<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}
