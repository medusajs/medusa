import "@zjedene-medusa/utils"
export * from "@zjedene-medusa/types"

import type { ModuleOptions as ModuleOptionsType } from "@zjedene-medusa/types"

// Re-declare ModuleOptions to enable augmentation from @zjedene-medusa/framework/types
// EventBusEventsOptions is exported via "export *" and gets augmentations from @zjedene-medusa/utils
export interface ModuleOptions extends ModuleOptionsType {}
