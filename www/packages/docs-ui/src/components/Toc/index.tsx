"use client"

import React, { useEffect, useState } from "react"
import { ToCItemUi } from "types"
import {
  ActiveOnScrollItem,
  isElmWindow,
  useActiveOnScroll,
  useIsBrowser,
  useScrollController,
} from "../.."
import { TocList } from "./List"
import clsx from "clsx"
import { TocMenu } from "./Menu"

export const Toc = () => {
  const [items, setItems] = useState<ToCItemUi[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const { isBrowser } = useIsBrowser()
  const { items: headingItems, activeItemId } = useActiveOnScroll({})
  const [maxHeight, setMaxHeight] = useState(0)
  const { scrollableElement } = useScrollController()

  const formatHeadingContent = (content: string | null): string => {
    return content?.replaceAll(/#$/g, "") || ""
  }

  const formatHeadingObject = ({
    heading,
    children,
  }: ActiveOnScrollItem): ToCItemUi => {
    const level = parseInt(heading.tagName.replace("H", ""))
    return {
      title: formatHeadingContent(heading.textContent),
      id: heading.id,
      level,
      children: children?.map(formatHeadingObject),
      associatedHeading: heading as HTMLHeadingElement,
    }
  }

  useEffect(() => {
    setItems(headingItems.map(formatHeadingObject))
  }, [headingItems])

  const handleResize = () => {
    const offset =
      (scrollableElement instanceof HTMLElement
        ? scrollableElement.offsetTop
        : 0) + 56

    setMaxHeight(
      (isElmWindow(scrollableElement)
        ? scrollableElement.innerHeight
        : scrollableElement?.clientHeight || 0) - offset
    )
  }

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isBrowser])

  return (
    <div className="hidden lg:block" onMouseOver={() => setShowMenu(true)}>
      <div
        className={clsx(
          "fixed top-1/2 right-[20px]",
          "hidden lg:flex justify-center items-center",
          "overflow-hidden z-10",
          showMenu && "lg:hidden",
          maxHeight < 1000 && "-translate-y-[40%]",
          maxHeight >= 1000 && "-translate-y-1/2"
        )}
        onMouseOver={() => setShowMenu(true)}
        style={{
          maxHeight,
        }}
      >
        <TocList items={items} topLevel={true} activeItem={activeItemId} />
      </div>
      <TocMenu
        items={items}
        activeItem={activeItemId}
        show={showMenu}
        setShow={setShowMenu}
      />
    </div>
  )
}
