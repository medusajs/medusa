import { AwilixContainer, ResolveOptions } from "awilix"

/**
 * The following interface acts as a bucket that other modules or the
 * utils package can fill using declaration merging
 */
export interface ModuleImplementations {}

/**
 * The Medusa Container extends [Awilix](https://github.com/jeffijoe/awilix) to
 * provide dependency injection functionalities.
 */
export type MedusaContainer<Cradle extends object = ModuleImplementations> =
  Omit<AwilixContainer, "resolve"> & {
    resolve<K extends keyof Cradle>(
      key: K,
      resolveOptions?: ResolveOptions
    ): Cradle[K]
    resolve<T>(key: string, resolveOptions?: ResolveOptions): T

    /**
     * @ignore
     */
    registerAdd: <T>(name: string, registration: T) => MedusaContainer
    /**
     * @ignore
     */
    createScope: () => MedusaContainer
  }

export type ContainerLike = {
  resolve<T = unknown>(key: string): T
}
