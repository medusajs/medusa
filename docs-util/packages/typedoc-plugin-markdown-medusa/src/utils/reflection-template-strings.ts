import { Reflection, ReflectionKind } from "typedoc"

export function replaceTemplateVariables(
  reflection: Reflection,
  text?: string
): string {
  if (!text) {
    return ""
  }

  return text
    .replaceAll("{{alias}}", reflection.getAlias())
    .replaceAll("{{alias-lower}}", reflection.getAlias().toLowerCase())
    .replaceAll("{{parent.alias}}", reflection.parent?.getAlias() || "")
    .replaceAll(
      "{{parent.alias-lower}}",
      reflection.parent?.getAlias().toLowerCase() || ""
    )
    .replaceAll(
      "{{parent.parent.alias}}",
      reflection.parent?.parent?.getAlias() || ""
    )
    .replaceAll("{{kind}}", getKindAsText(reflection.kind))
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
