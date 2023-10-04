import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
  ParameterReflection,
  ReflectionKind,
  TypeParameterReflection,
} from "typedoc"

export type ParameterStyle = "table" | "list"

export type ReflectionTitleOptions = {
  typeParameters?: boolean
  kind?: boolean
}

export type ObjectLiteralDeclarationStyle = "table" | "list"

export type FormattingOptionType = {
  sections?: {
    [k: string]: boolean
  }
  reflectionGroups?: {
    [k: string]: boolean
  }
  reflectionTitle?: {
    kind: boolean
    typeParameters: boolean
    suffix: string
  }
  reflectionDescription?: string
  expandMembers?: boolean
  showCommentsAsHeader?: boolean
  parameterStyle?: ParameterStyle
  showReturnSignature?: string
}

export type FormattingOptionsType = {
  [k: string]: FormattingOptionType
}

export type ReflectionParameterType =
  | ParameterReflection
  | DeclarationReflection
  | TypeParameterReflection

export type Mapping = {
  kind: ReflectionKind[]
  isLeaf: boolean
  directory: string
  template: (pageEvent: PageEvent<ContainerReflection>) => string
}
