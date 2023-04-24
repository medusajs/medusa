import { FC, MouseEventHandler, ReactNode } from "react"
import Button, { ButtonProps } from "../fundamentals/button"
import Modal from "../molecules/modal"

export interface PromptProps {
  heading?: ReactNode
  text?: ReactNode
  onCancel?: MouseEventHandler<HTMLButtonElement>
  cancelProps?: Partial<ButtonProps>
  cancelText?: ReactNode
  onConfirm?: MouseEventHandler<HTMLButtonElement>
  confirmProps?: Partial<ButtonProps>
  confirmText?: ReactNode
  onSaveAndConfirm?: MouseEventHandler<HTMLButtonElement>
  saveAndConfirmProps?: Partial<ButtonProps>
  saveAndConfirmText?: ReactNode
  handleClose: () => void
  isLoading?: boolean
}

export const Prompt: FC<PromptProps> = ({
  heading,
  text,
  onCancel,
  cancelProps,
  cancelText = "No, cancel",
  onConfirm,
  confirmProps,
  confirmText = "Yes, confirm",
  onSaveAndConfirm,
  saveAndConfirmProps,
  saveAndConfirmText = "Save and confirm",
  handleClose,
  isLoading,
}) => (
  <Modal isLargeModal={false} handleClose={handleClose} className="max-w-md">
    <Modal.Body>
      <Modal.Content>
        {typeof heading === "string" ? (
          <div className="inter-large-semibold">{heading}</div>
        ) : (
          heading
        )}
        {typeof text === "string" ? (
          <div className="inter-base-regular mt-2 text-grey-50">{text}</div>
        ) : (
          text
        )}
      </Modal.Content>
      <Modal.Footer>
        <div className="flex items-center justify-end w-full gap-2">
          {onCancel && (
            <Button
              size="small"
              variant="ghost"
              disabled={isLoading}
              onClick={onCancel}
              {...cancelProps}
            >
              {cancelText}
            </Button>
          )}

          {onSaveAndConfirm && (
            <Button
              size="small"
              variant="secondary"
              disabled={isLoading}
              onClick={onSaveAndConfirm}
              {...saveAndConfirmProps}
            >
              {saveAndConfirmText}
            </Button>
          )}

          {onConfirm && (
            <Button
              size="small"
              variant="primary"
              onClick={onConfirm}
              disabled={isLoading}
              {...confirmProps}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal.Body>
  </Modal>
)
