import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"
import { parseDocument } from "yaml"

export function GET() {
  const apiSpecFile = fs.readFileSync(
    path.join(process.cwd(), "specs/admin/openapi.yaml"),
    "utf-8"
  )
  const baseSpecs = parseDocument(apiSpecFile)

  return NextResponse.json(baseSpecs, {
    status: 200,
  })
}
