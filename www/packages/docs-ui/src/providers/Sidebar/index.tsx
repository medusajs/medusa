"use client"

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { getScrolledTop } from "@/utils"
import { useIsBrowser } from "@/hooks"
import {
  SidebarItemSections,
  SidebarItemType,
  SidebarSectionItemsType,
} from "types"

export type CurrentItemsState = SidebarSectionItemsType & {
  previousSidebar?: CurrentItemsState
}

export type SidebarStyleOptions = {
  disableActiveTransition?: boolean
  noTitleStyling?: boolean
}

export type SidebarContextType = {
  items: SidebarSectionItemsType
  currentItems: CurrentItemsState | undefined
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
  staticSidebarItems?: boolean
  shouldHandleHashChange: boolean
  sidebarRef: React.RefObject<HTMLUListElement>
  goBack: () => void
} & SidebarStyleOptions

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
  let foundItem: SidebarItemType | undefined
  section.some((i) => {
    if (
      (!item.path && !i.path && i.title === item.title) ||
      i.path === item.path
    ) {
      foundItem = i
    } else if (checkChildren && i.children) {
      foundItem = findItem(i.children, item)
    }

    return foundItem !== undefined
  })

  return foundItem
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
              children:
                indexPosition !== undefined
                  ? [
                      ...(i.children?.slice(0, indexPosition) || []),
                      ...items,
                      ...(i.children?.slice(indexPosition) || []),
                    ]
                  : [...(i.children || []), ...items],
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
  staticSidebarItems?: boolean
} & SidebarStyleOptions

export const SidebarProvider = ({
  children,
  isLoading = false,
  setIsLoading,
  initialItems,
  shouldHandleHashChange = false,
  shouldHandlePathChange = false,
  scrollableElement,
  staticSidebarItems = false,
  disableActiveTransition = false,
  noTitleStyling = false,
}: SidebarProviderProps) => {
  const [items, dispatch] = useReducer(reducer, {
    top: initialItems?.top || [],
    bottom: initialItems?.bottom || [],
    mobile: initialItems?.mobile || [],
  })
  const [currentItems, setCurrentItems] = useState<
    CurrentItemsState | undefined
  >()
  const [activePath, setActivePath] = useState<string | null>("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const sidebarRef = useRef<HTMLUListElement>(null)

  const pathname = usePathname()
  const router = useRouter()
  const isBrowser = useIsBrowser()
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
    return Object.values(items).every((sectionItems) => {
      if (!Array.isArray(sectionItems)) {
        return true
      }

      return sectionItems.length === 0
    })
  }, [items])

  const init = () => {
    const currentPath = location.hash.replace("#", "")
    if (currentPath) {
      setActivePath(currentPath)
    }
  }

  const getCurrentSidebar = useCallback(
    (searchItems: SidebarItemType[]): SidebarItemType | undefined => {
      let currentSidebar: SidebarItemType | undefined
      searchItems.some((item) => {
        if (item.isChildSidebar) {
          if (isItemActive(item)) {
            currentSidebar = item
          } else if (item.children?.length) {
            const childSidebar =
              getCurrentSidebar(item.children) ||
              findItem(item.children, { path: activePath || undefined })

            if (childSidebar) {
              currentSidebar = childSidebar.isChildSidebar ? childSidebar : item
            }
          }
        } else if (item.children?.length) {
          currentSidebar = getCurrentSidebar(item.children)
        }

        return currentSidebar !== undefined
      })

      return currentSidebar
    },
    [isItemActive, activePath]
  )

  const goBack = () => {
    if (!currentItems) {
      return
    }

    const previousSidebar = currentItems.previousSidebar || items

    const backItem =
      previousSidebar.top.find((item) => item.path && !item.isChildSidebar) ||
      previousSidebar.bottom.find((item) => item.path && !item.isChildSidebar)

    if (!backItem) {
      return
    }

    setActivePath(backItem.path!)
    setCurrentItems(currentItems.previousSidebar)
    router.replace(backItem.path!)
  }

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

    return () => {
      resolvedScrollableElement.removeEventListener("scroll", handleScroll)
    }
  }, [shouldHandleHashChange, getResolvedScrollableElement])

  useEffect(() => {
    if (!shouldHandleHashChange || !isBrowser) {
      return
    }

    // this is mainly triggered by Algolia
    const handleHashChange = () => {
      const currentPath = location.hash.replace("#", "")
      if (currentPath !== activePath) {
        setActivePath(currentPath)
      }
    }

    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [shouldHandleHashChange, isBrowser])

  useEffect(() => {
    if (isLoading && items.top.length && items.bottom.length) {
      setIsLoading?.(false)
    }
  }, [items, isLoading, setIsLoading])

  useEffect(() => {
    if (!shouldHandlePathChange) {
      return
    }

    if (pathname !== activePath) {
      setActivePath(pathname)
    }
  }, [shouldHandlePathChange, pathname])

  useEffect(() => {
    if (!activePath?.length) {
      setCurrentItems(undefined)
      return
    }

    const currentSidebar =
      getCurrentSidebar(items.top) || getCurrentSidebar(items.bottom)

    if (!currentSidebar) {
      setCurrentItems(undefined)
      return
    }

    if (
      currentSidebar.isChildSidebar &&
      currentSidebar.children &&
      currentItems?.parentItem?.path !== currentSidebar.path
    ) {
      const { children, ...parentItem } = currentSidebar
      setCurrentItems({
        top: children,
        bottom: [],
        mobile: items.mobile,
        parentItem: parentItem,
        previousSidebar: currentItems,
      })
    }
  }, [getCurrentSidebar, activePath])

  return (
    <SidebarContext.Provider
      value={{
        items,
        currentItems,
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
        staticSidebarItems,
        disableActiveTransition,
        noTitleStyling,
        shouldHandleHashChange,
        sidebarRef,
        goBack,
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
