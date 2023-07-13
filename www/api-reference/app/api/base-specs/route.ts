import { NextResponse } from "next/server"
import path from "path"
import OpenAPIParser from "@readme/openapi-parser"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
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
  const baseSpecs = await OpenAPIParser.parse(
    path.join(process.cwd(), `specs/${area}/openapi.yaml`)
  )

  return NextResponse.json(baseSpecs, {
    status: 200,
  })
}
