import { IBaseExtension, IBaseLoadedExtension } from "./common"
import { FeatureFlagHelpers, Navigate, Notify } from "./helpers"

export interface Widget extends IBaseExtension {}

export type DomainKey =
  | "product"
  | "product_collection"
  | "order"
  | "draft_order"
  | "customer"
  | "customer_group"
  | "discount"
  | "price_list"
  | "gift_card"

export type StumbDomainKey = "custom_gift_card"

export type PageKey = "login"

export type HookPointKey = "details" | "list"

export type PagePointKey = "before" | "after"

export type HookPoint = {
  [key in HookPointKey]?: Widget[]
}

export type PagePoint = {
  [key in PagePointKey]?: Widget[]
}

export type WidgetConfigKey = DomainKey | StumbDomainKey | PageKey

export type WidgetsConfig = {
  [key in DomainKey]?: HookPoint
} & {
  [key in StumbDomainKey]?: Widget[]
} & {
  [key in PageKey]?: PagePoint
}

export interface LoadedWidget extends Widget, IBaseLoadedExtension {}

export interface WidgetProps {
  notify: Notify
  navigate: Navigate
  featureFlags: FeatureFlagHelpers
}
