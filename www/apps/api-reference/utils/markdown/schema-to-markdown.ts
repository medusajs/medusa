import type { OpenAPI } from "types"
import mergeAllOfTypes from "@/utils/merge-all-of-types"
import checkRequired from "@/utils/check-required"
import { resolveApiRefDocUrl } from "@/utils/resolve-doc-url"
import { MarkdownContext, absolutizeLink, capitalize, oneLine } from "./shared"

const INDENT = "  "

const isObjectSchema = (schema?: OpenAPI.SchemaObject): boolean =>
  !!schema &&
  (schema.type === "object" ||
    !!schema.properties ||
    !!schema.allOf ||
    !!schema.anyOf ||
    !!schema.oneOf)

/** Mirrors `Parameters/Name/formatArrayDescription`. */
const formatArrayDescription = (items?: OpenAPI.SchemaObject): string => {
  if (!items) {
    return "Array"
  }
  const type =
    items.type === "object"
      ? `objects ${items.title ? `(${items.title})` : ""}`.trim()
      : `${items.type || "object"}s`
  return `Array of ${type}`
}

/** Mirrors `Parameters/Name/formatUnionDescription` (distinct member types). */
const formatUnionDescription = (arr?: OpenAPI.SchemaObject[]): string => {
  const types = [...new Set(arr?.map((type) => type.type || "object"))]
  return types.join(" or ")
}

/** Human-readable type label, mirroring the `Name` component's logic. */
const typeDescription = (schema: OpenAPI.SchemaObject): string => {
  const nullable = schema.nullable ? " or null" : ""
  switch (true) {
    case schema.type === "object":
      return `object${schema.title ? ` (${schema.title})` : ""}${nullable}`
    case schema.type === "array":
      return `${formatArrayDescription(
        (schema as OpenAPI.ArraySchemaObject).items
      )}${nullable}`
    case schema.anyOf !== undefined:
    case schema.allOf !== undefined:
      return `${formatUnionDescription(schema.allOf || schema.anyOf)}${nullable}`
    case schema.oneOf !== undefined:
      return `${schema
        .oneOf!.map((item) => {
          if (item.type === "array") {
            return `array${item.items?.type ? ` of ${item.items.type}s` : ""}`
          }
          return item.title || item.type || "object"
        })
        .join(" or ")}${nullable}`
    default:
      return `${!schema.type ? "any" : schema.type}${
        schema.format ? ` <${schema.format}>` : ""
      }${nullable}`
  }
}

/** The inline metadata suffix (description, default, enum, example, guide). */
const descriptionSuffix = (
  schema: OpenAPI.SchemaObject,
  ctx: MarkdownContext
): string => {
  const segments: string[] = []
  if (schema.description) {
    segments.push(oneLine(capitalize(schema.description)))
  }
  if (schema.default !== undefined) {
    segments.push(`Default: \`${JSON.stringify(schema.default)}\``)
  }
  if (schema.enum) {
    segments.push(
      `Enum: ${schema.enum
        .map((value) => `\`${JSON.stringify(value)}\``)
        .join(", ")}`
    )
  }
  if (schema.example !== undefined) {
    segments.push(`Example: \`${JSON.stringify(schema.example)}\``)
  }
  if (schema.externalDocs) {
    const href = absolutizeLink(
      resolveApiRefDocUrl(schema.externalDocs.url, ctx.area),
      ctx
    )
    segments.push(
      `Related guide: [${schema.externalDocs.description || "Read More"}](${href})`
    )
  }
  return segments.join(" ")
}

/** Order properties so required fields come first (mirrors `Types/Object`). */
const sortedPropertyNames = (
  schema: OpenAPI.SchemaObject,
  properties: Record<string, OpenAPI.SchemaObject>
): string[] =>
  Object.keys(properties).sort((a, b) => {
    const aRequired = checkRequired(schema, a) ? 1 : 0
    const bRequired = checkRequired(schema, b) ? 1 : 0
    return bRequired - aRequired
  })

/** Render the nested children of a schema (properties/items/oneOf members). */
const renderChildren = (
  schema: OpenAPI.SchemaObject,
  level: number,
  ctx: MarkdownContext
): string => {
  let resolved = schema

  if (resolved.allOf) {
    resolved = mergeAllOfTypes(resolved)
  } else if (resolved.anyOf) {
    const objectMember = resolved.anyOf.find(isObjectSchema)
    if (!objectMember) {
      return ""
    }
    resolved = objectMember
  }

  if (resolved.oneOf) {
    const indent = INDENT.repeat(level)
    return resolved.oneOf
      .map((member, index) => {
        // Render each option with its type and description (the page shows
        // these per tab); recurse for object members.
        const suffix = descriptionSuffix(member, ctx)
        const line = `${indent}- **Option ${index + 1}**: ${typeDescription(
          member
        )}${suffix ? ` — ${suffix}` : ""}`
        const children = renderChildren(member, level + 1, ctx)
        return children ? `${line}\n${children}` : line
      })
      .join("\n")
  }

  if (
    resolved.type === "array" &&
    (resolved as OpenAPI.ArraySchemaObject).items
  ) {
    return renderChildren(
      (resolved as OpenAPI.ArraySchemaObject).items,
      level,
      ctx
    )
  }

  const additional =
    resolved.additionalProperties &&
    typeof resolved.additionalProperties === "object"
      ? (resolved.additionalProperties as OpenAPI.SchemaObject).properties
      : undefined
  const properties = resolved.properties || additional
  if (!properties) {
    return ""
  }

  return sortedPropertyNames(resolved, properties)
    .map((name) =>
      renderProperty(
        properties[name],
        name,
        !!checkRequired(resolved, name),
        level,
        ctx
      )
    )
    .join("\n")
}

/** Render one named property line plus its nested children. */
const renderProperty = (
  schema: OpenAPI.SchemaObject,
  name: string,
  required: boolean,
  level: number,
  ctx: MarkdownContext
): string => {
  const indent = INDENT.repeat(level)
  let line = `${indent}- \`${name}\`: ${typeDescription(schema)}`

  const flags: string[] = []
  if (!required) {
    flags.push("optional")
  }
  if (schema.deprecated) {
    flags.push("deprecated")
  }
  if (schema["x-expandable"]) {
    flags.push("expandable")
  }
  if (flags.length) {
    line += ` (${flags.join(", ")})`
  }

  const suffix = descriptionSuffix(schema, ctx)
  if (suffix) {
    line += ` — ${suffix}`
  }

  const children = renderChildren(schema, level + 1, ctx)
  return children ? `${line}\n${children}` : line
}

/**
 * Converts an OpenAPI schema to a nested Markdown bullet list, reproducing the
 * recursive `Tags/Operation/Parameters` renderer. Used for parameters, request
 * bodies, responses, event payloads, and the tag's associated schema.
 */
export default function schemaToMarkdown(
  schema: OpenAPI.SchemaObject,
  ctx: MarkdownContext
): string {
  const body = renderChildren(schema, 0, ctx)
  if (body) {
    return body
  }

  // Top-level primitive / empty object: emit a single descriptive line.
  const suffix = descriptionSuffix(schema, ctx)
  const base = `- ${typeDescription(schema)}`
  return suffix ? `${base} — ${suffix}` : base
}
