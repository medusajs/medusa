import { User } from "@medusajs/medusa"
import { useAdminUpdateUser } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import FormValidator from "../../../utils/form-validator"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"

type EditUserModalProps = {
  handleClose: () => void
  user: User
  onSuccess: () => void
}

type EditUserModalFormData = {
  first_name: string
  last_name: string
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  handleClose,
  user,
  onSuccess,
}) => {
  const { mutate, isLoading } = useAdminUpdateUser(user.id)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserModalFormData>()
  const notification = useNotification()

  useEffect(() => {
    reset(mapUser(user))
  }, [user])

  const onSubmit = (data: EditUserModalFormData) => {
    mutate(data, {
      onSuccess: () => {
        notification("Success", `User was updated`, "success")
        onSuccess()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
      onSettled: () => {
        handleClose()
      },
    })
  }

  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Edit User</span>
          </Modal.Header>
          <Modal.Content>
            <div className="gap-large mb-base grid w-full grid-cols-2">
              <InputField
                label="First Name"
                placeholder="First name..."
                required
                {...register("first_name", {
                  required: FormValidator.required("First name"),
                  pattern: FormValidator.whiteSpaceRule("First name"),
                  minLength: FormValidator.minOneCharRule("First name"),
                })}
                errors={errors}
              />
              <InputField
                label="Last Name"
                placeholder="Last name..."
                required
                {...register("last_name", {
                  required: FormValidator.required("Last name"),
                  pattern: FormValidator.whiteSpaceRule("Last name"),
                  minLength: FormValidator.minOneCharRule("last name"),
                })}
                errors={errors}
              />
            </div>
            <InputField label="Email" disabled value={user.email} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                size="small"
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

const mapUser = (user: User): EditUserModalFormData => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
  }
}

export default EditUserModal
