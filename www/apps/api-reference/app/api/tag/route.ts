import { NextResponse } from "next/server"
import path from "path"
import getPathsOfTag from "@/utils/get-paths-of-tag"
import { Version } from "../../../types/openapi"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tagName = searchParams.get("tagName") || ""
  const area = searchParams.get("area")
  const version =
    process.env.NEXT_PUBLIC_VERSIONING === "true"
      ? (searchParams.get("version") as Version) || "1"
      : "1"

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

  // this is just to ensure that vercel picks up these files on build
  path.join(process.cwd(), "specs/admin/code_samples")
  path.join(process.cwd(), "specs/admin/components")
  path.join(process.cwd(), "specs/admin/paths")
  path.join(process.cwd(), "specs/store/code_samples")
  path.join(process.cwd(), "specs/store/components")
  path.join(process.cwd(), "specs/store/paths")
  path.join(process.cwd(), "specs-v2/admin/code_samples")
  path.join(process.cwd(), "specs-v2/admin/components")
  path.join(process.cwd(), "specs-v2/admin/paths")
  path.join(process.cwd(), "specs-v2/store/code_samples")
  path.join(process.cwd(), "specs-v2/store/components")
  path.join(process.cwd(), "specs-v2/store/paths")

  // get path files
  const paths = await getPathsOfTag(tagName, area, version)

  return NextResponse.json(
    {
      paths: paths.paths,
    },
    {
      status: 200,
    }
  )
}
