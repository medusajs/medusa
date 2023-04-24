import { FC, HTMLAttributes } from "react"
import clsx from "clsx"
import { getSectionTypeLabel } from "../../helpers/get-section-type-label"
import { usePostSectionContext } from "./context"

export interface PostSectionTypeLabelProps
  extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const PostSectionTypeLabel: FC<PostSectionTypeLabelProps> = ({
  className,
  ...props
}) => {
  const { postSection } = usePostSectionContext()

  return (
    <div
      {...props}
      className={clsx(
        "inter-small-regular text-grey-50 leading-none",
        className
      )}
    >
      {getSectionTypeLabel(postSection.type)}
    </div>
  )
}
