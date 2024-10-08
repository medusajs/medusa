import { Constructor } from "./index"

export type ModuleProviderExports = {
  services: Constructor<any>[]
}

export type ModuleProvider = {
  resolve: string | ModuleProviderExports
  id: string
  options?: Record<string, unknown>
}
