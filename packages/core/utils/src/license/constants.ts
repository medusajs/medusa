export const LicenseFeature = {
  RBAC: "rbac",
  AUTH_OIDC: "auth-oidc",
} as const

export type LicenseFeature =
  (typeof LicenseFeature)[keyof typeof LicenseFeature]

export const LICENSE_KEY_ENV_VAR = "MEDUSA_LICENSE_KEY"

export const LICENSE_CHECK_URL =
  "https://api.staging.medusajs.cloud/v1/license/check"

export const LICENSE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAf9qSwDtZzl7mYI1Gf8FuT6acJWmpeIjVfHzPYqT8ZqE=
-----END PUBLIC KEY-----`

export const LICENSE_CHECK_ERROR_CODE = "LICENSE_CHECK_ERROR"
