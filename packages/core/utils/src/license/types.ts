export interface LicenseKeyClaims {
  sub: string
  jti: string
  features: string[]
  iat: number
  exp?: number
}

export type LicenseCheckStatus = "active" | "expired" | "revoked" | "invalid"

export interface LicenseCheckResponse {
  status: LicenseCheckStatus
  expires_at?: string
  grace_until?: string
}

export interface LicenseState {
  status: "none" | "invalid" | "valid"
  claims: LicenseKeyClaims | null
  token: string | null
}
