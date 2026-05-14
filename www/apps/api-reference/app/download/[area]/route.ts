import { NextResponse } from "next/server"

export const runtime = "edge"

type DownloadParams = {
  params: {
    area: string
  }
}

export async function GET(request: Request, { params }: DownloadParams) {
  const { area } = params
  const { origin } = new URL(request.url)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  const specRes = await fetch(
    `${origin}${basePath}/specs/${area}/openapi.full.yaml`
  )
  if (!specRes.ok) {
    return new NextResponse(null, {
      status: 404,
    })
  }

  return new Response(specRes.body, {
    headers: {
      "Content-Type": "application/x-yaml",
      "Content-Disposition": `attachment; filename="openapi.yaml"`,
    },
  })
}
