/* eslint-disable no-console */
/**
 * Pre-generates static JSON/YAML files from the OpenAPI specs so that
 * the Next.js route handlers can serve them via fetch() instead of fs
 * (required for Cloudflare Workers edge runtime).
 *
 * Outputs to public/specs/:
 *   public/specs/{area}/base.json          — parsed openapi.yaml (refs intact)
 *   public/specs/{area}/tags/{tag}.json    — dereferenced paths for each tag
 *   public/specs/{area}/openapi.full.yaml  — full YAML for download endpoint
 */

import path from "path"
import { promises as fs } from "fs"
import { createRequire } from "module"
import { fileURLToPath } from "url"

const require = createRequire(import.meta.url)
const OpenAPIParser = require("@readme/openapi-parser")
const slugify = require("slugify")
const { parseDocument } = require("yaml")

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const specsDir = path.join(__dirname, "..", "specs")
const outputDir = path.join(__dirname, "..", "public", "specs")

function getSectionId(parts) {
  return parts.map((p) => slugify(p.trim().toLowerCase())).join("_")
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

async function main() {
  await fs.mkdir(outputDir, { recursive: true })

  for (const area of ["admin", "store"]) {
    const areaOutputDir = path.join(outputDir, area)
    const tagsOutputDir = path.join(areaOutputDir, "tags")
    await fs.mkdir(tagsOutputDir, { recursive: true })

    console.log(`Processing ${area} spec...`)

    const baseSpecs = await OpenAPIParser.parse(
      path.join(specsDir, area, "openapi.yaml")
    )
    await fs.writeFile(
      path.join(areaOutputDir, "base.json"),
      JSON.stringify(baseSpecs)
    )
    console.log(`  Wrote ${area}/base.json`)

    for (const tag of baseSpecs.tags || []) {
      const tagName = getSectionId([tag.name])
      try {
        const paths = await getPathsOfTag(tagName, area)
        await fs.writeFile(
          path.join(tagsOutputDir, `${tagName}.json`),
          JSON.stringify(paths)
        )
        console.log(`  Wrote ${area}/tags/${tagName}.json`)
      } catch (err) {
        console.warn(
          `  Warning: could not generate tag ${tagName}: ${err.message}`
        )
      }
    }

    const fullYamlSrc = path.join(specsDir, area, "openapi.full.yaml")
    try {
      await fs.access(fullYamlSrc)
      await fs.copyFile(
        fullYamlSrc,
        path.join(areaOutputDir, "openapi.full.yaml")
      )
      console.log(`  Copied ${area}/openapi.full.yaml`)
    } catch {
      console.warn(`  Warning: ${area}/openapi.full.yaml not found, skipping`)
    }
  }

  console.log("Spec pre-generation complete.")
}

main().catch((err) => {
  console.error("Pre-generation failed:", err)
  process.exit(1)
})
