import type { OpenAPI } from "types"
import { resolveApiRefDocUrl } from "@/utils/resolve-doc-url"
import generateSchemaExamples from "@/utils/generate-schema-examples"
import schemaToMarkdown from "./schema-to-markdown"
import { MarkdownContext, absolutizeLink, oneLine } from "./shared"

export type OperationToMarkdownOptions = MarkdownContext & {
  endpointPath: string
  method: string
  baseSpecs?: OpenAPI.ExpandedDocument
}

const firstContentSchema = (
  content?: Record<string, { schema?: OpenAPI.SchemaObject }>
): { media: string; schema?: OpenAPI.SchemaObject } | undefined => {
  if (!content) {
    return undefined
  }
  const media = Object.keys(content)[0]
  if (!media) {
    return undefined
  }
  return { media, schema: content[media]?.schema }
}

const renderParameters = (
  parameters: OpenAPI.Parameter[],
  ctx: MarkdownContext
): string => {
  const groups: { in: string; title: string }[] = [
    { in: "path", title: "Path Parameters" },
    { in: "query", title: "Query Parameters" },
    { in: "header", title: "Header Parameters" },
  ]

  return groups
    .map(({ in: location, title }) => {
      const groupParams = parameters.filter((param) => param.in === location)
      if (!groupParams.length) {
        return ""
      }

      const syntheticSchema: OpenAPI.SchemaObject = {
        type: "object",
        properties: groupParams.reduce(
          (acc, param) => {
            acc[param.name] = {
              ...(param.schema || {}),
              description: param.description || param.schema?.description,
              example: param.example ?? param.schema?.example,
              examples: param.examples ?? param.schema?.examples,
            } as OpenAPI.SchemaObject
            return acc
          },
          {} as Record<string, OpenAPI.SchemaObject>
        ),
        required: groupParams
          .filter((param) => param.required)
          .map((param) => param.name),
      }

      return `### ${title}\n\n${schemaToMarkdown(syntheticSchema, ctx)}`
    })
    .filter(Boolean)
    .join("\n\n")
}

const renderResponses = (
  responses: OpenAPI.ResponsesObject,
  ctx: MarkdownContext
): string => {
  const parts: string[] = ["### Responses"]

  Object.entries(responses).forEach(([code, response]) => {
    const content = firstContentSchema(response.content)
    const header = `#### ${code}${response.description ? ` ${response.description}` : ""}`
    if (!content?.schema) {
      parts.push(`${header}\n\nEmpty response`)
      return
    }
    parts.push(
      `${header}\n\nContent type: \`${content.media}\`\n\n${schemaToMarkdown(
        content.schema,
        ctx
      )}`
    )
  })

  return parts.join("\n\n")
}

// Normalize `x-codeSamples` language names to Markdown code-fence identifiers.
const FENCE_LANG: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  shell: "bash",
  bash: "bash",
}
const fenceLang = (lang?: string): string => {
  const normalized = (lang || "").toLowerCase()
  return FENCE_LANG[normalized] ?? normalized
}

// Render an event payload. The OAS payload is usually already a fenced code
// block (```ts ...```), so emit it as-is rather than double-wrapping it.
const renderEventPayload = (payload?: string): string => {
  const trimmed = payload?.trim()
  if (!trimmed) {
    return ""
  }
  return trimmed.startsWith("```")
    ? `\n\n${trimmed}`
    : `\n\n\`\`\`ts\n${trimmed}\n\`\`\``
}

const renderEvents = (events: OpenAPI.OasEvents[]): string => {
  const parts: string[] = ["### Emitted Events"]
  events.forEach((event) => {
    const flags = [
      event.deprecated ? "deprecated" : "",
      event.since ? `since v${event.since}` : "",
    ]
      .filter(Boolean)
      .join(", ")
    parts.push(
      `#### \`${event.name}\`${flags ? ` (${flags})` : ""}${
        event.description ? `\n\n${oneLine(event.description)}` : ""
      }${renderEventPayload(event.payload)}`
    )
  })
  return parts.join("\n\n")
}

const renderCodeSamples = (samples: OpenAPI.Code[]): string => {
  const parts: string[] = ["### Code Samples"]
  samples.forEach((sample) => {
    parts.push(
      `**${sample.label || sample.lang}**\n\n\`\`\`${fenceLang(sample.lang)}\n${
        sample.source
      }\n\`\`\``
    )
  })
  return parts.join("\n\n")
}

/**
 * Converts a single OpenAPI operation to full-fidelity Markdown, mirroring the
 * rendered `Tags/Operation` page (heading, method+path, description, workflow,
 * related guide, security, parameters, request body, all responses, emitted
 * events, code samples, and an example of the primary success response).
 */
export default function operationToMarkdown(
  operation: OpenAPI.Operation,
  options: OperationToMarkdownOptions
): string {
  const { endpointPath, method, baseSpecs } = options
  const ctx: MarkdownContext = {
    area: options.area,
    baseUrl: options.baseUrl,
    basePath: options.basePath,
  }
  const parts: string[] = []

  // Heading + inline metadata.
  const headingFlags = [
    operation.deprecated ? "deprecated" : "",
    operation["x-since"] ? `since v${operation["x-since"]}` : "",
    operation["x-featureFlag"]
      ? `feature flag: ${operation["x-featureFlag"]}`
      : "",
    ...(operation["x-badges"]?.map((badge) => badge.text) || []),
  ].filter(Boolean)
  parts.push(
    `## ${operation.summary || operation.operationId}${
      headingFlags.length ? ` (${headingFlags.join(", ")})` : ""
    }`
  )

  parts.push(`\`${method.toUpperCase()} ${endpointPath}\``)

  // Custom badges carry an explanatory description (shown in a tooltip on the
  // page); keep it — it often links to a plugin/guide.
  operation["x-badges"]?.forEach((badge) => {
    if (badge.description) {
      parts.push(`> **${badge.text}:** ${oneLine(badge.description)}`)
    }
  })

  if (operation["x-deprecated_message"]) {
    parts.push(
      `> **Deprecated:** ${oneLine(operation["x-deprecated_message"])}`
    )
  }

  if (operation.description) {
    parts.push(operation.description)
  }

  if (operation["x-workflow"]) {
    parts.push(
      `Workflow: [${operation["x-workflow"]}](${ctx.baseUrl}/resources/references/medusa-workflows/${operation["x-workflow"]})`
    )
  }

  if (operation.externalDocs) {
    const href = absolutizeLink(
      resolveApiRefDocUrl(operation.externalDocs.url, ctx.area),
      ctx
    )
    parts.push(
      `Related guide: [${operation.externalDocs.description || "Read More"}](${href})`
    )
  }

  // Security / authorization.
  if (operation.security?.length) {
    const displayNames = operation.security
      .map((requirement) => {
        const schemeName = Object.keys(requirement)[0]
        const scheme = baseSpecs?.components?.securitySchemes?.[schemeName]
        return scheme && !("$ref" in scheme)
          ? (scheme as OpenAPI.SecuritySchemeObject)["x-displayName"]
          : undefined
      })
      .filter(Boolean)
    if (displayNames.length) {
      parts.push(`**Authorization:** ${displayNames.join(" or ")}`)
    }
  }

  if (operation.parameters?.length) {
    const rendered = renderParameters(
      operation.parameters as OpenAPI.Parameter[],
      ctx
    )
    if (rendered) {
      parts.push(rendered)
    }
  }

  const requestContent = firstContentSchema(operation.requestBody?.content)
  if (requestContent?.schema) {
    parts.push(
      `### Request Body\n\nContent type: \`${requestContent.media}\`\n\n${schemaToMarkdown(
        requestContent.schema,
        ctx
      )}`
    )
  }

  if (operation.responses) {
    parts.push(renderResponses(operation.responses, ctx))
  }

  if (operation["x-events"]?.length) {
    parts.push(renderEvents(operation["x-events"]))
  }

  if (operation["x-codeSamples"]?.length) {
    parts.push(renderCodeSamples(operation["x-codeSamples"]))
  }

  // Example of the primary success response (200/201), matching the code column.
  const successEntry = operation.responses
    ? Object.entries(operation.responses).find(
        ([code]) => code === "200" || code === "201"
      )
    : undefined
  const successContent = successEntry
    ? Object.values(successEntry[1].content || {})[0]
    : undefined
  if (successContent?.schema) {
    const examples = generateSchemaExamples({
      schema: successContent.schema,
      schemaExample: successContent.example,
    })
    if (examples[0]?.content) {
      parts.push(`### Example\n\n\`\`\`json\n${examples[0].content}\n\`\`\``)
    }
  }

  return parts.join("\n\n")
}
