/* eslint-disable no-console */
import OpenAPIParser from "@readme/openapi-parser"
import algoliasearch from "algoliasearch"
import { JSDOM } from "jsdom"
import path from "path"
import { fileURLToPath } from "url"
import slugify from "slugify"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.resolve(__dirname, "..")

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/api"

function getUrl(area, tagName) {
  const anchor = tagName ? `#${tagName}` : ""
  return `${baseUrl}${basePath}/${area}${anchor}`
}

function getSectionId(parts) {
  return parts
    .map((p) => slugify(p.trim().toLowerCase()))
    .join("_")
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getObjectId(area, objectName) {
  return `${area}_${objectName}`
}

function getHierarchy(area, levels) {
  const hierarchy = { lvl0: `${capitalize(area)} API Reference` }
  levels.forEach((level, i) => {
    hierarchy[`lvl${i + 1}`] = level
  })
  return hierarchy
}

async function main() {
  const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
    process.env.ALGOLIA_WRITE_API_KEY || ""
  )
  const index = algoliaClient.initIndex(
    process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || ""
  )

  /**
   * @type {Record<string, any>[]}
   */
  const indices = []

  for (const area of ["store", "admin"]) {
    const defaultIndexData = {
      version: ["current"],
      lang: "en",
      _tags: ["api", `${area}-v2`],
    }

    // Index static MDX section headers from the live page
    const pageUrl = getUrl(area)
    console.log(`Scraping page headers from ${pageUrl}...`)
    try {
      const dom = await JSDOM.fromURL(pageUrl)
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
          type: "content",
          content: description || "",
          url,
          url_without_variables: url,
          url_without_anchor: url,
          ...defaultIndexData,
        })
      })
    } catch (e) {
      console.warn(`Failed to scrape ${pageUrl}: ${e.message}`)
    }

    // Parse OpenAPI spec and index tags + operations
    const specPath = path.join(appDir, `specs/${area}/openapi.full.yaml`)
    console.log(`Parsing spec at ${specPath}...`)
    const baseSpecs = await OpenAPIParser.parse(specPath)

    baseSpecs.tags?.forEach((tag) => {
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

    Object.values(baseSpecs.paths).forEach((pathItem) => {
      Object.values(pathItem).forEach((operation) => {
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

        if (operation.description) {
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
        }
      })
    })
  }

  console.log(`Saving ${indices.length} records to Algolia...`)
  if (indices.length) {
    await index.saveObjects(indices, { autoGenerateObjectIDIfNotExist: true })
  }
  console.log("Done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
