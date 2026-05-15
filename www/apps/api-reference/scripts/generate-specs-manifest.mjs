import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { parse as parseYaml } from "yaml"
import { getSectionId } from "docs-utils"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.join(__dirname, "..")

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
]

export async function generateSpecsPathsManifest() {
  const tagIndex = {}
  // operationsByTag[area][tagName] = [operationId, ...]  (tagName = original, not slugified)
  const operationsByTag = {}

  for (const area of ["admin", "store"]) {
    const pathsDir = path.join(appDir, "specs", area, "paths")
    let files = []
    try {
      const allFiles = await fs.readdir(pathsDir)
      files = allFiles.filter((f) => f.endsWith(".yaml"))
    } catch {
      // paths dir doesn't exist yet
    }
    tagIndex[area] = {}
    operationsByTag[area] = {}

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(pathsDir, file)
        try {
          const content = await fs.readFile(filePath, "utf-8")
          const parsed = parseYaml(content)
          for (const method of HTTP_METHODS) {
            const operation = parsed?.[method]
            if (!operation?.tags) {
              continue
            }
            for (const tag of operation.tags) {
              const sectionId = getSectionId([tag])
              if (!tagIndex[area][sectionId]) {
                tagIndex[area][sectionId] = []
              }
              if (!tagIndex[area][sectionId].includes(file)) {
                tagIndex[area][sectionId].push(file)
              }
              if (!operationsByTag[area][tag]) {
                operationsByTag[area][tag] = []
              }
              if (operation.operationId) {
                operationsByTag[area][tag].push(operation.operationId)
              }
            }
          }
        } catch {
          // skip unreadable files
        }
      })
    )
  }

  // Build sitemap data: ordered by openapi.yaml tags, with precomputed section IDs
  const sitemapData = {}
  for (const area of ["admin", "store"]) {
    const specPath = path.join(appDir, "specs", area, "openapi.yaml")
    let orderedTags = []
    try {
      const specContent = await fs.readFile(specPath, "utf-8")
      const spec = parseYaml(specContent)
      orderedTags = spec.tags ?? []
    } catch {
      // fall back to whatever tags we found in path files
      orderedTags = Object.keys(operationsByTag[area]).map((name) => ({ name }))
    }

    sitemapData[area] = orderedTags.map((tag) => ({
      tagSectionId: getSectionId([tag.name]),
      operationSectionIds: (operationsByTag[area][tag.name] ?? []).map((opId) =>
        getSectionId([tag.name, opId])
      ),
    }))
  }

  const generatedDir = path.join(appDir, "generated")
  await fs.mkdir(generatedDir, { recursive: true })

  await fs.writeFile(
    path.join(generatedDir, "specs-tag-index.mjs"),
    `export const specsTagIndex = ${JSON.stringify(tagIndex, null, 2)}\n`
  )

  await fs.writeFile(
    path.join(generatedDir, "specs-sitemap-data.mjs"),
    `export const specsSitemapData = ${JSON.stringify(sitemapData, null, 2)}\n`
  )
}
