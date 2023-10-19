import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { prefersReducedMotion } from "@docusaurus/theme-common"

type SidebarContextType = {
  hasSidebar: boolean
  hiddenSidebar: boolean
  setHiddenSidebar: (value: boolean) => void
  hiddenSidebarContainer: boolean
  setHiddenSidebarContainer: (value: boolean) => void
  floatingSidebar: boolean
  setFloatingSidebar: (value: boolean) => void
  onCollapse: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

type SidebarProviderProps = {
  sidebarName?: string
  children?: React.ReactNode
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  sidebarName,
  children,
}) => {
  const [hiddenSidebar, setHiddenSidebar] = useState(false)
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false)
  const [floatingSidebar, setFloatingSidebar] = useState(false)

  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false)
    }
    // onTransitionEnd won't fire when sidebar animation is disabled
    // fixes https://github.com/facebook/docusaurus/issues/8918
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true)
    }
    setHiddenSidebarContainer((value) => !value)
  }, [setHiddenSidebarContainer, hiddenSidebar])

  useEffect(() => {
    function isEditingContent(event: KeyboardEvent) {
      const element = event.target as HTMLElement
      const tagName = element.tagName
      return (
        element.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA"
      )
    }

    function sidebarShortcut(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "i" &&
        !isEditingContent(e)
      ) {
        e.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", sidebarShortcut)

    return () => {
      window.removeEventListener("keydown", sidebarShortcut)
    }
  })

  return (
    <SidebarContext.Provider
      value={{
        hasSidebar: sidebarName !== undefined,
        hiddenSidebar,
        setHiddenSidebar,
        hiddenSidebarContainer,
        setHiddenSidebarContainer,
        floatingSidebar,
        setFloatingSidebar,
        onCollapse: toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider

export const useSidebar = () => {
  const context = useContext(SidebarContext)

  return context
}
