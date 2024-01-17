import { AuthUserDTO } from "./common"

export abstract class AbstractAuthenticationModuleProvider {
  public static PROVIDER: string
  public static DISPLAY_NAME: string

  public get provider() {
    return (this.constructor as Function & { PROVIDER: string}).PROVIDER
  }

  public get displayName() {
    return (this.constructor as Function & { DISPLAY_NAME: string}).DISPLAY_NAME
  }

  public getProvider(): string { 
    return (this.constructor as Function & { PROVIDER: string}).PROVIDER
  }

  public getDisplayName(): string { 
    return (this.constructor as Function & { DISPLAY_NAME: string, PROVIDER: string}).PROVIDER
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
