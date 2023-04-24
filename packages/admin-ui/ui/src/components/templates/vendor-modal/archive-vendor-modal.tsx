import { Vendor } from "@medusajs/medusa"
import React from "react"
import { useAdminArchiveVendor } from "../../../hooks/admin/vendors"
import { clearVendorsCache } from "../../../hooks/admin/vendors/queries"
import useNotification from "../../../hooks/use-notification"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

export const ArchiveVendorModal: React.FC<{
  vendor: Vendor
  onClose: () => void
  onSuccess: () => void
}> = ({ onClose, onSuccess, vendor }) => {
  const archiveVendor = useAdminArchiveVendor()
  const notification = useNotification()

  const archive = () => {
    archiveVendor.mutate(
      { id: vendor.id },
      {
        onSuccess: () => {
          clearVendorsCache()
          notification("Success", "Vendor Archived", "success")
          onSuccess()
          onClose()
        },
        onError: (error) => {
          notification("Failure", "Vendor Archive Failed", "error")
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
            <h1 className="inter-xlarge-semibold mb-2xsmall">Archive Vendor</h1>
          </div>
        </Modal.Header>
        <Modal.Content>
          <p className="mb-base">
            Are you sure you want to archive {vendor.name}?
          </p>
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
              onClick={archive}
              variant="primary"
              size="small"
            >
              Archive Vendor
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}
