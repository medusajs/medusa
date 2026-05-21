import path from "path"

export function shouldIgnoreBackendBuildFile(
  projectRoot: string,
  fileName: string,
  chunksToIgnore: string[]
): boolean {
  const relativeFileName = path.relative(projectRoot, fileName)
  const fileSegments = relativeFileName.split(path.sep)

  return chunksToIgnore.some((chunk) => {
    const chunkSegments = chunk.split(/[\\/]+/)

    return fileSegments.some((_segment, index) =>
      chunkSegments.every(
        (chunkSegment, chunkIndex) =>
          fileSegments[index + chunkIndex] === chunkSegment
      )
    )
  })
}
