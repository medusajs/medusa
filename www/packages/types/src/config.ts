import { LayoutOptions } from "./layout.js"
import { SidebarSectionItems } from "./sidebar.js"

export declare type DocsConfig = {
  titleSuffix?: string
  baseUrl: string
  basePath?: string
  sidebar: SidebarSectionItems
  filesBasePath?: string
  useNextLinks?: boolean
  layoutOptions?: {
    route: string | RegExp
    options: LayoutOptions
  }[]
}
