export function resolveExports(moduleExports) {
  if ("__esModule" in moduleExports && "default" in moduleExports.default) {
    return resolveExports(moduleExports.default)
  }
  return moduleExports
}
