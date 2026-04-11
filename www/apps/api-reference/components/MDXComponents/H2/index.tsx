"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useScrollController, useSidebar, H2 as UiH2 } from "docs-ui"
import { getSectionId } from "docs-utils"

type H2Props = React.HTMLAttributes<HTMLHeadingElement>

const H2 = ({ children, ...props }: H2Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { activePath } = useSidebar()
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

  return (
    <UiH2 {...props} id={id} passRef={headingRef}>
      {children}
    </UiH2>
  )
}

export default H2
