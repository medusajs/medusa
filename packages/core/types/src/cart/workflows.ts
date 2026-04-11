import { CustomerDTO } from "../customer"
import { ShippingOptionDTO } from "../fulfillment"
import { PaymentCollectionDTO } from "../payment"
import { ProductDTO } from "../product"
import { RegionDTO } from "../region"
import { BigNumberInput } from "../totals"
import { CartDTO } from "./common"
import {
  CreateAddressDTO,
  UpdateAddressDTO,
  UpdateLineItemDTO,
} from "./mutations"

/**
 * The details of the line item to create.
 */
export interface CreateCartCreateLineItemDTO {
  /**
   * The quantity of the line item.
   */
  quantity: BigNumberInput

  /**
   * The ID of the variant to be added to the cart.
   */
  variant_id?: string

  /**
   * The title of the line item.
   */
  title?: string

  /**
   * The subtitle of the line item.
   */
  subtitle?: string

  /**
   * The thumbnail URL of the line item.
   */
  thumbnail?: string

  /**
   * The ID of the product whose variant is being added to the cart.
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
   * The ID of the associated product's type.
   */
  product_type?: string

  /**
   * The ID of the associated product's collection.
   */
  product_collection?: string

  /**
   * The handle of the associated product.
   */
  product_handle?: string

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
   * The associated variant's values for the product's options.
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
   * Whether the line item's price is tax inclusive. Learn more in
   * [this documentation](https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing)
   */
  is_tax_inclusive?: boolean

  /**
   * Whether the line item is a gift card.
   */
  is_giftcard?: boolean

  /**
   * The original price of the item before a promotion or sale.
   */
  compare_at_unit_price?: BigNumberInput

  /**
   * The price of a single quantity of the item.
   */
  unit_price?: BigNumberInput

  /**
   * Custom key-value pairs related to the item.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The details of the line item to update.
 */
export interface UpdateLineItemInCartWorkflowInputDTO {
  /**
   * The ID of the cart that the line item belongs to.
   */
  cart_id: string
  /**
   * The ID of the line item to update.
   */
  item_id: string
  /**
   * The details to update in the line item.
   */
  update: Partial<UpdateLineItemDTO>
}

/**
 * The details of the address to create.
 */
export interface CreateCartAddressDTO {
  /**
   * The first name of the customer associated with the address.
   */
  first_name?: string

  /**
   * The last name of the customer associated with the address.
   */
  last_name?: string

  /**
   * The address's phone number
   */
  phone?: string

  /**
   * The address's company name.
   */
  company?: string

  /**
   * The primary address line.
   */
  address_1?: string

  /**
   * The secondary address line.
   */
  address_2?: string

  /**
   * The city of the address.
   */
  city?: string

  /**
   * The country code of the address.
   *
   * @example us
   */
  country_code?: string

  /**
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province or state of the address.
   */
  province?: string

  /**
   * The postal code of the address.
   */
  postal_code?: string

  /**
   * Custom key-value pairs related to the address.
   */
  metadata?: Record<string, unknown>
}

/**
 * The details of a cart to create.
 */
export interface CreateCartWorkflowInputDTO {
  /**
   * The ID of the region that the cart belongs to.
   * If not provided, the default region of the store is used.
   * If the store doesn't have a default region, an error is thrown.
   */
  region_id?: string

  /**
   * The ID of the customer associated with the cart.
   */
  customer_id?: string

  /**
   * The ID of the sales channel through which the cart is created.
   */
  sales_channel_id?: string

  /**
   * The email address of the cart's customer.
   */
  email?: string

  /**
   * The currency code of the cart. This defaults to the region's currency code.
   *
   * @example usd
   */
  currency_code?: string

  /**
   * The ID of the associated shipping address.
   */
  shipping_address_id?: string

  /**
   * The ID of the associated billing address.
   */
  billing_address_id?: string

  /**
   * The ID of an existing shipping address, or the details of a shipping address to create.
   */
  shipping_address?: CreateCartAddressDTO | string

  /**
   * The ID of an existing billing address, or the details of a billing address to create.
   */
  billing_address?: CreateCartAddressDTO | string

  /**
   * Custom key-value pairs related to the cart.
   */
  metadata?: Record<string, unknown>

  /**
   * The items to be added to the cart.
   */
  items?: CreateCartCreateLineItemDTO[]

  /**
   * The promotional codes applied on the cart.
   */
  promo_codes?: string[]

  /**
   * The locale code of the cart in BCP 47 format.
   * 
   * @since 2.12.3
   * 
   * @example
   * "en-US"
   */
  locale?: string
}

/**
 * The details of adding items to the cart.
 */
export interface AddToCartWorkflowInputDTO {
  /**
   * The ID of the cart to add items to.
   */
  cart_id: string
  /**
   * The items to add to the cart.
   */
  items: CreateCartCreateLineItemDTO[]
}

/**
 * The details to update in a cart.
 */
export interface UpdateCartWorkflowInputDTO {
  /**
   * The ID of the cart to update.
   */
  id: string

  /**
   * An array of promotional codes applied on the cart.
   */
  promo_codes?: string[]

  /**
   * The ID of the cart's region.
   */
  region_id?: string

  /**
   * The ID of the cart's customer.
   */
  customer_id?: string | null

  /**
   * The ID of the cart's sales channel.
   */
  sales_channel_id?: string | null

  /**
   * The email address of the cart's customer.
   */
  email?: string | null

  /**
   * The currency code for the cart.
   *
   * @example usd
   */
  currency_code?: string

  /**
   * The locale code for the cart in BCP 47 format.
   * 
   * @since 2.12.3
   * 
   * @example
   * "en-US"
   */
  locale?: string | null

  /**
   * Custom key-value pairs of data related to the cart.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The cart's shipping address. You can either update the cart's existing shipping address, or create a new one.
   */
  shipping_address?: CreateAddressDTO | UpdateAddressDTO | null

  /**
   * The cart's billing address. You can either update the cart's existing billing address, or create a new one.
   */
  billing_address?: CreateAddressDTO | UpdateAddressDTO | null
}

/**
 * The details to create the payment collection.
 */
export interface CreatePaymentCollectionForCartWorkflowInputDTO {
  /**
   * The ID of the cart to create a payment collection for.
   */
  cart_id: string

  /**
   * Custom key-value pairs to store in the payment collection.
   */
  metadata?: Record<string, unknown>
}

/**
 * A cart's details.
 */
export interface CartWorkflowDTO extends CartDTO {
  /**
   * The cart's customer.
   */
  customer?: CustomerDTO
  /**
   * The cart's product to be added.
   */
  product?: ProductDTO
  /**
   * The cart's region.
   */
  region?: RegionDTO
}

export interface ListShippingOptionsForCartWorkflowInputDTO {
  cart_id: string
  is_return: boolean
  sales_channel_id?: string
  region_id?: string
  currency_code: string
  shipping_address: {
    city?: string
    country_code?: string
    province?: string
  }
}

export interface PricedShippingOptionDTO extends ShippingOptionDTO {
  amount: BigNumberInput
}

export interface CompleteCartWorkflowInputDTO {
  id: string
}

/**
 * The details necessary to check whether the variant has sufficient inventory.
 */
export interface ConfirmVariantInventoryWorkflowInputDTO {
  /**
   * The ID of the sales channel to check the inventory availability in.
   */
  sales_channel_id: string
  /**
   * The variants to confirm they have sufficient in-stock quantity.
   */
  variants: {
    /**
     * The variant's ID.
     */
    id: string
    /**
     * Whether Medusa manages the inventory of the variant. If disabled, the
     * variant is always considered in stock.
     */
    manage_inventory: boolean
    /**
     * The variant's inventory items, if {@link manage_inventory} is enabled.
     */
    inventory_items: {
      /**
       * The ID of the inventory item.
       */
      inventory_item_id: string
      /**
       * The ID of the variant.
       */
      variant_id: string
      /**
       * The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
       * value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
       */
      required_quantity: BigNumberInput
      /**
       * The inventory details.
       */
      inventory: {
        /**
         * The inventory details at specified stock locations.
         */
        location_levels: {
          /**
           * The stock location's details.
           */
          stock_locations: {
            /**
             * The stock location's ID.
             */
            id: string
            /**
             * The associated sales channel's details.
             */
            sales_channels: {
              /**
               * The sales channel's ID.
               */
              id: string
            }[]
          }[]
        }
      }[]
    }[]
  }[]
  /**
   * The items in the cart, or to be added.
   */
  items: {
    /**
     * The ID of the associated variant.
     */
    variant_id?: string | null
    /**
     * The quantity in the cart.
     */
    quantity: BigNumberInput
    /**
     * The ID of the line item if it's already in the cart.
     */
    id?: string
  }[]
  /**
   * The new quantity of the variant to be added to the cart.
   * This is useful when updating a variant's quantity in the cart.
   */
  itemsToUpdate?:
    | {
        /**
         * The item update's details.
         */
        data: {
          /**
           * The ID of the associated variant.
           */
          variant_id?: string
          /**
           * The variant's quantity.
           */
          quantity?: BigNumberInput
        }
      }[]
    | {
        /**
         * The ID of the associated variant.
         */
        variant_id?: string
        /**
         * The variant's quantity.
         */
        quantity?: BigNumberInput
      }[]
}

export interface CartWorkflowDTO {
  id: string
  payment_collection: PaymentCollectionDTO
}

export type CreateCartCreditLinesWorkflowInput = {
  /**
   * The ID of the cart that the credit line belongs to.
   */
  cart_id: string

  /**
   * The amount of the credit line.
   */
  amount: number

  /**
   * The reference model name that the credit line is generated from
   */
  reference: string | null

  /**
   * The reference model id that the credit line is generated from
   */
  reference_id: string | null

  /**
   * The metadata of the cart detail
   */
  metadata: Record<string, unknown> | null
}[]
