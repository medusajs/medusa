import { useAdminUpdateOrder } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"

import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

type EmailModalProps = {
  handleClose: () => void
  email?: string
  orderId: string
}

type EmailModalFormData = {
  email: string
}

const EmailModal: React.FC<EmailModalProps> = ({
  orderId,
  email,
  handleClose,
}) => {
  const { mutate: updateEmail, isLoading } = useAdminUpdateOrder(orderId)
  const { register, handleSubmit } = useForm<EmailModalFormData>({
    defaultValues: { email },
  })
  const notification = useNotification()

  const handleUpdateEmail = (data: EmailModalFormData) => {
    const updateObj = { email: data.email }

    return updateEmail(updateObj, {
      onSuccess: () => {
        notification(
          "Success",
          "Successfully updated the email address",
          "success"
        )
        handleClose()
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  return (
    <Modal handleClose={handleClose} isLargeModal>
      <form onSubmit={handleSubmit(handleUpdateEmail)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Email Address</span>
          </Modal.Header>
          <Modal.Content>
            <div className="space-y-4">
              <div className="mt-4 flex space-x-4">
                <Input
                  label="Email"
                  {...register("email")}
                  placeholder="Email"
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <Button
                variant="ghost"
                className="text-small mr-2 w-32 justify-center"
                size="large"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="text-small w-32 justify-center"
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
                type="submit"
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default EmailModal
