import { createPublicKey } from "crypto"
import { LICENSE_KEY_ENV_VAR, LICENSE_PUBLIC_KEY } from "./constants"
import { LicenseState } from "./types"
import { verifyLicenseKey } from "./verify-license-key"

const MEDUSA_CLOUD_PUBLIC_KEY = createPublicKey(LICENSE_PUBLIC_KEY)

let publicKey = MEDUSA_CLOUD_PUBLIC_KEY
let licenseState: LicenseState | null = null
const registeredFeatures = new Set<string>()

export function loadLicense(): LicenseState {
  if (licenseState) {
    return licenseState
  }

  const token = process.env[LICENSE_KEY_ENV_VAR] ?? null
  const claims = token ? verifyLicenseKey(token, publicKey) : null

  licenseState = claims
    ? { status: "valid", claims, token }
    : { status: "invalid", claims: null, token }

  return licenseState
}

// @internal for tests
export function setLicensePublicKey(pem: string): void {
  publicKey = createPublicKey(pem)
  licenseState = null
}

// @internal for tests
export function resetLicenseState(): void {
  publicKey = MEDUSA_CLOUD_PUBLIC_KEY
  licenseState = null
  registeredFeatures.clear()
}

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
