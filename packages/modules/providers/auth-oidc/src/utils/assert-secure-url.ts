import { isProduction, MedusaError } from "@medusajs/framework/utils"

/**
 * Asserts that a URL is `https`. Outside of production, `http` is allowed for
 * localhost so local development and testing remain possible.
 */
export const assertSecureUrl = (value: string, label: string): void => {
  let url: URL
  try {
    url = new URL(value)
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `OIDC '${label}' must be a valid URL`
    )
  }

  const isLocalhost =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "::1" ||
    url.hostname === "[::1]"

  const allowsHttp = isLocalhost && !isProduction()

  if (url.protocol !== "https:" && !(url.protocol === "http:" && allowsHttp)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `OIDC '${label}' must use https (http is only allowed for localhost outside of production)`
    )
  }
}
