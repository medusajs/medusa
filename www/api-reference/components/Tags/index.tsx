"use client"

import { OpenAPIV3 } from "openapi-types"
import React from "react"
import TagSection from "./Section"
import { useInView } from "react-intersection-observer"
import { useSidebar } from "@/providers/sidebar"
import BaseSpecsProvider from "@/providers/base-specs"

export type TagsProps = {
  tags: OpenAPIV3.TagObject[]
  baseSpecs: OpenAPIV3.Document
} & React.HTMLAttributes<HTMLDivElement>

const Tags = ({ tags, baseSpecs }: TagsProps) => {
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
      <BaseSpecsProvider initialSpecs={baseSpecs}>
        {tags.map((tag, index) => (
          <TagSection tag={tag} key={index} />
        ))}
      </BaseSpecsProvider>
    </div>
  )
}

export default Tags
