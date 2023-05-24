export type WidgetConfig = {
  type: "widget"
  zone: string
}

export type PageConfig = {
  type: "page"
  path: string
  title: string
}

export type Config = WidgetConfig | PageConfig

type BaseProps = {
  Component: () => Promise<React.ComponentType<any>>
}

export type WidgetProps = BaseProps & Omit<WidgetConfig, "type">

export type PageProps = BaseProps & Omit<PageConfig, "type">

export type LoadedWidgetConfig = {
  id: string
  type: "widget"
  pathTo: string
  props: WidgetProps
}

export type LoadedPageConfig = {
  id: string
  type: "page"
  pathTo: string
  props: PageProps
}

export type LoadedConfig = LoadedWidgetConfig | LoadedPageConfig
