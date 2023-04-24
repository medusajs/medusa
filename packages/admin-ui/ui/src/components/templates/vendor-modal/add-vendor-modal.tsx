import { Vendor } from "@medusajs/medusa"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../fundamentals/button"
import IconTooltip from "../../molecules/icon-tooltip"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Metadata, { MetadataField } from "../../organisms/metadata"

type VendorModalProps = {
  onClose: () => void
  onSubmit: (values: any, metadata: MetadataField[]) => void
  isEdit?: boolean
  vendor?: Vendor
}

export const AddVendorModal: React.FC<VendorModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { register, setValue, handleSubmit } = useForm()
  const [metadata, setMetadata] = useState<MetadataField[]>([])

  useEffect(() => {
    register("name", { required: true })
    register("handle", { required: true })
  }, [])

  const submit = (data: any) => {
    onSubmit({ ...data }, metadata)
  }

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">Add Vendor</h1>
            {/* <p className="inter-small-regular text-grey-50">
              To create a vendor, all you need is a name.
            </p> */}
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Content>
            <div>
              <h2 className="inter-base-semibold mb">Details</h2>
              <div className="grid grid-cols-1 gap-1">
                <InputField
                  label="Vendor Name"
                  required
                  placeholder="Enter Vendor Name"
                  {...register("name", { required: "Name is Required" })}
                  onChange={(e) => {
                    setValue(
                      "handle",
                      encodeURIComponent(
                        e.target.value.toLowerCase().replaceAll(" ", "-")
                      )
                    )
                  }}
                />

                <InputField
                  label="Handle"
                  placeholder="vendor-name"
                  prefix="/"
                  tooltip={
                    <IconTooltip content="URL Slug for the vendor. Will be auto generated if left blank." />
                  }
                  {...register("handle")}
                />
              </div>
            </div>
            <div className="mt-xlarge w-full">
              <Metadata setMetadata={setMetadata} metadata={metadata} />
            </div>
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
              <Button variant="primary" size="small">
                Create Vendor
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}
