import {
  Application,
  Comment,
  CommentDisplayPart,
  CommentTag,
  Context,
  Converter,
  DeclarationReflection,
  Reflection,
  ReflectionKind,
  SomeType,
} from "typedoc"
import { parse } from "yaml"
import { getTypeChildren } from "utils"

// a simplified schema type
// mainly focusing on properties used
// within this plugin
type Schema = {
  description?: string
  properties?: SchemaProperties
  allOf?: SchemaProperty[]
  oneOf?: SchemaProperty[]
}

type SchemaProperties = {
  [k: string]: SchemaProperty
}

type SchemaProperty = {
  description?: string
  "x-expandable"?: string
  "x-featureFlag"?: string
  default?: string
  items?: Schema
  properties?: SchemaProperties
  allOf?: SchemaProperty[]
  oneOf?: SchemaProperty[]
}

export function load(app: Application) {
  const definedSchemas = new Map<string, Schema>()

  // Since some files, such as models, include the
  // `@schema` declaration at the end of the file, i.e. not
  // before the related class/type/interface, this extracts
  // those schemas and applies them to reflections having the same
  // name, if those reflections don't have a schema comment of their own.
  const origConvertSymbol = app.converter.convertSymbol
  app.converter.convertSymbol = (context, symbol, exportSymbol) => {
    if (symbol.valueDeclaration) {
      const sourceFile = symbol.valueDeclaration?.getSourceFile()
      // find block comments
      const blockCommentMatch = sourceFile.text.matchAll(
        /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm
      )
      for (const blockMatch of blockCommentMatch) {
        blockMatch.forEach((matched) => {
          if (!matched) {
            return
          }
          const schemaStartIndex = matched.indexOf("@schema")
          if (schemaStartIndex === -1) {
            return
          }
          // find end index
          let schemaEndIndex = matched.indexOf(" * @", schemaStartIndex)

          if (schemaEndIndex === -1) {
            schemaEndIndex = matched.length
          }

          const schemaText = matched
            .substring(schemaStartIndex, schemaEndIndex)
            .replaceAll(" */", "")
            .replaceAll("*/", "")
            .replaceAll(" * ", "")
          const { name: schemaName = "" } =
            /@schema (?<name>\w+)/.exec(schemaText)?.groups || {}

          if (!schemaName || definedSchemas.has(schemaName)) {
            return
          }

          // attempt to parse schema and save it
          try {
            const parsedSchema = parse(
              schemaText.replace("@schema", "schema:")
            ) as Schema

            definedSchemas.set(schemaName, parsedSchema)
          } catch (e) {
            // ignore errors as the schema may be malformed.
            console.error(`Error parsing schema ${schemaName}: ${e}`)
          }
        })
      }
    }

    return origConvertSymbol(context, symbol, exportSymbol)
  }

  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      let schema: Schema | undefined
      let { comment } = reflection
      const schemaTags = comment?.getTags(`@schema`)

      if (schemaTags?.length) {
        schemaTags.forEach((part) => {
          if (part.content.length) {
            const schemaComment = prepareSchemaComment(part.content)
            schema = parse(schemaComment)
          }
        })
        reflection.comment?.removeTags("@schema")
      } else if (!comment) {
        if (definedSchemas.has(reflection.name)) {
          schema = definedSchemas.get(reflection.name)
          comment = new Comment()
        } else if ("type" in reflection && reflection.type) {
          const reflectionType = reflection.type as SomeType

          if (
            "name" in reflectionType &&
            definedSchemas.has(reflectionType.name)
          ) {
            schema = definedSchemas.get(reflectionType.name)
            comment = new Comment()
          }
        }
      }

      if (schema) {
        if (schema.description) {
          comment?.summary.push({
            kind: "text",
            text: schema.description,
          })
        }

        if (reflection.kind === ReflectionKind.TypeAlias) {
          comment?.modifierTags.add(`@interface`)
        }

        addComments(schema, reflection)

        if (!reflection.comment && comment) {
          reflection.comment = comment
        }
      }
    }
  })
}

function prepareSchemaComment(commentParts: CommentDisplayPart[]) {
  let result = `schema: `
  commentParts.forEach((commentPart) => {
    result += commentPart.text
  })
  return result
}

function addComments(schema: Schema, reflection: Reflection) {
  if (!schema.properties) {
    if (schema.allOf) {
      schema.allOf.forEach((valueChild) => {
        addComments(valueChild, reflection)
      })
    } else if (schema.oneOf) {
      schema.oneOf.forEach((valueChild) => {
        addComments(valueChild, reflection)
      })
    }
    return
  }
  const children =
    "type" in reflection
      ? getTypeChildren({
          reflectionType: reflection.type as SomeType,
          project: reflection.project,
        })
      : "children" in reflection
        ? (reflection.children as DeclarationReflection[])
        : []

  Object.entries(schema.properties).forEach(([key, value]) => {
    const childItem =
      children.find((child: DeclarationReflection) => child.name === key) ||
      reflection.getChildByName(key)

    if (childItem) {
      if (!childItem.comment) {
        const comment = new Comment()
        comment.summary.push({
          kind: "text",
          text: value.description || "",
        })
        childItem.comment = comment
      }

      if (
        value.default !== undefined &&
        "defaultValue" in childItem &&
        !childItem.defaultValue
      ) {
        childItem.defaultValue = value.default
      }

      if (value["x-expandable"]) {
        childItem.comment.modifierTags.add(`@expandable`)
      }

      if (value["x-featureFlag"]) {
        childItem.comment.blockTags.push(
          new CommentTag(`@featureFlag`, [
            {
              kind: `inline-tag`,
              text: value["x-featureFlag"],
              tag: `@featureFlag`,
            },
          ])
        )
      }

      if (value.items) {
        addComments(value.items, childItem)
      }

      if (value.properties || value.allOf || value.oneOf) {
        addComments(value, childItem)
      }
    }
  })
}
