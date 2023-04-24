import { Vendor } from "@medusajs/medusa"

import React, { useContext, useState } from "react"
import { AccountContext } from "../../../context/account"
import {
  AccessLevelEnum,
  useAdminCreateInvite,
  UserRole,
  UserRoles,
} from "../../../hooks/admin/invites/mutations"
import useNotification from "../../../hooks/use-notification"
import { Controller, useForm } from "react-hook-form"
import { Role } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Select from "../../molecules/select"
import { SelectPermission } from "../edit-user-permissions-modal"

type InviteModalProps = {
  vendor?: Vendor
  handleClose: () => void
}

type InviteModalFormData = {
  user: string
  role: Role
  permission: SelectPermission
}

const roleOptions: Role[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
]

const vendorPermissionOptions = [
  { value: "view", label: "View" },
  { value: "edit", label: "Edit" },
]

const InviteModal: React.FC<InviteModalProps> = ({ vendor, handleClose }) => {
  const account = useContext(AccountContext)

  const notification = useNotification()

  const { mutate, isLoading } = useAdminCreateInvite()

  const { control, register, handleSubmit } = useForm<InviteModalFormData>({
    defaultValues: { role: roleOptions[0] },
  })

  const onSubmit = (data: InviteModalFormData) => {
    mutate(
      {
        user: data.user,
        role: data.role.value,
        initial_vendor_id: vendor?.id,
        access_level: data.permission?.value,
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

  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Invite Users</span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col gap-y-base">
              <InputField
                label="Email"
                placeholder="lebron@james.com"
                required
                {...register("user", { required: true })}
              />
              <Controller
                name="role"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select
                      label="Role"
                      onChange={onChange}
                      options={roleOptions}
                      value={value}
                    />
                  )
                }}
              />

              {!!vendor && (
                <Controller
                  name="permission"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        label="Permissions"
                        onChange={onChange}
                        options={vendorPermissionOptions}
                        value={value}
                      />
                    )
                  }}
                />
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-2">
              <Button
                variant="ghost"
                size="small"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="small"
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
