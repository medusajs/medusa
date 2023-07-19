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
  loaded?: boolean
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

  const findItemInSection = (
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
  }

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
      section === SidebarItemSections.TOP ? items.top : items.bottom

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
        activePath,
        setActivePath,
        isItemActive,
        findItemInSection,
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
