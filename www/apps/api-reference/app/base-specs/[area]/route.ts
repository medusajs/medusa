import { NextResponse } from "next/server"

export const runtime = "edge"

type RouteParams = { params: { area: string } }

export async function GET(request: Request, { params }: RouteParams) {
  const { searchParams, origin } = new URL(request.url)
  const { area } = params
  const expand = searchParams.get("expand")
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

  const baseSpecsRes = await fetch(
    `${origin}${basePath}/specs/${area}/base.json`
  )
  if (!baseSpecsRes.ok) {
    return NextResponse.json({ success: false }, { status: 500 })
  }

  const baseSpecs = await baseSpecsRes.json()

  if (expand) {
    const tagRes = await fetch(
      `${origin}${basePath}/specs/${area}/tags/${expand}.json`
    )
    if (tagRes.ok) {
      const paths = await tagRes.json()
      if (paths) {
        baseSpecs.expandedTags = {}
        baseSpecs.expandedTags[expand] = paths.paths
      }
    }
  }

  return NextResponse.json(baseSpecs, {
    status: 200,
  })
}
