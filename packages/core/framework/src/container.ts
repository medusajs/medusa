import { createMedusaContainer } from "@medusajs/utils"
import { AwilixContainer, ResolveOptions } from "awilix"
import { ModuleImplementations } from "@medusajs/types"

/**
 * The Medusa Container extends [Awilix](https://github.com/jeffijoe/awilix) to
 * provide dependency injection functionalities.
 */
// export type MedusaContainer<Cradle extends object = TransformObjectMethodToAsync<ModuleImplementations>> =
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

export const container = createMedusaContainer()
