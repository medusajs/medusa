import { existsSync, readFileSync } from "fs"
import { NextResponse } from "next/server"
import path from "path"

type DownloadParams = {
  params: {
    area: string
  }
}

export function GET(request: Request, { params }: DownloadParams) {
  const { area } = params
  const filePath = path.join(process.cwd(), "specs", area, "openapi.full.yaml")

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
