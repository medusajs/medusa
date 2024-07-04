import { NextResponse } from "next/server"
import { SchemaObject } from "../../../../types/openapi"
import path from "path"
import { existsSync, promises as fs } from "fs"
import { parseDocument } from "yaml"
import dereference from "../../../../utils/dereference"

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

  const baseSchemasPath = path.join(
    process.cwd(),
    "specs",
    area,
    "components",
    "schemas"
  )
  const schemaPath = path.join(baseSchemasPath, name)

  if (!existsSync(schemaPath)) {
    return NextResponse.json(
      {
        success: false,
        message: `Schema ${name} doesn't exist.`,
      },
      {
        status: 404,
      }
    )
  }

  const schemaContent = await fs.readFile(schemaPath, "utf-8")
  const schema = parseDocument(schemaContent).toJS() as SchemaObject

  // resolve references in schema
  const dereferencedDocument = await dereference({
    basePath: baseSchemasPath,
    schemas: [schema],
  })

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
}
