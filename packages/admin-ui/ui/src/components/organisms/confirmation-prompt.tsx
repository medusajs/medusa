import React, { useState } from "react"
import { ToastOptions } from "react-hot-toast"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import { Prompt, PromptProps } from "./prompt"

export interface ConfirmationPromptProps
  extends Omit<PromptProps, "onConfirm"> {
  successText?: string
  handleClose: () => void
  onConfirm: () => Promise<unknown>
  notificationOptions?: ToastOptions
}

const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({
  successText,
  handleClose,
  onConfirm,
  notificationOptions,
  ...props
}) => {
  const notification = useNotification(notificationOptions)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = (e) => {
    e.preventDefault()

    setIsLoading(true)
    onConfirm()
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
      {...props}
    />
  )
}

ConfirmationPrompt.defaultProps = {
  heading: "Are you sure you want to proceed?",
  text: "",
  cancelText: "No, cancel",
  confirmText: "Yes, proceed",
}

export default ConfirmationPrompt
