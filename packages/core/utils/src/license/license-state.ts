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
  registeredFeatures.clear()
}

const registeredFeatures = new Set<string>()

/**
 * Records that a license gated package declaring `feature` was loaded in this
 * process. Called by the module loader when it admits a guarded package.
 */
export function registerLicensedFeature(feature: string): void {
  registeredFeatures.add(feature)
}

/**
 * The license gated features of the packages loaded in this process.
 */
export function getRegisteredLicensedFeatures(): string[] {
  return [...registeredFeatures]
}
