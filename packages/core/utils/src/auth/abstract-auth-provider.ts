import {
  AuthIdentityProviderService,
  AuthenticationInput,
  AuthenticationResponse,
  IAuthProvider,
} from "@medusajs/types"

export abstract class AbstractAuthModuleProvider implements IAuthProvider {
  private static PROVIDER: string
  private static DISPLAY_NAME: string

  protected readonly container_: any
  public get provider() {
    return (this.constructor as typeof AbstractAuthModuleProvider).PROVIDER
  }

  public get displayName() {
    return (this.constructor as typeof AbstractAuthModuleProvider).DISPLAY_NAME
  }

  protected constructor({}, config: { provider: string; displayName: string }) {
    this.container_ = arguments[0]
    ;(this.constructor as typeof AbstractAuthModuleProvider).PROVIDER ??=
      config.provider
    ;(this.constructor as typeof AbstractAuthModuleProvider).DISPLAY_NAME ??=
      config.displayName
  }

  abstract authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>

  validateCallback(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    throw new Error(
      `Callback authentication not implemented for provider ${this.provider}`
    )
  }
}
