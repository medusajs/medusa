import { Sidebar } from "./index.js"

export type BreadcrumbOptions = {
  startItems?: {
    title: string
    link: string
  }[]
}

export declare type DocsConfig = {
  titleSuffix?: string
  description?: string
  baseUrl: string
  basePath?: string
  sidebars: Sidebar.Sidebar[]
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
    releaseDate: string
    hide?: boolean
    bannerImage?: {
      light: string
      dark: string
    }
  }
  reportIssueLink?: string
  logo: string
  features?: {
    aiAssistant?: boolean
  }
  contentMenuSections?: Record<string, boolean>
}
