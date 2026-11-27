/**
 * File names auto-loaded resources (routes, subscribers, workflows, ...) are
 * never loaded from: files starting with `_`, and test files.
 */
export const EXCLUDED_RESOURCE_FILES: RegExp[] = [
  /^_[^/\\]*(\.[^/\\]+)?$/,
  /\.spec\.[jt]s$/,
  /\.test\.[jt]s$/,
]

export function isExcludedResourceFile(fileName: string): boolean {
  return EXCLUDED_RESOURCE_FILES.some((exclude) => exclude.test(fileName))
}
