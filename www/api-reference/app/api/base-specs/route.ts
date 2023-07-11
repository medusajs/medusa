import { NextResponse } from "next/server"
import path from "path"
import OpenAPIParser from "@readme/openapi-parser"

export async function GET() {
  const baseSpecs = await OpenAPIParser.parse(path.join(process.cwd(), "specs/admin/openapi.yaml"),)

  return NextResponse.json(baseSpecs, {
    status: 200,
  })
}
