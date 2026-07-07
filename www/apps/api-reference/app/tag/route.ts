import { NextResponse } from "next/server"
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
