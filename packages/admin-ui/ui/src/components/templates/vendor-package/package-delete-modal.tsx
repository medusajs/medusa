import React from "react"
import {
  PackageType,
  useAdminDeletePackage,
  Package,
} from "../../../hooks/admin/packages"
import Button from "../../fundamentals/button"
import { Option } from "../../../types/shared"
import useNotification from "../../../hooks/use-notification"
import Modal from "../../molecules/modal"
import { Vendor } from "@medusajs/medusa"

type PackageModalProps = {
  onClose: () => void
  vendorPackage: Package
  vendor: Vendor
}

export const packageTypes: Option[] = [
  {
    label: "Box",
    value: PackageType.BOX,
  },
  {
    label: "Envelope",
    value: PackageType.ENVELOPE,
  },
  {
    label: "Soft Package",
    value: PackageType.SOFT_PACKAGE,
  },
]

export const PackageDeleteModal: React.FC<PackageModalProps> = ({
  onClose,
  vendorPackage,
  vendor,
}) => {
  const notification = useNotification()
  const deletePackage = useAdminDeletePackage(vendor.id)

  const handleDelete = () => {
    deletePackage.mutate(
      { id: vendorPackage.id },
      {
        onSuccess: () => {
          notification("Success", "Package Removed", "success")
          onClose()
        },
        onError: (error) => {
          notification("Failure", "Package Deletion Failed", "error")
          console.error(error)
          onClose()
        },
      }
    )
  }

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">Delete Package</h1>
          </div>
        </Modal.Header>
        <Modal.Content isLargeModal>
          <h2 className="inter-base-semibold mb-base">
            Are you sure you want to delete: {vendorPackage?.package_name}?
          </h2>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end w-full gap-2">
            <Button
              variant="ghost"
              size="small"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              variant="primary"
              size="small"
            >
              Delete Package
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}
