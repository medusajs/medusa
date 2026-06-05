export interface GithubAuthProviderOptions {
  clientId: string
  clientSecret: string
  callbackUrl: string
  /**
   * Additional callback URLs allowed to be supplied in the request body's
   * `callback_url` field. The configured `callbackUrl` is always allowed.
   * Any other value passed in the request body will be rejected.
   * 
   * @since 2.16.0
   */
  callbackUrlAllowlist?: string[]
}
