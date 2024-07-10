import { ReactNode } from "react"

export type Widget = {
  Component: React.ComponentType<any>
}

export type WidgetImport = {
  widgets: Widget[]
}

export interface WidgetProps {
  before: WidgetImport
  after: WidgetImport
}

export interface PageProps<TData> {
  children: ReactNode
  widgets: WidgetProps
  data?: TData
  showJSON?: boolean
  hasOutlet?: boolean
}
