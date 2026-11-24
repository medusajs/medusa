export interface GithubAuthProviderOptions {
  clientId: string
  clientSecret: string
  callbackUrl: string
  /**
   * Whether to store the user's GitHub access and refresh tokens in the
   * provider identity's `provider_metadata`. Defaults to `true`.
   *
   * When `false`, nothing is stored there, and the tokens are only passed to
   * the `authCallbackValidated` hook of the `validateAuthCallbackWorkflow`.
   */
  storeTokens?: boolean
}
