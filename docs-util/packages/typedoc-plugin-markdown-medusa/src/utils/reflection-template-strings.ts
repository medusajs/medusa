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
