import crypto from "crypto"
import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  ICacheService,
  Logger,
  OidcAuthProviderOptions,
} from "@medusajs/framework/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
} from "@medusajs/framework/utils"
import { OidcEngine } from "../engine"
import { assertSecureUrl } from "../utils"

type InjectedDependencies = {
  logger: Logger
  cache?: ICacheService
}

// A generic failure message returned to the client; the detailed cause is only ever logged server-side.
const GENERIC_AUTH_ERROR = "Authentication failed"

export class OidcAuthService extends AbstractAuthModuleProvider {
  static identifier = "oidc"
  static DISPLAY_NAME = "OpenID Connect"

  protected readonly config_: OidcAuthProviderOptions
  protected readonly logger_: Logger
  protected readonly engine_: OidcEngine

  static validateOptions(options: OidcAuthProviderOptions) {
    if (!options.issuer) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "OIDC provider requires an 'issuer' option"
      )
    }

    assertSecureUrl(options.issuer, "issuer")

    if (!options.client_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "OIDC provider requires a 'client_id' option"
      )
    }

    if (!options.callback_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "OIDC provider requires a 'callback_url' option"
      )
    }
  }

  constructor(
    { logger, cache }: InjectedDependencies,
    options: OidcAuthProviderOptions
  ) {
    // @ts-ignore
    super(...arguments)
    this.config_ = options
    this.logger_ = logger
    this.engine_ = new OidcEngine(options, cache)
  }

  // The same OIDC package is registered once per IdP (okta, auth0, ...), so the
  // display name is instance-specific.
  get displayName() {
    return this.config_.display_name ?? OidcAuthService.DISPLAY_NAME
  }

  async register(_: AuthenticationInput): Promise<AuthenticationResponse> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "OIDC does not support registration. Use method `authenticate` instead."
    )
  }

  async authenticate(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const body: Record<string, string> = req.body ?? {}

    const callbackUrl = body?.callback_url ?? this.config_.callback_url

    // The allowlist is opt-in: when it isn't configured, validating the callback
    // URL is left entirely to the identity provider.
    const allowedCallbackUrls = this.config_.allowed_callback_urls

    if (
      allowedCallbackUrls?.length &&
      !allowedCallbackUrls.includes(callbackUrl)
    ) {
      this.logger_?.warn(
        `[auth-oidc] Rejected authentication with a callback URL (${callbackUrl}) that is not in the allowlist`
      )
      return {
        success: false,
        error: "The provided callback URL is not allowed",
      }
    }

    try {
      const stateKey = crypto.randomBytes(32).toString("hex")

      const { url, nonce, codeVerifier } =
        await this.engine_.buildAuthorizationUrl({
          state: stateKey,
          callbackUrl,
          scopes: this.config_.scopes,
        })

      await authIdentityService.setState(
        stateKey,
        {
          callback_url: callbackUrl,
          nonce,
          code_verifier: codeVerifier,
        },
        this.config_.state_ttl_seconds ?? 600
      )

      return { success: true, location: url }
    } catch (error) {
      this.logger_?.error(
        `[auth-oidc] Could not initiate authentication: ${error.message}`
      )
      return { success: false, error: GENERIC_AUTH_ERROR }
    }
  }

  async validateCallback(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query: Record<string, string> = req.query ?? {}
    const body: Record<string, string> = req.body ?? {}

    if (query.error) {
      // Not an application fault (e.g. the user canceled, or `access_denied`),
      // so it's only logged for debugging purposes.
      this.logger_?.debug(
        `[auth-oidc] Identity provider returned an error on callback: ${query.error}`
      )
      return { success: false, error: GENERIC_AUTH_ERROR }
    }

    const code = query?.code ?? body?.code
    if (!code) {
      return { success: false, error: "No code provided" }
    }

    const stateKey = (query?.state ?? body?.state) as string | undefined
    if (!stateKey) {
      return { success: false, error: "No state provided, or session expired" }
    }

    const state = await authIdentityService.getState(stateKey)
    if (!state) {
      return { success: false, error: "No state provided, or session expired" }
    }

    try {
      const { claims } = await this.engine_.exchangeCode({
        // Forward the full authorization-response params.
        params: { ...body, ...query },
        nonce: state.nonce as string,
        codeVerifier: state.code_verifier as string,
        callbackUrl: state.callback_url as string,
        state: stateKey,
      })

      const { entityId, userMetadata } = this.engine_.mapClaims(claims)

      let authIdentity
      try {
        authIdentity = await authIdentityService.retrieve({
          entity_id: entityId,
        })

        // Refresh the stored profile claims on every login.
        authIdentity = await authIdentityService.update(entityId, {
          user_metadata: userMetadata,
        })
      } catch (error) {
        if (error.type === MedusaError.Types.NOT_FOUND) {
          authIdentity = await authIdentityService.create({
            entity_id: entityId,
            user_metadata: userMetadata,
          })
        } else {
          throw error
        }
      }

      return { success: true, authIdentity }
    } catch (error) {
      this.logger_?.error(
        `[auth-oidc] Could not validate authentication callback: ${error.message}`
      )
      return { success: false, error: GENERIC_AUTH_ERROR }
    }
  }
}
