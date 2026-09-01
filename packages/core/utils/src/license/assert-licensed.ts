import { MedusaError } from "../common/errors"
import { LICENSE_CHECK_ERROR_CODE, LicenseKeyEnvVars } from "./constants"
import { loadLicense } from "./license-state"

// TODO: confirm wording
const OBTAIN_KEY_HINT =
  "Reach out to support@medusajs.com to learn more."

function licenseCheckError(message: string): MedusaError {
  return new MedusaError(
    MedusaError.Types.NOT_ALLOWED,
    `${message} ${OBTAIN_KEY_HINT}`,
    LICENSE_CHECK_ERROR_CODE
  )
}

/**
 * Throws unless the configured license key is authentic and covers `feature`.
 */
export function assertLicensed(feature: string): void {
  const state = loadLicense()

  if (state.status === "none") {
    throw licenseCheckError(
      `The "${feature}" feature requires a Medusa license key, but ${LicenseKeyEnvVars.KEY} is not set. Set ${LicenseKeyEnvVars.KEY} and ${LicenseKeyEnvVars.PUBLIC_KEY} to run it.`
    )
  }

  if (state.status === "invalid") {
    throw licenseCheckError(
      `The Medusa license key required by the "${feature}" feature could not be verified. Both ${LicenseKeyEnvVars.KEY} and ${LicenseKeyEnvVars.PUBLIC_KEY} must be set and valid.`
    )
  }

  if (!state.claims?.features.includes(feature)) {
    throw licenseCheckError(
      `The configured Medusa license key does not cover the "${feature}" feature. It covers: ${
        state.claims?.features.join(", ") || "no features"
      }.`
    )
  }
}
