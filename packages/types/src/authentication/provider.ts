import { AuthUserDTO } from "./common"

export abstract class AbstractAuthenticationModuleProvider {
  public static PROVIDER: string
  public static DISPLAY_NAME: string

  abstract authenticate(
    data: Record<string, unknown>
  ): Promise<AuthenticationResponse>
}

export type AuthenticationResponse = {
  success: boolean
  authUser?: AuthUserDTO
  error?: string
}
