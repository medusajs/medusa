import { SidebarProvider as UiSidebarProvider } from "docs-ui"
import { docsConfig } from "@/config/docs"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  return (
    <UiSidebarProvider
      initialItems={docsConfig.sidebar}
      shouldHandlePathChange={true}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
