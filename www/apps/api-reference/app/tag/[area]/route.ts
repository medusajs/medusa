import { NextResponse } from "next/server"

export const runtime = "edge"

type RouteParams = { params: { area: string } }

export async function GET(request: Request, { params }: RouteParams) {
  const { searchParams, origin } = new URL(request.url)
  const { area } = params
  const tagName = searchParams.get("tagName") || ""
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

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

  const tagRes = await fetch(
    `${origin}${basePath}/specs/${area}/tags/${tagName}.json`
  )
  if (!tagRes.ok) {
    return NextResponse.json(
      { success: false, message: `tag ${tagName} not found` },
      { status: 404 }
    )
  }

  const paths = await tagRes.json()

  return NextResponse.json(
    {
      paths: paths.paths,
    },
    {
      status: 200,
    }
  )
}
