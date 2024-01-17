import {
  AbstractAuthenticationModuleProvider,
  AuthenticationResponse,
} from "@medusajs/types"
import { AuthProviderService, AuthUserService } from "@services"

import { OAuth2 } from "oauth"
import url, { UrlWithParsedQuery } from "url"
import jwt, { JwtPayload } from "jsonwebtoken"
import { MedusaError } from "@medusajs/utils"

type InjectedDependencies = {
  authUserService: AuthUserService
  authProviderService: AuthProviderService
}

type GoogleProviderConfig = {
  callbackURL: string
  clientID: string
  clientSecret: string
}
const nullStore = {
  store: function (req, cb) {
    return cb()
  },
  verify: function (req, state, cb) {
    return cb(null, true)
  },
}

class GoogleProvider extends AbstractAuthenticationModuleProvider {
  public static PROVIDER = "google"
  public static DISPLAY_NAME = "Google Authentication"

  private authorizationUrl_ = "https://accounts.google.com/o/oauth2/v2/auth"
  private tokenUrl_ = "https://www.googleapis.com/oauth2/v4/token"

  protected readonly authUserSerivce_: AuthUserService
  protected readonly authProviderService_: AuthProviderService
  protected readonly _stateStore = nullStore

  constructor({ authUserService, authProviderService }: InjectedDependencies) {
    super()

    this.authUserSerivce_ = authUserService
    this.authProviderService_ = authProviderService
  }

  private async validateConfig(config: Partial<GoogleProviderConfig>) {
    if (!config.clientID) {
      throw new Error("Google clientID is required")
    }

    if (!config.clientSecret) {
      throw new Error("Google clientSecret is required")
    }

    if (!config.callbackURL) {
      throw new Error("Google callbackUrl is required")
    }
  }

  async authenticate(
    userData: Record<string, any>
  ): Promise<AuthenticationResponse> {
    const originalURL = (req) => {
      var tls = req.connection.encrypted,
        host = req.headers.host,
        protocol = tls ? "https" : "http",
        path = req.url || ""
      return protocol + "://" + host + path
    }

    const verify_ = async (request, accessToken, refreshToken, profile, done) => {
      // decode email from jwt
      const jwtData = await jwt.decode(refreshToken.id_token, { complete: true }) as JwtPayload | null
      // const email = jwtData!.email
      const entity_id = jwtData!.payload.email

      let authUser 
      
      try { 
        authUser = await this.authUserSerivce_.retrieveByProviderAndEntityId(
          entity_id,
          GoogleProvider.PROVIDER
        )
      } catch (error) {
        if(error.type === MedusaError.Types.NOT_FOUND) { 
          authUser = await this.authUserSerivce_.create([{
            entity_id,
            provider_id: GoogleProvider.PROVIDER,
            user_metadata: { 
              email: jwtData!.payload.email,
              email_verified: jwtData!.payload.email_verified,
              name: jwtData!.payload.name,
              picture: jwtData!.payload.picture,
              locale: jwtData!.payload.locale,
              family_name: jwtData!.payload.family_name,
              given_name: jwtData!.payload.given_name,
              hd: jwtData!.payload.hd,
            },
          }])
        }
        else { 
          return done(error.message)
        }
      }

      return done(null, authUser)
    }

    const req = userData

    const provider = await this.authProviderService_.retrieve(
      GoogleProvider.PROVIDER
    )

    try {
      this.validateConfig(provider.config || {})
    } catch (error) {
      return { success: false, error: error.message }
    }

    let { callbackURL, clientID, clientSecret } =
      provider.config as GoogleProviderConfig

    if (req.query && req.query.error) {
      return {
        success: false,
        error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
      }
    }

    // var callbackURL = provider./callbackURL;
    if (callbackURL) {
      var parsed = url.parse(callbackURL)
      if (!parsed.protocol) {
        // The callback URL is relative, resolve a fully qualified URL from the
        // URL of the originating request.
        callbackURL = url.resolve(originalURL(req), callbackURL)
      }
    }

    var meta = {
      authorizationURL: this.authorizationUrl_,
      tokenURL: this.tokenUrl_,
      clientID,
      callbackURL: callbackURL,
    }

    const oauth2 = new OAuth2(
      clientID,
      clientSecret,
      "",
      meta.authorizationURL,
      meta.tokenURL
    )

    if ((req.query && req.query.code) || (req.body && req.body.code)) {
      const stateStore = {
        state: null,

        setState: function (state) {
          this.state = state
        },
      }

      function loaded(err, ok) {
          if (err) {
            stateStore.setState({
              success: false,
              error: err,
            })
          }
          if (!ok) {
            // return self.fail(state, 403);
            // TODO: fail with status
            return stateStore.setState({
              success: false,
              error: "fail with status, 403",
            })
          }

          var code = (req.query && req.query.code) || (req.body && req.body.code)

          var params: {
            grant_type: string
            redirect_uri?: string
            code_verifier?: string
          } = { grant_type: "authorization_code" }
          if (callbackURL) {
            params.redirect_uri = callbackURL
          }

          oauth2.getOAuthAccessToken(
            code,
            params,
            async (err, accessToken, refreshToken, params) => {
              console.warn("testing")
              if (err || !accessToken) {
                return stateStore.setState({
                  success: false,
                  error: "Failed to obtain access token",
                })
              }

              function verified(err, user, info) {
                if (err) {
                  stateStore.setState({ success: false, error: err })
                } else if (!user) {
                  stateStore.setState({ success: false, error: info })
                } else {
                  stateStore.setState({ success: true, authUser: user })
                }
              }

              try {
                await verify_(accessToken, refreshToken, params, {}, verified)
              } catch (ex) {
                stateStore.setState({ error: ex.message, success: false })
              }
            }
          )
      }

      var state = (req.query && req.query.state) || (req.body && req.body.state)
      try {
        this._stateStore.verify(req, state, loaded)
      } catch (ex) {
        return { success: false, error: ex }
      }

      while(stateStore.state === null) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      return stateStore.state

    } else {
      var params: {
        response_type: string
        redirect_uri?: string
        scope?: string
      } = { response_type: "code", scope: "email profile" }
      if (callbackURL) {
        params.redirect_uri = callbackURL
      }

      function stored(err, state) {
        var parsed: Omit<UrlWithParsedQuery, "search"> & {
          search?: string | null
        } = url.parse(oauth2._authorizeUrl, true)
        for (const key in params) {
          parsed.query[key] = params[key]
        }

        parsed.query["client_id"] = meta.clientID

        delete parsed.search
        var location = url.format(parsed)
        return { success: true, location } // TODO: redirect
      }

      try {
        return this._stateStore.store(req, stored)
      } catch (ex) {
        return { success: false, error: ex }
      }
    }
  }
}

export default GoogleProvider
