import type { ComponentType } from "react"
import type { DashboardPlugin } from "./dashboard-app/types"

export type { Resources } from "./i18n/types"
export type { DashboardPlugin }

declare const App: ComponentType<{
  plugins?: DashboardPlugin[]
}>
export default App
