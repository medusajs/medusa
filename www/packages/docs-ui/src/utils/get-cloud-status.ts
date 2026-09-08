import { CloudStatus } from "types"
import { CLOUD_STATUS_PAGE_URL } from "../constants"

/**
 * Retrieves the overall status of Medusa Cloud from the public status page.
 *
 * The endpoint sets `Access-Control-Allow-Origin: *` and is cached on the
 * status page's CDN, so it can be fetched directly from the browser.
 */
export async function getCloudStatus(): Promise<CloudStatus> {
  const response = await fetch(`${CLOUD_STATUS_PAGE_URL}/api/v2/status.json`)

  if (!response.ok) {
    throw new Error("Failed to fetch the Medusa Cloud status")
  }

  const data = (await response.json()) as { status?: CloudStatus }

  if (!data.status) {
    throw new Error("The Medusa Cloud status response has an unexpected format")
  }

  return data.status
}
