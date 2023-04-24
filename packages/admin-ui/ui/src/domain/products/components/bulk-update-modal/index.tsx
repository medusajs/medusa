import { ProductStatus } from "@medusajs/medusa"
import * as React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { useAdminBulkProductUpdate } from "../../../../hooks/admin/products/mutations"
import { BulkUpdateForm, BulkUpdateFormData } from "../bulk-update-form"

export type BulkUpdateProductsModalProps = {
  close: () => void
  selectedProductIds: string[]
  onSave: () => void
}

export const BulkUpdateProductsModal: React.FC<
  BulkUpdateProductsModalProps
> = ({ close, onSave, selectedProductIds }) => {
  const mutation = useAdminBulkProductUpdate()
  const form = useForm<BulkUpdateFormData>()
  const { handleSubmit } = form

  const handleSave = (update: BulkUpdateFormData) => {
    mutation.mutate(
      {
        ids: selectedProductIds,
        collection_id: update.collection?.value,
        type: update.type
          ? { value: update.type.label, id: update.type?.value }
          : undefined,
        status: update?.status?.value as ProductStatus,
        add_tags: update.add_tags?.map((option) => ({
          value: option.label,
          id: option.value,
        })),
        remove_tags: update.remove_tags?.map((option) => ({
          value: option.label,
          id: option.value,
        })),
      },
      {
        onSuccess() {
          onSave()
          close()
        },
      }
    )
  }

  return (
    <Modal open handleClose={close}>
      <Modal.Body>
        <Modal.Header handleClose={close}>
          <h2 className="inter-xlarge-semibold">
            Update {selectedProductIds.length} Products
          </h2>
        </Modal.Header>
        <Modal.Content>
          <BulkUpdateForm form={form} />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end w-full gap-2">
            <Button variant="ghost" size="small" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleSubmit(handleSave)}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}
