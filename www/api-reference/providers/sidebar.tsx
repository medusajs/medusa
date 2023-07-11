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
}

export type SidebarItemType = {
  path: string
  title: string
  method?: OpenAPIV3.HttpMethods
  children?: SidebarItemType[]
}

type SidebarSectionItemsType = {
  [k in SidebarItemSections]: SidebarItemType[]
}

type SidebarContextType = {
  items: SidebarSectionItemsType
  // activeItem: SidebarItemType | null
  activePath: string | null
  setActivePath: (path: string | null) => void
  // changeActiveItem: (path: string) => void
  isItemActive: (item: SidebarItemType) => boolean
  addItems: (
    item: SidebarItemType[],
    options?: {
      section?: SidebarItemSections
      parentPath?: string
      indexPosition?: number
      ignoreExisting?: boolean
    }
  ) => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

type SidebarProviderProps = {
  children?: ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [items, setItems] = useState<SidebarSectionItemsType>({
    top: [],
    bottom: [],
  })
  const [activePath, setActivePath] = useState<string | null>(null)

  const isPathInSidebar = (path: string, section: SidebarItemSections) => {
    const selectedSection =
      section === SidebarItemSections.BOTTOM ? items.bottom : items.top
    return selectedSection.some((item) => item.path === path)
  }

  const setSectionItems = (
    newItems: SidebarItemType[],
    section: SidebarItemSections
  ) => {
    if (section === SidebarItemSections.TOP) {
      setItems({
        bottom: items.bottom,
        top: newItems,
      })
    } else {
      setItems({
        bottom: newItems,
        top: items.top,
      })
    }
  }

  const addItems = (
    newItems: SidebarItemType[],
    options?: {
      section?: SidebarItemSections
      parentPath?: string
      indexPosition?: number
      ignoreExisting?: boolean
    }
  ) => {
    const {
      section = SidebarItemSections.TOP,
      parentPath,
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
      section === SidebarItemSections.TOP ? items.top : items.bottom

    if (!parentPath && !indexPosition && indexPosition !== 0) {
      setSectionItems([...oldItems, ...newItems], section)
      return
    }

    if (parentPath) {
      // find parent index
      setSectionItems(
        oldItems.map((i) => {
          if (i.path === parentPath) {
            return {
              ...i,
              children: [...(i.children || []), ...newItems],
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
    (item: SidebarItemType): boolean => {
      return (
        item.path === activePath ||
        item.children?.some((childItem) => isItemActive(childItem)) ||
        false
      )
    },
    [activePath]
  )

  const init = () => {
    const currentPath = location.hash.replace("#", "")
    if (currentPath) {
      setActivePath(currentPath)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        items,
        addItems,
        // activeItem,
        // changeActiveItem,
        activePath,
        setActivePath,
        isItemActive,
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
