import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { parse as parseYaml } from "yaml"
import {
  findAllPageHeadings,
  getApiRefIntroSlug,
  getApiRefPath,
  getApiRefTagOperationSlugs,
  getApiRefTagSlug,
  getSectionId,
} from "docs-utils"
import pluralize from "pluralize"

const { singular } = pluralize

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

const AREAS = ["admin", "store"]

const getMethodOrder = (method) => {
  switch (method) {
    case "get":
      return 1
    case "post":
      return 2
    case "delete":
      return 3
    default:
      return 4
  }
}

// Mirror of the api-reference `compareOperations` display sort so slug
// de-duplication numbering (`-2`, `-3`, ...) matches the rendered order.
const compareOperations = (a, b) => {
  const orderDiff = getMethodOrder(a.method) - getMethodOrder(b.method)
  if (orderDiff !== 0) {
    return orderDiff
  }

  return (a.summary || "").localeCompare(b.summary || "")
}

export async function generateSpecsPathsManifest() {
  const tagIndex = {}
  // operationsByTag[area][tagName] = [{ operationId, method, summary, xSidebarSummary }]
  const operationsByTag = {}

  for (const area of AREAS) {
    const pathsDir = path.join(appDir, "specs", area, "paths")
    let files = []
    try {
      const allFiles = await fs.readdir(pathsDir)
      // Sort the file list so the generated output is deterministic
      // regardless of the OS/filesystem order that `readdir` returns.
      files = allFiles.filter((f) => f.endsWith(".yaml")).sort()
    } catch {
      // paths dir doesn't exist yet
    }
    tagIndex[area] = {}
    operationsByTag[area] = {}

    // Read and parse all files in parallel, but keep the results in the
    // sorted `files` order (`Promise.all` preserves input order) so the
    // arrays built below don't depend on I/O resolution timing.
    const parsedFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(pathsDir, file)
        try {
          const content = await fs.readFile(filePath, "utf-8")
          return { file, parsed: parseYaml(content) }
        } catch {
          // skip unreadable files
          return { file, parsed: null }
        }
      })
    )

    for (const { file, parsed } of parsedFiles) {
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
            operationsByTag[area][tag].push({
              operationId: operation.operationId,
              method,
              summary: operation.summary,
              "x-sidebar-summary": operation["x-sidebar-summary"],
            })
          }
        }
      }
    }
  }

  // Read ordered tags (with x-associatedSchema) from each area's base spec.
  const orderedTagsByArea = {}
  for (const area of AREAS) {
    const specPath = path.join(appDir, "specs", area, "openapi.yaml")
    try {
      const specContent = await fs.readFile(specPath, "utf-8")
      const spec = parseYaml(specContent)
      orderedTagsByArea[area] = spec.tags ?? []
    } catch {
      orderedTagsByArea[area] = Object.keys(operationsByTag[area]).map(
        (name) => ({ name })
      )
    }
  }

  // Build sitemap data: ordered by openapi.yaml tags, with precomputed section IDs
  const sitemapData = {}
  for (const area of AREAS) {
    sitemapData[area] = orderedTagsByArea[area].map((tag) => ({
      tagSectionId: getSectionId([tag.name]),
      operationSectionIds: (operationsByTag[area][tag.name] ?? []).map((op) =>
        getSectionId([tag.name, op.operationId])
      ),
    }))
  }

  // Parse intro-section headings (level-2) from each area's markdown intro, and
  // capture the raw MDX so it can be bundled (workerd has no filesystem, so the
  // `md-content` route reads the intro from the generated module, not `fs`).
  const apiRefIntroSections = {}
  const apiRefIntroContent = {}
  for (const area of AREAS) {
    let headings = []
    let markdownContent = ""
    try {
      markdownContent = await fs.readFile(
        path.join(appDir, "markdown", `${area}.mdx`),
        "utf-8"
      )
      headings = findAllPageHeadings({ content: markdownContent, level: 2 })
    } catch {
      // markdown file missing
    }

    apiRefIntroContent[area] = markdownContent
    apiRefIntroSections[area] = headings.map((heading) => ({
      slug: getApiRefIntroSlug(heading),
      title: heading,
    }))
  }

  // Build the path map + old-hash -> new-path redirect map.
  const apiRefPaths = {}
  const apiRefRedirects = {}
  for (const area of AREAS) {
    const areaPaths = { intro: {}, tags: {} }
    const areaRedirects = {}

    // intro sections
    for (const { slug } of apiRefIntroSections[area]) {
      const introPath = getApiRefPath({ area, section: slug })
      areaPaths.intro[slug] = introPath
      areaRedirects[slug] = introPath
    }

    // tags + operations + schema
    for (const tag of orderedTagsByArea[area]) {
      const tagName = tag.name
      const tagSlug = getApiRefTagSlug(tagName)
      const tagPath = getApiRefPath({ area, section: tagSlug })

      const operations = (operationsByTag[area][tagName] ?? [])
        .slice()
        .sort(compareOperations)
      const slugMap = getApiRefTagOperationSlugs(operations)

      const operationsOutput = {}
      for (const op of operations) {
        const slug = slugMap.get(op.operationId)
        const operationPath = getApiRefPath({
          area,
          section: tagSlug,
          operationSlug: slug,
        })
        const oldHash = getSectionId([tagName, op.operationId])
        operationsOutput[op.operationId] = {
          slug,
          path: operationPath,
          oldHash,
          title: op["x-sidebar-summary"] || op.summary || op.operationId,
          method: op.method,
        }
        areaRedirects[oldHash] = operationPath
      }

      let schemaPath = null
      if (tag["x-associatedSchema"]) {
        schemaPath = getApiRefPath({
          area,
          section: tagSlug,
          operationSlug: "schema",
        })
        const formattedName = singular(tagName).replaceAll(" ", "")
        const schemaOldHash = getSectionId([tagName, formattedName, "schema"])
        areaRedirects[schemaOldHash] = schemaPath
      }

      areaPaths.tags[tagSlug] = {
        name: tagName,
        path: tagPath,
        schemaPath,
        operations: operationsOutput,
      }
      areaRedirects[tagSlug] = tagPath
    }

    apiRefPaths[area] = areaPaths
    apiRefRedirects[area] = areaRedirects
  }

  // Guard: intro-section slugs and tag slugs share the /[area]/[section]
  // namespace and must not collide.
  for (const area of AREAS) {
    const tagSlugs = new Set(Object.keys(apiRefPaths[area].tags))
    for (const { slug } of apiRefIntroSections[area]) {
      if (tagSlugs.has(slug)) {
        console.warn(
          `[api-ref-paths] Slug collision in "${area}": intro section "${slug}" also matches a tag slug.`
        )
      }
    }
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

  await fs.writeFile(
    path.join(generatedDir, "intro-content.mjs"),
    `export const apiRefIntroContent = ${JSON.stringify(
      apiRefIntroContent,
      null,
      2
    )}\n`
  )

  await fs.writeFile(
    path.join(generatedDir, "api-ref-paths.mjs"),
    `export const apiRefIntroSections = ${JSON.stringify(
      apiRefIntroSections,
      null,
      2
    )}\n\nexport const apiRefPaths = ${JSON.stringify(
      apiRefPaths,
      null,
      2
    )}\n\nexport const apiRefRedirects = ${JSON.stringify(
      apiRefRedirects,
      null,
      2
    )}\n`
  )
}
