import React, { useState } from "react"
import { ToastOptions } from "react-hot-toast"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import { Prompt, PromptProps } from "./prompt"

export interface DeletePromptProps extends PromptProps {
  successText?: string | null
  onDelete: () => Promise<unknown>
  notificationOptions?: ToastOptions
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  handleClose,
  onDelete,
  successText,
  confirmProps,
  notificationOptions,
  ...props
}) => {
  const notification = useNotification(notificationOptions)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = (e) => {
    e.preventDefault()

    setIsLoading(true)
    onDelete()
      .then(() => {
        if (successText) notification("Success", successText, "success")
      })
      .catch((err) => notification("Error", getErrorMessage(err), "error"))
      .finally(() => {
        setIsLoading(false)
        handleClose()
      })
  }

  return (
    <Prompt
      onCancel={handleClose}
      onConfirm={handleConfirm}
      handleClose={handleClose}
      isLoading={isLoading}
      confirmProps={{ variant: "nuclear", ...confirmProps }}
      {...props}
    />
  )
}

DeletePrompt.defaultProps = {
  heading: "Are you sure you want to delete?",
  text: "",
  cancelText: "No, cancel",
  confirmText: "Yes, remove",
  successText: "Delete successful",
}

export default DeletePrompt
