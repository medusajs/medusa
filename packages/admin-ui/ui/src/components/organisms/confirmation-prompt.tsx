import React, { useState } from "react"

import Button from "../fundamentals/button"
import Modal from "../molecules/modal"

type ConfirmationPromptProps = {
  heading: string
  text: string
  cancelText: string
  confirmText: string
  handleClose: () => void
  onConfirm: () => Promise<void>
}

const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({
  heading,
  text,
  cancelText,
  confirmText,
  handleClose,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsLoading(true)
    onConfirm().finally(() => {
      setIsLoading(false)
      handleClose()
    })
  }

  return (
    <Modal isLargeModal={false} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="inter-base-regular text-grey-50 mt-1">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex h-8 w-full justify-end">
            <Button
              variant="ghost"
              className="text-small me-2 w-24 justify-center"
              size="small"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              loading={isLoading}
              size="small"
              className="text-small w-24 justify-center"
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ConfirmationPrompt
