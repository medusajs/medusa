import { siteConfig } from "../config/site"

export function absoluteUrl(path = "") {
  return `${siteConfig.baseUrl}${path}`
}
