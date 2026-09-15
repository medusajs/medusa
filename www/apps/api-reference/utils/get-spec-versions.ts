import path from "path"
import { unstable_cache } from "next/cache"
import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Compares two version directory names, sorting the newest first. Falls back
 * to a string comparison for segments that aren't numeric.
 */
function compareVersionsDesc(versionA: string, versionB: string): number {
  const segmentsA = versionA.split(".")
  const segmentsB = versionB.split(".")

  for (let i = 0; i < Math.max(segmentsA.length, segmentsB.length); i++) {
    const segmentA = segmentsA[i] ?? ""
    const segmentB = segmentsB[i] ?? ""

    if (segmentA === segmentB) {
      continue
    }

    const numberA = Number.parseInt(segmentA, 10)
    const numberB = Number.parseInt(segmentB, 10)

    if (Number.isNaN(numberA) || Number.isNaN(numberB)) {
      return segmentB.localeCompare(segmentA)
    }

    return numberB - numberA
  }

  return 0
}

/**
 * Version directory names are interpolated into bucket keys and file system
 * paths, so anything that isn't a plain version is rejected before use.
 */
const VERSION_PATTERN = /^\d+(?:\.\d+)*(?:-[a-zA-Z0-9.]+)?$/

export function isValidSpecVersion(version: string): boolean {
  return VERSION_PATTERN.test(version)
}

/**
 * Resolves the R2 bucket binding and the prefix that the archived spec keys
 * live under. Returns `null` outside Cloudflare (next dev / build) or when the
 * binding isn't configured, so callers can fall back to the file system.
 */
type SpecsBucket = NonNullable<CloudflareEnv["SPECS_R2_BUCKET"]>

async function getVersionsBucket(): Promise<{
  bucket: SpecsBucket
  prefix: string
} | null> {
  const r2Base = process.env.SPECS_R2_BASE_URL
  if (!r2Base) {
    return null
  }

  try {
    // async mode so this also works in statically rendered contexts
    const { env } = await getCloudflareContext({ async: true })
    const bucket = env.SPECS_R2_BUCKET
    if (!bucket) {
      return null
    }

    // The public bucket URL serves the bucket root, so its pathname is the
    // prefix that the spec keys live under.
    const basePrefix = new URL(r2Base).pathname.replace(/^\/|\/$/g, "")

    return {
      bucket,
      prefix: `${basePrefix ? `${basePrefix}/` : ""}specs/versions/`,
    }
  } catch {
    return null
  }
}

/**
 * Lists the version directories under `specs/versions` in the R2 bucket using
 * the bucket binding. Returns `null` when the bucket isn't available.
 */
async function listVersionsFromBinding(): Promise<string[] | null> {
  const resolved = await getVersionsBucket()
  if (!resolved) {
    return null
  }

  const { bucket, prefix } = resolved

  try {
    const versions: string[] = []
    let cursor: string | undefined

    do {
      const listed = await bucket.list({ prefix, delimiter: "/", cursor })
      versions.push(
        ...listed.delimitedPrefixes.map((delimitedPrefix) =>
          delimitedPrefix.slice(prefix.length).replace(/\/$/, "")
        )
      )
      cursor = listed.truncated ? listed.cursor : undefined
    } while (cursor)

    // An empty listing means the binding points at a bucket that doesn't hold
    // the specs, which is indistinguishable from "no versions". Treating it as
    // a miss lets the caller fall back instead of returning an empty list.
    return versions.length ? versions : null
  } catch {
    return null
  }
}

/**
 * Checks whether a single version is archived in the R2 bucket, without
 * listing the other versions. Returns `null` when the bucket isn't available
 * or holds no objects for the version, so callers can fall back.
 */
async function versionExistsInBinding(version: string): Promise<true | null> {
  const resolved = await getVersionsBucket()
  if (!resolved) {
    return null
  }

  const { bucket, prefix } = resolved

  try {
    const listed = await bucket.list({
      prefix: `${prefix}${version}/`,
      limit: 1,
    })

    // An empty listing is indistinguishable from a bucket that doesn't hold
    // the specs, which is what the binding points at in local development.
    // Treating it as a miss lets the caller fall back to the file system.
    return listed.objects.length > 0 || listed.delimitedPrefixes.length > 0
      ? true
      : null
  } catch {
    return null
  }
}

/**
 * Checks whether a single version is archived in the file system.
 */
async function versionExistsInFs(version: string): Promise<boolean> {
  const { stat } = await import("fs/promises")

  try {
    const stats = await stat(
      path.join(process.cwd(), "specs", "versions", version)
    )

    return stats.isDirectory()
  } catch {
    return false
  }
}

/**
 * Checks whether a version is archived under `specs/versions`, looking up only
 * that version instead of retrieving the full listing.
 */
export async function specVersionExists(version: string): Promise<boolean> {
  if (!isValidSpecVersion(version)) {
    return false
  }

  return (
    (await versionExistsInBinding(version)) ??
    (await versionExistsInFs(version))
  )
}

/**
 * Lists the version directories under `specs/versions` in the file system.
 */
async function listVersionsFromFs(): Promise<string[]> {
  const { readdir } = await import("fs/promises")

  try {
    const entries = await readdir(
      path.join(process.cwd(), "specs", "versions"),
      {
        withFileTypes: true,
      }
    )

    return entries
      .filter((entry) => entry.isDirectory())
      .map(({ name }) => name)
  } catch {
    return []
  }
}

/**
 * Retrieves the archived spec versions, sorted from newest to oldest. The
 * versions are read from R2 when it's configured, and from the local `specs`
 * directory otherwise.
 */
export async function getSpecVersions(): Promise<string[]> {
  const versions =
    (await listVersionsFromBinding()) ?? (await listVersionsFromFs())

  return versions.filter(Boolean).sort(compareVersionsDesc)
}

/**
 * The listing only changes when a version is archived, so it's memoized to
 * keep repeat requests from paging through the bucket again.
 */
export const getCachedSpecVersions = unstable_cache(
  getSpecVersions,
  ["api-ref-spec-versions"],
  {
    revalidate: 3600,
  }
)
