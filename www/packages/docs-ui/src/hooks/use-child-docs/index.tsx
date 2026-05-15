"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Card,
  CardList,
  getLocalSearch,
  H2,
  H3,
  H4,
  Hr,
  LocalSearch,
  MarkdownContent,
  SearchInput,
  useIsBrowser,
  useSidebar,
} from "../.."
import { Sidebar } from "types"
import slugify from "slugify"
import { MDXComponents } from "../.."
import { ChevronDoubleRight, ExclamationCircle } from "@medusajs/icons"
import { isSidebarItemLink } from "../../utils/sidebar-utils"

type HeadingComponent = (
  props: React.HTMLAttributes<HTMLHeadingElement>
) => React.JSX.Element

export type UseChildDocsProps = {
  onlyTopLevel?: boolean
  type?: "sidebar" | "item"
  hideItems?: string[]
  showItems?: string[]
  hideTitle?: boolean
  hideDescription?: boolean
  titleLevel?: number
  startChildLevel?: number
  endChildLevel?: number
  itemsPerRow?: number
  defaultItemsPerRow?: number
  search?: {
    enable: boolean
    storageKey?: string
    placeholder?: string
  }
}

export const useChildDocs = ({
  onlyTopLevel = false,
  hideItems = [],
  showItems,
  type = "sidebar",
  hideTitle = false,
  hideDescription = false,
  titleLevel = 2,
  startChildLevel = 1,
  endChildLevel = -1,
  itemsPerRow,
  defaultItemsPerRow,
  search: {
    enable: enableSearch = false,
    storageKey = "child-docs",
    ...searchProps
  } = { enable: false },
}: UseChildDocsProps) => {
  const { shownSidebar, activeItem, getSidebarFirstLinkChild } = useSidebar()
  const { isBrowser } = useIsBrowser()
  const [searchQuery, setSearchQuery] = useState("")
  const [localSearch, setLocalSearch] = useState<
    LocalSearch<Sidebar.SidebarItemLink> | undefined
  >()
  const TitleHeaderComponent = useCallback(
    (level: number): HeadingComponent => {
      switch (level) {
        case 3:
          return H3
        case 4:
          return H4
        case 5:
          return MDXComponents["h5"] as HeadingComponent
        case 6:
          return MDXComponents["h6"] as HeadingComponent
        default:
          return H2
      }
    },
    []
  )
  const filterType = useMemo(() => {
    return showItems !== undefined
      ? "show"
      : hideItems.length > 0
        ? "hide"
        : "all"
  }, [showItems, hideItems])

  const filterCondition = (item: Sidebar.SidebarItem): boolean => {
    if (item.type === "separator") {
      return false
    }
    switch (filterType) {
      case "hide":
        return (
          (!isSidebarItemLink(item) || !hideItems.includes(item.path)) &&
          !hideItems.includes(item.title)
        )
      case "show":
        return (
          (isSidebarItemLink(item) && showItems!.includes(item.path)) ||
          showItems!.includes(item.title)
        )
      case "all":
        return true
    }
  }

  const filterItems = (
    items: Sidebar.SidebarItem[]
  ): Sidebar.InteractiveSidebarItem[] => {
    return (items.filter(filterCondition) as Sidebar.InteractiveSidebarItem[])
      .map((item) => Object.assign({}, item))
      .map((item) => {
        if (item.children && filterType === "hide") {
          item.children = filterItems(item.children)
        }

        return item
      })
  }

  const filterNonInteractiveItems = (
    items: Sidebar.SidebarItem[] | undefined
  ): Sidebar.InteractiveSidebarItem[] => {
    return (
      (items?.filter(
        (item) => item.type !== "separator" && !item.hideFromChildItems
      ) as Sidebar.InteractiveSidebarItem[]) || []
    )
  }

  const getChildrenForLevel = ({
    item,
    currentLevel = 1,
  }: {
    item: Sidebar.InteractiveSidebarItem
    currentLevel?: number
  }): Sidebar.InteractiveSidebarItem[] | undefined => {
    if (
      (endChildLevel > 0 && currentLevel > endChildLevel) ||
      !item.children ||
      item.hideFromChildItems
    ) {
      return
    }
    if (currentLevel >= startChildLevel) {
      return filterNonInteractiveItems(item.children)
    }

    const childrenResult: Sidebar.InteractiveSidebarItem[] = []

    filterNonInteractiveItems(item.children).forEach((child) => {
      const childChildren = getChildrenForLevel({
        item: child,
        currentLevel: currentLevel + 1,
      })

      if (!childChildren) {
        return
      }

      childrenResult.push(...childChildren)
    })

    return childrenResult
  }

  const filteredItems = useMemo(() => {
    let targetItems =
      type === "sidebar"
        ? shownSidebar && "items" in shownSidebar
          ? shownSidebar.items
          : shownSidebar?.children || []
        : [...(activeItem?.children || [])]
    if (filterType !== "all" && targetItems) {
      targetItems = filterItems(targetItems)
    }

    return filterNonInteractiveItems(targetItems)
  }, [shownSidebar, type, activeItem, filterType])

  const searchableItems = useMemo(() => {
    const searchableItems: Sidebar.SidebarItemLink[] = []
    if (!enableSearch) {
      return searchableItems
    }
    if (onlyTopLevel) {
      filteredItems.forEach((item) => {
        if (isSidebarItemLink(item)) {
          searchableItems.push(item)
        } else {
          const firstChild = item.children?.find((child) =>
            isSidebarItemLink(child)
          )
          if (firstChild) {
            searchableItems.push(firstChild as Sidebar.SidebarItemLink)
          }
        }
      })
    } else {
      filteredItems?.forEach((item) => {
        const childItems: Sidebar.SidebarItemLink[] =
          (getChildrenForLevel({ item })?.filter((childItem) => {
            return isSidebarItemLink(childItem)
          }) as Sidebar.SidebarItemLink[]) || []
        searchableItems.push(...childItems)
      })
    }

    return searchableItems
  }, [filteredItems, onlyTopLevel, enableSearch])

  useEffect(() => {
    if (!enableSearch && localSearch) {
      setLocalSearch(undefined)
      return
    }
    if (!enableSearch || !searchableItems?.length || localSearch) {
      return
    }

    setLocalSearch(
      getLocalSearch<Sidebar.SidebarItemLink>({
        docs: searchableItems,
        searchableFields: ["title", "description"],
        options: {
          storeFields: ["title", "description", "path", "type"],
          searchOptions: {
            boost: { title: 2 },
            prefix: true,
            fuzzy: 0.2,
          },
          idField: "path",
        },
      })
    )
  }, [searchableItems, enableSearch, localSearch])

  const searchResult = useMemo(() => {
    return localSearch?.search(searchQuery) || []
  }, [localSearch, searchQuery])

  useEffect(() => {
    if (!isBrowser || !enableSearch) {
      return
    }

    const storedQuery = localStorage.getItem(`${storageKey}-query`)
    if (storedQuery) {
      setSearchQuery(storedQuery)
    }
  }, [isBrowser, storageKey, enableSearch])

  useEffect(() => {
    if (!isBrowser || !enableSearch) {
      return
    }

    localStorage.setItem(`${storageKey}-query`, searchQuery)
  }, [isBrowser, searchQuery, storageKey, enableSearch])

  const getTopLevelElms = (items?: Sidebar.InteractiveSidebarItem[]) => {
    const itemsToShow: {
      [k: string]: Sidebar.InteractiveSidebarItem
    } = {}
    items?.forEach((childItem) => {
      const href = isSidebarItemLink(childItem)
        ? childItem.path
        : childItem.type === "sidebar"
          ? getSidebarFirstLinkChild(childItem)?.path
          : (
              childItem.children?.find((item) =>
                isSidebarItemLink(item)
              ) as Sidebar.SidebarItemLink
            )?.path

      if (!href) {
        return
      }

      itemsToShow[href] = childItem
    })
    const itemsToShowEntries = Object.entries(itemsToShow)
    if (!itemsToShowEntries.length) {
      return <></>
    }
    return (
      <CardList
        items={itemsToShowEntries.map(([href, childItem]) => {
          return {
            title: childItem.title,
            href,
            rightIcon:
              childItem.type === "ref" ? ChevronDoubleRight : undefined,
            text: childItem.description,
          }
        })}
        itemsPerRow={itemsPerRow}
        defaultItemsPerRow={defaultItemsPerRow}
      />
    )
  }

  const getAllLevelsElms = ({
    items,
    headerLevel = titleLevel,
    currentLevel = 1,
  }: {
    items?: Sidebar.InteractiveSidebarItem[]
    headerLevel?: number
    currentLevel?: number
  }) => {
    return items?.map((item, key) => {
      const itemChildren = getChildrenForLevel({ item, currentLevel })
      const HeadingComponent = itemChildren?.length
        ? TitleHeaderComponent(headerLevel)
        : undefined
      const linkChildren =
        itemChildren?.filter(
          (item) => isSidebarItemLink(item) || item.type === "sidebar"
        ) || []
      const categoryChildren =
        itemChildren?.filter(
          (child) => child.type === "category" || child.type === "sub-category"
        ) || []
      const showLinkAsCard = !HeadingComponent && isSidebarItemLink(item)

      return (
        <React.Fragment key={key}>
          {HeadingComponent && (
            <>
              {!hideTitle && (
                <>
                  <HeadingComponent id={slugify(item.title.toLowerCase())}>
                    {item.title}
                  </HeadingComponent>
                  {!hideDescription && item.description && (
                    <MarkdownContent
                      allowedElements={["a", "code", "ul", "ol", "p"]}
                    >
                      {item.description}
                    </MarkdownContent>
                  )}
                </>
              )}
              {linkChildren.length > 0 && (
                <CardList
                  items={
                    linkChildren.map((childItem) => {
                      const href = isSidebarItemLink(childItem)
                        ? childItem.path
                        : getSidebarFirstLinkChild(
                            childItem as Sidebar.SidebarItemSidebar
                          )?.path
                      return {
                        title: childItem.title,
                        href,
                        text: childItem.description,
                        rightIcon:
                          childItem.type === "ref"
                            ? ChevronDoubleRight
                            : undefined,
                      }
                    }) || []
                  }
                  itemsPerRow={itemsPerRow}
                  defaultItemsPerRow={defaultItemsPerRow}
                  className="mb-docs_1"
                />
              )}
              {categoryChildren.length > 0 &&
                getAllLevelsElms({
                  items: categoryChildren,
                  headerLevel: headerLevel + 1,
                  currentLevel: currentLevel + 1,
                })}
              {key !== items.length - 1 && headerLevel === 2 && <Hr />}
            </>
          )}
          {showLinkAsCard && (
            <Card
              title={item.title}
              href={item.path}
              text={item.description}
              rightIcon={item.type === "ref" ? ChevronDoubleRight : undefined}
            />
          )}
        </React.Fragment>
      )
    })
  }

  const getSearchResultElms = () => {
    const Heading = TitleHeaderComponent(titleLevel)
    return (
      <>
        <Heading>Search Results</Heading>
        {searchResult.length > 0 && (
          <CardList
            items={searchResult.map((item) => ({
              title: item.title,
              href: item.path,
              text: item.description,
              rightIcon: item.type === "ref" ? ChevronDoubleRight : undefined,
              highlightText: item.terms,
            }))}
            itemsPerRow={itemsPerRow}
            defaultItemsPerRow={defaultItemsPerRow}
            className="my-docs_2"
          />
        )}
        {!searchResult.length && (
          <div className="flex flex-col justify-center items-center gap-docs_0.75">
            <ExclamationCircle className="text-medusa-fg-subtle" />
            <span className="text-compact-small-plus text-medusa-fg-base text-center">
              No results found matching your query.
            </span>
            <span className="text-compact-small text-medusa-fg-subtle text-center">
              Try searching with another term or clearing the search.
            </span>
          </div>
        )}
      </>
    )
  }

  const getElms = () => {
    return (
      <>
        {enableSearch && (
          <SearchInput
            value={searchQuery || ""}
            onChange={setSearchQuery}
            {...searchProps}
          />
        )}
        {searchQuery && getSearchResultElms()}
        {!searchQuery && (
          <>
            {onlyTopLevel
              ? getTopLevelElms(filteredItems)
              : getAllLevelsElms({
                  items: filteredItems,
                })}
          </>
        )}
      </>
    )
  }

  return {
    items: filteredItems,
    component: getElms(),
  }
}
