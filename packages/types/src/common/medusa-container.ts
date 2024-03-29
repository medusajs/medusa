import { AwilixContainer } from "awilix"

/**
 * The Medusa Container extends [Awilix](https://github.com/jeffijoe/awilix) to 
 * provide dependency injection functionalities.
 */
export type MedusaContainer = AwilixContainer & {
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
