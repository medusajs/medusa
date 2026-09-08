import path from "path"
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
 * Lists the version directories under `specs/versions` in the R2 bucket using
 * the bucket binding. Returns `null` outside Cloudflare (next dev / build) or
 * when the binding isn't configured, so callers can fall back to the local
 * `specs` directory.
 */
async function listVersionsFromBinding(): Promise<string[] | null> {
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
    const prefix = `${basePrefix ? `${basePrefix}/` : ""}specs/versions/`

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
