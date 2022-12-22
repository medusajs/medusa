import { useAdminResendNotification } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

type ResendModalProps = {
  notificationId: string
  email: string
  handleCancel: () => void
}

const ResendModal: React.FC<ResendModalProps> = ({
  notificationId,
  email,
  handleCancel,
}) => {
  const { mutate, isLoading } = useAdminResendNotification(notificationId)

  const { register, handleSubmit } = useForm({
    defaultValues: { to: email },
  })

  const notification = useNotification()

  const handleResend = (data) => {
    mutate(
      {
        to: data.to.trim(),
      },
      {
        onSuccess: () => {
          notification(
            "Success",
            `Notification re-send to ${data.to}`,
            "success"
          )
          handleCancel()
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <Modal handleClose={handleCancel}>
      <form onSubmit={handleSubmit(handleResend)}>
        <Modal.Body>
          <Modal.Header handleClose={handleCancel}>
            <span className="inter-xlarge-semibold">Resend notification</span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col">
              <div className="flex flex-col space-y-2">
                <Input
                  label={"Email"}
                  type="text"
                  placeholder={"Email"}
                  {...register(`to`, {
                    required: "Must be filled",
                  })}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-end">
              <div className="flex">
                <Button
                  variant="ghost"
                  className="mr-2 w-32 text-small justify-center"
                  size="large"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="large"
                  className="w-32 text-small justify-center"
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default ResendModal
