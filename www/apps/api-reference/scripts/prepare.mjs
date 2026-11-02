import { generateLlmsIndex, generateSplitSidebars } from "build-scripts"
import { pathToFileURL } from "url"
import path from "path"
import { generateSpecsPathsManifest } from "./generate-specs-manifest.mjs"

async function generateApiRefLlmsIndex() {
  const { apiRefIntroSections, apiRefPaths } = await import(
    pathToFileURL(path.resolve("generated", "api-ref-paths.mjs")).href
  )
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${process.env.NEXT_PUBLIC_BASE_PATH || "/api"}`

  const sections = ["store", "admin"].map((area) => {
    const title = area === "store" ? "Store API" : "Admin API"
    const links = [
      { title: `Medusa ${title} Reference`, url: `${baseUrl}/${area}` },
      ...(apiRefIntroSections[area] ?? []).map((section) => ({
        title: section.title,
        url: `${baseUrl}/${area}/${section.slug}`,
      })),
    ]

    for (const tag of Object.values(apiRefPaths[area]?.tags ?? {})) {
      links.push({ title: tag.name, url: `${baseUrl}${tag.path}` })
      if (tag.schemaPath) {
        links.push({
          title: `${tag.name} Object`,
          url: `${baseUrl}${tag.schemaPath}`,
        })
      }
      for (const operation of Object.values(tag.operations)) {
        links.push({
          title: operation.title,
          url: `${baseUrl}${operation.path}`,
        })
      }
    }

    return { title, links }
  })

  await generateLlmsIndex({
    title: "Medusa API Reference",
    description:
      "REST API reference for the Medusa Store and Admin APIs, with every route's parameters, request bodies, responses, and code snippets.",
    sections,
  })
}

async function main() {
  await generateSpecsPathsManifest()
  await generateApiRefLlmsIndex()
  await generateSplitSidebars({
    sidebars: [
      {
        sidebar_id: "store",
        title: "Store",
        items: [],
        custom_autogenerate: "api-ref",
      },
      {
        sidebar_id: "admin",
        title: "Admin",
        items: [],
        custom_autogenerate: "api-ref",
      },
    ],
  })
}

void main()
