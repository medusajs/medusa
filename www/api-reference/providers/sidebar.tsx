"use client"

import { OpenAPIV3 } from "openapi-types"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
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
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSidebarEmpty: () => boolean
  desktopSidebarOpen: boolean
  setDesktopSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextType | null>(null)

type SidebarProviderProps = {
  children?: ReactNode
}

type ActionOptionsType = {
  section?: SidebarItemSections
  parent?: {
    path: string
    changeLoaded?: boolean
  }
  indexPosition?: number
  ignoreExisting?: boolean
}

type ActionType = {
  type: "add" | "update"
  items: SidebarItemType[]
  options?: ActionOptionsType
}

const reducer = (
  state: SidebarSectionItemsType,
  { type, items, options }: ActionType
) => {
  const {
    section = SidebarItemSections.TOP,
    parent,
    indexPosition,
  } = options || {}

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
      break
    case "update":
      // find item index
      return {
        ...state,
        [section]: state[section].map((i) => {
          if (i.path === parent?.path) {
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

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [items, dispatch] = useReducer(reducer, {
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
  })
  const [activePath, setActivePath] = useState<string | null>("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)

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
      ignoreExisting = false,
    } = options || {}

    if (!ignoreExisting) {
      newItems = newItems.filter((item) => !isPathInSidebar(item.path, section))
    }

    if (!newItems.length) {
      return
    }

    dispatch({
      type: parent ? "update" : "add",
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

  useEffect(() => {
    init()

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setActivePath("")
        // can't use next router as it doesn't support
        // changing url without scrolling
        history.replaceState({}, "", location.pathname)
      }
    }

    const handleHashChange = () => {
      const currentPath = location.hash.replace("#", "")
      if (currentPath !== activePath) {
        setActivePath(currentPath)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("hashchange", handleHashChange)
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

export default SidebarProvider

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used inside a SidebarProvider")
  }

  return context
}
