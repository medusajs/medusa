"use client"

import { useScrollController, useSidebar, Link } from "docs-ui"
import { useEffect, useMemo, useRef, useState } from "react"
import getSectionId from "../../../utils/get-section-id"
import clsx from "clsx"

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
    <h2
      className={clsx(
        "h2-docs [&_code]:!h2-docs [&_code]:!font-mono mb-docs_1 mt-docs_4 text-medusa-fg-base",
        props.id && "group/h2 scroll-m-56",
        props.className
      )}
      {...props}
      id={id}
      ref={headingRef}
    >
      {children}
      {props.id && (
        <Link
          href={`#${props.id}`}
          className="opacity-0 group-hover/h2:opacity-100 transition-opacity ml-docs_0.5 inline-block"
        >
          #
        </Link>
      )}
    </h2>
  )
}

export default H2
