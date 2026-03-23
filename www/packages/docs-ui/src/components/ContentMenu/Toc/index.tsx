"use client"

import React, { useEffect } from "react"
import { ToCItem, ToCItemUi } from "types"
import { useScrollController } from "../../../hooks/use-scroll-utils"
import {
  ActiveOnScrollItem,
  useActiveOnScroll,
} from "../../../hooks/use-active-on-scroll"
import clsx from "clsx"
import Link from "next/link"
import { useSiteConfig } from "../../../providers/SiteConfig"
import { Loading } from "../../Loading"
import { ContentMenuSection } from "../Section"

export const ContentMenuToc = () => {
  const { toc: items, frontmatter, setToc } = useSiteConfig()
  const { items: generatedItems, activeItemId } = useActiveOnScroll({
    maxLevel: 4,
  })

  const formatHeadingContent = (heading: HTMLHeadingElement): string => {
    return Array.from(heading.childNodes)
      .filter((child) => child.nodeType === Node.TEXT_NODE && child.textContent)
      .map((textNode) => textNode.textContent!.trim())
      .join("")
  }

  const formatHeadingObject = ({
    heading,
    children,
  }: ActiveOnScrollItem): ToCItemUi => {
    const level = parseInt(heading.tagName.replace("H", ""))
    return {
      title: formatHeadingContent(heading),
      id: heading.id,
      level,
      children: children?.map(formatHeadingObject),
      associatedHeading: heading as HTMLHeadingElement,
    }
  }

  useEffect(() => {
    if (
      frontmatter.generate_toc &&
      generatedItems &&
      items?.length !== generatedItems.length
    ) {
      const tocItems: ToCItem[] = generatedItems.map(formatHeadingObject)
      setToc(tocItems)
    }
  }, [frontmatter, generatedItems])

  useEffect(() => {
    const activeElement = document.querySelector(
      ".toc-item a[href='#" + activeItemId + "']"
    ) as HTMLAnchorElement
    if (!activeElement) {
      return
    }

    activeElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    })
  }, [activeItemId])

  if (items && !items.length) {
    return <></>
  }

  return (
    <ContentMenuSection title="On this page">
      <div className="h-max max-h-full overflow-y-hidden flex relative flex-col">
        {items !== null && (
          <TocList
            items={items}
            activeItemId={activeItemId}
            className="relative overflow-y-auto py-docs_0.75 px-docs_1"
          />
        )}
        {items === null && <EmptyTocItems />}
      </div>
    </ContentMenuSection>
  )
}

type TocListProps = {
  items: ToCItem[]
  activeItemId: string
  className?: string
}

const TocList = ({ items, activeItemId, className }: TocListProps) => {
  return (
    <ul className={className} data-testid="toc-list">
      {items.map((item) => (
        <TocItem item={item} key={item.id} activeItemId={activeItemId} />
      ))}
    </ul>
  )
}

type TocItemProps = {
  item: ToCItem
  activeItemId: string
}

const TocItem = ({ item, activeItemId }: TocItemProps) => {
  const { scrollToElement } = useScrollController()
  return (
    <li className="w-full toc-item" data-testid="toc-item">
      <Link
        href={`#${item.id}`}
        className={clsx(
          "block w-full relative py-docs_0.25",
          item.id !== activeItemId &&
            "text-medusa-fg-subtle hover:text-medusa-fg-base text-x-small",
          item.id === activeItemId && "text-medusa-fg-base text-x-small-plus",
          "truncate"
        )}
        onClick={(e) => {
          e.preventDefault()
          history.pushState({}, "", `#${item.id}`)
          const elm = document.getElementById(item.id) as HTMLElement
          scrollToElement(elm)
        }}
      >
        {item.title}
      </Link>
      {(item.children?.length ?? 0) > 0 && (
        <TocList
          items={item.children!}
          activeItemId={activeItemId}
          className="pl-docs_0.75 relative after:content-[''] after:absolute after:left-0 after:top-docs_0.25 after:bottom-docs_0.25 after:w-docs_0.125 after:h-[calc(100%-8px)] after:bg-medusa-border-strong"
        />
      )}
    </li>
  )
}

const EmptyTocItems = () => {
  return (
    <div className="animate-pulse" data-testid="empty-toc-items">
      <Loading
        count={5}
        className="!py-docs_0.75 !px-docs_1 !my-0"
        barClassName="!h-docs_0.5"
      />
    </div>
  )
}
