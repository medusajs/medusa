import { Node } from "unist-builder"

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

export type Expression =
  | {
      type: string
    }
  | ArrayExpression
  | ObjectExpression
  | LiteralExpression

export interface Estree {
  body?: {
    type?: string
    expression?: Expression
  }[]
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

export declare type FrontMatter = {
  slug?: string
  sidebar_label?: string
  sidebar_group?: string
  sidebar_group_main?: boolean
  sidebar_position?: number
  sidebar_autogenerate_exclude?: boolean
}

export declare type CrossProjectLinksOptions = {
  baseUrl: string
  projectUrls?: {
    [k: string]: {
      url: string
      path?: string
    }
  }
}

export declare type TypeListLinkFixerOptions = {
  filePath?: string
  basePath?: string
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
