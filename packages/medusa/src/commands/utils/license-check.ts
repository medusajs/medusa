import { Logger, MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, License } from "@medusajs/framework/utils"

export const LICENSE_CHECK_URL =
  "https://api.staging.medusajs.cloud/v1/license/check"

const LICENSE_CHECK_TIMEOUT = 5000

const UNVERIFIED_LICENSE_MESSAGE =
  "Could not verify the configured license key with Medusa Cloud. The check runs again on the next start."

const REJECTED_LICENSE_MESSAGES = new Map<unknown, string>([
  [
    "invalid",
    "The configured license key was not issued by Medusa: Medusa Cloud does not recognize it. Contact support@medusajs.com for more information.",
  ],
  [
    "revoked",
    "The configured license key no longer entitles this instance: the plan it was issued for no longer covers the licensed features in use. To renew the license, contact support@medusajs.com.",
  ],
])

export async function startLicenseRemoteCheck(
  container: MedusaContainer
): Promise<void> {
  const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
  const license = container.resolve<License | null>(
    ContainerRegistrationKeys.LICENSE,
    { allowUnregistered: true }
  )

  if (!license) {
    return
  }

  let status: unknown

  try {
    const response = await fetch(LICENSE_CHECK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ license_key: license.token }),
      signal: AbortSignal.timeout(LICENSE_CHECK_TIMEOUT),
    })

    if (!response.ok) {
      logger.warn(`${UNVERIFIED_LICENSE_MESSAGE} Status: ${response.status}.`)
      return
    }

    status = ((await response.json()) as { status?: unknown } | null)?.status
  } catch (error) {
    logger.warn(`${UNVERIFIED_LICENSE_MESSAGE} ${error}`)
    return
  }

  if (status === "active") {
    return
  }

  const rejection = REJECTED_LICENSE_MESSAGES.get(status)

  if (!rejection) {
    logger.warn(UNVERIFIED_LICENSE_MESSAGE)
    return
  }

  logger.error(rejection)
  process.exit(1)
}
