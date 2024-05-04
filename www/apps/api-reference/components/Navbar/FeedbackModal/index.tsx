"use client"

import { Button, useModal, usePageLoading } from "docs-ui"
import DetailedFeedback from "../../DetailedFeedback"

const FeedbackModal = () => {
  const { setModalProps } = useModal()
  const { isLoading } = usePageLoading()

  const openModal = () => {
    if (isLoading) {
      return
    }
    setModalProps({
      title: "Send your Feedback",
      children: <DetailedFeedback />,
      contentClassName: "lg:!min-h-auto !p-0",
    })
  }

  return (
    <Button onClick={openModal} variant="secondary">
      Feedback
    </Button>
  )
}

export default FeedbackModal
