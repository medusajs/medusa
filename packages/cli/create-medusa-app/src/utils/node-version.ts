export const MIN_SUPPORTED_NODE_VERSION = "20.12.0"

export function isNodeVersionSupported(): boolean {
  const [major, minor] = process.versions.node.split(".").map(Number)
  const [minMajor, minMinor] = MIN_SUPPORTED_NODE_VERSION.split(".").map(Number)

  return major > minMajor || (major === minMajor && minor >= minMinor)
}
