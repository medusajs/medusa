import { Logger } from "@medusajs/framework/types"
import {
  checkLicenseRemote,
  getRegisteredLicensedFeatures,
  loadLicense,
  MEDUSA_CLOUD_EXECUTION_CONTEXT,
} from "@medusajs/framework/utils"

/**
 * Asks Medusa Cloud whether the configured license key still entitles this
 * instance. Fired in the background after boot so it never delays startup:
 * network failures fail open, and only a definitive negative from Cloud past
 * its grace window stops the process.
 */
export async function startLicenseRemoteCheck(logger: Logger): Promise<void> {
  // TODO: this would only be true if upon changes to the key we trigger a new
  // build? Otherwise it would wait until injection happens on next customer
  // triggered one

  // Hosted instances are entitled by the platform directly: it injects,
  // reconciles, and clears their keys on plan changes.
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

    if (response.status === "invalid") {
      logger.error(
        "The configured license key was not issued by Medusa: Medusa Cloud does not recognize it. Set a license key obtained from the Medusa Cloud dashboard."
      )
      process.exit(1)
    }

    const expiredAt = response.expires_at ? ` on ${response.expires_at}` : ""
    const graceUntil = response.grace_until
      ? new Date(response.grace_until)
      : null

    if (graceUntil && graceUntil.getTime() > Date.now()) {
      logger.warn(
        `The configured license key no longer entitles this instance: the license is ${
          response.status
        }${expiredAt}. Licensed features stop loading at boot after ${graceUntil.toISOString()}. Renew the license in the Medusa Cloud dashboard.`
      )
      return
    }

    logger.error(
      `The configured license key no longer entitles this instance: the license is ${response.status}${expiredAt} and its grace window has passed. Renew the license in the Medusa Cloud dashboard.`
    )
    process.exit(1)
  } catch (error) {
    logger.debug(`The license check failed unexpectedly: ${error}`)
  }
}
