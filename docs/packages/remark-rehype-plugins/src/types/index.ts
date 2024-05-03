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

export interface UnistNodeWithData extends UnistNode {
  attributes: {
    name: string
    value: {
      data?: {
        estree?: {
          body?: {
            type?: string
            expression?: {
              type?: string
              elements?: {
                properties: AttributeProperty[]
              }[]
            }
          }[]
        }
      }
      value?: string
    }
    type?: string
  }[]
}

export interface AttributeProperty {
  key: {
    value: string
    raw: string
  }
  value: {
    value: unknown
    raw: string
  }
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
