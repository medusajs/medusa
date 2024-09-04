import { retrieveMdxPages } from "build-scripts"
import type { MetadataRoute } from "next"
import path from "path"
import { config } from "../config"
import { basePathUrl } from "../utils/base-path-url"

export default function sitemap(): MetadataRoute.Sitemap {
  return retrieveMdxPages({
    basePath: path.resolve("app"),
  }).map((filePath) => ({
    url: `${config.baseUrl}${basePathUrl(filePath)}`,
  }))
}
