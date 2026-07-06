import path from "path"

export function getBackendDirectory(projectDirectory: string): string {
  return path.join(projectDirectory, "apps", "backend")
}

export function getStorefrontDirectory(projectDirectory: string): string {
  return path.join(projectDirectory, "apps", "storefront")
}
