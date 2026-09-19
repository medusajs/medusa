const TS_NODE_SUPPORTED_MAJOR = 5

export function assertTypeScriptCompatibility(typescript: {
  version: string
  versionMajorMinor: string
}) {
  const major = Number.parseInt(typescript.versionMajorMinor, 10)
  if (Number.isFinite(major) && major > TS_NODE_SUPPORTED_MAJOR) {
    const error = new Error(
      `TypeScript ${typescript.version} is not supported by Medusa's runtime config loader. Use TypeScript 5.x until the loader no longer depends on ts-node.`
    ) as Error & { code: string }
    error.code = "MEDUSA_UNSUPPORTED_TYPESCRIPT"
    throw error
  }
}
