/* eslint-disable no-console */
import OpenAPIParser from "@readme/openapi-parser"
import algoliasearch from "algoliasearch"
import { JSDOM } from "jsdom"
import path from "path"
import { fileURLToPath } from "url"
import {
  apiRefIntroSections,
  apiRefPaths,
} from "../generated/api-ref-paths.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.resolve(__dirname, "..")

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/api"

// The app now uses real page paths (no hash anchors), e.g.
// `/api/store/carts/get-a-cart`. Slugs/paths are read from the generated
// `api-ref-paths.mjs` (the single source of truth) rather than recomputed.
function getAreaUrl(area) {
  return `${baseUrl}${basePath}/${area}`
}

function getPageUrl(pagePath) {
  return `${baseUrl}${basePath}${pagePath}`
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

// Build a `title` -> intro section slug lookup for the scraped MDX headers.
function getIntroSlugByTitle(area) {
  const map = new Map()
  ;(apiRefIntroSections[area] || []).forEach((section) => {
    map.set(section.title.trim().toLowerCase(), section.slug)
  })
  return map
}

// Build an `operationId` -> generated operation entry (path/oldHash/title/...)
// lookup across all of an area's tags.
function getOperationsById(area) {
  const map = new Map()
  const tags = apiRefPaths[area]?.tags || {}
  Object.entries(tags).forEach(([tagSlug, tag]) => {
    Object.entries(tag.operations || {}).forEach(([operationId, operation]) => {
      map.set(operationId, { ...operation, tagSlug })
    })
  })
  return map
}

// Build a tag `name` -> generated tag entry (path/schemaPath/...) lookup.
function getTagsByName(area) {
  const map = new Map()
  const tags = apiRefPaths[area]?.tags || {}
  Object.entries(tags).forEach(([tagSlug, tag]) => {
    map.set(tag.name.trim().toLowerCase(), { ...tag, tagSlug })
  })
  return map
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

    const introSlugByTitle = getIntroSlugByTitle(area)
    const operationsById = getOperationsById(area)
    const tagsByName = getTagsByName(area)
    const introPaths = apiRefPaths[area]?.intro || {}

    // Index static MDX section headers from the live page. Each `h2` maps to an
    // intro section that now has its own page path (`/api/{area}/{slug}`).
    const pageUrl = getAreaUrl(area)
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
        const slug = introSlugByTitle.get(
          normalizedHeaderContent.trim().toLowerCase()
        )
        if (!slug) {
          console.warn(
            `No intro section slug found for header "${normalizedHeaderContent.trim()}" in ${area}; skipping.`
          )
          return
        }
        const url = getPageUrl(introPaths[slug] || `/${area}/${slug}`)
        indices.push({
          objectID: getObjectId(area, `${slug}-mdx-section`),
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

    // Parse OpenAPI spec for tag/operation descriptions, joining each to its
    // generated page path (and stable objectID) via name/operationId.
    const specPath = path.join(appDir, `specs/${area}/openapi.full.yaml`)
    console.log(`Parsing spec at ${specPath}...`)
    const baseSpecs = await OpenAPIParser.parse(specPath)

    baseSpecs.tags?.forEach((tag) => {
      const tagEntry = tagsByName.get(tag.name.trim().toLowerCase())
      if (!tagEntry) {
        console.warn(
          `No generated path for tag "${tag.name}" in ${area}; skipping.`
        )
        return
      }
      const url = getPageUrl(tagEntry.path)
      indices.push({
        objectID: getObjectId(area, tagEntry.tagSlug),
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
        if (!operation?.operationId) {
          return
        }
        const operationEntry = operationsById.get(operation.operationId)
        if (!operationEntry) {
          console.warn(
            `No generated path for operation "${operation.operationId}" in ${area}; skipping.`
          )
          return
        }
        const url = getPageUrl(operationEntry.path)

        indices.push({
          objectID: getObjectId(area, operationEntry.oldHash),
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
          indices.push({
            objectID: getObjectId(
              area,
              `${operationEntry.oldHash}-description`
            ),
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
