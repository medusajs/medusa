import { NextResponse } from "next/server"
import path from "path"
import getPathsOfTag from "@/utils/get-paths-of-tag"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tagName = searchParams.get("tagName") || ""
  const area = searchParams.get("area")

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
  path.join(process.cwd(), "specs")

  // get path files
  const paths = await getPathsOfTag(tagName, area)

  return NextResponse.json(
    {
      paths: paths.paths,
    },
    {
      status: 200,
    }
  )
}
