import { AuthUserService } from "@services"
import { AbstractAuthenticationModuleProvider } from "@medusajs/types"

class UsernamePasswordProvider extends AbstractAuthenticationModuleProvider {
  public static PROVIDER = "usernamePassword"
  public static DISPLAY_NAME = "Username/Password Authentication"

  protected readonly authUserSerivce_: AuthUserService

  constructor({ authUserService: AuthUserService }) {
    super()

    this.authUserSerivce_ = AuthUserService
  }

  async authenticate(userData: Record<string, unknown>) {
    return {}
  }
}

export default UsernamePasswordProvider
