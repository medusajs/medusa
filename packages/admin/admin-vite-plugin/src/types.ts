import type {
  CustomFieldFormTab,
  CustomFieldModel,
  CustomFieldZone,
  InjectionZone,
} from "@medusajs/admin-shared"
import type * as Vite from "vite"

export type ExtensionGraph = Map<string, Set<string>>

export type CustomFieldLinkPath = {
  model: CustomFieldModel
}

export type CustomFieldDisplayPath = {
  model: CustomFieldModel
  zone: CustomFieldZone
}

export type CustomFieldConfigPath = {
  model: CustomFieldModel
  zone: CustomFieldZone
}

export type CustomFieldFieldPath = {
  model: CustomFieldModel
  zone: CustomFieldZone
  tab?: CustomFieldFormTab
}

export type LoadModuleOptions =
  | {
      type: "widget"
      get: InjectionZone
    }
  | {
      type: "route"
      get: "page" | "link"
    }
  | {
      type: "link"
      get: CustomFieldLinkPath
    }
  | {
      type: "field"
      get: CustomFieldFieldPath
    }
  | {
      type: "config"
      get: CustomFieldConfigPath
    }
  | {
      type: "display"
      get: CustomFieldDisplayPath
    }

export interface MedusaVitePluginOptions {
  sources?: string[]
}

export type MedusaVitePlugin = (config?: MedusaVitePluginOptions) => Vite.Plugin
