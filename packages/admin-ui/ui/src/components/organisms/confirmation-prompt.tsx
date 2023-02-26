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
            <span className="inter-base-regular mt-1 text-grey-50">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-24 text-small justify-center"
              size="small"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              loading={isLoading}
              size="small"
              className="w-24 text-small justify-center"
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
