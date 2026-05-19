import { existsSync, readFileSync } from "fs"
import { NextResponse } from "next/server"
import path from "path"

type DownloadParams = {
  params: Promise<{
    area: string
  }>
}

export async function GET(request: Request, props: DownloadParams) {
  const params = await props.params
  const { area } = params
  const { searchParams } = new URL(request.url)
  const version = searchParams.get("version")

  const defaultPath = path.join(
    process.cwd(),
    "specs",
    area,
    "openapi.full.yaml"
  )
  const versionedPath = version
    ? path.join(
        process.cwd(),
        "specs",
        "versions",
        version,
        area,
        "openapi.full.yaml"
      )
    : null
  const filePath =
    versionedPath && existsSync(versionedPath) ? versionedPath : defaultPath

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
