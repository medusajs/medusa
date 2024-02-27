"use client"
import {
  SidebarProvider as UiSidebarProvider,
  usePageLoading,
  useScrollController,
} from "docs-ui"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { isLoading, setIsLoading } = usePageLoading()
  const { scrollableElement } = useScrollController()

  return (
    <UiSidebarProvider
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      shouldHandleHashChange={true}
      scrollableElement={scrollableElement}
      initialItems={{
        top: [
          {
            title: "Introduction",
            path: "",
            loaded: true,
          },
        ],
        bottom: [],
        mobile: [
          {
            title: "Docs",
            path: "https://docs.medusajs.com/",
            loaded: true,
            isPathHref: true,
          },
          {
            title: "User Guide",
            path: "https://docs.medusajs.com/user-guide",
            loaded: true,
            isPathHref: true,
          },
          {
            title: "Store API",
            path: "/api/store",
            loaded: true,
            isPathHref: true,
          },
          {
            title: "Admin API",
            path: "/api/admin",
            loaded: true,
            isPathHref: true,
          },
        ],
      }}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
