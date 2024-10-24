import { SidebarSectionItems } from "./sidebar.js"

export type BreadcrumbOptions = {
  showCategories?: boolean
}

export declare type DocsConfig = {
  titleSuffix?: string
  baseUrl: string
  basePath?: string
  sidebar: SidebarSectionItems
  filesBasePath?: string
  useNextLinks?: boolean
  project: {
    title: string
    key: string
  }
  breadcrumbOptions?: BreadcrumbOptions
  version: {
    number: string
    releaseUrl: string
  }
}
