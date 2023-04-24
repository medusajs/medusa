import { FC } from "react"
import Button from "../../../../../../../components/fundamentals/button"
import ArrowLeftIcon from "../../../../../../../components/fundamentals/icons/arrow-left-icon"
import { usePostContext } from "../../../../../context"
import { useNavigate } from "react-router-dom"

export const PostSectionBackButton: FC = () => {
  const navigate = useNavigate()
  const { post, shouldConfirmLeaveSection, setConfirmLeave } = usePostContext()

  const handleBackClick = () => {
    const navigateTo = `/admin/editor/${post.type}/${post.id}`

    // If there are changes to the section, we set the confirm leave state to "section"
    // so the section's unsaved changes prompt can be displayed.
    if (shouldConfirmLeaveSection) {
      return setConfirmLeave({
        from: "section",
        context: "section",
        navigateTo,
      })
    }

    navigate(navigateTo)
  }

  return (
    <Button
      variant="ghost"
      size="small"
      onClick={handleBackClick}
      className="w-8 h-8 p-0"
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </Button>
  )
}
