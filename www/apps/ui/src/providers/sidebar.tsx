import {
  SidebarProvider as UiSidebarProvider,
  useScrollController,
} from "docs-ui"
import { docsConfig } from "@/config/docs"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { scrollableElement } = useScrollController()
  return (
    <UiSidebarProvider
      initialItems={docsConfig.sidebar}
      shouldHandlePathChange={true}
      scrollableElement={scrollableElement}
      disableActiveTransition={true}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
