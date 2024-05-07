import { CustomerDTO } from "../customer"
import { ShippingOptionDTO } from "../fulfillment"
import { PaymentCollectionDTO } from "../payment"
import { ProductDTO } from "../product"
import { RegionDTO } from "../region"
import { BigNumberInput } from "../totals"
import { CartDTO, CartLineItemDTO } from "./common"
import { UpdateLineItemDTO } from "./mutations"

export interface CreateCartCreateLineItemDTO {
  quantity: BigNumberInput
  variant_id: string
  title?: string

  subtitle?: string
  thumbnail?: string

  product_id?: string
  product_title?: string
  product_description?: string
  product_subtitle?: string
  product_type?: string
  product_collection?: string
  product_handle?: string

  variant_sku?: string
  variant_barcode?: string
  variant_title?: string
  variant_option_values?: Record<string, unknown>

  requires_shipping?: boolean
  is_discountable?: boolean
  is_tax_inclusive?: boolean
  is_giftcard?: boolean

  compare_at_unit_price?: BigNumberInput
  unit_price?: BigNumberInput

  metadata?: Record<string, unknown>
}

export interface UpdateLineItemInCartWorkflowInputDTO {
  cart: CartDTO
  item: CartLineItemDTO
  update: Partial<UpdateLineItemDTO>
}

export interface CreateCartAddressDTO {
  first_name?: string
  last_name?: string
  phone?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  metadata?: Record<string, unknown>
}

export interface CreateCartWorkflowInputDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string
  shipping_address_id?: string
  billing_address_id?: string
  shipping_address?: CreateCartAddressDTO | string
  billing_address?: CreateCartAddressDTO | string
  metadata?: Record<string, unknown>

  items?: CreateCartCreateLineItemDTO[]
  promo_codes?: string[]
}

export interface AddToCartWorkflowInputDTO {
  items: CreateCartCreateLineItemDTO[]
  cart: CartWorkflowDTO
}

export interface UpdateCartWorkflowInputDTO {
  id: string
  promo_codes?: string[]
  region_id?: string
  customer_id?: string | null
  sales_channel_id?: string | null
  email?: string | null
  currency_code?: string
  metadata?: Record<string, unknown> | null
}

export interface CreatePaymentCollectionForCartWorkflowInputDTO {
  cart_id: string
  region_id: string
  currency_code: string
  amount: BigNumberInput
  metadata?: Record<string, unknown>
}

export interface CartWorkflowDTO extends CartDTO {
  customer?: CustomerDTO
  product?: ProductDTO
  region?: RegionDTO
}

export interface ListShippingOptionsForCartWorkflowInputDTO {
  cart_id: string
  sales_channel_id?: string
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

export interface ConfirmVariantInventoryWorkflowInputDTO {
  sales_channel_id: string
  variants: {
    id: string
    manage_inventory: boolean
    inventory_items: {
      inventory_item_id: string
      variant_id: string
      required_quantity: BigNumberInput
      inventory: {
        location_levels: {
          stock_locations: {
            id: string
            sales_channels: {
              id: string
            }[]
          }[]
        }
      }[]
    }[]
  }[]
  items: {
    variant_id?: string
    quantity: BigNumberInput
  }[]
}

export interface CartWorkflowDTO {
  id: string
  payment_collection: PaymentCollectionDTO
}
