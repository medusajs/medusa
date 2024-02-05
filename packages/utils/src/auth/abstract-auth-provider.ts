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
    return (this.constructor as Function & { PROVIDER: string }).PROVIDER
  }

  public get displayName() {
    return (this.constructor as Function & { DISPLAY_NAME: string })
      .DISPLAY_NAME
  }

  protected constructor({ scopes }) {
    this.scopes_ = scopes
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
    cloned.scopeConfg_ = this.scopes_[scope]

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
