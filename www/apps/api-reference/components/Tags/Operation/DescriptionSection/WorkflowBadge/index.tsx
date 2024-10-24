import { Badge, DecisionProcessIcon } from "docs-ui"
import { config } from "../../../../../config"
import Link from "next/link"

export type TagsOperationDescriptionSectionWorkflowBadgeProps = {
  workflow: string
}

const TagsOperationDescriptionSectionWorkflowBadge = ({
  workflow,
}: TagsOperationDescriptionSectionWorkflowBadgeProps) => {
  return (
    <p className="my-1">
      Workflow{" "}
      <Link
        href={`${config.baseUrl}/resources/references/medusa-workflows/${workflow}`}
        className="align-middle"
        target="_blank"
        rel="noreferrer"
      >
        <Badge
          variant="neutral"
          className="inline-flex hover:bg-medusa-tag-neutral-bg-hover cursor-pointer"
          childrenWrapperClassName="inline-flex flex-row gap-[3px] items-center"
        >
          <DecisionProcessIcon />
          <span>{workflow}</span>
        </Badge>
      </Link>{" "}
      is used in this API route.
    </p>
  )
}

export default TagsOperationDescriptionSectionWorkflowBadge
