"use client"

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react"
import { usePathname } from "next/navigation"
import { getScrolledTop } from "../../utils"

export enum SidebarItemSections {
  TOP = "top",
  BOTTOM = "bottom",
  MOBILE = "mobile",
}

export type SidebarItemType = {
  path?: string
  title: string
  additionalElms?: React.ReactNode
  children?: SidebarItemType[]
  loaded?: boolean
  isPathHref?: boolean
  linkProps?: React.AllHTMLAttributes<HTMLAnchorElement>
}

export type SidebarSectionItemsType = {
  [k in SidebarItemSections]: SidebarItemType[]
}

export type SidebarContextType = {
  items: SidebarSectionItemsType
  activePath: string | null
  getActiveItem: () => SidebarItemType | undefined
  setActivePath: (path: string | null) => void
  isItemActive: (item: SidebarItemType, checkChildren?: boolean) => boolean
  addItems: (
    item: SidebarItemType[],
    options?: {
      section?: SidebarItemSections
      parent?: {
        path: string
        changeLoaded?: boolean
      }
      indexPosition?: number
      ignoreExisting?: boolean
    }
  ) => void
  findItemInSection: (
    section: SidebarItemType[],
    item: Partial<SidebarItemType>,
    checkChildren?: boolean
  ) => SidebarItemType | undefined
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSidebarEmpty: () => boolean
  desktopSidebarOpen: boolean
  setDesktopSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SidebarContext = createContext<SidebarContextType | null>(null)

export type ActionOptionsType = {
  section?: SidebarItemSections
  parent?: {
    path: string
    changeLoaded?: boolean
  }
  indexPosition?: number
  ignoreExisting?: boolean
}

export type ActionType = {
  type: "add" | "update"
  items: SidebarItemType[]
  options?: ActionOptionsType
}

const findItem = (
  section: SidebarItemType[],
  item: Partial<SidebarItemType>,
  checkChildren = true
): SidebarItemType | undefined => {
  return section.find((i) => {
    if (!item.path) {
      return !i.path && i.title === item.title
    } else {
      return (
        i.path === item.path ||
        (checkChildren && i.children && findItem(i.children, item))
      )
    }
  })
}

export const reducer = (
  state: SidebarSectionItemsType,
  { type, items, options }: ActionType
) => {
  const {
    section = SidebarItemSections.TOP,
    parent,
    ignoreExisting = false,
    indexPosition,
  } = options || {}

  if (!ignoreExisting) {
    const selectedSection =
      section === SidebarItemSections.BOTTOM ? state.bottom : state.top
    items = items.filter((item) => !findItem(selectedSection, item))
  }

  if (!items.length) {
    return state
  }

  switch (type) {
    case "add":
      return {
        ...state,
        [section]:
          indexPosition !== undefined
            ? [
                ...state[section].slice(0, indexPosition),
                ...items,
                ...state[section].slice(indexPosition),
              ]
            : [...state[section], ...items],
      }
    case "update":
      // find item index
      return {
        ...state,
        [section]: state[section].map((i) => {
          if (i.path && parent?.path && i.path === parent?.path) {
            return {
              ...i,
              children: [...(i.children || []), ...items],
              loaded: parent.changeLoaded ? true : i.loaded,
            }
          }
          return i
        }),
      }
    default:
      return state
  }
}

export type SidebarProviderProps = {
  children?: ReactNode
  isLoading?: boolean
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
  initialItems?: SidebarSectionItemsType
  shouldHandleHashChange?: boolean
  shouldHandlePathChange?: boolean
  scrollableElement?: Element | Window
}

export const SidebarProvider = ({
  children,
  isLoading = false,
  setIsLoading,
  initialItems,
  shouldHandleHashChange = false,
  shouldHandlePathChange = false,
  scrollableElement,
}: SidebarProviderProps) => {
  const [items, dispatch] = useReducer(reducer, {
    top: initialItems?.top || [],
    bottom: initialItems?.bottom || [],
    mobile: initialItems?.mobile || [],
  })
  const [activePath, setActivePath] = useState<string | null>("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const pathname = usePathname()
  const getResolvedScrollableElement = useCallback(() => {
    return scrollableElement || window
  }, [scrollableElement])

  const findItemInSection = useCallback(findItem, [])

  const getActiveItem = useCallback(() => {
    if (activePath === null) {
      return undefined
    }

    return (
      findItemInSection(items.mobile, { path: activePath }) ||
      findItemInSection(items.top, { path: activePath }) ||
      findItemInSection(items.bottom, { path: activePath })
    )
  }, [activePath, items, findItemInSection])

  const addItems = (
    newItems: SidebarItemType[],
    options?: {
      section?: SidebarItemSections
      parent?: {
        path: string
        changeLoaded?: boolean
      }
      indexPosition?: number
      ignoreExisting?: boolean
    }
  ) => {
    dispatch({
      type: options?.parent ? "update" : "add",
      items: newItems,
      options,
    })
  }

  const isItemActive = useCallback(
    (item: SidebarItemType, checkChildren = false): boolean => {
      return (
        item.path === activePath ||
        (checkChildren && activePath?.split("_")[0] === item.path)
      )
    },
    [activePath]
  )

  const isSidebarEmpty = useCallback((): boolean => {
    return Object.values(items).every(
      (sectionItems) => sectionItems.length === 0
    )
  }, [items])

  const init = () => {
    const currentPath = location.hash.replace("#", "")
    if (currentPath) {
      setActivePath(currentPath)
    }
  }

  // this is mainly triggered by Algolia
  const handleHashChange = useCallback(() => {
    const currentPath = location.hash.replace("#", "")
    if (currentPath !== activePath) {
      setActivePath(currentPath)
    }
  }, [activePath])

  useEffect(() => {
    if (shouldHandleHashChange) {
      init()
    }
  }, [shouldHandleHashChange])

  useEffect(() => {
    if (!shouldHandleHashChange) {
      return
    }

    const resolvedScrollableElement = getResolvedScrollableElement()

    const handleScroll = () => {
      if (getScrolledTop(resolvedScrollableElement) === 0) {
        setActivePath("")
        // can't use next router as it doesn't support
        // changing url without scrolling
        history.replaceState({}, "", location.pathname)
      }
    }

    resolvedScrollableElement.addEventListener("scroll", handleScroll)
    resolvedScrollableElement.addEventListener("hashchange", handleHashChange)

    return () => {
      resolvedScrollableElement.removeEventListener("scroll", handleScroll)
      resolvedScrollableElement.removeEventListener(
        "hashchange",
        handleHashChange
      )
    }
  }, [handleHashChange, shouldHandleHashChange, getResolvedScrollableElement])

  useEffect(() => {
    if (isLoading && items.top.length && items.bottom.length) {
      setIsLoading?.(false)
    }
  }, [items, isLoading, setIsLoading])

  useEffect(() => {
    if (shouldHandlePathChange && pathname !== activePath) {
      setActivePath(pathname)
    }
  }, [shouldHandlePathChange, pathname])

  return (
    <SidebarContext.Provider
      value={{
        items,
        addItems,
        activePath,
        setActivePath,
        isItemActive,
        findItemInSection,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        isSidebarEmpty,
        getActiveItem,
        desktopSidebarOpen,
        setDesktopSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used inside a SidebarProvider")
  }

  return context
}
