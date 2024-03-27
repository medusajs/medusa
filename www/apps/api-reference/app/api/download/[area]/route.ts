import { existsSync, readFileSync } from "fs"
import { NextResponse } from "next/server"
import path from "path"
import { Version } from "../../../../types/openapi"

type DownloadParams = {
  params: {
    area: string
  }
}

export function GET(request: Request, { params }: DownloadParams) {
  const { searchParams } = new URL(request.url)
  const { area } = params
  const version =
    process.env.NEXT_PUBLIC_VERSIONING === "true"
      ? (searchParams.get("version") as Version) || "1"
      : "1"
  const filePath = path.join(
    process.cwd(),
    `${version === "1" ? "specs" : "specs-v2"}/${area}/openapi.full.yaml`
  )

  if (!existsSync(filePath)) {
    return new NextResponse(null, {
      status: 404,
    })
  }

  const fileContent = readFileSync(filePath)

  return new Response(fileContent, {
    headers: {
      "Content-Type": "application/x-yaml",
      "Content-Disposition": `attachment; filename="openapi.yaml"`,
    },
  })
}
