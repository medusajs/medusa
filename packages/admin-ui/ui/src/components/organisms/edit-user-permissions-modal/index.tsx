import { Vendor } from "@medusajs/medusa"
import React, { useState } from "react"
import { AccessLevelEnum } from "../../../hooks/admin/invites"
import { useAdminUpdateVendorAccess } from "../../../hooks/admin/user-vendor-access/mutations"

import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import Select from "../../molecules/select"

type EditUserPermissionsModalProps = {
  handleClose: () => void
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  vendor: Vendor
  onSubmit: () => void
}

export type SelectPermission = {
  value: string
  label: string
}

const selectablePermissions: SelectPermission[] = [
  {
    value: "view",
    label: "View",
  },
  {
    value: "edit",
    label: "Edit",
  },
]

const EditUserPermissionsModal: React.FC<EditUserPermissionsModalProps> = ({
  handleClose,
  vendor,
  user,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const updateVendorAccess = useAdminUpdateVendorAccess()
  const [selectedPermission, setSelectedPermission] =
    useState<SelectPermission>(selectablePermissions[0])
  const notification = useNotification()

  const submit = () => {
    setIsLoading(true)

    updateVendorAccess.mutate(
      {
        vendor_id: vendor.id,
        user_id: user.id,
        access_level: selectedPermission.value as AccessLevelEnum,
      },
      {
        onSuccess: () => {
          notification("Success", "user updated", "success")
          handleClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )

    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Edit User Permissions</span>
        </Modal.Header>
        <Modal.Content>
          <Select
            label="Vendor Permission"
            options={selectablePermissions}
            value={selectedPermission}
            enableSearch={true}
            onChange={(e: SelectPermission) => setSelectedPermission(e)}
            className="mb-2"
          />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end w-full gap-2">
            <Button variant="ghost" size="small" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              loading={isLoading}
              variant="primary"
              size="small"
              onClick={submit}
            >
              Update
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditUserPermissionsModal
