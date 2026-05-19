import OpenAPIParser from "@readme/openapi-parser"
import algoliasearch from "algoliasearch"
import type { OpenAPI } from "types"
import path from "path"
import { NextResponse } from "next/server"
import { JSDOM } from "jsdom"
import getUrl from "../../utils/get-url"
import { capitalize } from "docs-ui"
import { getSectionId } from "docs-utils"

export async function GET() {
  const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
    process.env.ALGOLIA_WRITE_API_KEY || ""
  )
  const index = algoliaClient.initIndex(
    process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || ""
  )

  // retrieve tags and their operations to index them
  const indices: Record<string, any>[] = []
  for (const area of ["store", "admin"]) {
    const defaultIndexData = {
      version: ["current"],
      lang: "en",
      _tags: ["api", `${area}-v2`],
    }
    // find and parse static headers from pages
    const dom = await JSDOM.fromURL(getUrl(area))
    const headers = dom.window.document.querySelectorAll("h2")
    headers.forEach((header) => {
      if (!header.textContent || !header.nextSibling?.textContent) {
        return
      }
      const normalizedHeaderContent = header.textContent.replaceAll("#", "")
      const description = header.nextSibling?.textContent

      const objectID = getSectionId([normalizedHeaderContent])
      const url = getUrl(area, objectID)
      indices.push({
        objectID: getObjectId(area, `${objectID}-mdx-section`),
        hierarchy: getHierarchy(area, [normalizedHeaderContent]),
        type: `content`,
        content: description || "",
        url,
        url_without_variables: url,
        url_without_anchor: url,
        ...defaultIndexData,
      })
    })

    // find and index tag and operations
    const baseSpecs = (await OpenAPIParser.parse(
      path.join(process.cwd(), `specs/${area}/openapi.full.yaml`)
    )) as OpenAPI.ExpandedDocument

    baseSpecs.tags?.map((tag) => {
      const tagName = getSectionId([tag.name])
      const url = getUrl(area, tagName)
      indices.push({
        objectID: getObjectId(area, tagName),
        hierarchy: getHierarchy(area, [tag.name]),
        type: "lvl1",
        content: null,
        description: tag.description,
        url,
        url_without_variables: url,
        url_without_anchor: url,
        ...defaultIndexData,
      })
    })

    const paths = baseSpecs.paths

    Object.values(paths).forEach((path) => {
      Object.values(path).forEach((op) => {
        const operation = op as OpenAPI.Operation
        const tag = operation.tags?.[0]
        const operationName = getSectionId([tag || "", operation.operationId])
        const url = getUrl(area, operationName)
        indices.push({
          objectID: getObjectId(area, operationName),
          hierarchy: getHierarchy(area, [operation.summary]),
          type: "content",
          content: operation.summary,
          content_camel: operation.summary,
          url,
          url_without_variables: url,
          url_without_anchor: url,
          ...defaultIndexData,
        })

        // index its description
        const operationDescriptionId = getSectionId([
          tag || "",
          operation.operationId,
          operation.description.substring(
            0,
            Math.min(20, operation.description.length)
          ),
        ])

        indices.push({
          objectID: getObjectId(area, operationDescriptionId),
          hierarchy: getHierarchy(area, [
            operation.summary,
            operation.description,
          ]),
          type: "content",
          content: operation.description,
          content_camel: operation.description,
          url,
          url_without_variables: url,
          url_without_anchor: url,
          ...defaultIndexData,
        })
      })
    })
  }

  if (indices.length) {
    await index.saveObjects(indices, {
      autoGenerateObjectIDIfNotExist: true,
    })
  }

  return NextResponse.json({
    message: "done",
    total: indices.length,
  })
}

function getObjectId(area: string, objectName: string): string {
  return `${area}_${objectName}`
}

function getHierarchy(area: string, levels: string[]): Record<string, string> {
  const heirarchy: Record<string, string> = {
    lvl0: `${capitalize(area)} API Reference`,
  }

  let counter = 1
  levels.forEach((level) => {
    heirarchy[`lvl${counter}`] = level
    counter++
  })

  return heirarchy
}

export const dynamic = "force-dynamic"
