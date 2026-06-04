import { Admin } from "./admin/index.js"
import { Auth } from "./auth/index.js"
import { Client } from "./client.js"
import { Store } from "./store/index.js"
import { Config } from "./types.js"

class Medusa {
  public client: Client

  public admin: Admin
  public store: Store
  public auth: Auth

  constructor(config: Config) {
    this.client = new Client(config)

    this.admin = new Admin(this.client)
    this.store = new Store(this.client)
    this.auth = new Auth(this.client, config)
  }

  setLocale(locale: string) {
    this.client.setLocale(locale)
  }

  getLocale() {
    return this.client.locale
  }
}

export default Medusa

export { FetchError, Client } from "./client.js"
export { Admin } from "./admin/index.js"
export {
  Auth,
  type AuthCallbackResponse,
  type AuthVerificationConfirmPayload,
  type AuthVerificationConfirmResponse,
  type AuthVerificationRequestPayload,
  type AuthVerificationRequestResponse,
  type AuthVerificationRequiredResponse,
  type AuthLoginResponse,
  type AuthMfaDisablePayload,
  type AuthMfaFactorResponse,
  type AuthMfaGenerateRecoveryCodesPayload,
  type AuthMfaListResponse,
  type AuthMfaRecoveryCodesResponse,
  type AuthMfaRequiredResponse,
  type AuthMfaSetupResponse,
  type AuthMfaStartPayload,
  type AuthMfaVerifyChallengePayload,
  type AuthMfaVerifyPayload,
  type AuthRedirectResponse,
  type AuthRegisterOptions,
  type AuthRegisterResponse,
} from "./auth/index.js"
export { Store } from "./store/index.js"
export {
  Config,
  ClientHeaders,
  ClientFetch,
  FetchArgs,
  FetchInput,
  FetchStreamResponse,
  Logger,
  ServerSentEventMessage,
} from "./types.js"
