import { AdminPostGiftCardsGiftCardReq, Region } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import Select from "../../../components/molecules/select"
import { Option } from "../../../types/shared"

type EditGiftCardModalProps = {
  handleClose: () => void
  handleSave: (update: AdminPostGiftCardsGiftCardReq) => void
  updating: boolean
  regions: Region[] | undefined
  region: Region
}

type EditGiftCardModalFormData = {
  region: Option
}

const EditGiftCardModal = ({
  handleClose,
  handleSave,
  updating,
  regions,
  region,
}: EditGiftCardModalProps) => {
  const { control, handleSubmit } = useForm<EditGiftCardModalFormData>({
    defaultValues: {
      region: {
        value: region.id,
        label: region.name,
      },
    },
  })

  const onSubmit = (data: EditGiftCardModalFormData) => {
    handleSave({ region_id: data.region.value })
  }

  const regionOptions: Option[] = useMemo(() => {
    return (
      regions?.map((r) => ({
        label: r.name,
        value: r.id,
      })) || []
    )
  }, [regions])

  return (
    <Modal handleClose={handleClose} isLargeModal={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body isLargeModal={true}>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              Edit Gift Card Details
            </span>
          </Modal.Header>
          <Modal.Content>
            {/* TODO: Missing backend support for updating code
            <InputField
              label="Code"
              name="code"
              value={code}
              onChange={({ currentTarget }) => setCode(currentTarget.value)}
              className="mb-4"
            /> */}
            <Controller
              control={control}
              name="region"
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Region"
                    options={regionOptions}
                    value={value}
                    onChange={onChange}
                  />
                )
              }}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="w-full flex justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
                type="button"
              >
                Cancel
              </Button>
              <Button
                loading={updating}
                disabled={updating}
                variant="primary"
                className="min-w-[100px]"
                size="small"
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
export default EditGiftCardModal
