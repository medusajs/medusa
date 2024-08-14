"use client"

import { useScrollController, useSidebar } from "docs-ui"
import { useEffect, useMemo, useRef, useState } from "react"
import getSectionId from "../../../utils/get-section-id"

type H2Props = React.HTMLAttributes<HTMLHeadingElement>

const H2 = ({ children, ...props }: H2Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { activePath, addItems } = useSidebar()
  const { scrollableElement, scrollToElement } = useScrollController()
  const [scrolledFirstTime, setScrolledFirstTime] = useState(false)

  const id = useMemo(() => getSectionId([children as string]), [children])

  useEffect(() => {
    if (!scrollableElement || !headingRef.current || scrolledFirstTime) {
      return
    }

    if (id === (activePath || location.hash.replace("#", ""))) {
      scrollToElement(
        (headingRef.current.offsetParent as HTMLElement) || headingRef.current
      )
    }
    setScrolledFirstTime(scrolledFirstTime)
  }, [scrollableElement, headingRef, id])

  useEffect(() => {
    addItems([
      {
        type: "link",
        path: `${id}`,
        title: children as string,
        loaded: true,
      },
    ])
  }, [id])

  return (
    <h2 {...props} id={id} ref={headingRef}>
      {children}
    </h2>
  )
}

export default H2
