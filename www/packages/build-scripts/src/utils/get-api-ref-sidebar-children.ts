import { Sidebar } from "types"
import { ItemsToAdd } from "../index.js"
import path from "path"
import { pathToFileURL } from "url"
import pkg from "pluralize"

const { singular } = pkg

type GeneratedOperation = {
  slug: string
  path: string
  oldHash: string
  title: string
  method: string
}

type GeneratedTag = {
  name: string
  path: string
  schemaPath: string | null
  operations: Record<string, GeneratedOperation>
}

type ApiRefPathsModule = {
  apiRefIntroSections: Record<string, { slug: string; title: string }[]>
  apiRefPaths: Record<
    string,
    { intro: Record<string, string>; tags: Record<string, GeneratedTag> }
  >
}

// Node-only dynamic import of the app's generated map (resolved from cwd at
// prep time). Wrapped in `new Function` so bundlers/analyzers (e.g. webpack
// tracing next.config's dependency graph) don't try to statically resolve the
// computed specifier and emit a build-dependency warning.
const dynamicImport = new Function("specifier", "return import(specifier)") as (
  specifier: string
) => Promise<unknown>

// Mirror of the api-reference `MethodLabel` component so the always-visible
// sidebar can render method badges from serializable data.
function getMethodBadge(method: string): Sidebar.SidebarItemLink["badge"] {
  const lower = method.toLowerCase()
  return {
    variant: lower === "get" ? "green" : lower === "post" ? "blue" : "red",
    text:
      lower === "delete"
        ? "Del"
        : lower.charAt(0).toUpperCase() + lower.slice(1),
  }
}

export default async function getApiRefSidebarChildren(
  sidebar?: Sidebar.RawSidebar
): Promise<ItemsToAdd[]> {
  if (!sidebar) {
    return []
  }

  const projPath = path.resolve()
  const area = sidebar.sidebar_id

  const { apiRefIntroSections, apiRefPaths } = (await dynamicImport(
    pathToFileURL(path.join(projPath, "generated", "api-ref-paths.mjs")).href
  )) as ApiRefPathsModule

  const items: ItemsToAdd[] = [
    {
      type: "link",
      title: "Introduction",
      path: `/${area}`,
      loaded: true,
    },
  ]

  // intro-section pages (Authentication, Pagination, ...)
  for (const section of apiRefIntroSections[area] ?? []) {
    items.push({
      type: "link",
      title: section.title,
      path: `/${area}/${section.slug}`,
      loaded: true,
    })
  }

  const tags = apiRefPaths[area]?.tags ?? {}

  if (Object.keys(tags).length) {
    items.push({
      type: "separator",
    })
  }

  // one category per tag, with all its operations (and schema) as children
  for (const tag of Object.values(tags)) {
    const category: ItemsToAdd = {
      type: "category",
      title: tag.name,
      path: tag.path,
      loaded: true,
      children: [],
    }

    if (tag.schemaPath) {
      const formattedName = singular(tag.name).replaceAll(" ", "")
      category.children!.push({
        type: "link",
        path: tag.schemaPath,
        title: `${formattedName} Object`,
        loaded: true,
        badge: {
          variant: "neutral",
          text: "Schema",
        },
      })
    }

    for (const operation of Object.values(tag.operations)) {
      category.children!.push({
        type: "link",
        path: operation.path,
        title: operation.title,
        loaded: true,
        badge: getMethodBadge(operation.method),
      })
    }

    items.push(category)
  }

  return items
}
