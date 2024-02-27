export * from "./common"
export * from "./internal-module-service"
export * from "./module-provider"

export * from "./medusa-app"

export type Constructor<T> = new (...args: any[]) => T

export type ModuleProviderExports = {
  services: Constructor<any>[]
}

export type ModuleProvider = {
  resolve: string | ModuleProviderExports
  provider_name?: string
  options: Record<string, unknown>
}
