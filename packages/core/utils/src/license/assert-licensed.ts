import { MedusaError } from "../common/errors"
import { LicenseKeyEnvVars } from "./constants"
import { loadLicense } from "./license-state"

// TODO: confirm wording
const OBTAIN_KEY_HINT =
  "Reach out support@medusajs.com to obtain a license key."

/**
 * Throws unless the configured license key is authentic and covers `feature`.
 */
export function assertLicensed(feature: string): void {
  const state = loadLicense()

  if (state.status === "none") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `The "${feature}" feature requires a Medusa license key, but ${LicenseKeyEnvVars.KEY} is not set. Set ${LicenseKeyEnvVars.KEY} and ${LicenseKeyEnvVars.PUBLIC_KEY} to run it. ${OBTAIN_KEY_HINT}`
    )
  }

  if (state.status === "invalid") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `The Medusa license key required by the "${feature}" feature could not be verified. Both ${LicenseKeyEnvVars.KEY} and ${LicenseKeyEnvVars.PUBLIC_KEY} must be set and valid. ${OBTAIN_KEY_HINT}`
    )
  }

  if (!state.claims?.features.includes(feature)) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `The configured Medusa license key does not cover the "${feature}" feature. It covers: ${
        state.claims?.features.join(", ") || "no features"
      }. ${OBTAIN_KEY_HINT}`
    )
  }
}
