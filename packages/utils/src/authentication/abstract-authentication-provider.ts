import { AuthUserDTO } from "@medusajs/types"

export abstract class AbstractAuthenticationModuleProvider {
  public static PROVIDER: string
  public static DISPLAY_NAME: string

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
}

export type AuthenticationResponse = {
  success: boolean
  authUser?: AuthUserDTO
  error?: string
}
