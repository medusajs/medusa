import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { OpenAPIV3 } from "openapi-types"
import mergeObjects from "@/utils/merge-object"
import readSpecDocument from "@/utils/read-spec-document"
import resolveRefs from "@/utils/resolve-refs"
import getSectionId from "@/utils/get-section-id"
import { Operation } from "@/types/openapi"
import flattenArray from "@/utils/flatten-array"
import convertToOpenApi from "@/utils/convert-to-openapi"

export async function GET(req: NextRequest) {
  const tagName = req.nextUrl.pathname.replace("/api/tag/", "").replace("/", "")

  // get path files
  const basePath = path.join(process.cwd(), "specs/admin/paths")
  // this is just to ensure that vercel picks up these files on build
  path.join(process.cwd(), "specs/admin/code_samples")
  path.join(process.cwd(), "specs/admin/components")

  const files = await fs.readdir(basePath)

  let documents: OpenAPIV3.PathItemObject<Operation>[] = await Promise.all(
    files.map(async (file) => {
      return (await readSpecDocument(
        path.join(basePath, file)
      )) as OpenAPIV3.PathItemObject<Operation>
    })
  )

  documents = documents.filter((document) =>
    Object.values(document).some((operation) => {
      if (typeof operation !== "object" || !("tags" in operation)) {
        return false
      }

      return operation.tags?.some((tag) => getSectionId([tag]) === tagName)
    })
  )

  documents = await Promise.all(
    documents.map(async (document) => {
      // load all references in document
      const keys = Object.keys(document)
      let values = await Promise.all(
        Object.values(document).map(async (operation) => {
          if (typeof operation === "string") {
            return operation
          }

          if ("operationId" in operation && operation.operationId) {
            return await resolveRefs(operation, basePath)
          }

          return operation
        })
      )
      values = flattenArray(values)

      values.map((v) => {
        if (typeof v === "string") {
          return v
        }

        return convertToOpenApi(v)
      })

      const result = mergeObjects(keys, values)

      return result
    })
  )

  return NextResponse.json(
    {
      paths: documents,
    },
    {
      status: 200,
    }
  )
}
