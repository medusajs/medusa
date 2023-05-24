import { PageConfigProps, WidgetConfigProps } from "@medusajs/admin-shared"

export type DiscoveredExtensionObject = {
  widgets: {
    path: string
    props: WidgetConfigProps
  }[]
  pages: {
    path: string
    props: PageConfigProps
  }[]
}
