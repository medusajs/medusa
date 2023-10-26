import { ReflectionKind } from "typedoc"

const PLURALS = {
  [ReflectionKind.Class]: "Classes",
  [ReflectionKind.Property]: "Properties",
  [ReflectionKind.Enum]: "Enumerations",
  [ReflectionKind.EnumMember]: "Enumeration members",
  [ReflectionKind.TypeAlias]: "Type aliases",
}

export function getKindPlural(kind: ReflectionKind): string {
  if (kind in PLURALS) {
    return PLURALS[kind as keyof typeof PLURALS]
  } else {
    return getKindString(kind) + "s"
  }
}

function getKindString(kind: ReflectionKind): string {
  let str = ReflectionKind[kind]
  str = str.replace(/(.)([A-Z])/g, (_m, a, b) => a + " " + b.toLowerCase())
  return str
}
