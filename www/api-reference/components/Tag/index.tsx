"use client"

import { OpenAPIV3 } from "openapi-types"
import React from "react"
import TagSection from "./Section"

export type TagsProps = {
  tags: OpenAPIV3.TagObject[]
} & React.HTMLAttributes<HTMLDivElement>

const Tags = ({ tags }: TagsProps) => {
  return (
    <>
      {tags.map((tag, index) => (
        <TagSection tag={tag} key={index} />
      ))}
    </>
  )
}

export default Tags
