import { LICENSE_CHECK_URL } from "./constants"
import { LicenseCheckResponse, LicenseCheckStatus } from "./types"

const DEFAULT_TIMEOUT = 5000

const KNOWN_STATUSES = new Set<LicenseCheckStatus>([
  "active",
  "expired",
  "revoked",
  "invalid",
])

/**
 * Asks the Medusa Cloud license endpoint whether `token` still entitles this
 * instance. Returns `null` on any failure: network error, timeout, non-2xx,
 * unparsable body, or an unrecognized status. Callers are expected to fail
 * open on `null`.
 */
export async function checkLicenseRemote(
  token: string
): Promise<LicenseCheckResponse | null> {
  const url = LICENSE_CHECK_URL

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    })

    if (!response.ok) {
      return null
    }

    const body = (await response.json()) as Partial<LicenseCheckResponse> | null

    if (!body?.status || !KNOWN_STATUSES.has(body.status)) {
      return null
    }

    return body as LicenseCheckResponse
  } catch {
    return null
  }
}
