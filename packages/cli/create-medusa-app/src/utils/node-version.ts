export const MIN_SUPPORTED_NODE_VERSION = "22.22.0"

export function getNodeVersion(): string {
  return process.versions.node
}

export function isNodeVersionSupported(
  version: string = getNodeVersion()
): boolean {
  const current = version.split(".").map(Number)
  const minimum = MIN_SUPPORTED_NODE_VERSION.split(".").map(Number)

  for (let i = 0; i < minimum.length; i++) {
    const part = current[i] ?? 0
    if (part !== minimum[i]) {
      return part > minimum[i]
    }
  }

  return true
}
