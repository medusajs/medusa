import { NextResponse } from "next/server"
import { withRouteErrorHandling } from "docs-utils"
import { globalConfig } from "docs-utils/global-config"
import { getSpecVersions } from "@/utils/get-spec-versions"

type VersionSpecs = {
  version: string
  admin_url: string
  store_url: string
}

// The number of archived versions returned alongside the latest one.
const MAX_ARCHIVED_VERSIONS = 4

/**
 * The latest version isn't archived under `specs/versions`, so it's derived
 * from the docs' global config, which is updated on every release. The release
 * URL is used since it holds the full version, unlike `version.number`.
 */
function getLatestVersion(): string {
  const { number, releaseUrl } = globalConfig.version

  return releaseUrl.match(/\/tag\/v?([^/]+)\/?$/)?.[1] || number
}

export const GET = withRouteErrorHandling(async (request: Request) => {
  const r2Base = process.env.SPECS_R2_BASE_URL
  // Outside of Cloudflare the specs aren't in R2, so the download route, which
  // reads them from the file system, is linked to instead.
  const requestUrl = new URL(request.url)
  const downloadBaseUrl = `${requestUrl.origin}${requestUrl.pathname.replace(
    /\/versions\/?$/,
    ""
  )}/download`

  const getSpecUrl = (area: "admin" | "store", version?: string): string => {
    if (!r2Base) {
      return `${downloadBaseUrl}/${area}${
        version ? `?version=${encodeURIComponent(version)}` : ""
      }`
    }

    const segments = ["specs"]
    if (version) {
      segments.push("versions", version)
    }
    segments.push(area, "openapi.full.json")

    return `${r2Base}/${segments.join("/")}`
  }

  const toVersionSpecs = (
    version: string,
    archivedVersion?: string
  ): VersionSpecs => ({
    version,
    admin_url: getSpecUrl("admin", archivedVersion),
    store_url: getSpecUrl("store", archivedVersion),
  })

  const latestVersion = getLatestVersion()
  const archivedVersions = await getSpecVersions()

  const versions: VersionSpecs[] = [
    toVersionSpecs(latestVersion),
    ...archivedVersions
      .filter((version) => version !== latestVersion)
      .slice(0, MAX_ARCHIVED_VERSIONS)
      .map((version) => toVersionSpecs(version, version)),
  ]

  return NextResponse.json({ versions })
})
