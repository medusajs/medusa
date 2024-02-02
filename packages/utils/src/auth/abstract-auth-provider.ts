import { AuthenticationResponse } from "@medusajs/types"

export abstract class AbstractAuthModuleProvider {
  public static PROVIDER: string
  public static DISPLAY_NAME: string
  protected readonly container_: any
  protected scope_: {
    scope: string
    config: Record<string, unknown>
  }

  constructor(container: any) {
    this.container_ = container
  }

  withConfig(scope: string, config: Record<string, unknown>) {
    const cloned = new (this.constructor as any)(this.container_)
    cloned.scope_ = {
      scope,
      config,
    }
    return cloned
  }

  public get provider() {
    return (this.constructor as Function & { PROVIDER: string }).PROVIDER
  }

  public get displayName() {
    return (this.constructor as Function & { DISPLAY_NAME: string })
      .DISPLAY_NAME
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
