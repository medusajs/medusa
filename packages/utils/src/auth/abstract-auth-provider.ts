import { AuthProviderScope, AuthenticationResponse } from "@medusajs/types"

import { MedusaError } from "../common"

export abstract class AbstractAuthModuleProvider {
  public static PROVIDER: string
  public static DISPLAY_NAME: string

  protected readonly container_: any
  protected scopeConfig_: AuthProviderScope
  protected scope_: string

  private readonly scopes_: Record<string, AuthProviderScope>

  public get provider() {
    return (this.constructor as typeof AbstractAuthModuleProvider).PROVIDER
  }

  public get displayName() {
    return (this.constructor as typeof AbstractAuthModuleProvider).DISPLAY_NAME
  }

  protected constructor(
    { scopes },
    config: { provider: string; displayName: string }
  ) {
    this.container_ = arguments[0]
    this.scopes_ = scopes
    ;(this.constructor as typeof AbstractAuthModuleProvider).PROVIDER ??=
      config.provider
    ;(this.constructor as typeof AbstractAuthModuleProvider).DISPLAY_NAME ??=
      config.displayName
  }

  private validateScope(scope) {
    if (!this.scopes_[scope]) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Scope "${scope}" is not valid for provider ${this.provider}`
      )
    }
  }

  public withScope(scope: string) {
    this.validateScope(scope)

    const cloned = new (this.constructor as any)(this.container_)
    cloned.scope_ = scope
    cloned.scopeConfig_ = this.scopes_[scope]

    return cloned
  }

  abstract authenticate(
    data: Record<string, unknown>
  ): Promise<AuthenticationResponse>

  public validateCallback(
    data: Record<string, unknown>
  ): Promise<AuthenticationResponse> {
    throw new Error(
      `Callback authentication not implemented for provider ${this.provider}`
    )
  }
}
