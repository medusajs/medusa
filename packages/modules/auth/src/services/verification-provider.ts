import {
  AuthTypes,
  Context,
  IAuthVerificationProvider,
  Logger,
} from "@medusajs/framework/types"
import { AuthVerificationProviderRegistrationPrefix } from "@types"

type InjectedDependencies = {
  logger?: Logger
  [
    key: `${typeof AuthVerificationProviderRegistrationPrefix}${string}`
  ]: IAuthVerificationProvider
}

export default class AuthVerificationProviderService {
  protected dependencies: InjectedDependencies
  #logger: Logger

  constructor(container: InjectedDependencies) {
    this.dependencies = container
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  protected retrieveProviderRegistration(
    provider: string
  ): IAuthVerificationProvider {
    try {
      return this.dependencies[
        `${AuthVerificationProviderRegistrationPrefix}${provider}`
      ] as IAuthVerificationProvider
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the verification provider with id: ${provider}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the verification provider with id: ${provider}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }

  async request(
    provider: string,
    data: AuthTypes.RequestAuthVerificationDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.RequestAuthVerificationResponse> {
    return await this.retrieveProviderRegistration(provider).request(
      data,
      sharedContext
    )
  }

  async confirm(
    provider: string,
    data: AuthTypes.ConfirmAuthVerificationDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ConfirmAuthVerificationResponse> {
    return await this.retrieveProviderRegistration(provider).confirm(
      data,
      sharedContext
    )
  }
}
