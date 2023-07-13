import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { OpenAPIV3 } from "openapi-types"
import readSpecDocument from "@/utils/read-spec-document"
// import resolveRefs from "@/utils/resolve-refs"
import getSectionId from "@/utils/get-section-id"
import { Operation } from "@/types/openapi"
import OpenAPIParser from "@readme/openapi-parser"

type ParsedPathItemObject = OpenAPIV3.PathItemObject<Operation> & {
  operationPath?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tagName = searchParams.get("tagName")
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

  // this is just to ensure that vercel picks up these files on build
  path.join(process.cwd(), "specs/admin/code_samples")
  path.join(process.cwd(), "specs/admin/components")
  path.join(process.cwd(), "specs/admin/paths")
  path.join(process.cwd(), "specs/store/code_samples")
  path.join(process.cwd(), "specs/store/components")
  path.join(process.cwd(), "specs/store/paths")

  // get path files
  const basePath = path.join(process.cwd(), `specs/${area}/paths`)

  const files = await fs.readdir(basePath)

  // read the path documents
  let documents: ParsedPathItemObject[] = await Promise.all(
    files.map(async (file) => {
      const fileContent = (await readSpecDocument(
        path.join(basePath, file)
      )) as OpenAPIV3.PathItemObject<Operation>

      return {
        ...fileContent,
        operationPath: `/${file
          .replaceAll("_", "/")
          .replace(/\.[A-Za-z]+$/, "")}`,
      }
    })
  )

  // console.log(documents)

  // filter out operations not related to the passed tag
  documents = documents.filter((document) =>
    Object.values(document).some((operation) => {
      if (typeof operation !== "object" || !("tags" in operation)) {
        return false
      }

      return operation.tags?.some((tag) => getSectionId([tag]) === tagName)
    })
  )

  // dereference the references in the paths
  let paths: OpenAPIV3.Document = {
    paths: {},
    // These attributes are only for validation purposes
    openapi: "3.0.0",
    info: {
      title: "Medusa API",
      version: "1.0.0",
    },
  }

  documents.forEach((document) => {
    const documentPath = document.operationPath || ""
    delete document.operationPath
    paths.paths[documentPath] = document
  })

  // resolve references in paths
  paths = (await OpenAPIParser.dereference(
    `${basePath}/`,
    paths,
    {}
  )) as unknown as OpenAPIV3.Document

  return NextResponse.json(
    {
      paths: paths.paths,
    },
    {
      status: 200,
    }
  )
}
