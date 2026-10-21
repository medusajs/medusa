import type { MetadataRoute } from "next"
import { config } from "../config"
import { sitemapUrls } from "../generated/sitemap-urls.mjs"
import { basePathUrl } from "../utils/base-path-url"

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapUrls.map((filePath) => ({
    url: `${config.baseUrl}${basePathUrl(filePath)}`,
  }))
}
