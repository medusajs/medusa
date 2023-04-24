import { ConfiguredTaxRegion } from "@medusajs/medusa"
import { FC } from "react"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import { useForm } from "react-hook-form"
import { useAdminUpdateConfiguredTaxRegion } from "../../../hooks/admin/tax-regions/mutations"
import useNotification from "../../../hooks/use-notification"

import Input from "../../../components/molecules/input"

interface FormValues {
  registered_tax_id: string
}

interface UpdateConfiguredTaxRegionFormProps {
  configured_tax_region: ConfiguredTaxRegion
  onClose: () => void
}

export const UpdateConfiguredTaxRegionModal: FC<
  UpdateConfiguredTaxRegionFormProps
> = ({ configured_tax_region, onClose }) => {
  const update = useAdminUpdateConfiguredTaxRegion(configured_tax_region.id)
  const notification = useNotification()
  const form = useForm<{ registered_tax_id: string }>({
    defaultValues: {
      registered_tax_id: configured_tax_region.registered_tax_id ?? "",
    },
  })

  const { register, handleSubmit } = form

  const onSubmit = async (data: FormValues) => {
    return update.mutate(
      {
        registered_tax_id: data.registered_tax_id,
      },
      {
        onSuccess: () => {
          notification("Success", "Tax Region Configured", "success")
          onClose()
        },
        onError: (error) => {
          notification("Failure", error?.response?.data?.message, "error")
        },
      }
    )
  }

  return (
    <Modal handleClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            Configure Tax Region
          </Modal.Header>
          <Modal.Content>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4">
              <Input
                label="Registered Tax ID"
                {...register("registered_tax_id")}
              />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-2">
              <Button size="small" variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}
