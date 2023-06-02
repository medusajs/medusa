import fs from "fs"
import path from "path"
import { parseDocument } from "yaml"
import { OpenAPIV3 } from "openapi-types"
import slugify from "slugify"
import { NextResponse } from "next/server"

export function GET() {
  const fullSpecFile = fs.readFileSync(
    path.join(process.cwd(), "specs/admin/full.yaml"),
    "utf-8"
  )
  const fullSpecs = parseDocument(fullSpecFile).toJS() as OpenAPIV3.Document
  const paths: {
    tag: string[]
  }[] = []
  fullSpecs.tags?.forEach((tag) => {
    const tagSlugName = slugify(tag.name.toLowerCase())
    paths.push({
      tag: [tagSlugName],
    })

    // find sub-paths of this tag
    Object.values(fullSpecs.paths).forEach((operation) => {
      if (operation) {
        Object.values(operation).forEach((op) => {
          if (typeof op !== "object" || !("tags" in op)) {
            return
          }

          if (op.tags?.includes(tag.name) && op.operationId) {
            paths.push({
              tag: [tagSlugName, slugify(op.operationId.toLowerCase())],
            })
          }
        })
      }
    })
  })

  return NextResponse.json({ paths }, { status: 200 })
}
