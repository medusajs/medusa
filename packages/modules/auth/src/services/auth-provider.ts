import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  AuthTypes,
  Logger,
} from "@medusajs/framework/types"
import { AbstractAuthModuleProvider } from "@medusajs/framework/utils"
import {
  AuthIdentifiersRegistrationName,
  AuthProviderRegistrationPrefix,
} from "@types"

type InjectedDependencies = {
  [
    key: `${typeof AuthProviderRegistrationPrefix}${string}`
  ]: AuthTypes.IAuthProvider
  logger?: Logger
  /**
   * The list of registered auth provider instance IDs
   */
  auth_providers_identifier?: (string | undefined)[]
}

export default class AuthProviderService {
  protected dependencies: InjectedDependencies
  #logger: Logger

  constructor(container: InjectedDependencies) {
    this.dependencies = container
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  protected retrieveProviderRegistration(
    providerId: string
  ): AuthTypes.IAuthProvider {
    try {
      return this.dependencies[`${AuthProviderRegistrationPrefix}${providerId}`]
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the auth provider with id: ${providerId}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        // Log full error for debugging
        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the auth provider with id: ${providerId}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }

  /**
   * Lists the public information of every registered auth provider instance.
   * The IDs are read from the container registry populated by the providers
   * loader, and the display metadata is read from each resolved provider
   * instance. Provider options and secrets are never exposed.
   *
   * A provider instance that fails to resolve from the container is skipped
   * (with a warning) so that a single broken registration does not prevent
   * the healthy providers from being listed.
   */
  listProviders(filters?: {
    id: string | string[]
  }): AuthTypes.AuthProviderInfoDTO[] {
    let identifiers = (
      this.dependencies[AuthIdentifiersRegistrationName] ?? []
    ).filter((id): id is string => Boolean(id))

    if (filters?.id) {
      const normalizedId = Array.isArray(filters.id) ? filters.id : [filters.id]
      identifiers = identifiers.filter((id) => normalizedId.includes(id))
    }

    return identifiers
      .map((id): AuthTypes.AuthProviderInfoDTO | null => {
        let provider:
          | (AuthTypes.IAuthProvider & {
              identifier?: string
              displayName?: string
            })
          | undefined

        try {
          provider = this.retrieveProviderRegistration(id)
        } catch (error) {
          this.#logger.warn(
            `Skipping auth provider "${id}" when listing providers, as it could not be resolved: ${error.message}`
          )

          return null
        }

        return {
          id,
          identifier: provider?.identifier ?? id,
          display_name: provider?.displayName ?? id,
          flow: this.deriveFlow(provider),
        }
      })
      .filter(
        (provider): provider is AuthTypes.AuthProviderInfoDTO =>
          provider !== null
      )
  }

  /**
   * Derives the authentication flow of a provider instance. A provider is
   * `redirect`-based if it implements `validateCallback`, which exists
   * solely for the redirect/callback flow.
   */
  protected deriveFlow(
    provider?: AuthTypes.IAuthProvider
  ): "credentials" | "redirect" {
    const validateCallback = provider?.validateCallback

    const isRedirect =
      typeof validateCallback === "function" &&
      validateCallback !== AbstractAuthModuleProvider.prototype.validateCallback

    return isRedirect ? "redirect" : "credentials"
  }

  async authenticate(
    provider: string,
    auth: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.authenticate(auth, authIdentityProviderService)
  }

  async register(
    provider: string,
    auth: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.register(auth, authIdentityProviderService)
  }

  async update(
    provider: string,
    data: Record<string, unknown>,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.update(data, authIdentityProviderService)
  }

  async validateCallback(
    provider: string,
    auth: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.validateCallback(
      auth,
      authIdentityProviderService
    )
  }
}
