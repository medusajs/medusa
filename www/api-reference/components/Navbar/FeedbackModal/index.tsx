"use client"

import { useModal } from "../../../providers/modal"
import Button from "../../Button"
import DetailedFeedback from "../../DetailedFeedback"

const FeedbackModal = () => {
  const { setModalProps } = useModal()

  const openModal = () => {
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
