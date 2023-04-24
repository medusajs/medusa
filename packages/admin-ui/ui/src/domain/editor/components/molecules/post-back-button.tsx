import Button from "../../../../components/fundamentals/button"
import ArrowLeftIcon from "../../../../components/fundamentals/icons/arrow-left-icon"
import { usePostContext } from "../../context"
import { useNavigate } from "react-router-dom"

const PostBackButton = () => {
  const navigate = useNavigate()
  const {
    backURLPath,
    backButtonLabel,
    shouldConfirmLeavePost,
    shouldConfirmLeaveSection,
    setConfirmLeave,
  } = usePostContext()

  const handleBackClick = () => {
    const navigateTo = backURLPath

    // If the section has changes, let's show the section's unsaved changes prompt.
    // The section's unsaved changes prompt will also handle the post's unsaved changes.
    if (shouldConfirmLeaveSection) {
      return setConfirmLeave({
        from: "post",
        context: "section",
        navigateTo,
      })
    }

    // If the post has changes, let's show the post's unsaved changes prompt.
    if (shouldConfirmLeavePost) {
      return setConfirmLeave({
        from: "post",
        context: "post",
        navigateTo,
      })
    }

    navigate(navigateTo)
  }

  return (
    <Button variant="secondary" size="medium" onClick={handleBackClick}>
      <ArrowLeftIcon />
      <span>{backButtonLabel}</span>
    </Button>
  )
}

export default PostBackButton
