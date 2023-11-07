import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
  ParameterReflection,
  Reflection,
  ReflectionKind,
  TypeParameterReflection,
} from "typedoc"

export type ParameterStyle = "table" | "list" | "component"

export type ReflectionTitleOptions = {
  typeParameters?: boolean
  kind?: boolean
}

export type ObjectLiteralDeclarationStyle = "table" | "list" | "component"

export type SectionKey =
  | "comment"
  | "member_declaration_typeParameters"
  | "member_declaration_indexSignature"
  | "member_declaration_signatures"
  | "member_declaration_typeDeclaration"
  | "member_declaration_example"
  | "member_getteSetter_getSignature"
  | "member_getteSetter_setSignature"
  | "member_signatures"
  | "member_getterSetter"
  | "member_reference"
  | "member_declaration"
  | "member_signature_title"
  | "member_signature_comment"
  | "member_signature_typeParameters"
  | "member_signature_parameters"
  | "member_signature_example"
  | "member_signature_returns"
  | "member_signature_declarationSignatures"
  | "member_signature_declarationChildren"
  | "member_signature_sources"
  | "member_sources_implementationOf"
  | "member_sources_inheritedFrom"
  | "member_sources_overrides"
  | "member_sources_definedIn"
  | "members_group_categories"
  | "members_categories"
  | "title_reflectionPath"
  | "reflection_comment"
  | "reflection_typeParameters"
  | "reflection_hierarchy"
  | "reflection_implements"
  | "reflection_implementedBy"
  | "reflection_callable"
  | "reflection_indexable"

export type FormattingOptionType = {
  sections?: {
    [k in SectionKey]: boolean
  }
  reflectionGroups?: {
    [k: string]: boolean
  }
  reflectionTitle?: {
    kind: boolean
    typeParameters: boolean
    suffix?: string
  }
  reflectionDescription?: string
  expandMembers?: boolean
  showCommentsAsHeader?: boolean
  showCommentsAsDetails?: boolean
  parameterStyle?: ParameterStyle
  frontmatterData?: Record<string, unknown>
  parameterComponent?: string
  mdxImports?: string[]
  maxLevel?: number
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

export class NavigationItem {
  title: string
  url: string
  dedicatedUrls?: string[]
  parent?: NavigationItem
  children?: NavigationItem[]
  isLabel?: boolean
  isVisible?: boolean
  isCurrent?: boolean
  isModules?: boolean
  isInPath?: boolean
  reflection?: Reflection

  constructor(
    title?: string,
    url?: string,
    parent?: NavigationItem,
    reflection?: Reflection
  ) {
    this.title = title || ""
    this.url = url || ""
    this.parent = parent
    this.reflection = reflection

    if (!url) {
      this.isLabel = true
    }

    if (this.parent) {
      if (!this.parent.children) {
        this.parent.children = []
      }
      this.parent.children.push(this)
    }
  }

  static create(
    reflection: Reflection,
    parent?: NavigationItem,
    useShortNames?: boolean
  ) {
    let name: string
    if (useShortNames || (parent && parent.parent)) {
      name = reflection.name
    } else {
      name = reflection.getFullName()
    }

    name = name.trim()

    return new NavigationItem(name, reflection.url, parent, reflection)
  }
}
