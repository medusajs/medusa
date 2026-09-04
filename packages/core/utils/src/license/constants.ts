export const LicenseFeature = {
  RBAC: "rbac",
  AUTH_OIDC: "auth-oidc",
} as const

export type LicenseFeature =
  (typeof LicenseFeature)[keyof typeof LicenseFeature]

export const LICENSE_CHECK_URL =
  "https://api.prod.medusajs.cloud/v1/subscriptions/license/check"

export const LicenseKeyEnvVars = {
  KEY: "MEDUSA_LICENSE_KEY",
  PUBLIC_KEY: "MEDUSA_LICENSE_PUBLIC_KEY",
} as const

export const LICENSE_CHECK_ERROR_CODE = "LICENSE_CHECK_ERROR"
