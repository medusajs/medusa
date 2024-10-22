import { OpenAPIV3 } from "openapi-types"
import { TagSectionProps } from "./Section"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const TagSection = dynamic<TagSectionProps>(
  async () => import("./Section")
) as React.FC<TagSectionProps>

type TagsProps = {
  tags?: OpenAPIV3.TagObject[]
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <Suspense>
      {tags?.map((tag) => (
        <TagSection tag={tag} key={tag.name} />
      ))}
    </Suspense>
  )
}

export default Tags
