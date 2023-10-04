export type ParameterStyle = "table" | "list"

export type ReflectionTitleOptions = {
  typeParameters?: boolean
  kind?: boolean
}

export type ObjectLiteralDeclarationStyle = 'table' | 'list'

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
  }
  expandMembers?: boolean
  showCommentsAsHeader?: boolean
  parameterStyle?: ParameterStyle
  showReturnSignature?: string
}

export type FormattingOptionsType = {
  [k: string]: FormattingOptionType
}