import { useAdminCreateInvite } from "medusa-react"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { Role } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import { NextSelect } from "../../molecules/select/next-select"

type InviteModalProps = {
  handleClose: () => void
}

type InviteModalFormData = {
  user: string
  role: Role
}

const InviteModal: React.FC<InviteModalProps> = ({ handleClose }) => {
  const notification = useNotification()

  const { mutate, isLoading } = useAdminCreateInvite()

  const { control, register, handleSubmit } = useForm<InviteModalFormData>()

  const onSubmit = (data: InviteModalFormData) => {
    mutate(
      {
        user: data.user,
        role: data.role.value,
      },
      {
        onSuccess: () => {
          notification("Success", `Invitation sent to ${data.user}`, "success")
          handleClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const roleOptions: Role[] = [
    { value: "member", label: "Member" },
    { value: "admin", label: "Admin" },
    { value: "developer", label: "Developer" },
  ]

  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Invite Users</span>
          </Modal.Header>
          <Modal.Content>
            <div className="gap-y-base flex flex-col">
              <InputField
                label="Email"
                placeholder="lebron@james.com"
                required
                {...register("user", { required: true })}
              />
              <Controller
                name="role"
                control={control}
                defaultValue={{ label: "Member", value: "member" }}
                render={({ field: { value, onChange, onBlur, ref } }) => {
                  return (
                    <NextSelect
                      label="Role"
                      placeholder="Select role"
                      onBlur={onBlur}
                      ref={ref}
                      onChange={onChange}
                      options={roleOptions}
                      value={value}
                    />
                  )
                }}
              />
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
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="text-small w-32 justify-center"
                variant="primary"
              >
                Invite
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default InviteModal
