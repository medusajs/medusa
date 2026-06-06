import {
  Constructor,
  ICachingProviderService,
  Logger,
} from "@zjedene-medusa/framework/types"
import { MedusaError } from "@zjedene-medusa/framework/utils"
import { CachingProviderRegistrationPrefix } from "../types"

type InjectedDependencies = {
  [key: `cp_${string}`]: ICachingProviderService
  logger?: Logger
}

export default class CacheProviderService {
  #container: InjectedDependencies
  #logger: Logger

  constructor(container: InjectedDependencies) {
    this.#container = container
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<ICachingProviderService>
  ) {
    if (!(providerClass as any).identifier) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Trying to register a caching provider without an identifier.`
      )
    }
    return `${(providerClass as any).identifier}`
  }

  public retrieveProvider(providerId: string): ICachingProviderService {
    try {
      return this.#container[
        `${CachingProviderRegistrationPrefix}${providerId}`
      ]
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
 Unable to retrieve the caching provider with id: ${providerId}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        // Log full error for debugging
        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the caching provider with id: ${providerId}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }
}
