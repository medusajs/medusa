import { useState } from "react"
import Button from "../../../../components/fundamentals/button"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { usePostContext } from "../../context"
import { DeletePostPrompt } from "./delete-post-prompt"

const PostDeleteButton = () => {
  const { post, postTypeLabel, featureFlags } = usePostContext()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleClick = () => setConfirmDelete(true)

  if (!post) return null

  if (!featureFlags.delete) return null

  return (
    <div>
      <Button variant="danger" size="medium" onClick={handleClick}>
        <TrashIcon size={20} />
        <span>Delete {postTypeLabel}</span>
      </Button>

      {confirmDelete && (
        <DeletePostPrompt
          post={post}
          handleClose={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}

export default PostDeleteButton
