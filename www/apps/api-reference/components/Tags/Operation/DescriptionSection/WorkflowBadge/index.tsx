import React from "react"
import { DecisionProcessIcon, SourceCodeLink } from "docs-ui"
import { config } from "@/config"

export type TagsOperationDescriptionSectionWorkflowBadgeProps = {
  workflow: string
}

const TagsOperationDescriptionSectionWorkflowBadge = ({
  workflow,
}: TagsOperationDescriptionSectionWorkflowBadgeProps) => {
  return (
    <p className="my-1">
      Workflow{" "}
      <SourceCodeLink
        link={`${config.baseUrl}/resources/references/medusa-workflows/${workflow}`}
        text={workflow}
        icon={<DecisionProcessIcon />}
      />{" "}
      is used in this API route.
    </p>
  )
}

export default TagsOperationDescriptionSectionWorkflowBadge
