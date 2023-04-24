import type {
  AdminPostProductsReq as MedusaAdminPostProductsReq,
  AdminGetProductsParams as MedusaAdminGetProductsParams,
  AdminGetOrdersParams as MedusaAdminGetOrdersParams,
  Product as MedusaProduct,
  Order as MedusaOrder,
  Store as MedusaStore,
  Discount as MedusaDiscount,
  AdminPostDiscountsDiscountReq as MedusaAdminPostDiscountsDiscountReq,
  Image,
  LineItem as MedusaLineItem,
  Address,
  ShippingProfile as MedusaShippingProfile,
  User,
  AdminPostShippingOptionsReq as MedusaAdminPostShippingOptionsReq,
  ShippingOption as MedusaShippingOption,
  MoneyAmount,
  Country,
} from "@medusajs/medusa"
import { TransitTimeTypeEnum } from "../domain/discounts/types"
import {
  BalanceType,
  BalanceEventType,
  BalanceTransactionType,
  BalanceTransactionStatus,
  PostType,
  PostStatus,
  PostContentMode,
  PostSectionType,
  PostSectionStatus,
  ButtonStyleVariant,
  ColorRange,
  Font,
} from "./shared"
import { LanguageCode } from "./languages"

/* eslint-disable no-unused-vars */
declare module "@medusajs/medusa" {
  export interface TaxRegion {
    id: string
    country: Country
    country_code: string
    province_name: string
    province_code: string
    created_at: string
    updated_at: string
  }

  export interface ConfiguredTaxRegion {
    id: string
    tax_region: TaxRegion
    tax_region_id: string
    configured: boolean
    registered_tax_id?: string | null
    created_at: string
    updated_at: string
  }

  export interface SiteSettings {
    header_code?: string
    footer_code?: string
    description?: string
    storefront_url?: string
    primary_theme_colors?: ColorRange
    accent_theme_colors?: ColorRange
    highlight_theme_colors?: ColorRange
    display_font?: Font
    body_font?: Font
    favicon?: string
    include_site_name_beside_logo?: boolean
    social_instagram?: string
    social_youtube?: string
    social_facebook?: string
    social_twitter?: string
    social_linkedin?: string
    social_pinterest?: string
    social_tiktok?: string
    social_snapchat?: string
  }

  export interface Price {
    id?: string | null
    amount: number | null
    currency_code: string
    region_id: string | null
    includes_tax?: boolean
  }

  export interface AdminPostProductsReq extends MedusaAdminPostProductsReq {
    vendor_id?: string
    profile_id?: string
    default_price: Price[]
    tax_category_id?: string | null
    customer_response_prompt?: string | null
  }

  export interface Order extends MedusaOrder {
    vendor?: Vendor
    order_parent_id?: string
    vendor_id?: string
    children?: Order[]
  }

  export interface AdminGetProductsParams extends MedusaAdminGetProductsParams {
    vendor_id?: string | string[]
  }

  export interface AdminGetOrdersParams extends MedusaAdminGetOrdersParams {
    order_parent_id?: string
    vendor_id?: string
  }

  export interface ProductTaxCategory {
    id: string
    name: string
    description?: string
    tax_jar_code: string
    created_at: string
    updated_at: string
  }

  export interface Product extends MedusaProduct {
    vendor_id: string
    prices: MoneyAmount[]
    customer_response_prompt: string | null
    default_price: Price[]
    tax_category?: ProductTaxCategory
  }

  export interface LineItem extends MedusaLineItem {
    customer_product_response: string | null
  }

  export interface RichTextContent {
    blocks?: Record<string, any>[]
    time?: number
  }

  export interface TranslatableRichTextField {
    value: RichTextContent
    translations?: {
      [key in LanguageCode]?: RichTextContent
    }
  }

  export interface TranslatableField {
    value: string
    translations?: {
      [key in LanguageCode]?: string
    }
  }

  export class ImageField {
    url: string
    alt?: TranslatableField
  }

  export interface CustomAction {
    label: string | TranslatableField
    url: string
    new_tab?: boolean
    style_variant?: ButtonStyleVariant
  }

  export interface Vendor {
    id: string
    name: string
    handle?: string
    description?: string
    email?: string
    return_policy?: string
    logo_id?: string
    logo?: Image
    location?: string
    status: string
    created_at: string
    updated_at: string
    store_percent_fee: number
    store_flat_fee: number
    balance_id: string
    country_code: string
    country: Country
  }

  export interface FulfillmentOption {
    provider_id: string
    options: ProviderOption[]
    configured: boolean
  }

  export interface ProviderOption {
    id: string
    is_return?: boolean
    transit_time?: string
    name?: string
    provider_id?: string
  }

  export interface Location {
    id: string
    name: string
    address_id: string
    address: Address
    vendor_id: string
    created_at: string
    updated_at: string
  }

  export interface ShipEngineCurrency {
    currency: string
    amount: number
  }

  export interface ShipEngineRate {
    rate_id: string
    rate_type: "check" | "shipment"
    carrier_id: string
    shipping_amount: ShipEngineCurrency
    insurance_amount: ShipEngineCurrency
    confirmation_amount: ShipEngineCurrency
    other_amount: ShipEngineCurrency
    tax_amount: ShipEngineCurrency
    zone: number
    package_type?: string
    delivery_days: number
    guaranteed_service: boolean
    estimated_delivery_date: Date
    carrier_delivery_days: string
    ship_date: Date
    negotiated_rate: boolean
    service_type: string
    service_code: string
    carrier_nickname: string
    carrier_friendly_name: string
    validation_status: "valid" | "invalid" | "has_warnings" | "unknown"
    warning_messages: string[]
    error_messages: string[]
  }

  export interface NavigationItem {
    id: string
    label: string
    url: string
    sort_order: number
    location: "header" | "footer"
    new_tab: boolean
  }

  export interface Post {
    id: string
    type: PostType
    featured_image_id?: string
    featured_image?: Image
    title?: string
    excerpt?: string
    content?: any
    content_mode: PostContentMode
    sections: PostSection[]
    tags: PostTag[]
    authors: User[]
    handle: string
    status: PostStatus
    is_home_page?: boolean
    product_id?: string
    last_updated_by_id?: string
    last_updated_by?: User
    root_id?: string
    root?: Post
    created_at: Date
    updated_at: Date
    archived_at?: Date
    published_at?: Date
  }

  export interface PostTag {
    id: string
    label: string
    handle: string
    created_by_id?: string
    created_by?: User
    created_at: Date
    updated_at: Date
  }

  export interface PostSection {
    id: string
    type: PostSectionType
    name: string
    content: any
    styles: any
    settings: any
    status: PostSectionStatus
    is_reusable: boolean
    usage_count: number
    last_updated_by_id?: string
    last_updated_by?: User
    created_at: Date
    updated_at: Date
  }

  export interface AdminPostShippingOptionsReq
    extends MedusaAdminPostShippingOptionsReq {
    transit_time?: string
  }

  export interface ShippingOption extends MedusaShippingOption {
    transit_time: TransitTimeTypeEnum
  }

  export interface ShippingProfile extends MedusaShippingProfile {
    vendor_id: string
    vendor: Vendor
    default_address_id: string
    default_address: Address
  }

  export class BalanceEvent {
    id: string
    type: BalanceEventType
    order_id?: string
    refund_id?: string
    fulfillment_id?: string
    return_id?: string
    created_at: Date
  }

  export interface BalanceTransaction {
    id: string
    event_id: string
    event: BalanceEvent
    status: BalanceTransactionStatus
    description: string
    type: BalanceTransactionType
    from_balance_id: string
    to_balance_id: string
    from: Balance
    to: Balance
    amount: number
    created_at: Date
  }

  export class Balance {
    id: string
    type: BalanceType
    name: string
    vendor_id?: string
    store_id?: string
    vendor?: Vendor
    store?: Store
  }

  export type BalanceWithAmounts = Balance & {
    total_amount: number
    total_credits: number
    total_debits: number
    pending_debits: number
    pending_credits: number
    available_amount: number
    pending_amount: number
  }

  export interface StoreFees {
    id: string
    platform_percent_fee: number
    platform_flat_fee: number
    default_store_percent_fee: number
    default_store_flat_fee: number
    transaction_percent_fee: number
    transaction_flat_fee: number
    store_id: string
  }

  export interface Store extends MedusaStore {
    primary_vendor: Vendor
    primary_vendor_id: string
    type: "markethaus" | "whitelabel" | "enterprise"
  }

  export interface Discount extends MedusaDiscount {
    customer_usage_limit: number | null
  }

  export interface AdminPostDiscountsDiscountReq
    extends MedusaAdminPostDiscountsDiscountReq {
    customer_usage_limit?: number | null
  }
}
