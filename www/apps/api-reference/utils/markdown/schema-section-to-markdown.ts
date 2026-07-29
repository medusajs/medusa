import type { OpenAPI } from "types"
import { singular } from "pluralize"
import generateSchemaExamples from "@/utils/generate-schema-examples"
import schemaToMarkdown from "./schema-to-markdown"
import { MarkdownContext } from "./shared"

/**
 * Converts a tag's associated schema (the "{Name} Object") to Markdown,
 * mirroring `Tags/Section/Schema`: heading, the commerce-modules note, the full
 * field list, and a complete example (including non-required fields).
 */
export default function schemaSectionToMarkdown(
  schema: OpenAPI.SchemaObject,
  tagName: string,
  ctx: MarkdownContext
): string {
  const formattedName = singular(tagName).replaceAll(" ", "")
  const parts: string[] = [`## ${formattedName} Object`]

  parts.push(
    `> This object's schema is as returned by Medusa's ${ctx.area} API routes. ` +
      `However, the related model in the Medusa application may support more fields and relations. ` +
      `To view the models in the Medusa application and their relations, visit the ` +
      `[Commerce Modules Documentation](https://docs.medusajs.com/resources/commerce-modules).`
  )

  parts.push(`### Fields\n\n${schemaToMarkdown(schema, ctx)}`)

  const examples = generateSchemaExamples({
    schema,
    options: { skipNonRequired: false },
  })
  if (examples[0]?.content) {
    parts.push(
      `### The ${formattedName} Object\n\n\`\`\`json\n${examples[0].content}\n\`\`\``
    )
  }

  return parts.join("\n\n")
}
