export function resolveExports(moduleExports) {
  if ("default" in moduleExports && "default" in moduleExports.default) {
    return resolveExports(moduleExports.default)
  }
  return moduleExports
}
