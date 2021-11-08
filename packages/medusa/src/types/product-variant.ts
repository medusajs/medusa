import { ProductVariant } from "../models/product-variant"
import { PartialPick, DateFilter } from "./common"

export interface IProductVariantPrice {
  currency_code?: string
  region_id?: string
  amount: number
  sale_amount?: number | undefined
}

export interface IProductVariantOption {
  option_id: string
  value: string
}

export interface CreateProductVariantInput {
  title?: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  variant_rank?: number
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options: IProductVariantOption[]
  prices: IProductVariantPrice[]
  metadata?: JSON
}

export interface UpdateProductVariantInput {
  title?: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options: IProductVariantOption[]
  prices: IProductVariantPrice[]
  metadata?: JSON
}

export type FilterableProductVariantProps = PartialPick<
  ProductVariant,
  | "title"
  | "product_id"
  | "sku"
  | "barcode"
  | "ean"
  | "upc"
  | "inventory_quantity"
  | "allow_backorder"
  | "manage_inventory"
  | "hs_code"
  | "origin_country"
  | "mid_code"
  | "material"
  | "weight"
  | "length"
  | "height"
  | "width"
> & {
  q?: string
  created_at?: DateFilter
  updated_at?: DateFilter
}
