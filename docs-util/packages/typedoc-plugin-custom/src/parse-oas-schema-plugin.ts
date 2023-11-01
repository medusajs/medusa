import {
  Application,
  Comment,
  CommentDisplayPart,
  Context,
  Converter,
  DeclarationReflection,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  SomeType,
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

export function load(app: Application) {
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      const { comment } = reflection
      if (comment) {
        comment.getTags("@schema").forEach((part) => {
          if (part.content.length) {
            const schemaComment = prepareSchemaComment(part.content)
            const schema: Schema = parse(schemaComment)

            if (schema.description) {
              comment.summary.push({
                kind: "text",
                text: schema.description,
              })
            }

            if (reflection.kind === ReflectionKind.TypeAlias) {
              comment.modifierTags.add(`@interface`)
            }

            addComments(schema, reflection)
          }
        })
        comment.removeTags("@schema")
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
    return
  }

  const children =
    "type" in reflection
      ? getTypeChildren(reflection.type as SomeType, reflection.project)
      : "children" in reflection
      ? (reflection.children as DeclarationReflection[])
      : []

  Object.entries(schema.properties).forEach(([key, value]) => {
    const childItem =
      children.find((child) => child.name === key) ||
      reflection.getChildByName(key)

    if (childItem) {
      let { comment } = childItem
      if (!comment) {
        comment = new Comment()
      }
      comment.summary.push({
        kind: "text",
        text: getPropertyDescription(value),
      })
      childItem.comment = comment
    }
  })
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

function getTypeChildren(
  reflectionType: SomeType,
  project: ProjectReflection
): DeclarationReflection[] {
  let children: DeclarationReflection[] = []

  switch (reflectionType.type) {
    case "reference":
      // eslint-disable-next-line no-case-declarations
      const referencedReflection =
        reflectionType.reflection ||
        project?.getChildByName(reflectionType.name)

      if (
        referencedReflection instanceof DeclarationReflection &&
        referencedReflection.children
      ) {
        children = referencedReflection.children
      }
      break
    case "reflection":
      children = reflectionType.declaration.children || [
        reflectionType.declaration,
      ]
      break
    case "array":
      children = getTypeChildren(reflectionType.elementType, project)
  }

  return children
}
