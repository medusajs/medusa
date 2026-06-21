import { NextResponse } from "next/server"
import path from "path"
import OpenAPIParser from "@readme/openapi-parser"
import getPathsOfTag from "@/utils/get-paths-of-tag"
import type { OpenAPI } from "types"
import { workerCompatibleFetch } from "docs-utils"
import { parse as parseYaml } from "yaml"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get("area")
  const expand = searchParams.get("expand")
  if (area !== "admin" && area !== "store") {
    return NextResponse.json(
      {
        success: false,
        message: `area ${area} is not allowed`,
      },
      {
        status: 400,
      }
    )
  }
  const r2Base = process.env.SPECS_R2_BASE_URL
  const specPath = r2Base
    ? `${r2Base}/specs/${area}/openapi.yaml`
    : path.join(process.cwd(), "specs", area, "openapi.yaml")
  const baseSpecs = await workerCompatibleFetch<OpenAPI.ExpandedDocument>({
    url: specPath,
    responseTransformer: async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch spec: ${specPath} (${res.status})`)
      }
      const text = await res.text()
      return (await parseYaml(text)) as OpenAPI.ExpandedDocument
    },
    fallbackAction: async () => {
      // In local development, we can read the spec directly from the filesystem
      return (await OpenAPIParser.parse(specPath)) as OpenAPI.ExpandedDocument
    },
  })

  if (expand) {
    const paths = await getPathsOfTag(expand, area)
    if (paths) {
      baseSpecs.expandedTags = {}
      baseSpecs.expandedTags[expand] = paths.paths
    }
  }

  return NextResponse.json(baseSpecs, {
    status: 200,
  })
}
