import { AuthenticationInput, AuthenticationResponse } from "@medusajs/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
  isString,
} from "@medusajs/utils"

import { AuthIdentityService } from "@services"
import Scrypt from "scrypt-kdf"

class EmailPasswordProvider extends AbstractAuthModuleProvider {
  public static PROVIDER = "emailpass"
  public static DISPLAY_NAME = "Email/Password Authentication"

  protected readonly authIdentitySerivce_: AuthIdentityService

  constructor({
    authIdentityService,
  }: {
    authIdentityService: AuthIdentityService
  }) {
    super(arguments[0], {
      provider: EmailPasswordProvider.PROVIDER,
      displayName: EmailPasswordProvider.DISPLAY_NAME,
    })

    this.authIdentitySerivce_ = authIdentityService
  }

  private getHashConfig() {
    const scopeConfig = this.scopeConfig_.hashConfig as
      | Scrypt.ScryptParams
      | undefined

    const defaultHashConfig = { logN: 15, r: 8, p: 1 }

    // Return custom defined hash config or default hash parameters
    return scopeConfig ?? defaultHashConfig
  }

  async authenticate(
    userData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    const { email, password } = userData.body

    if (!password || !isString(password)) {
      return {
        success: false,
        error: "Password should be a string",
      }
    }

    if (!email || !isString(email)) {
      return {
        success: false,
        error: "Email should be a string",
      }
    }
    let authIdentity

    try {
      authIdentity =
        await this.authIdentitySerivce_.retrieveByProviderAndEntityId(
          email,
          EmailPasswordProvider.PROVIDER
        )
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const password_hash = await Scrypt.kdf(password, this.getHashConfig())

        const [createdAuthIdentity] = await this.authIdentitySerivce_.create([
          {
            entity_id: email,
            provider: EmailPasswordProvider.PROVIDER,
            scope: this.scope_,
            provider_metadata: {
              password: password_hash.toString("base64"),
            },
          },
        ])

        return {
          success: true,
          authIdentity: JSON.parse(JSON.stringify(createdAuthIdentity)),
        }
      }
      return { success: false, error: error.message }
    }

    const password_hash = authIdentity.provider_metadata?.password

    if (isString(password_hash)) {
      const buf = Buffer.from(password_hash as string, "base64")

      const success = await Scrypt.verify(buf, password)

      if (success) {
        delete authIdentity.provider_metadata!.password

        return {
          success,
          authIdentity: JSON.parse(JSON.stringify(authIdentity)),
        }
      }
    }

    return {
      success: false,
      error: "Invalid email or password",
    }
  }
}

export default EmailPasswordProvider
