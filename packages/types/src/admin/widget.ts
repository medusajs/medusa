import { IBaseExtension, IBaseLoadedExtension } from "./common"
import { FeatureFlagHelpers, Navigate, Notify } from "./helpers"

export interface Widget extends IBaseExtension {}

export type DomainKey = "product" | "product_collection" | "order" | "customer"

export type HookPointKey = "details"

type HookPoint = {
  [key in HookPointKey]?: Widget[]
}

export type WidgetsConfig = {
  [key in DomainKey]?: HookPoint
}

export interface LoadedWidget extends Widget, IBaseLoadedExtension {}

export interface WidgetProps {
  notify: Notify
  navigate: Navigate
  featureFlags: FeatureFlagHelpers
}
