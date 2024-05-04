export function getLinkWithBasePath(path: string, basePath?: string): string {
  return `${basePath || ""}${path}`
}
