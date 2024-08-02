"use client"

import { InView } from "react-intersection-observer"
import { isElmWindow, useScrollController, useSidebar } from "docs-ui"
import checkElementInViewport from "../../../utils/check-element-in-viewport"
import { useEffect, useMemo } from "react"
import getSectionId from "../../../utils/get-section-id"

type H2Props = {
  addToSidebar?: boolean
} & React.HTMLAttributes<HTMLHeadingElement>

const H2 = ({ addToSidebar = true, children, ...props }: H2Props) => {
  const { activePath, setActivePath, addItems } = useSidebar()
  const { getScrolledTop, scrollableElement } = useScrollController()

  const handleViewChange = (
    inView: boolean,
    entry: IntersectionObserverEntry
  ) => {
    if (!addToSidebar) {
      return
    }
    const heading = entry.target
    if (
      (inView ||
        checkElementInViewport(heading.parentElement || heading, 40)) &&
      getScrolledTop() !== 0 &&
      activePath !== heading.id
    ) {
      // can't use next router as it doesn't support
      // changing url without scrolling
      history.pushState({}, "", `#${heading.id}`)
      setActivePath(heading.id)
    }
  }
  const id = getSectionId([children as string])

  useEffect(() => {
    if (id === (activePath || location.hash.replace("#", ""))) {
      const elm = document.getElementById(id)
      elm?.scrollIntoView()
    }

    addItems([
      {
        type: "link",
        path: `${id}`,
        title: children as string,
        loaded: true,
      },
    ])
  }, [])

  const root = useMemo(() => {
    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [scrollableElement])

  return (
    <InView
      as="h2"
      threshold={0.4}
      skip={!addToSidebar}
      initialInView={false}
      {...props}
      onChange={handleViewChange}
      id={id}
      root={root}
    >
      {children}
    </InView>
  )
}

export default H2
