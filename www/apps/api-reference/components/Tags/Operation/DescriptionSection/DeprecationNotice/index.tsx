import React from "react"
import clsx from "clsx"
import { Badge, Tooltip } from "docs-ui"

export type TagsOperationDescriptionSectionDeprecationNoticeProps = {
  deprecationMessage?: string
  className?: string
}

const TagsOperationDescriptionSectionDeprecationNotice = ({
  deprecationMessage,
  className,
}: TagsOperationDescriptionSectionDeprecationNoticeProps) => {
  const getBadge = () => {
    return <Badge variant="orange">deprecated</Badge>
  }

  return (
    <div
      className={clsx("inline-block", className)}
      data-testid="deprecation-notice"
    >
      {deprecationMessage && (
        <Tooltip text={deprecationMessage}>{getBadge()}</Tooltip>
      )}
      {!deprecationMessage && getBadge()}
    </div>
  )
}

export default TagsOperationDescriptionSectionDeprecationNotice
