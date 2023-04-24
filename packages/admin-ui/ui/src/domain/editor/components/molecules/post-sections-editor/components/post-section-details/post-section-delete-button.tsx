import { PostSection } from "@medusajs/medusa"
import { FC, useState, MouseEvent } from "react"
import Button, {
  ButtonProps,
} from "../../../../../../../components/fundamentals/button"
import LibraryIcon from "../../../../../../../components/fundamentals/icons/library"
import Alert from "../../../../../../../components/molecules/alert"
import DeletePrompt from "../../../../../../../components/organisms/delete-prompt"
import { useAdminDeletePostSection } from "../../../../../../../hooks/admin/post-sections"

export interface PostSectionDeleteButtonProps
  extends Omit<ButtonProps, "variant"> {
  postSection: PostSection
  onDelete?: (postSection: PostSection) => void
  onCancel?: () => void
}

export const PostSectionDeleteButton: FC<PostSectionDeleteButtonProps> = ({
  postSection,
  onDelete,
  onCancel,
  onClick,
  children,
  ...props
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { mutateAsync: deletePostSection } = useAdminDeletePostSection(
    postSection.id
  )

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setConfirmDelete(true)
    if (onClick) onClick(event)
  }

  const handleDelete = async () => {
    await deletePostSection({})
    if (onDelete) onDelete(postSection)
  }

  const handleCancel = () => {
    setConfirmDelete(false)
    if (onCancel) onCancel()
  }

  if (!postSection) return null

  const otherLocations = postSection.usage_count - 1

  return (
    <>
      <Button variant="danger" size="medium" onClick={handleClick} {...props}>
        {children}
      </Button>

      {confirmDelete && (
        <DeletePrompt
          handleClose={() => setConfirmDelete(false)}
          onDelete={handleDelete}
          onCancel={handleCancel}
          heading="Delete section"
          text={
            <>
              <p>Are you sure you want to delete this section?</p>
              {otherLocations > 0 && (
                <Alert
                  variant="danger"
                  className="mt-4 mb-2"
                  icon={LibraryIcon}
                >
                  This library section is being used in{" "}
                  <span className="font-semibold">{otherLocations}</span> other
                  location{otherLocations > 1 ? "s" : ""}.
                </Alert>
              )}
            </>
          }
          confirmText="Yes, delete"
          successText="Section deleted"
          notificationOptions={{ position: "bottom-left" }}
        />
      )}
    </>
  )
}
