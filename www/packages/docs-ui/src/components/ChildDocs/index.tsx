"use client"

import React, { useMemo } from "react"
import { Card, CardList, MDXComponents, useSidebar } from "../.."
import { SidebarItemType } from "types"

type ChildDocsProps = {
  onlyTopLevel?: boolean
  type?: "sidebar" | "item"
  filters?: string[]
}

export const ChildDocs = ({
  onlyTopLevel = false,
  filters = [],
  type = "sidebar",
}: ChildDocsProps) => {
  const { currentItems, getActiveItem } = useSidebar()

  const filterItems = (items: SidebarItemType[]): SidebarItemType[] => {
    return items
      .filter(
        (item) =>
          (!item.path || !filters.includes(item.path)) &&
          !filters.includes(item.title)
      )
      .map((item) => Object.assign({}, item))
      .map((item) => {
        if (item.children) {
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
    if (!filters.length || !targetItems) {
      return targetItems
    }

    return {
      ...targetItems,
      top: filterItems(targetItems.top),
      bottom: filterItems(targetItems.bottom),
    }
  }, [currentItems, type, getActiveItem])

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
              <HeadingComponent>{item.title}</HeadingComponent>
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
