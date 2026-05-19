import { Node } from "unist-builder"
import { SlugChange } from "./build-scripts.js"

export interface UnistNode extends Node {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: {
    [key: string]: string
  }
  attributes?: {
    name: string
    value: unknown
    type?: string
  }[]
  children?: UnistNode[]
  ordered?: boolean
  url?: string
  spread?: boolean
  depth?: number
  lang?: string
}

export type ArrayExpression = {
  type: "ArrayExpression"
  elements: Expression[]
}

export type ObjectExpression = {
  type: "ObjectExpression"
  properties: AttributeProperty[]
}

export type LiteralExpression = {
  type: "Literal"
  value: unknown
  raw: string
}

export type JSXElementExpression = {
  type: "JSXElement" | "JSXFragment"
  children: Expression[]
  openingElement: {
    type: "JSXOpeningElement"
    attributes: UnistJSXAttributeNode[]
  }
}

export type JSXTextExpression = {
  type: "JSXText"
  value: string
  raw: string
}

export type VariableDeclaration = {
  type: "VariableDeclaration"
  declarations: VariableDeclarator[]
}
export type VariableDeclarator = {
  type: "VariableDeclarator"
  id: Identifier
  init: Expression
}

export type Identifier = {
  type: "Identifier"
  name: string
}

export type TemplateLiteralExpression = {
  type: "TemplateLiteral"
  expressions: Expression[]
  quasis: {
    type: "TemplateElement"
    value: {
      raw: string
      cooked: string
    }
  }[]
}

export type Expression =
  | {
      type: string
    }
  | ArrayExpression
  | ObjectExpression
  | LiteralExpression
  | JSXElementExpression
  | JSXTextExpression

export interface Estree {
  body?: (
    | {
        type?: "ExpressionStatement"
        expression?: Expression
      }
    | {
        type?: "ExportNamedDeclaration"
        declaration?: VariableDeclaration
      }
  )[]
}

export interface UnistJSXAttributeNode {
  type: "JSXAttribute"
  name: {
    type: "JSXIdentifier"
    name: string
  }
  value: {
    type: "JSXExpressionContainer"
    expression: Identifier | Expression
  }
}

export interface UnistNodeWithData extends UnistNode {
  attributes: {
    name: string
    value:
      | {
          data?: {
            estree?: Estree
          }
          value?: string
        }
      | string
    type?: string
  }[]
}

export interface AttributeProperty {
  key: {
    name?: string
    value?: string
    raw: string
  }
  value:
    | {
        type: "Literal"
        value: unknown
        raw: string
      }
    | {
        type: "JSXElement"
        // TODO add correct type if necessary
        openingElement: unknown
      }
    | ArrayExpression
}

export interface UnistTree extends Node {
  children: UnistNode[]
}

export interface UnistFunctionDeclarationNode extends UnistNode {
  type: "FunctionDeclaration"
  body: {
    type: "BlockStatement"
    body: UnistNode[]
  }
}

export interface UnistReturnStatementNode extends UnistNode {
  type: "ReturnStatement"
  argument: UnistFragmentNode | UnistCallExpressionNode | UnistJSXElementNode
}

export interface UnistFragmentNode extends UnistNode {
  type: "JSXFragment"
  openingElement: {
    type: "JSXOpeningFragment"
  }
  closingElement: {
    type: "JSXClosingFragment"
  }
  children: UnistNode[]
}

export interface UnistCallExpressionNode extends UnistNode {
  type: "CallExpression"
  arguments: UnistNode[]
}

export interface UnistJSXElementNode extends UnistNode {
  type: "JSXElement"
  // TODO add correct type if necessary
}

export interface UnistImportDeclarationNode extends UnistNode {
  type: "ImportDeclaration"
  source: {
    type: "Literal"
    value: string
  }
  specifiers: {
    type: "ImportSpecifier"
    imported: {
      type: "Identifier"
      name: string
    }
    local: {
      type: "Identifier"
      name: string
    }
  }[]
}

export interface UnistProgram extends UnistNode {
  type: "Program"
  body: (
    | UnistNode
    | UnistFunctionDeclarationNode
    | UnistImportDeclarationNode
  )[]
  sourceType: "module" | "script"
  comments?: UnistNode[]
}

export declare type CloudinaryConfig = {
  cloudName?: string
  flags?: string[]
  resize?: {
    action: string
    width?: number
    height?: number
    aspectRatio?: string
  }
  roundCorners?: number
}

export declare type CrossProjectLinksOptions = {
  baseUrl: string
  projectUrls?: {
    [k: string]: {
      url: string
      path?: string
    }
  }
  useBaseUrl?: boolean
}

export declare type BrokenLinkCheckerOptions = {
  rootBasePath?: {
    default: string
    overrides?: {
      [k: string]: string
    }
  }
  hasGeneratedSlugs?: boolean
  generatedSlugs?: SlugChange[]
  crossProjects: {
    [k: string]: {
      projectPath: string
      contentPath?: string
      hasGeneratedSlugs?: boolean
      generatedSlugs?: SlugChange[]
      skipSlugValidation?: boolean
    }
  }
}

export declare type ComponentLinkFixerLinkType = "md" | "value"

export declare type ComponentLinkFixerOptions = {
  filePath?: string
  basePath?: string
  checkLinksType: ComponentLinkFixerLinkType
}

export declare type LocalLinkOptions = {
  filePath?: string
  basePath?: string
}

export type ExpressionJsVarItem = {
  original: AttributeProperty
  data?: unknown
}

export type ExpressionJsVarLiteral = {
  original: {
    type: "Literal"
    value: unknown
    raw: string
  }
  data?: unknown
}

export type ExpressionJsVarObj = {
  [k: string]: ExpressionJsVarItem | ExpressionJsVar | ExpressionJsVar[]
}

export type ExpressionJsVar = ExpressionJsVarObj | ExpressionJsVarLiteral

export type JSXExpressionContainer = {
  type: "JSXExpressionContainer"
  expression: Expression
}
