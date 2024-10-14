import { ComponentType, ReactNode } from "react"

export interface WidgetProps {
  before: ComponentType<any>[]
  after: ComponentType<any>[]
}

export interface PageProps<TData> {
  children: ReactNode
  widgets: WidgetProps
  data?: TData
  showJSON?: boolean
  showMetadata?: boolean
  hasOutlet?: boolean
}
