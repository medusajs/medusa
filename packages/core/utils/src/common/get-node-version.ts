export function getNodeVersion(): number {
  const [major] = process.versions.node.split('.').map(Number)

  return major
}