import { AuthenticationResponse, AuthProviderScope } from "@medusajs/types"
import { MedusaError } from "../common"

export abstract class AbstractAuthenticationModuleProvider {
  public static PROVIDER: string
  public static DISPLAY_NAME: string
  protected readonly scopes_: Record<string, AuthProviderScope>

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

  public validateScope(scope) {
    if (!this.scopes_[scope]) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Scope "${scope}" is not valid for provider ${this.provider}`
      )
    }
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
