import { LICENSE_CHECK_URL } from "./constants"
import { LicenseCheckResponse, LicenseCheckStatus } from "./types"

const DEFAULT_TIMEOUT = 5000

const KNOWN_STATUSES = new Set<LicenseCheckStatus>([
  "active",
  "revoked",
  "invalid",
])

export async function checkLicenseRemote(
  licenseKey: string
): Promise<LicenseCheckResponse | null> {
  try {
    const response = await fetch(LICENSE_CHECK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ license_key: licenseKey }),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    })

    if (!response.ok) {
      return null
    }

    const body = (await response.json()) as Partial<LicenseCheckResponse> | null

    if (!body?.status || !KNOWN_STATUSES.has(body.status)) {
      return null
    }

    return { status: body.status }
  } catch {
    return null
  }
}
