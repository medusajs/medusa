"use client"

import { usePathname } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { ToCItemUi } from "types"
import { isElmWindow, useIsBrowser, useScrollController } from "../.."
import { TocList } from "./List"
import clsx from "clsx"
import { TocMenu } from "./Menu"

export const Toc = () => {
  const [items, setItems] = useState<ToCItemUi[]>([])
  const [activeItem, setActiveItem] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [maxHeight, setMaxHeight] = useState(0)
  const isBrowser = useIsBrowser()
  const pathname = usePathname()
  const { scrollableElement } = useScrollController()
  const getHeadingsInDom = useCallback(() => {
    if (!isBrowser) {
      return []
    }

    return document.querySelectorAll("h2,h3")
  }, [isBrowser, pathname])

  const formatHeadingContent = (content: string | null): string => {
    return content?.replaceAll(/#$/g, "") || ""
  }

  useEffect(() => {
    const headings = getHeadingsInDom()
    const itemsToSet: ToCItemUi[] = []
    let lastLevel2HeadingIndex = -1

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.replace("H", ""))
      const isLevel2 = level === 2
      const headingItem: ToCItemUi = {
        title: formatHeadingContent(heading.textContent),
        id: heading.id,
        level,
        children: [],
        associatedHeading: heading as HTMLHeadingElement,
      }

      if (isLevel2 || lastLevel2HeadingIndex === -1) {
        itemsToSet.push(headingItem)
        if (isLevel2) {
          lastLevel2HeadingIndex = itemsToSet.length - 1
        }
      } else if (lastLevel2HeadingIndex !== -1) {
        itemsToSet[lastLevel2HeadingIndex].children?.push(headingItem)
      }
    })

    setItems(itemsToSet)
  }, [isBrowser, getHeadingsInDom])

  const setActiveToClosest = useCallback(() => {
    const headings = getHeadingsInDom()
    let closestPositiveHeading: HTMLHeadingElement | undefined = undefined
    let closestNegativeHeading: HTMLHeadingElement | undefined = undefined
    let closestPositiveDistance = Infinity
    let closestNegativeDistance = -Infinity
    const halfway = isElmWindow(scrollableElement)
      ? scrollableElement.innerHeight / 2
      : scrollableElement
      ? scrollableElement.scrollHeight / 2
      : 0

    headings.forEach((heading) => {
      const headingDistance = heading.getBoundingClientRect().top

      if (headingDistance > 0 && headingDistance < closestPositiveDistance) {
        closestPositiveDistance = headingDistance
        closestPositiveHeading = heading as HTMLHeadingElement
      } else if (
        headingDistance < 0 &&
        headingDistance > closestNegativeDistance
      ) {
        closestNegativeDistance = headingDistance
        closestNegativeHeading = heading as HTMLHeadingElement
      }
    })

    const negativeDistanceToHalfway = Math.abs(
      halfway + closestNegativeDistance
    )
    const positiveDistanceToHalfway = Math.abs(
      halfway - closestPositiveDistance
    )

    const chosenClosest =
      negativeDistanceToHalfway > positiveDistanceToHalfway
        ? closestNegativeHeading
        : closestPositiveHeading

    setActiveItem(
      chosenClosest
        ? (chosenClosest as HTMLHeadingElement).id
        : items.length
        ? items[0].id
        : ""
    )
  }, [getHeadingsInDom, items])

  useEffect(() => {
    if (!scrollableElement) {
      return
    }

    scrollableElement.addEventListener("scroll", setActiveToClosest)

    return () => {
      scrollableElement.removeEventListener("scroll", setActiveToClosest)
    }
  }, [scrollableElement, setActiveToClosest])

  useEffect(() => {
    if (items.length) {
      setActiveToClosest()
    }
  }, [items, setActiveToClosest])

  const handleResize = () => {
    if (window.innerHeight < 900) {
      setMaxHeight(0)
      return
    }

    setMaxHeight(
      isElmWindow(scrollableElement)
        ? scrollableElement.innerHeight
        : scrollableElement?.clientHeight || 0
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
        <TocList items={items} topLevel={true} activeItem={activeItem} />
      </div>
      <TocMenu
        items={items}
        activeItem={activeItem}
        show={showMenu}
        setShow={setShowMenu}
      />
    </div>
  )
}
