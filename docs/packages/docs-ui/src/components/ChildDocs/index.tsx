"use client"

import React from "react"
import { Card, CardList, MDXComponents, useSidebar } from "../.."
import { SidebarItemType } from "types"

type ChildDocsProps = {
  onlyTopLevel?: boolean
}

export const ChildDocs = ({ onlyTopLevel = false }: ChildDocsProps) => {
  const { currentItems } = useSidebar()

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
      {getElms(currentItems?.top)}
      {getElms(currentItems?.bottom)}
    </>
  )
}
