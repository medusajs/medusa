import { LicenseState } from "./types"
import { verifyLicenseKey } from "./verify-license-key"

let licenseState: LicenseState | null = null

/**
 * Resolves the license state of the current process from
 * `MEDUSA_LICENSE_KEY`. Computed once and cached for the lifetime of the
 * process.
 */
export function loadLicense(): LicenseState {
  if (licenseState) {
    return licenseState
  }

  const token = process.env.MEDUSA_LICENSE_KEY

  if (!token) {
    licenseState = { status: "none", claims: null, token: null }
    return licenseState
  }

  const claims = verifyLicenseKey(token)

  licenseState = claims
    ? { status: "valid", claims, token }
    : { status: "invalid", claims: null, token }

  return licenseState
}

export function resetLicenseState(): void {
  licenseState = null
}
