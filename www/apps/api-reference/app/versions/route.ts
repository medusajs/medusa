import { NextResponse } from "next/server"
import { throwErrorResponse, withRouteErrorHandling } from "docs-utils"
import { globalConfig } from "docs-utils/global-config"
import {
  getCachedSpecVersions,
  specVersionExists,
} from "@/utils/get-spec-versions"

const DEFAULT_LIMIT = 15
const MAX_LIMIT = 100

const cacheHeaders = {
  "Cache-Control": "public, max-age=3600, must-revalidate",
}

type VersionSpecs = {
  version: string
  admin_url: string
  store_url: string
}

function clampNumber(
  value: string | null,
  fallback: number,
  min: number,
  max: number
): number {
  const parsed = parseInt(value || "", 10)

  return Number.isNaN(parsed) ? fallback : Math.min(Math.max(parsed, min), max)
}

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
  const versionFilter = requestUrl.searchParams.get("version")

  // A single version is looked up on its own, so the full listing is never
  // retrieved when it's filtered down to one version anyway.
  if (versionFilter) {
    const isLatest = versionFilter === latestVersion

    if (!isLatest && !(await specVersionExists(versionFilter))) {
      throwErrorResponse(
        404,
        `No OpenAPI specs found for version "${versionFilter}"`
      )
    }

    return NextResponse.json(
      {
        versions: [
          toVersionSpecs(versionFilter, isLatest ? undefined : versionFilter),
        ],
        count: 1,
        limit: 1,
        offset: 0,
      },
      { headers: cacheHeaders }
    )
  }

  const archivedVersions = (await getCachedSpecVersions()).filter(
    (version) => version !== latestVersion
  )

  const count = archivedVersions.length + 1
  const limit = clampNumber(
    requestUrl.searchParams.get("limit"),
    DEFAULT_LIMIT,
    1,
    MAX_LIMIT
  )
  const offset = clampNumber(requestUrl.searchParams.get("offset"), 0, 0, count)

  // The latest version heads the list, so it shifts the archived versions by
  // one and only an offset of `0` includes it.
  const versions: VersionSpecs[] = [
    ...(offset === 0 ? [toVersionSpecs(latestVersion)] : []),
    ...archivedVersions
      .slice(Math.max(offset - 1, 0), offset + limit - 1)
      .map((version) => toVersionSpecs(version, version)),
  ]

  return NextResponse.json(
    {
      versions,
      count,
      limit,
      offset,
    },
    { headers: cacheHeaders }
  )
})
