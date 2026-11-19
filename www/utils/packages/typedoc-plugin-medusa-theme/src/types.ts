import {
  DeclarationReflection,
  ParameterReflection,
  ReflectionKind,
  TypeParameterReflection,
} from "typedoc"

export type ParameterStyle = "table" | "list" | "component"

export type ReflectionParameterType =
  | ParameterReflection
  | DeclarationReflection
  | TypeParameterReflection

export type Mapping = {
  kind: ReflectionKind[]
  modifiers: {
    has: `@${string}`[]
    not: `@${string}`[]
  }
  isLeaf: boolean
  directory: string
  pageKind: MedusaPageKind
}

export type MedusaPageKind = "reflection" | "member" | "index"

export type Parameter = {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
  example?: string
  description?: string
  featureFlag?: string
  expandable: boolean
  children?: Parameter[]
  since?: string
  deprecated?: {
    is_deprecated: boolean
    description?: string
  }
}
