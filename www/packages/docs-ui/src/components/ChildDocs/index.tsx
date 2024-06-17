"use client"

import React, { useMemo } from "react"
import { Card, CardList, MDXComponents, useSidebar } from "../.."
import { SidebarItemType } from "types"

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

  const filterCondition = (item: SidebarItemType): boolean => {
    switch (filterType) {
      case "hide":
        return (
          (!item.path || !hideItems.includes(item.path)) &&
          !hideItems.includes(item.title)
        )
      case "show":
        return (
          (item.path !== undefined && showItems!.includes(item.path)) ||
          showItems!.includes(item.title)
        )
      case "all":
        return true
    }
  }

  const filterItems = (items: SidebarItemType[]): SidebarItemType[] => {
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
            top: [...(getActiveItem()?.children || [])],
            bottom: [],
          }
    if (filterType === "all" || !targetItems) {
      return targetItems
    }

    return {
      ...targetItems,
      top: filterItems(targetItems.top),
      bottom: filterItems(targetItems.bottom),
    }
  }, [currentItems, type, getActiveItem, filterItems])

  const getTopLevelElms = (items?: SidebarItemType[]) => (
    <CardList
      items={
        items?.map((childItem) => ({
          title: childItem.title,
          href: childItem.path,
          showLinkIcon: false,
        })) || []
      }
    />
  )

  const getAllLevelsElms = (items?: SidebarItemType[]) =>
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
                    href: childItem.path,
                    showLinkIcon: false,
                  })) || []
                }
              />
            </>
          )}
          {!HeadingComponent && (
            <Card title={item.title} href={item.path} showLinkIcon={false} />
          )}
        </React.Fragment>
      )
    })

  const getElms = (items?: SidebarItemType[]) => {
    return onlyTopLevel ? getTopLevelElms(items) : getAllLevelsElms(items)
  }

  return (
    <>
      {getElms(filteredItems?.top)}
      {getElms(filteredItems?.bottom)}
    </>
  )
}
