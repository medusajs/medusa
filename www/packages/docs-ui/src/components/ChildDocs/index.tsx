"use client"

import React, { useMemo } from "react"
import { Card, CardList, MDXComponents, useSidebar } from "../.."
import { SidebarItem } from "types"

type ChildDocsProps = {
  onlyTopLevel?: boolean
  type?: "sidebar" | "item"
  hideItems?: string[]
  showItems?: string[]
  hideTitle?: boolean
}

export const ChildDocs = ({
  onlyTopLevel = false,
  hideItems = [],
  showItems,
  type = "sidebar",
  hideTitle = false,
}: ChildDocsProps) => {
  const { currentItems, getActiveItem } = useSidebar()
  const filterType = useMemo(() => {
    return showItems !== undefined
      ? "show"
      : hideItems.length > 0
      ? "hide"
      : "all"
  }, [showItems, hideItems])

  const filterCondition = (item: SidebarItem): boolean => {
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
        if (item.children && filterType === "hide") {
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
            default: [...(getActiveItem()?.children || [])],
          }
    if (filterType === "all" || !targetItems) {
      return targetItems
    }

    return {
      ...targetItems,
      default: filterItems(targetItems.default),
    }
  }, [currentItems, type, getActiveItem, filterItems])

  const getTopLevelElms = (items?: SidebarItem[]) => (
    <CardList
      items={
        items?.map((childItem) => ({
          title: childItem.title,
          href: childItem.type === "link" ? childItem.path : "",
          showLinkIcon: false,
        })) || []
      }
    />
  )

  const getAllLevelsElms = (items?: SidebarItem[]) =>
    items?.map((item, key) => {
      const HeadingComponent = item.children?.length
        ? MDXComponents["h2"]
        : undefined

      return (
        <React.Fragment key={key}>
          {HeadingComponent && (
            <>
              {!hideTitle && <HeadingComponent>{item.title}</HeadingComponent>}
              <CardList
                items={
                  item.children?.map((childItem) => ({
                    title: childItem.title,
                    href: childItem.type === "link" ? childItem.path : "",
                    showLinkIcon: false,
                  })) || []
                }
              />
            </>
          )}
          {!HeadingComponent && (
            <Card
              title={item.title}
              href={item.type === "link" ? item.path : ""}
              showLinkIcon={false}
            />
          )}
        </React.Fragment>
      )
    })

  const getElms = (items?: SidebarItem[]) => {
    return onlyTopLevel ? getTopLevelElms(items) : getAllLevelsElms(items)
  }

  return <>{getElms(filteredItems?.default)}</>
}
