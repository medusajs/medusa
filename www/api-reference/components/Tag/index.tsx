"use client"

import { OpenAPIV3 } from "openapi-types"
import React from "react"
import TagSection from "./Section"
import { useInView } from "react-intersection-observer"
import { useSidebar } from "@/providers/sidebar"

export type TagsProps = {
  tags: OpenAPIV3.TagObject[]
} & React.HTMLAttributes<HTMLDivElement>

const Tags = ({ tags }: TagsProps) => {
  const { setActivePath } = useSidebar()
  const { ref } = useInView({
    onChange: (inView) => {
      if (!inView) {
        setActivePath(null)
        history.pushState({}, "", "/")
      }
    },
  })
  return (
    <div ref={ref}>
      {tags.map((tag, index) => (
        <TagSection tag={tag} key={index} />
      ))}
    </div>
  )
}

export default Tags
