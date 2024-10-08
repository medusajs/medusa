import { NextResponse } from "next/server"
import path from "path"
import OpenAPIParser from "@readme/openapi-parser"
import getPathsOfTag from "@/utils/get-paths-of-tag"
import type { ExpandedDocument } from "@/types/openapi"

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
  const baseSpecs = (await OpenAPIParser.parse(
    path.join(process.cwd(), "specs", area, "openapi.yaml")
  )) as ExpandedDocument

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
