import { AuthProvider } from "../../hooks/api"

export const EMAILPASS_PROVIDER_ID = "emailpass"

/**
 * Returns the redirect-based (SSO) providers, i.e. those rendered as
 * "Continue with ..." buttons.
 */
export const getRedirectProviders = (
  providers: AuthProvider[]
): AuthProvider[] =>
  providers.filter((provider) => provider.flow === "redirect")

export const hasEmailPassProvider = (providers: AuthProvider[]): boolean =>
  providers.some((provider) => provider.id === EMAILPASS_PROVIDER_ID)
