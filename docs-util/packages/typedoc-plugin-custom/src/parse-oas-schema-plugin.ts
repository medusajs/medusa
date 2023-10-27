import {
  Application,
  CommentDisplayPart,
  CommentTag,
  Context,
  Converter,
  ReflectionKind,
} from "typedoc"
import { parse } from "yaml"

// a simplified schema type
// mainly focusing on properties used
// within this plugin
type Schema = {
  description?: string
  properties?: {
    [k: string]: SchemaProperty
  }
}

type SchemaProperty = {
  description?: string
  "x-expandable"?: string
  "x-featureFlag"?: string
}

type ParsedTags = {
  schema?: CommentDisplayPart
  tags: CommentTag[]
}

export function load(app: Application) {
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      const { comment } = reflection
      if (comment) {
        comment.getTags("@schema").forEach((part) => {
          const p = part.content[0]
          if (p?.text) {
            const parsedTags = parseSchema(p.text)
            if (parsedTags.schema) {
              comment.summary.push(parsedTags.schema)
            }
            comment.blockTags.push(...parsedTags.tags)
          }
        })
        comment.removeTags("@schema")
      }
    }
  })
}

function parseSchema(schema: string): ParsedTags {
  const parsed: Schema = parse(`schema: ${schema}`)
  const parsedTags: ParsedTags = {
    tags: [],
  }

  if (parsed.description) {
    parsedTags.schema = {
      kind: "text",
      text: parsed.description,
    }
  }

  if (parsed.properties) {
    Object.entries(parsed.properties).forEach(([key, value]) => {
      parsedTags.tags.push(
        new CommentTag(`@prop`, [
          {
            kind: "text",
            text: key,
          },
          {
            kind: "text",
            text: getPropertyDescription(value),
          },
        ])
      )
    })
  }

  return parsedTags
}

// TODO maybe add expandable and feature flag as tags instead
function getPropertyDescription(schemaProperty: SchemaProperty): string {
  let result = schemaProperty.description || ""

  if (schemaProperty["x-expandable"]) {
    result +=
      " This property is only available if it's expanded using the `expand` parameter, if it's accepted by the associated request."
  }

  if (schemaProperty["x-featureFlag"]) {
    result += ` This property is only available if the [feature flag ${schemaProperty["x-featureFlag"]} is enabled](https://docs.medusajs.com/development/feature-flags/toggle).`
  }

  return result
}
