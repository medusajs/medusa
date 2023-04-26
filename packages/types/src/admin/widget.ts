import { IBaseExtension, IBaseLoadedExtension } from "./common"

export interface Widget extends IBaseExtension {}

export type DomainKey =
  | "product"
  | "product_category"
  | "product_collection"
  | "order"
  | "customer"
  | "customer_group"
  | "price_list"

export type HookPointKey = "details"

type HookPoint = {
  [key in HookPointKey]?: Widget[]
}

export type WidgetsConfig = {
  [key in DomainKey]?: HookPoint
}

export interface LoadedWidget extends Widget, IBaseLoadedExtension {}
