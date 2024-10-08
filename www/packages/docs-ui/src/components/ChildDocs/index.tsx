"use client"

import React, { useMemo } from "react"
import { Card, CardList, MDXComponents, useSidebar } from "../.."
import { InteractiveSidebarItem, SidebarItem, SidebarItemLink } from "types"
import slugify from "slugify"

type ChildDocsProps = {
  onlyTopLevel?: boolean
  type?: "sidebar" | "item"
  hideItems?: string[]
  showItems?: string[]
  hideTitle?: boolean
  childLevel?: number
}

export const ChildDocs = ({
  onlyTopLevel = false,
  hideItems = [],
  showItems,
  type = "sidebar",
  hideTitle = false,
  childLevel = 1,
}: ChildDocsProps) => {
  const { currentItems, activeItem } = useSidebar()
  const filterType = useMemo(() => {
    return showItems !== undefined
      ? "show"
      : hideItems.length > 0
      ? "hide"
      : "all"
  }, [showItems, hideItems])

  const filterCondition = (item: SidebarItem): boolean => {
    if (item.type === "separator") {
      return false
    }
    switch (filterType) {
      case "hide":
        return (
          (item.type !== "link" || !hideItems.includes(item.path)) &&
          !hideItems.includes(item.title)
        )
      case "show":
        return (
          (item.type === "link" && showItems!.includes(item.path)) ||
          showItems!.includes(item.title)
        )
      case "all":
        return true
    }
  }

  const filterItems = (items: SidebarItem[]): SidebarItem[] => {
    return items
      .filter(filterCondition)
      .map((item) => Object.assign({}, item))
      .map((item) => {
        if (
          item.type !== "separator" &&
          item.children &&
          filterType === "hide"
        ) {
          item.children = filterItems(item.children)
        }

        return item
      })
  }

  const filteredItems = useMemo(() => {
    const targetItems =
      type === "sidebar"
        ? currentItems
          ? Object.assign({}, currentItems)
          : undefined
        : {
            default: [...(activeItem?.children || [])],
          }
    if (filterType === "all" || !targetItems) {
      return targetItems
    }

    return {
      ...targetItems,
      default: filterItems(targetItems.default),
    }
  }, [currentItems, type, activeItem, filterItems])

  const filterNonInteractiveItems = (
    items: SidebarItem[] | undefined
  ): InteractiveSidebarItem[] => {
    return (
      (items?.filter(
        (item) => item.type !== "separator"
      ) as InteractiveSidebarItem[]) || []
    )
  }

  const getChildrenForLevel = (
    item: InteractiveSidebarItem,
    currentLevel = 1
  ): InteractiveSidebarItem[] | undefined => {
    if (currentLevel === childLevel) {
      return filterNonInteractiveItems(item.children)
    }
    if (!item.children) {
      return
    }

    const childrenResult: InteractiveSidebarItem[] = []

    filterNonInteractiveItems(item.children).forEach((child) => {
      const childChildren = getChildrenForLevel(child, currentLevel + 1)

      if (!childChildren) {
        return
      }

      childrenResult.push(...childChildren)
    })

    return childrenResult
  }

  const getTopLevelElms = (items?: SidebarItem[]) => {
    return (
      <CardList
        items={
          filterNonInteractiveItems(items).map((childItem) => {
            const href =
              childItem.type === "link"
                ? childItem.path
                : childItem.children?.length
                ? (
                    childItem.children.find(
                      (item) => item.type === "link"
                    ) as SidebarItemLink
                  )?.path
                : "#"
            return {
              title: childItem.title,
              href,
            }
          }) || []
        }
      />
    )
  }

  const getAllLevelsElms = (items?: SidebarItem[]) =>
    filterNonInteractiveItems(items).map((item, key) => {
      const itemChildren = getChildrenForLevel(item)
      const HeadingComponent = itemChildren?.length
        ? MDXComponents["h2"]
        : undefined

      return (
        <React.Fragment key={key}>
          {HeadingComponent && (
            <>
              {!hideTitle && (
                <HeadingComponent id={slugify(item.title)}>
                  {item.title}
                </HeadingComponent>
              )}
              <CardList
                items={
                  itemChildren?.map((childItem) => ({
                    title: childItem.title,
                    href: childItem.type === "link" ? childItem.path : "",
                  })) || []
                }
              />
            </>
          )}
          {!HeadingComponent && item.type === "link" && (
            <Card title={item.title} href={item.path} />
          )}
        </React.Fragment>
      )
    })

  const getElms = (items?: SidebarItem[]) => {
    return onlyTopLevel ? getTopLevelElms(items) : getAllLevelsElms(items)
  }

  return <>{getElms(filteredItems?.default)}</>
}
