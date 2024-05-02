import { BigNumberInput } from "../totals"
import { CartDTO, CartLineItemDTO } from "./common"

/** ADDRESS START */

/**
 * The attributes in the address to be created or updated.
 */
export interface UpsertAddressDTO {
  /**
   * The associated customer's ID.
   */
  customer_id?: string

  /**
   * The company of the address.
   */
  company?: string

  /**
   * The first name of the address.
   */
  first_name?: string

  /**
   * The last name of the address.
   */
  last_name?: string

  /**
   * The first line of the address.
   */
  address_1?: string

  /**
   * The second line of the address.
   */
  address_2?: string

  /**
   * The city of the address.
   */
  city?: string

  /**
   * The ISO two country code of the address.
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
  metadata?: Record<string, unknown>
}

/**
 * The attributes to update in the address.
 */
export interface UpdateAddressDTO extends UpsertAddressDTO {
  /**
   * The ID of the address.
   */
  id: string
}

/**
 * The address to be created.
 */
export interface CreateAddressDTO extends UpsertAddressDTO {}

/** ADDRESS END */

/** CART START */

/**
 * The cart to be created.
 */
export interface CreateCartDTO {
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
   * The email of the customer that owns the cart.
   */
  email?: string

  /**
   * The currency code of the cart.
   */
  currency_code: string

  /**
   * The associated shipping address's ID.
   */
  shipping_address_id?: string

  /**
   * The associated billing address's ID.
   */
  billing_address_id?: string

  /**
   * The shipping address of the cart.
   */
  shipping_address?: CreateAddressDTO | string

  /**
   * The billing address of the cart.
   */
  billing_address?: CreateAddressDTO | string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The items of the cart.
   */
  items?: CreateLineItemDTO[]
}

/**
 * The attributes to update in the cart data.
 */
export interface UpdateCartDataDTO {
  /**
   * The associated region's ID.
   */
  region_id?: string

  /**
   * The associated customer's ID.
   */
  customer_id?: string | null

  /**
   * The associated sales channel's ID.
   */
  sales_channel_id?: string | null

  /**
   * The email of the customer that owns the cart.
   */
  email?: string | null

  /**
   * The currency code of the cart.
   */
  currency_code?: string

  /**
   * The associated shipping address's ID.
   */
  shipping_address_id?: string | null

  /**
   * The associated billing address's ID.
   */
  billing_address_id?: string | null

  /**
   * The billing address of the cart.
   */
  billing_address?: CreateAddressDTO | UpdateAddressDTO | null

  /**
   * The shipping address of the cart.
   */
  shipping_address?: CreateAddressDTO | UpdateAddressDTO | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the cart.
 */
export interface UpdateCartDTO extends UpdateCartDataDTO {
  /**
   * The ID of the cart.
   */
  id: string
}

/** CART END */

/** ADJUSTMENT START */

/**
 * The adjustment to be created.
 */
export interface CreateAdjustmentDTO {
  /**
   * The code of the promotion that lead to
   * this adjustment.
   */
  code: string

  /**
   * The amount to adjust the original amount with.
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
export interface UpdateAdjustmentDTO {
  /**
   * The ID of the adjustment.
   */
  id: string

  /**
   * The code of the promotion that lead to
   * this adjustment.
   */
  code?: string

  /**
   * The amount to adjust the original amount with.
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
export interface CreateLineItemAdjustmentDTO extends CreateAdjustmentDTO {
  /**
   * The associated item's ID.
   */
  item_id: string
}

/**
 * The attributes to update in the line item adjustment.
 */
export interface UpdateLineItemAdjustmentDTO extends UpdateAdjustmentDTO {
  /**
   * The associated item's ID.
   */
  item_id: string
}

/**
 * The attributes in the line item adjustment to be created or updated.
 */
export interface UpsertLineItemAdjustmentDTO {
  /**
   * The ID of the line item adjustment.
   */
  id?: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The code of the promotion that lead to the
   * adjustment.
   */
  code?: string

  /**
   * The amount to adjust the original amount with.
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
 * The tax line to be created.
 */
export interface CreateTaxLineDTO {
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
  rate: number

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/**
 * The attributes to update in the tax line.
 */
export interface UpdateTaxLineDTO {
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
  rate?: number

  /**
   * The associated provider's ID.
   */
  provider_id?: string
}

/**
 * The shipping method tax line to be created.
 */
export interface CreateShippingMethodTaxLineDTO extends CreateTaxLineDTO {}

/**
 * The attributes to update in the shipping method tax line.
 */
export interface UpdateShippingMethodTaxLineDTO extends UpdateTaxLineDTO {}

/**
 * The line item tax line to be created.
 */
export interface CreateLineItemTaxLineDTO extends CreateTaxLineDTO {}

/**
 * The attributes to update in the line item tax line.
 */
export interface UpdateLineItemTaxLineDTO extends UpdateTaxLineDTO {}

/** TAX LINES END */

/** LINE ITEMS START */

/**
 * The line item to be created.
 */
export interface CreateLineItemDTO {
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
   * The associated cart's ID.
   */
  cart_id?: string

  /**
   * The quantity of the line item in the cart.
   */
  quantity: BigNumberInput

  /**
   * The associated product's ID.
   */
  product_id?: string

  /**
   * The title of the associated product.
   */
  product_title?: string

  /**
   * The description of the associated product.
   */
  product_description?: string

  /**
   * The subtitle of the associated product.
   */
  product_subtitle?: string

  /**
   * The type of the associated product.
   */
  product_type?: string

  /**
   * The collection of the associated product.
   */
  product_collection?: string

  /**
   * The handle of the associated product.
   */
  product_handle?: string

  /**
   * The associated variant's ID.
   */
  variant_id?: string

  /**
   * The SKU of the associated variant.
   */
  variant_sku?: string

  /**
   * The barcode of the associated variant.
   */
  variant_barcode?: string

  /**
   * The title of the associated variant.
   */
  variant_title?: string

  /**
   * The option values of the associated variant.
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
   * Whether the line item's amount is tax inclusive.
   */
  is_tax_inclusive?: boolean

  /**
   * The calculated price of the line item after applying promotions.
   */
  compare_at_unit_price?: BigNumberInput

  /**
   * The unit price of the line item.
   */
  unit_price: BigNumberInput

  /**
   * The tax lines of the line item.
   */
  tax_lines?: CreateTaxLineDTO[]

  /**
   * The adjustments of the line item.
   */
  adjustments?: CreateAdjustmentDTO[]
}

/**
 * The line item to be created in a cart.
 */
export interface CreateLineItemForCartDTO extends CreateLineItemDTO {
  /**
   * The associated cart's ID.
   */
  cart_id: string
}

/**
 * A pair of selectors and data, where the selectors determine which
 * line items to update, and the data determines what to update
 * in the line items.
 */
export interface UpdateLineItemWithSelectorDTO {
  /**
   * Filters to specify which line items to update.
   */
  selector: Partial<CartLineItemDTO>

  /**
   * The attributes to update in the line items.
   */
  data: Partial<UpdateLineItemDTO>
}

/**
 * A pair of selectors and data, where the selectors determine which
 * carts to update, and the data determines what to update
 * in the carts.
 */
export interface UpdateCartWithSelectorDTO {
  /**
   * Filters to specify which carts to update.
   */
  selector: Partial<CartDTO>

  /**
   * The attributes to update in the carts.
   */
  data: UpdateCartDataDTO
}

/**
 * The attributes to update in a line item.
 */
export interface UpdateLineItemDTO
  extends Omit<
    CreateLineItemDTO,
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
   * The quantity of the line item in the cart.
   */
  quantity?: BigNumberInput

  /**
   * The unit price of the line item.
   */
  unit_price?: BigNumberInput

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The tax lines of the line item.
   */
  tax_lines?: UpdateTaxLineDTO[] | CreateTaxLineDTO[]

  /**
   * The adjustments of the line item.
   */
  adjustments?: UpdateAdjustmentDTO[] | CreateAdjustmentDTO[]
}

/** LINE ITEMS END */

/** SHIPPING METHODS START */

/**
 * The shipping method to be created.
 */
export interface CreateShippingMethodDTO {
  /**
   * The name of the shipping method.
   */
  name: string

  /**
   * The associated cart's ID.
   */
  cart_id: string

  /**
   * The amount of the shipping method.
   */
  amount: BigNumberInput

  /**
   * The amount of the shipping method.
   */
  shipping_option_id?: string

  /**
   * The data of the shipping method.
   */
  data?: Record<string, unknown>

  /**
   * The tax lines of the shipping method.
   */
  tax_lines?: CreateTaxLineDTO[]

  /**
   * The adjustments of the shipping method.
   */
  adjustments?: CreateAdjustmentDTO[]
}

/**
 * The shipping method to be created in a cart.
 */
export interface CreateShippingMethodForSingleCartDTO {
  /**
   * The name of the shipping method.
   */
  name: string

  /**
   * The amount of the shipping method.
   */
  amount: BigNumberInput

  /**
   * The amount of the shipping method.
   */
  shipping_option_id?: string

  /**
   * The data of the shipping method.
   */
  data?: Record<string, unknown>

  /**
   * The tax lines of the shipping method.
   */
  tax_lines?: CreateTaxLineDTO[]

  /**
   * The adjustments of the shipping method.
   */
  adjustments?: CreateAdjustmentDTO[]
}

/**
 * The attributes to update in the shipping method.
 */
export interface UpdateShippingMethodDTO {
  /**
   * The ID of the shipping method.
   */
  id: string

  /**
   * The name of the shipping method.
   */
  name?: string

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
  tax_lines?: UpdateTaxLineDTO[] | CreateTaxLineDTO[]

  /**
   * The adjustments of the shipping method.
   */
  adjustments?: CreateAdjustmentDTO[] | UpdateAdjustmentDTO[]
}

/**
 * The shipping method adjustment to be created.
 */
export interface CreateShippingMethodAdjustmentDTO {
  /**
   * The associated shipping method's ID.
   */
  shipping_method_id: string

  /**
   * The code of the promotion that lead to
   * this adjustment.
   */
  code: string

  /**
   * The amount to adjust the original amount with.
   */
  amount: BigNumberInput

  /**
   * The description of the shipping method adjustment.
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
export interface UpdateShippingMethodAdjustmentDTO {
  /**
   * The ID of the shipping method adjustment.
   */
  id: string

  /**
   * The code of the promotion that lead to
   * this adjustment.
   */
  code?: string

  /**
   * The amount to adjust the original amount with.
   */
  amount?: BigNumberInput

  /**
   * The description of the shipping method adjustment.
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
