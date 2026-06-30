import path from "path"

export function getPathForEnv(...pathSegments: string[]): string {
  const isCloudflare = !!process.env.SPECS_R2_BASE_URL

  if (isCloudflare) {
    return pathSegments.join("/")
  }

  return path.join(...pathSegments)
}
