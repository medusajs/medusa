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
  value: "flat_rate" | "calculated"
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
