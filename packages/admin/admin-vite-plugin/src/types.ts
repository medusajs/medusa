import type { ContainerId, FormId, InjectionZone } from "@medusajs/admin-shared"
import type * as Vite from "vite"

export type ExtensionGraph = Map<string, Set<string>>

export type LoadModuleOptions =
  | {
      type: "widget"
      get: InjectionZone
    }
  | {
      type: "form"
      get: FormId
    }
  | {
      type: "container"
      get: ContainerId
    }
  | {
      type: "route"
      get: "page" | "link"
    }

export interface MedusaVitePluginOptions {
  sources?: string[]
}

export type MedusaVitePlugin = (config?: MedusaVitePluginOptions) => Vite.Plugin
