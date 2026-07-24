import { Reflection, ReflectionKind } from "typedoc"
import pkg from "slugify"

const slugify = pkg.default

export function replaceTemplateVariables(
  reflection: Reflection,
  text?: string
): string {
  if (!text) {
    return ""
  }

  return text
    .replaceAll("{{alias}}", reflection.name)
    .replaceAll("{{alias-lower}}", reflection.name.toLowerCase())
    .replaceAll(
      "{{alias-slug}}",
      slugify(reflection.name, {
        lower: true,
      })
    )
    .replaceAll("{{parent.alias}}", reflection.parent?.name || "")
    .replaceAll(
      "{{parent.alias-lower}}",
      reflection.parent?.name.toLowerCase() || ""
    )
    .replaceAll(
      "{{parent.parent.alias}}",
      reflection.parent?.parent?.name || ""
    )
    .replaceAll("{{kind}}", getKindAsText(reflection.kind))
    .replaceAll(
      "{{summary}}",
      reflection.comment?.blockTags
        .find((tag) => tag.tag === "@summary")
        ?.content.map((content) => content.text)
        .join(" ") || ""
    )
}

export function getKindAsText(kind: ReflectionKind) {
  switch (kind) {
    case ReflectionKind.Method:
      return "method"
    case ReflectionKind.Enum:
      return "enum"
    default:
      return ""
  }
}

export function getAlias(reflection: Reflection): string {
  let alias = reflection.name.replaceAll(" ", "_").replaceAll("/", "_")

  if (reflection.kind === ReflectionKind.Module) {
    alias = alias.replaceAll("-", "_")
  }

  return alias
}
