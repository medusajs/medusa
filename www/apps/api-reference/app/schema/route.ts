import { NextResponse } from "next/server"
import getSchemaContent from "../../utils/get-schema-content"
import { getPathForEnv } from "../../utils/get-path-for-env"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let name = searchParams.get("name")
  const area = searchParams.get("area")

  if (!name) {
    return NextResponse.json(
      {
        success: false,
        message: `Name is required.`,
      },
      {
        status: 400,
      }
    )
  }

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

  name = name
    .replace("#/components/schemas/", "")
    .replaceAll("./components/schemas/", "")

  const r2Base = process.env.SPECS_R2_BASE_URL

  const baseSchemasUrl = getPathForEnv(
    r2Base || process.cwd(),
    "specs",
    area,
    "components",
    "schemas"
  )
  const schemaUrl = getPathForEnv(baseSchemasUrl, name)

  try {
    const { dereferencedDocument, originalSchema: schema } =
      await getSchemaContent(schemaUrl, baseSchemasUrl)

    return NextResponse.json(
      {
        schema: dereferencedDocument.components?.schemas
          ? Object.values(dereferencedDocument.components?.schemas)[0]
          : schema,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch schema: ${error}`,
      },
      {
        status: 500,
      }
    )
  }
}
