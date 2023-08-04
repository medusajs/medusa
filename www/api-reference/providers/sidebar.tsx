"use client"

import { OpenAPIV3 } from "openapi-types"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export enum SidebarItemSections {
  TOP = "top",
  BOTTOM = "bottom",
  MOBILE = "mobile",
}

export type SidebarItemType = {
  path: string
  title: string
  method?: OpenAPIV3.HttpMethods
  children?: SidebarItemType[]
  loaded?: boolean
  isPathHref?: boolean
  hasChildren?: boolean
}

type SidebarSectionItemsType = {
  [k in SidebarItemSections]: SidebarItemType[]
}

type SidebarContextType = {
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
    itemPath: string,
    checkChildren?: boolean
  ) => SidebarItemType | undefined
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  isSidebarEmpty: () => boolean
}

const SidebarContext = createContext<SidebarContextType | null>(null)

type SidebarProviderProps = {
  children?: ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [items, setItems] = useState<SidebarSectionItemsType>({
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
        path: "/store",
        loaded: true,
        isPathHref: true,
      },
      {
        title: "Admin API",
        path: "/admin",
        loaded: true,
        isPathHref: true,
      },
    ],
  })
  const [activePath, setActivePath] = useState<string | null>("")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  const findItemInSection = useCallback(
    (
      section: SidebarItemType[],
      itemPath: string,
      checkChildren = true
    ): SidebarItemType | undefined => {
      return section.find(
        (item) =>
          item.path === itemPath ||
          (checkChildren &&
            item.children &&
            findItemInSection(item.children, itemPath))
      )
    },
    []
  )

  const getActiveItem = useCallback(() => {
    if (activePath === null) {
      return undefined
    }

    return (
      findItemInSection(items.mobile, activePath) ||
      findItemInSection(items.top, activePath) ||
      findItemInSection(items.bottom, activePath)
    )
  }, [activePath, items, findItemInSection])

  const isPathInSidebar = (path: string, section: SidebarItemSections) => {
    const selectedSection =
      section === SidebarItemSections.BOTTOM ? items.bottom : items.top
    return findItemInSection(selectedSection, path) !== undefined
  }

  const setSectionItems = (
    newItems: SidebarItemType[],
    section: SidebarItemSections
  ) => {
    if (section === SidebarItemSections.TOP) {
      setItems({
        ...items,
        top: newItems,
      })
    } else if (section === SidebarItemSections.BOTTOM) {
      setItems({
        ...items,
        bottom: newItems,
      })
    } else if (section === SidebarItemSections.MOBILE) {
      setItems({
        ...items,
        mobile: newItems,
      })
    }
  }

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
    const {
      section = SidebarItemSections.TOP,
      parent,
      indexPosition,
      ignoreExisting = false,
    } = options || {}

    if (!ignoreExisting) {
      newItems = newItems.filter((item) => !isPathInSidebar(item.path, section))
    }

    if (!newItems.length) {
      return
    }

    const oldItems =
      section === SidebarItemSections.TOP
        ? items.top
        : SidebarItemSections.BOTTOM
        ? items.bottom
        : items.mobile

    if (!parent && !indexPosition && indexPosition !== 0) {
      setSectionItems([...oldItems, ...newItems], section)
      return
    }

    if (parent) {
      // find parent index
      setSectionItems(
        oldItems.map((i) => {
          if (i.path === parent.path) {
            return {
              ...i,
              children: [...(i.children || []), ...newItems],
              loaded: parent.changeLoaded ? true : i.loaded,
            }
          } else {
            return i
          }
        }),
        section
      )
      return
    }

    if (indexPosition || indexPosition === 0) {
      // add item at specified index
      setSectionItems(
        [
          ...oldItems.slice(0, indexPosition),
          ...newItems,
          ...oldItems.slice(indexPosition),
        ],
        section
      )
    }
  }

  const isItemActive = useCallback(
    (item: SidebarItemType, checkChildren = false): boolean => {
      return (
        item.path === activePath ||
        (checkChildren &&
          item.children?.some((childItem) => isItemActive(childItem))) ||
        false
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

  useEffect(() => {
    init()

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setActivePath("")
        // can't use next router as it doesn't support
        // changing url without scrolling
        history.pushState({}, "", location.pathname)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        items,
        addItems,
        activePath,
        setActivePath,
        isItemActive,
        findItemInSection,
        sidebarOpen,
        setSidebarOpen,
        isSidebarEmpty,
        getActiveItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used inside a SidebarProvider")
  }

  return context
}
