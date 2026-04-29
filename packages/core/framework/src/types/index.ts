import "@medusajs/utils"
export * from "@medusajs/types"

import type { ModuleOptions as ModuleOptionsType } from "@medusajs/types"

// Re-declare ModuleOptions to enable augmentation from @medusajs/framework/types
// EventBusEventsOptions is exported via "export *" and gets augmentations from @medusajs/utils
export interface ModuleOptions extends ModuleOptionsType {}
