"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { isElmWindow, useIsBrowser, useScrollController } from "../.."
import { usePathname } from "next/navigation"
import { useMutationObserver } from "../use-mutation-observer"

export type ActiveOnScrollItem = {
  heading: HTMLHeadingElement
  children?: ActiveOnScrollItem[]
}

export type UseActiveOnScrollProps = {
  rootElm?: Document | HTMLElement
  enable?: boolean
  useDefaultIfNoActive?: boolean
}

export const useActiveOnScroll = ({
  rootElm,
  enable = true,
  useDefaultIfNoActive = true,
}: UseActiveOnScrollProps) => {
  const [items, setItems] = useState<ActiveOnScrollItem[]>([])
  const [activeItemId, setActiveItemId] = useState("")
  const { scrollableElement } = useScrollController()
  const isBrowser = useIsBrowser()
  const pathname = usePathname()
  const root = useMemo(() => {
    if (!enable) {
      return
    }
    if (rootElm) {
      return rootElm
    }

    if (!isBrowser) {
      return
    }

    return document
  }, [rootElm, isBrowser, enable])
  const getHeadingsInElm = useCallback(() => {
    if (!isBrowser || !enable) {
      return []
    }

    return root?.querySelectorAll("h2,h3")
  }, [isBrowser, pathname, root, enable])
  const setHeadingItems = useCallback(() => {
    if (!enable) {
      return
    }
    const headings = getHeadingsInElm()
    const itemsToSet: ActiveOnScrollItem[] = []
    let lastLevel2HeadingIndex = -1

    headings?.forEach((heading) => {
      const level = parseInt(heading.tagName.replace("H", ""))
      const isLevel2 = level === 2
      const headingItem: ActiveOnScrollItem = {
        heading: heading as HTMLHeadingElement,
        children: [],
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
  }, [getHeadingsInElm, enable])

  useMutationObserver({
    elm: root,
    callback: setHeadingItems,
  })

  const setActiveToClosest = useCallback(() => {
    if (!enable) {
      return
    }
    const headings = getHeadingsInElm()
    let closestPositiveHeading: HTMLHeadingElement | undefined = undefined
    let closestNegativeHeading: HTMLHeadingElement | undefined = undefined
    let closestPositiveDistance = Infinity
    let closestNegativeDistance = -Infinity
    const halfway = isElmWindow(scrollableElement)
      ? scrollableElement.innerHeight / 2
      : scrollableElement
      ? scrollableElement.scrollHeight / 2
      : 0

    headings?.forEach((heading) => {
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

    setActiveItemId(
      chosenClosest
        ? (chosenClosest as HTMLHeadingElement).id
        : items.length
        ? useDefaultIfNoActive
          ? items[0].heading.id
          : ""
        : ""
    )
  }, [getHeadingsInElm, items, enable])

  useEffect(() => {
    if (!scrollableElement || !enable) {
      return
    }

    scrollableElement.addEventListener("scroll", setActiveToClosest)

    return () => {
      scrollableElement.removeEventListener("scroll", setActiveToClosest)
    }
  }, [scrollableElement, setActiveToClosest, enable])

  useEffect(() => {
    if (items.length && enable) {
      setActiveToClosest()
    }
  }, [items, setActiveToClosest, enable])

  return {
    items,
    activeItemId,
  }
}
