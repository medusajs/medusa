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
type ParsedSchema = {
  description?: string
  properties?: {
    [k: string]: {
      description?: string
    }
  }
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
  const parsed: ParsedSchema = parse(`schema: ${schema}`)
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
            text: value.description || "",
          },
        ])
      )
    })
  }

  // TODO change to parsed
  return parsedTags
}
