import { ConfiguredTaxRegion, TaxRegion } from "@medusajs/medusa"
import { FC } from "react"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import { Controller, useForm } from "react-hook-form"
import { useAdminCreateConfiguredTaxRegion } from "../../../hooks/admin/tax-regions/mutations"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { NextSelect } from "../../../components/molecules/select/next-select"
import Input from "../../../components/molecules/input"

interface FormValues {
  tax_region: Option
  registered_tax_id: string
}

interface CreateConfiguredTaxRegionModalProps {
  tax_regions: TaxRegion[]
  configured_tax_regions: ConfiguredTaxRegion[]
  onClose: () => void
}

export const CreateConfiguredTaxRegionModal: FC<
  CreateConfiguredTaxRegionModalProps
> = ({ tax_regions, configured_tax_regions, onClose }) => {
  const create = useAdminCreateConfiguredTaxRegion()
  const notification = useNotification()
  const form = useForm<{ tax_region: Option; registered_tax_id: string }>()

  const options = tax_regions
    .filter(
      (region) =>
        !configured_tax_regions.some((r) => r.tax_region_id === region.id)
    )
    .map((region) => ({ label: region.province_name, value: region.id }))

  const { register, handleSubmit, control } = form

  const onSubmit = async (data: FormValues) => {
    return create.mutate(
      {
        tax_region_id: data.tax_region.value,
        enabled: true,
        registered_tax_id: data.registered_tax_id,
      },
      {
        onSuccess: () => {
          notification("Success", "Tax Region Configured", "success")
          onClose()
        },
        onError: (error) => {
          notification("Faulure", error?.response?.data?.message, "error")
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
              <Controller
                name="tax_region"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <NextSelect
                      label="Region"
                      onChange={onChange}
                      options={options}
                      value={value}
                      placeholder="Choose a region"
                      isClearable
                    />
                  )
                }}
              />
              <Input
                label="Registered Tax ID"
                {...register("registered_tax_id")}
              />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-2">
              <Button size="small" variant="primary" type="submit">
                Configure
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}
