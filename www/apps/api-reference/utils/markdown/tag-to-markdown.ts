import type { OpenAPI } from "types"
import { MarkdownContext, absolutizeLink } from "./shared"

export type TagToMarkdownOptions = MarkdownContext

const methodOrder = (method: string): number => {
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

const HTTP_METHODS: OpenAPI.OpenAPIV3.HttpMethods[] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
] as OpenAPI.OpenAPIV3.HttpMethods[]

type RouteEntry = {
  endpointPath: string
  method: string
  operation: OpenAPI.Operation
}

const flattenPaths = (paths: OpenAPI.PathsObject): RouteEntry[] => {
  const entries: RouteEntry[] = []
  Object.entries(paths).forEach(([endpointPath, pathItem]) => {
    HTTP_METHODS.forEach((method) => {
      const operation = pathItem?.[method]
      if (operation) {
        entries.push({ endpointPath, method, operation })
      }
    })
  })

  return entries.sort((a, b) => {
    const orderDiff = methodOrder(a.method) - methodOrder(b.method)
    if (orderDiff !== 0) {
      return orderDiff
    }
    return (a.operation.summary || "").localeCompare(b.operation.summary || "")
  })
}

/**
 * Converts a tag's intro to Markdown: heading, description, related guide, and
 * an "API Routes" index linking to each operation's page (operations have their
 * own `.md`, so they are not inlined here).
 */
export default function tagToMarkdown(
  tag: OpenAPI.TagObject,
  paths: OpenAPI.PathsObject,
  ctx: TagToMarkdownOptions
): string {
  const parts: string[] = [`# ${tag.name}`]

  if (tag.description) {
    parts.push(tag.description)
  }

  if (tag.externalDocs) {
    parts.push(
      `Related guide: [${tag.externalDocs.description || "Read More"}](${tag.externalDocs.url})`
    )
  }

  const routes = flattenPaths(paths)
  if (routes.length) {
    const list = routes
      .map(({ endpointPath, method, operation }) => {
        const label = operation.summary || endpointPath
        const href = operation["x-path"]
          ? absolutizeLink(operation["x-path"], ctx)
          : undefined
        const link = href ? `[${label}](${href})` : label
        return `- \`${method.toUpperCase()} ${endpointPath}\` — ${link}`
      })
      .join("\n")
    parts.push(`## API Routes\n\n${list}`)
  }

  return parts.join("\n\n")
}
