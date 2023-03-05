import React, { useState } from "react"
import { createRoot } from "react-dom/client"
import Button from "../components/fundamentals/button"
import InputField from "../components/molecules/input"
import Modal from "../components/molecules/modal"

const DeleteDialog = ({
  open,
  heading,
  text,
  onConfirm,
  onCancel,
  confirmText = "Yes, confirm",
  cancelText = "Cancel",
  extraConfirmation = false,
  entityName,
}) => {
  const [confirmationString, setConfirmationString] = useState<string>()

  return (
    <Modal open={open} handleClose={onCancel} isLargeModal={false}>
      <Modal.Body>
        <Modal.Content className="!py-large">
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="mt-1 inter-base-regular text-grey-50">{text}</span>
          </div>
          {extraConfirmation && (
            <div className="flex flex-col my-base">
              <span className="mt-1 inter-base-regular text-grey-50">
                Type the name{" "}
                <span className="font-semibold">"{entityName}"</span> to
                confirm.
              </span>
              <InputField
                autoFocus={true}
                placeholder={entityName}
                className={"mt-base"}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmationString(event.target.value)
                }
              />
            </div>
          )}
        </Modal.Content>
        <Modal.Footer className="border-none !pt-0">
          <div className="flex justify-end w-full">
            <Button
              variant="secondary"
              className="justify-center mr-2 text-small"
              size="small"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              size="small"
              className="justify-center text-small"
              variant="nuclear"
              onClick={onConfirm}
              disabled={extraConfirmation && entityName !== confirmationString}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

type ImperativeDialogProps =
  | {
      heading: string
      text: string
      confirmText?: string
      cancelText?: string
    } & (
      | {
          extraConfirmation: true
          entityName: string
        }
      | {
          extraConfirmation?: false
          entityName?: never
        }
    )

const useImperativeDialog = () => {
  return ({
    heading,
    text,
    confirmText,
    cancelText,
    extraConfirmation,
    entityName,
  }: ImperativeDialogProps): Promise<boolean> => {
    // We want a promise here so we can "await" the user's action (either confirm or cancel)
    return new Promise((resolve) => {
      const mountRoot = createRoot(document.createElement("div"))
      let open = true

      const onConfirm = () => {
        open = false
        resolve(true)
        // trigger a rerender to close the dialog
        render()
      }

      const onCancel = () => {
        open = false
        resolve(false)
        // trigger a rerender to close the dialog
        render()
      }

      // attach the dialog in the mount node
      const render = () => {
        mountRoot.render(
          <DeleteDialog
            heading={heading}
            text={text}
            open={open}
            onCancel={onCancel}
            onConfirm={onConfirm}
            confirmText={confirmText}
            cancelText={cancelText}
            extraConfirmation={extraConfirmation}
            entityName={entityName}
          />
        )
      }

      render()
    })
  }
}

export default useImperativeDialog
