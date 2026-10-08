import { Logger } from "@medusajs/framework/types"
import {
  checkLicenseRemote,
  getRegisteredLicensedFeatures,
  loadLicense,
  MEDUSA_CLOUD_EXECUTION_CONTEXT,
} from "@medusajs/framework/utils"

export async function startLicenseRemoteCheck(logger: Logger): Promise<void> {
  if (process.env.EXECUTION_CONTEXT === MEDUSA_CLOUD_EXECUTION_CONTEXT) {
    return
  }

  if (!getRegisteredLicensedFeatures().length) {
    return
  }

  const license = loadLicense()

  // Anything but a valid key was already handled by the local gate at module
  // registration.
  if (license.status !== "valid" || !license.token) {
    return
  }

  try {
    const response = await checkLicenseRemote(license.token)

    if (!response || response.status === "active") {
      return
    }

    logger.error(
      response.status === "invalid"
        ? "The configured license key was not issued by Medusa: Medusa Cloud does not recognize it. Contact support@medusajs.com for more information."
        : "The configured license key no longer entitles this instance: the plan it was issued for no longer covers the licensed features in use. To renew the license, contact support@medusajs.com."
    )
    process.exit(1)
  } catch (error) {
    logger.debug(`The license check failed unexpectedly: ${error}`)
  }
}
