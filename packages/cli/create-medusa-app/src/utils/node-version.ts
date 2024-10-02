export function getNodeVersion(): number {
  const [major] = process.versions.node.split('.').map(Number)

  return major
}

export const MIN_SUPPORTED_NODE_VERSION = 20