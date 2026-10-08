export interface LicenseKeyClaims {
  sub: string
  features: string[]
}

export type LicenseCheckStatus = "active" | "revoked" | "invalid"

export interface LicenseCheckResponse {
  status: LicenseCheckStatus
}

export interface LicenseState {
  status: "invalid" | "valid"
  claims: LicenseKeyClaims | null
  token: string | null
}
