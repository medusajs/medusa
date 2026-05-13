/* eslint-disable no-console */
/**
 * Indexes the API reference to Algolia.
 * Run manually via the "Index API Reference to Algolia" GitHub Actions workflow.
 *
 * Required env vars:
 *   NEXT_PUBLIC_ALGOLIA_APP_ID
 *   ALGOLIA_WRITE_API_KEY
 *   NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME
 *   NEXT_PUBLIC_SITE_URL   — deployed URL of the api-reference app (e.g. https://docs.medusajs.com)
 *   NEXT_PUBLIC_BASE_PATH  — defaults to /v1/api
 */

import path from "path"
import { promises as fs } from "fs"
import { createRequire } from "module"
import { fileURLToPath } from "url"
import { JSDOM } from "jsdom"

const require = createRequire(import.meta.url)
const OpenAPIParser = require("@readme/openapi-parser")
const algoliasearch = require("algoliasearch")
const slugify = require("slugify")
const { parseDocument } = require("yaml")

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const specsDir = path.join(__dirname, "..", "specs")

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/v1/api"

function getSectionId(parts) {
  return parts.map((p) => slugify(p.trim().toLowerCase())).join("_")
}

function getUrl(area, tagName) {
  return `${siteUrl}${basePath}/${area}#${tagName}`
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function readSpecDocument(filePath) {
  const fileContent = await fs.readFile(filePath, "utf-8")
  return parseDocument(fileContent).toJS()
}

async function getPathsOfTag(tagName, area) {
  const basePath = path.join(specsDir, area, "paths")
  const files = await fs.readdir(basePath)

  let documents = await Promise.all(
    files.map(async (file) => {
      const fileContent = await readSpecDocument(path.join(basePath, file))
      return {
        ...fileContent,
        operationPath: `/${file
          .replaceAll(/(?<!\{[^}]*)_(?![^{]*\})/g, "/")
          .replace(/\.[A-Za-z]+$/, "")}`,
      }
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

  let paths = {
    paths: {},
    openapi: "3.0.0",
    info: { title: "Medusa API", version: "1.0.0" },
  }

  documents.forEach((document) => {
    const documentPath = document.operationPath || ""
    delete document.operationPath
    paths.paths[documentPath] = document
  })

  paths = await OpenAPIParser.dereference(`${basePath}/`, paths, {
    parse: {
      text: {
        canParse: /.*/,
      },
    },
  })

  return paths
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
  if (
    !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ||
    !process.env.ALGOLIA_WRITE_API_KEY
  ) {
    throw new Error("Missing required Algolia env vars")
  }

  const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_WRITE_API_KEY
  )
  const index = algoliaClient.initIndex(
    process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || ""
  )

  const indices = []

  for (const area of ["store", "admin"]) {
    const defaultIndexData = {
      version: ["current"],
      lang: "en",
      _tags: ["api", area],
    }

    const areaUrl = getUrl(area, "")
    const dom = await JSDOM.fromURL(areaUrl.replace(/#$/, ""))
    const headers = dom.window.document.querySelectorAll("h2")
    headers.forEach((header) => {
      if (!header.textContent) {
        return
      }
      const objectID = getSectionId([header.textContent])
      const url = getUrl(area, objectID)
      indices.push({
        objectID: getObjectId(area, `${objectID}-mdx-section`),
        hierarchy: getHierarchy(area, [header.textContent]),
        type: "content",
        content: header.textContent,
        url,
        url_without_variables: url,
        url_without_anchor: url,
        ...defaultIndexData,
      })
    })

    const baseSpecs = await OpenAPIParser.parse(
      path.join(specsDir, area, "openapi.yaml")
    )

    await Promise.all(
      (baseSpecs.tags || []).map(async (tag) => {
        const tagName = getSectionId([tag.name])
        const url = getUrl(area, tagName)
        indices.push({
          objectID: getObjectId(area, tagName),
          hierarchy: getHierarchy(area, [tag.name]),
          type: "lvl1",
          content: null,
          url,
          url_without_variables: url,
          url_without_anchor: url,
          ...defaultIndexData,
        })

        const paths = await getPathsOfTag(tagName, area)

        Object.values(paths.paths).forEach((pathItem) => {
          Object.values(pathItem).forEach((op) => {
            const operation = op
            if (
              !operation ||
              typeof operation !== "object" ||
              !operation.operationId
            ) {
              return
            }

            const operationName = getSectionId([
              tag.name,
              operation.operationId,
            ])
            const url = getUrl(area, operationName)
            indices.push({
              objectID: getObjectId(area, operationName),
              hierarchy: getHierarchy(area, [tag.name, operation.summary]),
              type: "content",
              content: operation.summary,
              content_camel: operation.summary,
              url,
              url_without_variables: url,
              url_without_anchor: url,
              ...defaultIndexData,
            })

            if (operation.description) {
              const descId = getSectionId([
                tag.name,
                operation.operationId,
                operation.description.substring(
                  0,
                  Math.min(20, operation.description.length)
                ),
              ])
              indices.push({
                objectID: getObjectId(area, descId),
                hierarchy: getHierarchy(area, [
                  tag.name,
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
      })
    )
  }

  if (indices.length) {
    await index.saveObjects(indices, { autoGenerateObjectIDIfNotExist: true })
    console.log(`Indexed ${indices.length} objects to Algolia`)
  } else {
    console.log("No objects to index")
  }
}

main().catch((err) => {
  console.error("Algolia indexing failed:", err)
  process.exit(1)
})
