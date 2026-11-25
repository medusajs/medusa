export interface GithubAuthProviderOptions {
  clientId: string
  clientSecret: string
  callbackUrl: string
  /**
   * Whether to store the user's GitHub access and refresh tokens, in
   * plaintext, in the provider identity's `provider_metadata`. Defaults to
   * `true`. Logging in doesn't need them.
   *
   * When `false`, nothing is stored there. The tokens are passed to the
   * `authCallbackValidated` hook of the `validateAuthCallbackWorkflow`, where
   * you can keep them in your own storage.
   *
   * The default will change to `false` in a future minor release. Set it to
   * `false` now, and use the `authCallbackValidated` hook if you need the
   * tokens.
   */
  storeTokens?: boolean
}
