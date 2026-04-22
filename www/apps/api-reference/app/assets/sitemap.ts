import { MetadataRoute } from "next"
import OpenAPIParser from "@readme/openapi-parser"
import path from "path"
import type { ExpandedDocument, Operation } from "../../types/openapi"
import getUrl from "../../utils/get-url"
import getSectionId from "../../utils/get-section-id"
import getPathsOfTag from "../../utils/get-paths-of-tag"
import { config } from "../../config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return []
}
