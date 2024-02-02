import { AbstractAuthModuleProvider, MedusaError } from "@medusajs/utils"
import {
  AuthProviderScope,
  AuthenticationInput,
  AuthenticationResponse,
  ModulesSdkTypes,
} from "@medusajs/types"
import { AuthUserService } from "@services"
import jwt, { JwtPayload } from "jsonwebtoken"

import { AuthorizationCode } from "simple-oauth2"
import url from "url"

type InjectedDependencies = {
  authUserService: AuthUserService
  authProviderService: ModulesSdkTypes.InternalModuleService<any>
}

type ProviderConfig = {
  clientID: string
  clientSecret: string
  callbackURL: string
}

class GoogleProvider extends AbstractAuthModuleProvider {
  public static PROVIDER = "google"
  public static DISPLAY_NAME = "Google Authentication"

  protected readonly authUserService_: AuthUserService

  constructor({ authUserService }: InjectedDependencies) {
    super(arguments[0])
    this.authUserService_ = authUserService
  }

  async authenticate(
    req: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    if (req.query?.error) {
      return {
        success: false,
        error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
      }
    }

    let config: ProviderConfig

    try {
      config = await this.getProviderConfig(req)
    } catch (error) {
      return { success: false, error: error.message }
    }

    return this.getRedirect(config)
  }

  async validateCallback(
    req: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    if (req.query && req.query.error) {
      return {
        success: false,
        error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
      }
    }

    let config: ProviderConfig

    try {
      config = await this.getProviderConfig(req)
    } catch (error) {
      return { success: false, error: error.message }
    }

    const code = req.query?.code ?? req.body?.code

    return await this.validateCallbackToken(code, req.authScope, config)
  }

  // abstractable
  async verify_(refreshToken: string, scope: string) {
    const jwtData = jwt.decode(refreshToken, {
      complete: true,
    }) as JwtPayload
    const entity_id = jwtData.payload.email

    let authUser

    try {
      authUser = await this.authUserService_.retrieveByProviderAndEntityId(
        entity_id,
        GoogleProvider.PROVIDER
      )
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const [createdAuthUser] = await this.authUserService_.create([
          {
            entity_id,
            provider: GoogleProvider.PROVIDER,
            user_metadata: jwtData!.payload,
            scope,
          },
        ])
        authUser = createdAuthUser
      } else {
        return { success: false, error: error.message }
      }
    }

    return { success: true, authUser }
  }

  // abstractable
  private async validateCallbackToken(
    code: string,
    scope: string,
    { clientID, callbackURL, clientSecret }: ProviderConfig
  ) {
    const client = this.getAuthorizationCodeHandler({ clientID, clientSecret })

    const tokenParams = {
      code,
      redirect_uri: callbackURL,
    }

    try {
      const accessToken = await client.getToken(tokenParams)

      return await this.verify_(accessToken.token.id_token, scope)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  private validateConfig(scope: string): ProviderConfig {
    if (this.scope_ === undefined) {
      throw new Error(
        "Google Provider was not configured. Make sure withConfig was called before authentication."
      )
    }

    if (this.scope_.scope !== scope) {
      throw new Error(`Scope ${scope} is not configured for Google Provider`)
    }

    const config = this.scope_.config

    if (!config.clientID) {
      throw new Error("Google clientID is required")
    }

    if (!config.clientSecret) {
      throw new Error("Google clientSecret is required")
    }

    if (!config.callbackURL) {
      throw new Error("Google callbackUrl is required")
    }

    return config as ProviderConfig
  }

  private originalURL(req: AuthenticationInput) {
    const host = req.headers.host
    const protocol = req.protocol
    const path = req.url || ""

    return protocol + "://" + host + path
  }

  private async getProviderConfig(
    req: AuthenticationInput
  ): Promise<ProviderConfig> {
    const config = this.validateConfig(req.authScope)

    const callbackURL = config.callbackURL

    const parsedCallbackUrl = !url.parse(callbackURL).protocol
      ? url.resolve(this.originalURL(req), callbackURL)
      : callbackURL

    return { ...config, callbackURL: parsedCallbackUrl }
  }

  // Abstractable
  private getRedirect({ clientID, callbackURL, clientSecret }: ProviderConfig) {
    const client = this.getAuthorizationCodeHandler({ clientID, clientSecret })

    const location = client.authorizeURL({
      redirect_uri: callbackURL,
      scope: "email profile",
    })

    return { success: true, location }
  }

  private getAuthorizationCodeHandler({
    clientID,
    clientSecret,
  }: {
    clientID: string
    clientSecret: string
  }) {
    const config = {
      client: {
        id: clientID,
        secret: clientSecret,
      },
      auth: {
        // TODO: abstract to not be google specific
        authorizeHost: "https://accounts.google.com",
        authorizePath: "/o/oauth2/v2/auth",
        tokenHost: "https://www.googleapis.com",
        tokenPath: "/oauth2/v4/token",
      },
    }

    return new AuthorizationCode(config)
  }
}

export default GoogleProvider
