import crypto from "crypto"
import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  GithubAuthProviderOptions,
  Logger,
} from "@zjedene-medusa/framework/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
} from "@zjedene-medusa/framework/utils"

type InjectedDependencies = {
  logger: Logger
}

interface LocalServiceConfig extends GithubAuthProviderOptions {}

export class GithubAuthService extends AbstractAuthModuleProvider {
  static identifier = "github"
  static DISPLAY_NAME = "Github Authentication"

  protected config_: LocalServiceConfig
  protected logger_: Logger

  static validateOptions(options: GithubAuthProviderOptions) {
    if (!options.clientId) {
      throw new Error("Github clientId is required")
    }

    if (!options.clientSecret) {
      throw new Error("Github clientSecret is required")
    }

    if (!options.callbackUrl) {
      throw new Error("Github callbackUrl is required")
    }
  }

  constructor(
    { logger }: InjectedDependencies,
    options: GithubAuthProviderOptions
  ) {
    // @ts-ignore
    super(...arguments)
    this.config_ = options
    this.logger_ = logger
  }

  async register(_): Promise<AuthenticationResponse> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Github does not support registration. Use method `authenticate` instead."
    )
  }

  async authenticate(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query: Record<string, string> = req.query ?? {}
    const body: Record<string, string> = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: `${query.error_description}, read more at: ${query.error_uri}`,
      }
    }

    const stateKey = crypto.randomBytes(32).toString("hex")
    const state = {
      callback_url: body?.callback_url ?? this.config_.callbackUrl,
    }

    await authIdentityService.setState(stateKey, state)
    return this.getRedirect(this.config_.clientId, state.callback_url, stateKey)
  }

  async validateCallback(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query: Record<string, string> = req.query ?? {}
    const body: Record<string, string> = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: `${query.error_description}, read more at: ${query.error_uri}`,
      }
    }

    const code = query?.code ?? body?.code
    if (!code) {
      return { success: false, error: "No code provided" }
    }

    const state = await authIdentityService.getState(query?.state as string)
    if (!state) {
      return { success: false, error: "No state provided, or session expired" }
    }

    const params = `client_id=${this.config_.clientId}&client_secret=${this.config_.clientSecret}&code=${code}&redirect_uri=${state.callback_url}`

    const exchangeTokenUrl = new URL(
      `https://github.com/login/oauth/access_token?${params}`
    )

    try {
      const response = await fetch(exchangeTokenUrl.toString(), {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }).then((r) => {
        if (!r.ok) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Could not exchange token, ${r.status}, ${r.statusText}`
          )
        }

        return r.json()
      })

      const providerMetadata = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        // The response is in seconds
        access_token_expires_at: new Date(
          Date.now() + response.expires_in * 1000
        ).toISOString(),
        refresh_token_expires_at: new Date(
          Date.now() + response.refresh_token_expires_in * 1000
        ).toISOString(),
      }

      const { authIdentity, success } = await this.upsert_(
        providerMetadata,
        authIdentityService
      )

      return {
        success,
        authIdentity,
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async upsert_(
    providerMetadata: {
      access_token: string
      refresh_token: string
      access_token_expires_at: string
      refresh_token_expires_at: string
    },
    authIdentityService: AuthIdentityProviderService
  ) {
    if (!providerMetadata?.access_token) {
      return { success: false, error: "No access token found" }
    }

    const user = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${providerMetadata.access_token}`,
      },
    }).then((r) => r.json())

    const entity_id = user.id.toString()
    const userMetadata = {
      profile_url: user.url,
      avatar: user.avatar_url,
      email: user.email,
      name: user.name,
      company: user.company,
      two_factor_authentication: user.two_factor_authentication ?? false,
    }

    let authIdentity

    try {
      // Update throws if auth identity not found
      authIdentity = await authIdentityService.update(entity_id, {
        provider_metadata: providerMetadata,
        user_metadata: userMetadata,
      })
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await authIdentityService.create({
          entity_id,
          user_metadata: userMetadata,
          provider_metadata: providerMetadata,
        })
        authIdentity = createdAuthIdentity
      } else {
        return { success: false, error: error.message }
      }
    }

    return {
      success: true,
      authIdentity,
    }
  }

  private getRedirect(clientId: string, callbackUrl: string, stateKey: string) {
    const authUrl = new URL(`https://github.com/login/oauth/authorize`)
    authUrl.searchParams.set("redirect_uri", callbackUrl)
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("state", stateKey)

    return { success: true, location: authUrl.toString() }
  }
}
