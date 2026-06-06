import "./types"
import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { default as loadHash } from "./loaders/hash"
import { default as loadProviders } from "./loaders/providers"
import CachingModuleService from "./services/cache-module"

export default Module(Modules.CACHING, {
  service: CachingModuleService,
  loaders: [loadHash, loadProviders],
})

// Module options types
export { CachingModuleOptions } from "./types"
