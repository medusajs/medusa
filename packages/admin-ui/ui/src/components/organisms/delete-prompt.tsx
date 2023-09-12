import React, { useState } from "react"
import { useTranslation } from "react-i18next"

import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import Button from "../fundamentals/button"
import Modal from "../molecules/modal"

type DeletePromptProps = {
  heading?: string
  text?: string
  successText?: string | false
  cancelText?: string
  confirmText?: string
  handleClose: () => void
  onDelete: () => Promise<unknown>
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  heading,
  text = "",
  successText,
  cancelText,
  confirmText,
  handleClose,
  onDelete,
}) => {
  const { t } = useTranslation()
  const notification = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsLoading(true)
    onDelete()
      .then(() => {
        if (successText) {
          notification(
            t("organisms-success", "Success"),
            successText ||
              t("organisms-delete-successful", "Delete successful"),
            "success"
          )
        }
      })
      .catch((err) => notification("Error", getErrorMessage(err), "error"))
      .finally(() => {
        setIsLoading(false)
        handleClose()
      })
  }

  return (
    <Modal isLargeModal={false} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">
              {heading ||
                t(
                  "organisms-are-you-sure-you-want-to-delete",
                  "Are you sure you want to delete?"
                )}
            </span>
            <span className="inter-base-regular text-grey-50 mt-1">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="gap-x-xsmall flex h-8 w-full justify-end">
            <Button
              variant="secondary"
              className="justify-center"
              size="small"
              onClick={handleClose}
            >
              {cancelText || t("organisms-no-cancel", "No, cancel")}
            </Button>
            <Button
              loading={isLoading}
              size="small"
              className="justify-center"
              variant="nuclear"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {confirmText || t("organisms-yes-remove", "Yes, remove")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default DeletePrompt
