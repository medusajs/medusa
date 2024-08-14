"use client"

import { useScrollController, useSidebar } from "docs-ui"
import { useEffect, useMemo } from "react"
import getSectionId from "../../../utils/get-section-id"

type H2Props = React.HTMLAttributes<HTMLHeadingElement>

const H2 = ({ children, ...props }: H2Props) => {
  const { activePath, addItems } = useSidebar()
  const { scrollableElement } = useScrollController()

  const id = useMemo(() => getSectionId([children as string]), [children])

  useEffect(() => {
    if (id === (activePath || location.hash.replace("#", ""))) {
      const elm = document.getElementById(id) as HTMLElement
      scrollableElement?.scrollTo({
        top: elm.offsetTop,
      })
    }

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
    <h2 {...props} id={id}>
      {children}
    </h2>
  )
}

export default H2
