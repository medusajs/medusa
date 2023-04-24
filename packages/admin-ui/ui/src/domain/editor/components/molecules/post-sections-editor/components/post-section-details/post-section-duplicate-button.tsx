import { PostSection } from "@medusajs/medusa"
import { FC } from "react"
import Button, {
  ButtonProps,
} from "../../../../../../../components/fundamentals/button"
import { useAdminDuplicatePostSection } from "../../../../../../../hooks/admin/post-sections"

export interface PostSectionDuplicateButtonProps
  extends Omit<ButtonProps, "variant"> {
  postSection: PostSection
  onDuplicate?: (id: string, newPostSection: PostSection) => void
}

export const PostSectionDuplicateButton: FC<
  PostSectionDuplicateButtonProps
> = ({ children, postSection, onDuplicate, ...props }) => {
  const { mutateAsync: duplicatePostSection } = useAdminDuplicatePostSection(
    postSection.id
  )

  const handleDuplicate = async () => {
    const { data } = await duplicatePostSection({ type: postSection.type })
    if (onDuplicate) onDuplicate(postSection.id, data.post_section)
  }

  return (
    <Button {...props} variant="ghost" size="small" onClick={handleDuplicate}>
      {children}
    </Button>
  )
}
