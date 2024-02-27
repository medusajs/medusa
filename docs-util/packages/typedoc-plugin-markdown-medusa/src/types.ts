import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
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
  template: (pageEvent: PageEvent<ContainerReflection>) => string
}

export type Parameter = {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
  description?: string
  featureFlag?: string
  expandable: boolean
  children?: Parameter[]
}
