export type Option = {
  value: string
  label: string
}

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

export type DateFilter = null | {
  gt?: string
  lt?: string
}

export enum TaxRateType {
  REGION = "region",
  RATE = "rate",
}

export type PaginationProps = {
  limit: number
  offset: number
}

export type Idable = { id: string; [x: string]: any }

export type Role = {
  value: "admin" | "member" | "developer"
  label: string
}

export type ShippingOptionPriceType = {
  value: "flat_rate" | "calculated" | "free_shipping"
  label: string
}

export type FormImage = {
  url: string
  name?: string
  size?: number
  nativeFile?: File
}

export interface DragItem {
  index: number
  id: string
  type: string
}

export enum BalanceType {
  PLATFORM = "PLATFORM",
  VENDOR = "VENDOR",
  STORE = "STORE",
}

export enum BalanceEventType {
  ORDER_PLACED = "ORDER_PLACED",
  ORDER_REFUND = "ORDER_REFUND",
  LABEL_PURCHASE = "LABEL_PURCHASE",
  LABEL_REFUND = "LABEL_REFUND",
}

export enum BalanceTransactionType {
  ORDER_SALE = "ORDER_SALE",
  ORDER_REFUND = "ORDER_REFUND",
  TRANSACTION_FEE = "TRANSACTION_FEE",
  TRANSACTION_FEE_REFUND = "TRANSACTION_FEE_REFUND",
  STORE_FEE = "STORE_FEE",
  STORE_FEE_REFUND = "STORE_FEE_REFUND",
  PLATFORM_FEE = "PLATFORM_FEE",
  PLATFORM_FEE_REFUND = "PLATFORM_FEE_REFUND",
  SHIPPING_LABEL_PURCHASE = "SHIPPING_LABEL_PURCHASE",
  SHIPPING_LABEL_REFUND = "SHIPPING_LABEL_REFUND",
  PAYOUT = "PAYOUT",
}

export enum BalanceTransactionStatus {
  PENDING = "PENDING",
  SETTLED = "SETTLED",
  DELETED = "DELETED",
}

export enum PostType {
  POST = "post",
  PAGE = "page",
  PRODUCT = "product",
  REVISION = "revision",
}

export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum PostContentMode {
  BASIC = "basic",
  ADVANCED = "advanced",
}

export enum PostSectionType {
  BUTTON_LIST = "button_list",
  CTA = "cta",
  HEADER = "header",
  HERO = "hero",
  PRODUCT_CAROUSEL = "product_carousel",
  PRODUCT_GRID = "product_grid",
  RAW_HTML = "raw_html",
  RICH_TEXT = "rich_text",
}

export enum PostSectionStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum ShippingProfileType {
  DEFAULT = "default",
  GIFT_CARD = "gift_card",
  CUSTOM = "custom",
  VENDOR_DEFAULT = "vendor_default",
}

export enum ButtonStyleVariant {
  DEFAULT = "default",
  PRIMARY = "primary",
  LINK = "link",
}

export interface ColorRange {
  DEFAULT: string
  "50": string
  "100": string
  "200": string
  "300": string
  "400": string
  "500": string
  "600": string
  "700": string
  "800": string
  "900": string
}

export interface Font {
  family: string
  variants: (string | undefined)[]
  subsets: string[]
  version: string
  lastModified: string
  files: Record<string, string>
  category: string
  kind: string
}
