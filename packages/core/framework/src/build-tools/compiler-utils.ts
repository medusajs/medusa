import path from "path"

/**
 * Determines whether a file should be excluded from the build output.
 *
 * Each entry in "chunksToIgnore" is matched against the path *segments* of
 * "relativeFileName" rather than as a raw substring. Single-segment entries
 * (e.g. "test") match a directory or file named exactly that, while
 * multi-segment entries (e.g. "src/admin") only match when those segments
 * appear consecutively in the path.
 *
 * Matching on segments (instead of "String.includes") prevents user files such
 * as "src/scripts/seed-test-accounts.ts" from being silently dropped just
 * because their name happens to contain an ignored substring like "test".
 */
export function isFileIgnored(
  relativeFileName: string,
  chunksToIgnore: string[]
): boolean {
  const segments = relativeFileName.split(path.sep)

  return chunksToIgnore.some((chunk) => {
    const chunkSegments = chunk.split("/")
    return segments.some((_, index) =>
      chunkSegments.every(
        (chunkSegment, offset) => segments[index + offset] === chunkSegment
      )
    )
  })
}
