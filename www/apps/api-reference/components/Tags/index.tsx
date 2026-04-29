import React, { Suspense } from "react"
import { OpenAPI } from "types"
import { TagSectionProps } from "./Section"
import dynamic from "next/dynamic"

const TagSection = dynamic<TagSectionProps>(
  async () => import("./Section")
) as React.FC<TagSectionProps>

type TagsProps = {
  tags?: OpenAPI.OpenAPIV3.TagObject[]
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <Suspense>
      {tags?.map((tag) => <TagSection tag={tag} key={tag.name} />)}
    </Suspense>
  )
}

export default Tags
