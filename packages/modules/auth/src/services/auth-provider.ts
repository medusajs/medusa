import {
  AuthIdentityProviderService,
  AuthTypes,
  AuthenticationInput,
  AuthenticationResponse,
} from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { AuthProviderRegistrationPrefix } from "@types"

type InjectedDependencies = {
  [
    key: `${typeof AuthProviderRegistrationPrefix}${string}`
  ]: AuthTypes.IAuthProvider
}

export default class AuthProviderService {
  protected dependencies: InjectedDependencies

  constructor(container: InjectedDependencies) {
    this.dependencies = container
  }

  protected retrieveProviderRegistration(
    providerId: string
  ): AuthTypes.IAuthProvider {
    try {
      return this.dependencies[`${AuthProviderRegistrationPrefix}${providerId}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a auth provider with id: ${providerId}`
      )
    }
  }

  async authenticate(
    provider: string,
    auth: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService,
    config: { isRegistration: boolean }
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.authenticate(auth, authIdentityProviderService, config)
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
