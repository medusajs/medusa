import { PropsWithChildren } from "react"
import { DashboardExtensionManager } from "../dashboard-extension-manager/dashboard-extension-manager"
import { DashboardExtensionContext } from "./dashboard-extension-context"

type DashboardExtensionProviderProps = PropsWithChildren<{
  api: DashboardExtensionManager["api"]
}>

export const DashboardExtensionProvider = ({
  api,
  children,
}: DashboardExtensionProviderProps) => {
  return (
    <DashboardExtensionContext.Provider value={api}>
      {children}
    </DashboardExtensionContext.Provider>
  )
}
