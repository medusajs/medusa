"use client"

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { getScrolledTop } from "@/utils"
import {
  SidebarItemSections,
  SidebarItem,
  SidebarSectionItems,
  SidebarItemLink,
  InteractiveSidebarItem,
  SidebarItemCategory,
  SidebarItemLinkWithParent,
} from "types"
import { useIsBrowser } from "../BrowserProvider"

export type CurrentItemsState = SidebarSectionItems & {
  previousSidebar?: CurrentItemsState
}

export type SidebarStyleOptions = {
  disableActiveTransition?: boolean
}

export type SidebarContextType = {
  items: SidebarSectionItems
  currentItems: CurrentItemsState | undefined
  activePath: string | null
  activeItem: SidebarItemLinkWithParent | undefined
  setActivePath: (path: string | null) => void
  isLinkActive: (item: SidebarItem, checkChildren?: boolean) => boolean
  isChildrenActive: (item: SidebarItemCategory) => boolean
  addItems: (items: SidebarItem[], options?: ActionOptionsType) => void
  removeItems: (items: SidebarItem[]) => void
  findItemInSection: (
    section: SidebarItem[],
    item: Partial<SidebarItem>,
    checkChildren?: boolean
  ) => SidebarItem | undefined
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  desktopSidebarOpen: boolean
  setDesktopSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  staticSidebarItems?: boolean
  shouldHandleHashChange: boolean
  sidebarRef: React.RefObject<HTMLDivElement>
  goBack: () => void
  sidebarTopHeight: number
  setSidebarTopHeight: React.Dispatch<React.SetStateAction<number>>
  resetItems: () => void
  isItemLoaded: (path: string) => boolean
  updatePersistedCategoryState: (title: string, opened: boolean) => void
  getPersistedCategoryState: (title: string) => boolean | undefined
  persistState: boolean
  isSidebarShown: boolean
} & SidebarStyleOptions

export const SidebarContext = createContext<SidebarContextType | null>(null)

export type ActionOptionsType = {
  section?: SidebarItemSections
  parent?: {
    path: string
    title: string
    changeLoaded?: boolean
  }
  indexPosition?: number
  ignoreExisting?: boolean
}

export type ActionType =
  | {
      type: "add" | "update"
      items: SidebarItem[]
      options?: ActionOptionsType
    }
  | {
      type: "replace"
      replacementItems: SidebarSectionItems
    }
  | {
      type: "remove"
      items: SidebarItem[]
    }

type LinksMap = Map<string, SidebarItemLinkWithParent>

const areItemsEqual = (itemA: SidebarItem, itemB: SidebarItem): boolean => {
  if (itemA.type === "separator" || itemB.type === "separator") {
    return false
  }
  const hasSameTitle = itemA.title === itemB.title
  const hasSamePath =
    itemA.type === "link" && itemB.type === "link" && itemA.path === itemB.path

  return hasSameTitle || hasSamePath
}

const findItem = (
  section: SidebarItem[],
  item: Partial<SidebarItem>,
  checkChildren = true
): SidebarItemLinkWithParent | undefined => {
  let foundItem: SidebarItemLinkWithParent | undefined
  section.some((i) => {
    if (i.type === "separator") {
      return false
    }
    if (areItemsEqual(item as SidebarItem, i) && i.type === "link") {
      foundItem = i
    } else if (checkChildren && i.children) {
      foundItem = findItem(i.children, item)
      if (foundItem && !foundItem.parentItem) {
        foundItem.parentItem = i
      }
    }

    return foundItem !== undefined
  })

  return foundItem
}

const getLinksMap = (
  items: SidebarItem[],
  initMap?: LinksMap,
  parentItem?: InteractiveSidebarItem
): LinksMap => {
  const map: LinksMap = initMap || new Map()

  items.forEach((item) => {
    if (item.type === "separator") {
      return
    }

    if (item.type === "link") {
      map.set(item.path, {
        ...item,
        parentItem,
      })
    }
    if (item.children?.length) {
      getLinksMap(item.children, map, item)
    }
  })

  return map
}

export const reducer = (
  state: SidebarSectionItems,
  actionData: ActionType
): SidebarSectionItems => {
  if (actionData.type === "replace") {
    return actionData.replacementItems
  }
  if (actionData.type === "remove") {
    return {
      ...state,
      default: state.default.filter((item) => {
        if (item.type === "separator") {
          return true
        }

        const found = actionData.items.some((itemToRemove) => {
          if (
            itemToRemove.type === "separator" ||
            itemToRemove.type !== item.type
          ) {
            return false
          }

          if (
            itemToRemove.type === "category" ||
            itemToRemove.type === "sub-category"
          ) {
            return itemToRemove.title === item.title
          }

          return (
            itemToRemove.path === (item as SidebarItemLink).path &&
            itemToRemove.title === (item as SidebarItemLink).title
          )
        })

        return !found
      }),
    }
  }
  const { type, options } = actionData
  let { items } = actionData

  const { parent, ignoreExisting = false, indexPosition } = options || {}
  const sectionName = SidebarItemSections.DEFAULT
  const sectionItems = state[sectionName]

  if (!ignoreExisting) {
    items = items.filter((item) => !findItem(sectionItems, item))
  }

  if (!items.length) {
    return state
  }

  switch (type) {
    case "add":
      return {
        ...state,
        [sectionName]:
          indexPosition !== undefined
            ? [
                ...sectionItems.slice(0, indexPosition),
                ...items,
                ...sectionItems.slice(indexPosition),
              ]
            : [...sectionItems, ...items],
      }
    case "update":
      // find item index
      return {
        ...state,
        [sectionName]: sectionItems.map((i) => {
          if (i.type === "separator") {
            return i
          }
          if (parent && areItemsEqual(i, parent as SidebarItem)) {
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
              loaded: parent.changeLoaded
                ? true
                : i.type === "link"
                ? i.loaded
                : true,
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
  initialItems?: SidebarSectionItems
  shouldHandleHashChange?: boolean
  shouldHandlePathChange?: boolean
  scrollableElement?: Element | Window
  staticSidebarItems?: boolean
  resetOnCondition?: () => boolean
  projectName: string
  persistState?: boolean
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
  resetOnCondition,
  projectName,
  persistState = true,
}: SidebarProviderProps) => {
  const categoriesStorageKey = `${projectName}_categories`
  const hideSidebarStorageKey = `hide_sidebar`
  const [items, dispatch] = useReducer(reducer, {
    default: initialItems?.default || [],
    mobile: initialItems?.mobile || [],
  })
  const [currentItems, setCurrentItems] = useState<
    CurrentItemsState | undefined
  >()
  const [activePath, setActivePath] = useState<string | null>("")
  const linksMap: LinksMap = useMemo(() => {
    return new Map([
      ...getLinksMap(items.mobile),
      ...getLinksMap(items.default),
    ])
  }, [items])
  const findItemInSection = useCallback(findItem, [])
  const activeItem = useMemo(() => {
    if (activePath === null) {
      return undefined
    }

    return linksMap.get(activePath)
  }, [activePath, linksMap])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
  const [sidebarTopHeight, setSidebarTopHeight] = useState(0)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const router = useRouter()
  const { isBrowser } = useIsBrowser()
  const getResolvedScrollableElement = useCallback(() => {
    return scrollableElement || window
  }, [scrollableElement])
  const isSidebarShown = useMemo(() => {
    if (!isBrowser) {
      return true
    }

    return document.getElementsByTagName("aside").length > 0
  }, [isBrowser])

  const isItemLoaded = useCallback(
    (path: string) => {
      const item = linksMap.get(path)

      return item?.loaded || false
    },
    [items, linksMap]
  )

  const addItems = (newItems: SidebarItem[], options?: ActionOptionsType) => {
    dispatch({
      type: options?.parent ? "update" : "add",
      items: newItems,
      options,
    })
  }

  const removeItems = (itemsToRemove: SidebarItem[]) => {
    dispatch({
      type: "remove",
      items: itemsToRemove,
    })
  }

  const isLinkActive = useCallback(
    (item: SidebarItem, checkChildren = false): boolean => {
      if (item.type !== "link") {
        return false
      }

      return (
        item.path === activePath ||
        (checkChildren && activePath?.split("_")[0] === item.path)
      )
    },
    [activePath]
  )

  const isChildrenActive = useCallback(
    (item: InteractiveSidebarItem): boolean => {
      return (
        item.children?.some((child) => {
          if (isLinkActive(child, true)) {
            return true
          }

          return child.type !== "separator" && child.children
            ? isChildrenActive(child)
            : false
        }) || false
      )
    },
    [isLinkActive]
  )

  const init = () => {
    const currentPath = location.hash.replace("#", "")
    if (currentPath) {
      setActivePath(currentPath)
    }
  }

  const getCurrentSidebar = useCallback(
    (searchItems: SidebarItem[]): InteractiveSidebarItem | undefined => {
      let currentSidebar: InteractiveSidebarItem | undefined
      searchItems.some((item) => {
        if (item.type === "separator") {
          return false
        }
        if (item.isChildSidebar && isLinkActive(item)) {
          currentSidebar = item
        }

        if (!currentSidebar && item.children?.length) {
          const childSidebar =
            getCurrentSidebar(item.children) ||
            (activePath
              ? findItem(item.children, {
                  path: activePath || undefined,
                  type: "link",
                })
              : undefined)

          if (childSidebar) {
            currentSidebar = childSidebar.isChildSidebar ? childSidebar : item
          }
        }

        return currentSidebar !== undefined
      })

      return currentSidebar
    },
    [isLinkActive, activePath]
  )

  const goBack = () => {
    if (!currentItems) {
      return
    }

    const previousSidebar = currentItems.previousSidebar || items

    const backItem = previousSidebar.default.find(
      (item) => item.type === "link" && !item.isChildSidebar
    ) as SidebarItemLink

    if (!backItem) {
      return
    }

    setActivePath(backItem.path!)
    setCurrentItems(previousSidebar)
    router.replace(backItem.path!)
  }

  const resetItems = useCallback(() => {
    dispatch({
      type: "replace",
      replacementItems: {
        default: initialItems?.default || [],
        mobile: initialItems?.mobile || [],
      },
    })
  }, [initialItems])

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
        const firstItemPath =
          items.default.length && items.default[0].type === "link"
            ? items.default[0].path
            : ""
        setActivePath(firstItemPath)
        if (firstItemPath) {
          router.push(`#${firstItemPath}`, {
            scroll: false,
          })
        }
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
    if (isLoading && items.default.length) {
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

    const currentSidebar = getCurrentSidebar(items.default)

    if (!currentSidebar) {
      setCurrentItems(undefined)
      return
    }

    if (
      currentSidebar.isChildSidebar &&
      currentSidebar.children &&
      (!currentItems?.parentItem ||
        !areItemsEqual(currentItems?.parentItem, currentSidebar))
    ) {
      const { children, ...parentItem } = currentSidebar
      const hasPreviousSidebar =
        currentItems?.previousSidebar?.parentItem?.type === "link" &&
        parentItem.type === "link" &&
        currentItems.previousSidebar.parentItem.path !== parentItem.path

      setCurrentItems({
        default: children,
        mobile: items.mobile,
        parentItem: parentItem,
        previousSidebar: hasPreviousSidebar ? currentItems : undefined,
      })
    }
  }, [getCurrentSidebar, activePath])

  useEffect(() => {
    if (resetOnCondition?.()) {
      resetItems()
      setActivePath(null)
    }
  }, [resetOnCondition, resetItems])

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const storageValue = localStorage.getItem(hideSidebarStorageKey)

    if (storageValue !== null) {
      setDesktopSidebarOpen(storageValue === "false")
    }
  }, [isBrowser])

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    localStorage.setItem(
      hideSidebarStorageKey,
      `${desktopSidebarOpen === false}`
    )
  }, [isBrowser, desktopSidebarOpen])

  const updatePersistedCategoryState = (title: string, opened: boolean) => {
    const storageData = JSON.parse(
      localStorage.getItem(categoriesStorageKey) || "{}"
    )
    if (!Object.hasOwn(storageData, projectName)) {
      storageData[projectName] = {}
    }

    storageData[projectName] = {
      ...storageData[projectName],
      [title]: opened,
    }

    localStorage.setItem(categoriesStorageKey, JSON.stringify(storageData))
  }

  const getPersistedCategoryState = (title: string): boolean | undefined => {
    const storageData = JSON.parse(
      localStorage.getItem(categoriesStorageKey) || "{}"
    )

    return !Object.hasOwn(storageData, projectName) ||
      !Object.hasOwn(storageData[projectName], title)
      ? undefined
      : storageData[projectName][title]
  }

  return (
    <SidebarContext.Provider
      value={{
        items,
        currentItems,
        addItems,
        removeItems,
        activePath,
        setActivePath,
        isLinkActive: isLinkActive,
        isChildrenActive,
        findItemInSection,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        desktopSidebarOpen,
        setDesktopSidebarOpen,
        activeItem,
        staticSidebarItems,
        disableActiveTransition,
        shouldHandleHashChange,
        sidebarRef,
        goBack,
        sidebarTopHeight,
        setSidebarTopHeight,
        resetItems,
        isItemLoaded,
        updatePersistedCategoryState,
        getPersistedCategoryState,
        persistState,
        isSidebarShown,
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
