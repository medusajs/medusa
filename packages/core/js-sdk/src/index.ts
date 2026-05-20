import { Admin } from "./admin/index.js"
import { Auth } from "./auth/index.js"
import { Client } from "./client.js"
import { Store } from "./store/index.js"
import { Config } from "./types.js"

/**
 * The main Medusa JS SDK class that provides access to admin, store, and authentication APIs.
 *
 * @example
 * const medusa = new Medusa({
 *   baseUrl: "http://localhost:9000",
 *   debug: true,
 *   auth: {
 *     type: "jwt"
 *   }
 * })
 *
 * // Use admin APIs
 * const { products } = await medusa.admin.product.list()
 *
 * // Use store APIs  
 * const { products: storeProducts } = await medusa.store.product.list()
 *
 * // Use authentication
 * await medusa.auth.login("user", "emailpass", { email: "user@test.com", password: "password" })
 */
class Medusa {
  /**
   * The underlying HTTP client used for API requests.
   */
  public client: Client

  /**
   * Access to admin APIs for managing the store.
   */
  public admin: Admin
  /**
   * Access to storefront APIs for customer interactions.
   */
  public store: Store
  /**
   * Access to authentication APIs for login, registration, and session management.
   */
  public auth: Auth

  /**
   * Creates a new Medusa SDK instance.
   *
   * @param config - Configuration options for the SDK including base URL and authentication settings.
   */
  constructor(config: Config) {
    this.client = new Client(config)

    this.admin = new Admin(this.client)
    this.store = new Store(this.client)
    this.auth = new Auth(this.client, config)
  }

  /**
   * Sets the locale for API requests.
   *
   * @param locale - The locale code to use for requests.
   */
  setLocale(locale: string) {
    this.client.setLocale(locale)
  }

  /**
   * Gets the current locale setting.
   *
   * @returns The current locale code.
   */
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
