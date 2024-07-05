import { Constructor } from "./index"

export type ModuleProviderExports = {
  services: Constructor<any>[]
}

export type ModuleProvider = {
  resolve: string | ModuleProviderExports
  provider_name?: string
  options: Record<string, unknown>
}
