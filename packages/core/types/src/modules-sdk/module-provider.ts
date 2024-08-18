import { Constructor } from "./index";

export type ModuleProviderExports = {
  services: Constructor<any>[]
  loaders?: ((options: { container: any; options: Record<string, unknown> }) => Promise<void>)[]
}

export type ModuleProvider = {
  resolve: string | ModuleProviderExports
  id: string
  options?: Record<string, unknown>
}
