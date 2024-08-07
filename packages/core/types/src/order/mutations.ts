import { BigNumberInput } from "../totals"
import {
  ChangeActionType,
  OrderClaimDTO,
  OrderExchangeDTO,
  OrderItemDTO,
  OrderLineItemDTO,
  OrderReturnReasonDTO,
  OrderTransactionDTO,
  ReturnDTO,
} from "./common"

/** ADDRESS START */
/**
 * The data to create or update in the address.
 */
export interface UpsertOrderAddressDTO {
  /**
   * The associated customer's ID.
   */
  customer_id?: string

  /**
   * The company name.
   */
  company?: string

  /**
   * The first name of the customer.
   */
  first_name?: string

  /**
   * The last name of the customer.
   */
  last_name?: string

  /**
   * The address 1 of the address.
   */
  address_1?: string

  /**
   * The address 2 of the address.
   */
  address_2?: string

  /**
   * The city of the address.
   */
  city?: string

  /**
   * The country code of the address.
   */
  country_code?: string

  /**
   * The province of the address.
   */
  province?: string

  /**
   * The postal code of the address.
   */
  postal_code?: string

  /**
   * The phone of the address.
   */
  phone?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the address.
 */
export interface UpdateOrderAddressDTO extends UpsertOrderAddressDTO {
  /**
   * The ID of the address.
   */
  id: string
}

/**
 * The address to be created.
 */
export interface CreateOrderAddressDTO extends UpsertOrderAddressDTO {}

/** ADDRESS END */
/** ORDER START */
/**
 * The data of the order to be created.
 */
export interface CreateOrderDTO {
  /**
   * The associated region's ID.
   */
  region_id?: string

  /**
   * The associated customer's ID.
   */
  customer_id?: string

  /**
   * The associated sales channel's ID.
   */
  sales_channel_id?: string

  /**
   * The status of the order.
   */
  status?: string

  /**
   * The email of the customer that placed the order.
   */
  email?: string

  /**
   * The currency code of the order.
   */
  currency_code?: string

  /**
   * The associated shipping address's ID.
   */
  shipping_address_id?: string

  /**
   * The associated billing address's ID.
   */
  billing_address_id?: string

  /**
   * The shipping address of the order.
   */
  shipping_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO

  /**
   * The billing address of the order.
   */
  billing_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO

  /**
   * Whether the customer should receive notifications about
   * order updates.
   */
  no_notification?: boolean

  /**
   * The items of the order.
   */
  items?: CreateOrderLineItemDTO[]

  /**
   * The shipping methods of the order.
   */
  shipping_methods?: Omit<CreateOrderShippingMethodDTO, "order_id">[]

  /**
   * The transactions of the order.
   */
  transactions?: Omit<CreateOrderTransactionDTO, "order_id">[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The promo codes of the order.
   */
  promo_codes?: string[]
}

/**
 * The attributes to update in the order.
 */
export interface UpdateOrderDTO {
  /**
   * The ID of the order.
   */
  id?: string

  /**
   * The version of the order.
   */
  version?: number

  /**
   * The associated region's ID.
   */
  region_id?: string

  /**
   * The associated customer's ID.
   */
  customer_id?: string

  /**
   * The associated sales channel's ID.
   */
  sales_channel_id?: string

  /**
   * The items of the order.
   */
  items?: CreateOrderLineItemDTO[]

  /**
   * The shipping address of the order.
   */
  shipping_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO

  /**
   * The billing address of the order.
   */
  billing_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO

  /**
   * The email of the customer that placed the order.
   */
  email?: string

  /**
   * Whether the customer should receive notifications
   * about order updates.
   */
  no_notification?: boolean

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/** ORDER END */
/** ADJUSTMENT START */
/**
 * The data of the order adjustment to be created.
 */
export interface CreateOrderAdjustmentDTO {
  /**
   * The code of the adjustment.
   */
  code?: string

  /**
   * The amount of the adjustment.
   */
  amount: BigNumberInput

  /**
   * The description of the adjustment.
   */
  description?: string

  /**
   * The associated promotion's ID.
   */
  promotion_id?: string

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/**
 * The attributes to update in the adjustment.
 */
export interface UpdateOrderAdjustmentDTO {
  /**
   * The ID of the adjustment.
   */
  id: string

  /**
   * The code of the adjustment.
   */
  code?: string

  /**
   * The amount of the adjustment.
   */
  amount: BigNumberInput

  /**
   * The description of the adjustment.
   */
  description?: string

  /**
   * The associated promotion's ID.
   */
  promotion_id?: string

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/**
 * The line item adjustment to be created.
 */
export interface CreateOrderLineItemAdjustmentDTO
  extends CreateOrderAdjustmentDTO {
  /**
   * The associated item's ID.
   */
  item_id: string
}

/**
 * The attributes to update in the line item adjustment.
 */
export interface UpdateOrderLineItemAdjustmentDTO
  extends UpdateOrderAdjustmentDTO {
  /**
   * The associated item's ID.
   */
  item_id: string
}

/**
 * The attributes in the line item adjustment to be created or updated.
 */
export interface UpsertOrderLineItemAdjustmentDTO {
  /**
   * The ID of the line item adjustment.
   */
  id?: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The code of the line item adjustment.
   */
  code?: string

  /**
   * The amount of the line item adjustment.
   */
  amount?: BigNumberInput

  /**
   * The description of the line item adjustment.
   */
  description?: string

  /**
   * The associated promotion's ID.
   */
  promotion_id?: string

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/** ADJUSTMENTS END */
/** TAX LINES START */
/**
 * The dat of the tax line to be created.
 */
export interface CreateOrderTaxLineDTO {
  /**
   * The description of the tax line.
   */
  description?: string

  /**
   * The associated tax rate's ID.
   */
  tax_rate_id?: string

  /**
   * The code of the tax line.
   */
  code: string

  /**
   * The rate of the tax line.
   */
  rate: BigNumberInput

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/**
 * The attributes to update in the tax line.
 */
export interface UpdateOrderTaxLineDTO {
  /**
   * The ID of the tax line.
   */
  id: string

  /**
   * The description of the tax line.
   */
  description?: string

  /**
   * The associated tax rate's ID.
   */
  tax_rate_id?: string

  /**
   * The code of the tax line.
   */
  code?: string

  /**
   * The rate of the tax line.
   */
  rate?: BigNumberInput

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/**
 * The shipping method tax line to be created.
 */
export interface CreateOrderShippingMethodTaxLineDTO
  extends CreateOrderTaxLineDTO {}

/**
 * The attributes to update in the shipping method tax line.
 */
export interface UpdateOrderShippingMethodTaxLineDTO
  extends UpdateOrderTaxLineDTO {}

/**
 * The line item tax line to be created.
 */
export interface CreateOrderLineItemTaxLineDTO extends CreateOrderTaxLineDTO {}

/**
 * The attributes to update in the line item tax line.
 */
export interface UpdateOrderLineItemTaxLineDTO extends UpdateOrderTaxLineDTO {}

/** TAX LINES END */
/** LINE ITEMS START */
/**
 * The data of the line item to create.
 */
export interface CreateOrderLineItemDTO {
  /**
   * The title of the line item.
   */
  title: string

  /**
   * The subtitle of the line item.
   */
  subtitle?: string

  /**
   * The thumbnail of the line item.
   */
  thumbnail?: string

  /**
   * The associated order's ID.
   */
  order_id?: string

  /**
   * The quantity of the line item.
   */
  quantity: BigNumberInput

  /**
   * The associated product's ID.
   */
  product_id?: string

  /**
   * The product title of the line item.
   */
  product_title?: string

  /**
   * The product description of the line item.
   */
  product_description?: string

  /**
   * The product subtitle of the line item.
   */
  product_subtitle?: string

  /**
   * The product type of the line item.
   */
  product_type?: string

  /**
   * The product collection of the line item.
   */
  product_collection?: string

  /**
   * The product handle of the line item.
   */
  product_handle?: string

  /**
   * The associated variant's ID.
   */
  variant_id?: string

  /**
   * The variant sku of the line item.
   */
  variant_sku?: string

  /**
   * The variant barcode of the line item.
   */
  variant_barcode?: string

  /**
   * The variant title of the line item.
   */
  variant_title?: string

  /**
   * The variant option values of the line item.
   */
  variant_option_values?: Record<string, unknown>

  /**
   * Whether the line item requires shipping.
   */
  requires_shipping?: boolean

  /**
   * Whether the line item is discountable.
   */
  is_discountable?: boolean

  /**
   * Whether the line item is tax inclusive.
   */
  is_tax_inclusive?: boolean

  /**
   * The compare-at unit price of the line item.
   */
  compare_at_unit_price?: BigNumberInput

  /**
   * The unit price of the line item.
   */
  unit_price: BigNumberInput

  /**
   * The tax lines of the line item.
   */
  tax_lines?: CreateOrderTaxLineDTO[]

  /**
   * The adjustments of the line item.
   */
  adjustments?: CreateOrderAdjustmentDTO[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The line item to be created.
 */
export interface CreateOrderLineItemForOrderDTO extends CreateOrderLineItemDTO {
  /**
   * The associated order's ID.
   */
  order_id: string
}

/**
 * The attributes to update in the line item with selector.
 */
export interface UpdateOrderLineItemWithSelectorDTO {
  /**
   * The selector of the line item with selector.
   */
  selector: Partial<OrderLineItemDTO>

  /**
   * The data of the line item with selector.
   */
  data: Partial<UpdateOrderLineItemDTO>
}

/**
 * The attributes to update in the line item.
 */
export interface UpdateOrderLineItemDTO
  extends Omit<
    CreateOrderLineItemDTO,
    "tax_lines" | "adjustments" | "title" | "quantity" | "unit_price"
  > {
  /**
   * The ID of the line item.
   */
  id: string

  /**
   * The title of the line item.
   */
  title?: string

  /**
   * The quantity of the line item.
   */
  quantity?: BigNumberInput

  /**
   * The unit price of the line item.
   */
  unit_price?: BigNumberInput

  /**
   * The tax lines of the line item.
   */
  tax_lines?: UpdateOrderTaxLineDTO[] | CreateOrderTaxLineDTO[]

  /**
   * The adjustments of the line item.
   */
  adjustments?: UpdateOrderAdjustmentDTO[] | CreateOrderAdjustmentDTO[]
}

/** LINE ITEMS END */
/** SHIPPING METHODS START */
/**
 * The data of the shipping method to be created.
 */
export interface CreateOrderShippingMethodDTO {
  /**
   * The name of the shipping method.
   */
  name: string

  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The associated return's ID.
   */
  return_id?: string

  /**
   * The associated claim's ID.
   */
  claim_id?: string

  /**
   * The associated exchange's ID.
   */
  exchange_id?: string

  /**
   * The version of the shipping method.
   */
  version?: number

  /**
   * The amount of the shipping method.
   */
  amount: BigNumberInput

  /**
   * Whether the shipping method is tax inclusive.
   */
  is_tax_inclusive?: boolean

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id?: string

  /**
   * The data of the shipping method.
   */
  data?: Record<string, unknown>

  /**
   * The tax lines of the shipping method.
   */
  tax_lines?: CreateOrderTaxLineDTO[]

  /**
   * The adjustments of the shipping method.
   */
  adjustments?: CreateOrderAdjustmentDTO[]
}

/**
 * The attributes to update in the shipping method.
 */
export interface UpdateOrderShippingMethodDTO {
  /**
   * The ID of the shipping method.
   */
  id: string

  /**
   * The name of the shipping method.
   */
  name?: string

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id?: string

  /**
   * The amount of the shipping method.
   */
  amount?: BigNumberInput

  /**
   * The data of the shipping method.
   */
  data?: Record<string, unknown>

  /**
   * The tax lines of the shipping method.
   */
  tax_lines?: UpdateOrderTaxLineDTO[] | CreateOrderTaxLineDTO[]

  /**
   * The adjustments of the shipping method.
   */
  adjustments?: CreateOrderAdjustmentDTO[] | UpdateOrderAdjustmentDTO[]
}

/**
 * The shipping method adjustment to be created.
 */
export interface CreateOrderShippingMethodAdjustmentDTO {
  /**
   * The associated shipping method's ID.
   */
  shipping_method_id: string

  /**
   * The code of the adjustment.
   */
  code: string

  /**
   * The amount of the adjustment.
   */
  amount: BigNumberInput

  /**
   * The description of the adjustment.
   */
  description?: string

  /**
   * The associated promotion's ID.
   */
  promotion_id?: string

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/**
 * The attributes to update in the shipping method adjustment.
 */
export interface UpdateOrderShippingMethodAdjustmentDTO {
  /**
   * The ID of the shipping method adjustment.
   */
  id: string

  /**
   * The code of the adjustment.
   */
  code?: string

  /**
   * The amount of the adjustment.
   */
  amount?: BigNumberInput

  /**
   * The description of the adjustment.
   */
  description?: string

  /**
   * The associated promotion's ID.
   */
  promotion_id?: string

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/** SHIPPING METHODS END */
/** ORDER CHANGE START */
/**
 * The data of the order change to be created.
 */
export interface CreateOrderChangeDTO {
  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The associated return's ID.
   */
  return_id?: string

  /**
   * The associated claim's ID.
   */
  claim_id?: string

  /**
   * The associated exchange's ID.
   */
  exchange_id?: string

  /**
   * The type of the order change.
   */
  change_type?:
    | "return_request"
    | "return_receive"
    | "exchange"
    | "claim"
    | "edit"

  /**
   * The description of the order change.
   */
  description?: string

  /**
   * The internal note of the order change.
   */
  internal_note?: string | null

  /**
   * The user or customer that requested the order change.
   */
  requested_by?: string

  /**
   * The date that the order change was requested.
   */
  requested_at?: Date

  /**
   * The user that created the order change.
   */
  created_by?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The actions of the order change.
   */
  actions?: CreateOrderChangeActionDTO[]
}

/**
 * The attributes to update in the order change.
 */
export interface UpdateOrderChangeDTO {
  /**
   * The ID of the order change.
   */
  id: string

  /**
   * The status of the order change.
   */
  status?: string

  /**
   * The description of the order change.
   */
  description?: string

  /**
   * The internal note of the order change.
   */
  internal_note?: string | null

  /**
   * The user or customer that requested the
   * order change.
   */
  requested_by?: string | null

  /**
   * The date the order change was requested.
   */
  requested_at?: Date | null

  /**
   * The user or customer that confirmed the
   * order change.
   */
  confirmed_by?: string | null

  /**
   * The date the order change was confirmed.
   */
  confirmed_at?: Date | null

  /**
   * The user or customer that declined
   * the order change.
   */
  declined_by?: string | null

  /**
   * The reason that the order change was declined.
   */
  declined_reason?: string | null

  /**
   * The date that the order change was declined.
   */
  declined_at?: Date | null

  /**
   * The user or customer that canceled the
   * order change.
   */
  canceled_by?: string | null

  /**
   * The date that the order change was canceled.
   */
  canceled_at?: Date | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The details of the order change cancelation.
 */
export interface CancelOrderChangeDTO {
  /**
   * The ID of the order change.
   */
  id: string

  /**
   * The user or customer that canceled the order change.
   */
  canceled_by?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The details of declining the order change.
 */
export interface DeclineOrderChangeDTO {
  /**
   * The ID of the order change.
   */
  id: string

  /**
   * The user or customer who declined the order change.
   */
  declined_by?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The details of the order change confirmation.
 */
export interface ConfirmOrderChangeDTO {
  /**
   * The ID of the order change.
   */
  id: string

  /**
   * The user or customer that confirmed the
   * order change.
   */
  confirmed_by?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/** ORDER CHANGE END */
/** ORDER CHANGE ACTION START */
/**
 * The data of the order change action to be created.
 */
export interface CreateOrderChangeActionDTO {
  /**
   * The associated order change's ID.
   */
  order_change_id?: string

  /**
   * The associated order's ID.
   */
  order_id?: string

  /**
   * The associated return's ID.
   */
  return_id?: string

  /**
   * The associated claim's ID.
   */
  claim_id?: string

  /**
   * The associated exchange's ID.
   */
  exchange_id?: string

  /**
   * The version of the order change action.
   * Once the order change action is confirmed, this
   * becomes the order's version.
   */
  version?: number

  /**
   * The name of the data model that this action
   * references. For example, `return`.
   */
  reference?: string

  /**
   * The ID of the record references of the data model
   * specified in {@link reference}.
   *
   * For example, if `reference` is `return`, the `reference_id`
   * is the ID of the return.
   */
  reference_id?: string

  /**
   * The type of action.
   */
  action: ChangeActionType

  /**
   * The internal note of the order change action.
   */
  internal_note?: string | null

  /**
   * The amount of the order change action.
   */
  amount?: BigNumberInput

  /**
   * The details of the order change action.
   *
   * This could include the returned items or their changed
   * quantity, based on the type of this action.
   */
  details?: Record<string, unknown>
}

/**
 * The attributes to update in the order change action.
 */
export interface UpdateOrderChangeActionDTO {
  /**
   * The ID of the order change action.
   */
  id: string

  /**
   * The internal note of the order change action.
   */
  internal_note?: string | null
}

/** ORDER TRANSACTION START */
/**
 * The data of the transaction to be created.
 */
export interface CreateOrderTransactionDTO {
  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The description of the transaction.
   */
  description?: string

  /**
   * The data model this transaction references.
   * For example, `payment`.
   */
  reference?: string

  /**
   * The ID of the data model's record referenced.
   * For example, `pay_132`.
   */
  reference_id?: string

  /**
   * The internal note of the transaction.
   */
  internal_note?: string | null

  /**
   * The user or customer that created this
   * transaction.
   */
  created_by?: string

  /**
   * The amount of the transaction.
   */
  amount: BigNumberInput

  /**
   * The currency code of the transaction.
   */
  currency_code: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the transaction.
 */
export interface UpdateOrderTransactionDTO {
  /**
   * The ID of the transaction.
   */
  id: string

  /**
   * The amount of the transaction.
   */
  amount?: BigNumberInput

  /**
   * The currency code of the transaction.
   */
  currency_code?: string

  /**
   * The description of the transaction.
   */
  description?: string

  /**
   * The internal note of the transaction.
   */
  internal_note?: string | null

  /**
   * The data model this transaction references.
   * For example, `payment`.
   */
  reference?: string

  /**
   * The ID of the data model's record referenced.
   * For example, `pay_132`.
   */
  reference_id?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the transaction with filters
 * specifying which transactions to update.
 */
export interface UpdateOrderTransactionWithSelectorDTO {
  /**
   * The filters specifying which transactions to update.
   */
  selector: Partial<OrderTransactionDTO>

  /**
   * The data of the transaction to update.
   */
  data: Partial<UpdateOrderTransactionDTO>
}

/** ORDER TRANSACTION END */
/** ORDER DETAIL START */
/**
 * The data to update in the order items.
 */
export interface UpdateOrderItemDTO {
  /**
   * The ID of the item.
   */
  id: string

  /**
   * The associated order's ID.
   */
  order_id?: string

  /**
   * The version of the item.
   */
  version?: number

  /**
   * The associated item's ID.
   */
  item_id?: string

  /**
   * The quantity of the item.
   */
  quantity?: BigNumberInput

  /**
   * The fulfilled quantity of the item.
   */
  fulfilled_quantity?: BigNumberInput

  /**
   * The requested quantity of the item to be returned.
   */
  return_requested_quantity?: BigNumberInput

  /**
   * The quantity of the item received through a return.
   */
  return_received_quantity?: BigNumberInput

  /**
   * The dismissed quantity of the item through a return.
   */
  return_dismissed_quantity?: BigNumberInput

  /**
   * The quantity written off of the item due to
   * an order change.
   */
  written_off_quantity?: BigNumberInput

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the item with filters specifying
 * which items to update.
 */
export interface UpdateOrderItemWithSelectorDTO {
  /**
   * The filters specifying which items to update.
   */
  selector: Partial<OrderItemDTO>

  /**
   * The data of the item to update.
   */
  data: Partial<UpdateOrderItemDTO>
}

/** ORDER DETAIL END */
/** ORDER bundled action flows  */
/**
 * The details of an item used in a change action
 * performed on an order.
 */
interface BaseOrderBundledItemActionsDTO {
  /**
   * The ID of the item.
   */
  id: string

  /**
   * The quantity of the item.
   */
  quantity: BigNumberInput

  /**
   * The internal note of the item.
   */
  internal_note?: string

  /**
   * The note of the item.
   */
  note?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * Other details related to the item.
   */
  [key: string]: any
}

/**
 * The details of the action performed on an order,
 * return, claim, or exchange.
 */
interface BaseOrderBundledActionsDTO {
  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The associated return's ID.
   */
  return_id?: string

  /**
   * The associated claim's ID.
   */
  claim_id?: string

  /**
   * The associated exchange's ID.
   */
  exchange_id?: string

  /**
   * The description of the action.
   */
  description?: string

  /**
   * The internal note of the action.
   */
  internal_note?: string

  /**
   * The name of the data model the action
   * references. For example, `return`.
   */
  reference?: string

  /**
   * The ID of the record of the data model
   * specified in {@link reference}.
   *
   * For example, if `reference` is `return`, the
   * value is `return_123`.
   */
  reference_id?: string

  /**
   * The user or customer that created this action.
   */
  created_by?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The details to register a fulfillment of an order, return,
 * exchange, or claim.
 */
export interface RegisterOrderFulfillmentDTO
  extends BaseOrderBundledActionsDTO {
  /**
   * The items of the fulfillment.
   */
  items: BaseOrderBundledItemActionsDTO[]
}

/**
 * The details to cancel a fulfillment of an order, return,
 * exchange, or claim.
 */
export interface CancelOrderFulfillmentDTO extends BaseOrderBundledActionsDTO {
  /**
   * The items whose fulfillment is canceled.
   */
  items: BaseOrderBundledItemActionsDTO[]
}

/**
 * The details to register a shipment of an order, return, exchange,
 * or claim.
 */
export interface RegisterOrderShipmentDTO extends BaseOrderBundledActionsDTO {
  /**
   * The items of the shipment.
   */
  items?: BaseOrderBundledItemActionsDTO[]

  /**
   * Whether the customer should receive notifications about the shipment.
   */
  no_notification?: boolean
}

/**
 * The return to be created.
 */
export interface CreateOrderReturnDTO extends BaseOrderBundledActionsDTO {
  /**
   * The ID of the location to return the items to.
   */
  location_id?: string

  /**
   * The items of the return.
   */
  items?: {
    /**
     * The ID of the item.
     */
    id: string

    /**
     * The quantity of the item.
     */
    quantity: BigNumberInput

    /**
     * The internal note of the item.
     */
    internal_note?: string | null

    /**
     * The note of the item.
     */
    note?: string | null

    /**
     * The associated reason's ID.
     */
    reason_id?: string | null

    /**
     * Holds custom data in key-value pairs.
     */
    metadata?: Record<string, unknown> | null
  }[]

  /**
   * The shipping method of the return.
   */
  shipping_method?: Omit<CreateOrderShippingMethodDTO, "order_id"> | string

  /**
   * The refund amount of the return.
   */
  refund_amount?: BigNumberInput

  /**
   * Whether the customer should receive notifications related to
   * updates on the return.
   */
  no_notification?: boolean

  /**
   * The associated claim's ID.
   */
  claim_id?: string

  /**
   * The associated exchange's ID.
   */
  exchange_id?: string
}

/**
 * A return's status.
 */
export type ReturnStatus =
  | "open"
  | "requested"
  | "received"
  | "partially_received"
  | "canceled"

/**
 * The attributes to update in the return.
 */
export interface UpdateReturnDTO {
  /**
   * The ID of the return.
   */
  id: string

  /**
   * The ID of the location to return the items to.
   */
  location_id?: string

  /**
   * The refund amount of the return.
   */
  refund_amount?: BigNumberInput

  /**
   * Whether the customer should receive notifications related
   * to updates on the return.
   */
  no_notification?: boolean

  /**
   * The associated claim's ID.
   */
  claim_id?: string

  /**
   * The associated exchange's ID.
   */
  exchange_id?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The items of the return.
   */
  items?: {
    /**
     * The quantity of the item.
     */
    quantity: BigNumberInput

    /**
     * The internal note of the item.
     */
    internal_note?: string | null

    /**
     * The note of the item.
     */
    note?: string | null

    /**
     * The associated reason's ID.
     */
    reason_id?: string | null

    /**
     * The associated return's ID.
     */
    return_id?: string | null

    /**
     * Holds custom data in key-value pairs.
     */
    metadata?: Record<string, unknown> | null
  }[]
  status?: ReturnStatus
  requested_at?: Date
}

/**
 * The attributes to update in the claim.
 */
export interface UpdateOrderClaimDTO {
  /**
   * The ID of the claim.
   */
  id: string

  /**
   * The refund amount of the claim.
   */
  refund_amount?: BigNumberInput

  /**
   * Whether the customer should receive notifications
   * about updates related to the claim.
   */
  no_notification?: boolean

  /**
   * The associated return's ID, if the
   * claim's {@link type} is `replace`.
   */
  return_id?: string

  /**
   * The type of the claim.
   */
  type?: OrderClaimType

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the exchange.
 */
export interface UpdateOrderExchangeDTO {
  /**
   * The ID of the exchange.
   */
  id: string

  /**
   * The difference due of the exchange.
   *
   * - If less than `0`, the merchant owes the customer this amount.
   * - If greater than `0`, the customer owes the merchange this amount.
   * - If equal to `0`, no payment is required by either sides.
   */
  difference_due?: BigNumberInput

  /**
   * Whether the customer should receive notifications related
   * to updates on the exchange.
   */
  no_notification?: boolean

  /**
   * The associated return's ID.
   */
  return_id?: string

  /**
   * Whether backorders are allowed on the exchange's items.
   */
  allow_backorder?: boolean

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The order return item to be created.
 */
export interface CreateOrderReturnItemDTO {
  /**
   * The ID of the associated return.
   */
  return_id: string

  /**
   * The ID of the associated line item.
   */
  item_id: string

  /**
   * The quantity to return.
   */
  quantity?: BigNumberInput

  /**
   * The ID of the associated return reason.
   */
  reason_id?: string

  /**
   * The note of the return.
   */
  note?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The order claim item to be created.
 */
export interface CreateOrderClaimItemDTO {
  /**
   * The associated claim's ID.
   */
  claim_id: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The reason of the order claim item
   */
  reason?: ClaimReason

  /**
   * Whether the order claim item is an additional item sent
   * as a replacement to the customer.
   */
  is_additional_item?: boolean

  /**
   * The quantity of the order claim item
   */
  quantity?: BigNumberInput

  /**
   * The note of the order claim item
   */
  note?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The order exchange item to be created.
 */
export interface CreateOrderExchangeItemDTO {
  /**
   * The associated exchange's ID.
   */
  exchange_id: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The quantity of the order exchange item
   */
  quantity?: BigNumberInput

  /**
   * The note of the order exchange item
   */
  note?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The order exchange item to be created.
 */
export interface CreateOrderExchangeItemDTO {
  /**
   * The associated exchange's ID.
   */
  exchange_id: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The quantity of the order exchange item
   */
  quantity?: BigNumberInput

  /**
   * The note of the order exchange item
   */
  note?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the return with filters specifying
 * which returns to update.
 */
export interface UpdateOrderReturnWithSelectorDTO {
  /**
   * The filters specifying which returns to update.
   */
  selector: Partial<ReturnDTO>

  /**
   * The data of the return to update.
   */
  data: Partial<UpdateReturnDTO>
}

/**
 * The attributes to update in the claim with filters specifying
 * which claims to update.
 */
export interface UpdateOrderClaimWithSelectorDTO {
  /**
   * The filters specifying which claims to update.
   */
  selector: Partial<OrderClaimDTO>

  /**
   * The data of the claim to update.
   */
  data: Partial<UpdateOrderClaimDTO>
}

/**
 * The attributes to update in the exchange with filters specifying
 * which exchanges to update.
 */
export interface UpdateOrderExchangeWithSelectorDTO {
  /**
   * The filters specifying which exchanges to update.
   */
  selector: Partial<OrderExchangeDTO>

  /**
   * The data of the exchange to update.
   */
  data: Partial<UpdateOrderExchangeDTO>
}
export interface CancelOrderReturnDTO extends BaseOrderBundledActionsDTO {
  return_id: string
}

/**
 * A claim's type.
 */
export type OrderClaimType = "refund" | "replace"

/**
 * A claim's reason.
 */
export type ClaimReason =
  | "missing_item"
  | "wrong_item"
  | "production_failure"
  | "other"

/**
 * The claim to be created.
 */
export interface CreateOrderClaimDTO extends BaseOrderBundledActionsDTO {
  /**
   * The type of the claim.
   */
  type: OrderClaimType

  /**
   * The items of the claim.
   */
  claim_items?: (BaseOrderBundledItemActionsDTO & {
    /**
     * The reason the item is claimed.
     */
    reason?: ClaimReason

    /**
     * Images of the item explaining why it's claimed.
     */
    images?: {
      /**
       * The image's URL.
       */
      url: string

      /**
       * Holds custom data in key-value pairs.
       */
      metadata?: Record<string, unknown> | null
    }[]
  })[]

  /**
   * The items to be sent to the customer in replacement, if the
   * claim's type is `replace`.
   */
  additional_items?: BaseOrderBundledItemActionsDTO[]

  /**
   * The shipping methods used to send the additional items to the customer,
   * if the claim's type is `replace`.
   */
  shipping_methods?: Omit<CreateOrderShippingMethodDTO, "order_id">[] | string[]

  /**
   * The shipping methods used to send the items to be returned from the customer,
   * if the claim's type is `replace`.
   */
  return_shipping?: Omit<CreateOrderShippingMethodDTO, "order_id"> | string

  /**
   * The amount to be refunded.
   */
  refund_amount?: BigNumberInput

  /**
   * Whether the customer should receive notifications related to updates
   * on the claim.
   */
  no_notification?: boolean
}

export interface CancelOrderClaimDTO extends BaseOrderBundledActionsDTO {
  claim_id: string
}

/**
 * The exchange to be created.
 */
export interface CreateOrderExchangeDTO extends BaseOrderBundledActionsDTO {
  /**
   * The items to be sent to the customer.
   */
  additional_items?: BaseOrderBundledItemActionsDTO[]

  /**
   * The shipping methods used to send the additional items
   * to the customer.
   */
  shipping_methods?: Omit<CreateOrderShippingMethodDTO, "order_id">[] | string[]

  /**
   * The shipping methods used to return items from the customer.
   */
  return_shipping?: Omit<CreateOrderShippingMethodDTO, "order_id"> | string

  /**
   * The difference due of the exchange.
   *
   * - If less than `0`, the merchant owes the customer this amount.
   * - If greater than `0`, the customer owes the merchange this amount.
   * - If equal to `0`, no payment is required by either sides.
   */
  difference_due?: BigNumberInput

  /**
   * Whether backorder is allowed for the exchange's items.
   */
  allow_backorder?: boolean

  /**
   * Whether the customer should receive notifications related to
   * updates on the exchange.
   */
  no_notification?: boolean
}

export interface CancelOrderExchangeDTO extends BaseOrderBundledActionsDTO {
  exchange_id: string
}

/**
 * The details of return receival.
 */
export interface ReceiveOrderReturnDTO
  extends Omit<BaseOrderBundledActionsDTO, "order_id"> {
  /**
   * The items received.
   */
  items: BaseOrderBundledItemActionsDTO[]

  /**
   * The return's ID.
   */
  return_id: string
}

/** ORDER bundled action flows */
/**
 * The return reason to be created.
 */
export interface CreateOrderReturnReasonDTO {
  /**
   * The unique value of the return reason.
   */
  value: string

  /**
   * The label of the return reason.
   */
  label: string

  /**
   * The description of the return reason.
   */
  description?: string

  /**
   * The associated parent return reason's ID.
   */
  parent_return_reason_id?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the return reason.
 */
export interface UpdateOrderReturnReasonDTO {
  /**
   * The ID of the return reason.
   */
  id?: string

  /**
   * The label of the return reason.
   */
  label?: string

  /**
   * The unique value of the return reason.
   */
  value?: string

  /**
   * The description of the return reason.
   */
  description?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the return reason
 */
export interface ReturnReasonUpdatableFields {
  /**
   * he unique value of the return reason.
   */
  value?: string

  /**
   * The label of the return reason.
   */
  label?: string

  /**
   * The description of the return reason.
   */
  description?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the return reason with filters
 * specifying which return reasons to update.
 */
export interface UpdateOrderReturnReasonWithSelectorDTO {
  /**
   * The filters specifying which return reasons to update.
   */
  selector: Partial<OrderReturnReasonDTO>

  /**
   * The data of the return reasons to update.
   */
  data: Partial<UpdateOrderReturnReasonDTO>
}
