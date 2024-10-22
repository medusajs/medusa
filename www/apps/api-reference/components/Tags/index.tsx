import { OpenAPIV3 } from "openapi-types"
import { TagSectionProps } from "./Section"
import dynamic from "next/dynamic"

const TagSection = dynamic<TagSectionProps>(
  async () => import("./Section")
) as React.FC<TagSectionProps>

type TagsProps = {
  tags?: OpenAPIV3.TagObject[]
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <>
      {tags?.map((tag) => (
        <TagSection tag={tag} key={tag.name} />
      ))}
    </>
  )
}

export default Tags
