import React, { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { AddressCreatePayload } from "@medusajs/medusa/dist/types/common"
import Button from "../../../../components/fundamentals/button"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"

export interface EditAddressModalProps {
  address: AddressCreatePayload
  onClose: () => void
  onSave: (values) => void
}

export const EditAddressModal: FC<EditAddressModalProps> = ({
  address,
  onClose,
  onSave,
}) => {
  const methods = useForm()
  const isLoading = false

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h2 className="inter-xlarge-semibold mt-0 mb-2xsmall">
            Edit address
          </h2>
        </Modal.Header>
        <Modal.Content>
          <FormProvider {...methods}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="hidden"
                defaultValue={address.country_code}
                {...methods.register("country_code")}
              />
              <Input
                label="First name"
                placeholder="Enter first name"
                defaultValue={address.first_name}
                {...methods.register("first_name", {
                  required: "First name is required",
                })}
                required
              />
              <Input
                label="Last name"
                placeholder="Enter last name"
                defaultValue={address.last_name}
                {...methods.register("last_name", {
                  required: "Last name is required",
                })}
                required
              />
              <Input
                label="Company"
                placeholder="First company name"
                className="col-span-2"
                defaultValue={address.company}
                {...methods.register("company")}
              />
              <Input
                label="Address 1"
                placeholder="First address line"
                className="col-span-2"
                defaultValue={address.address_1}
                {...methods.register("address_1", {
                  required: "Address 1 is required",
                })}
                required
              />
              <Input
                label="Address 2"
                placeholder="Second address line"
                className="col-span-2"
                defaultValue={address.address_2}
                {...methods.register("address_2")}
              />
              <Input
                label="City"
                placeholder="City"
                defaultValue={address.city}
                {...methods.register("city", { required: "City is required" })}
                required
              />
              <Input
                label="State/Province"
                placeholder="State or province"
                defaultValue={address.province}
                {...methods.register("province", {
                  required: "State/Province is required",
                })}
                required
              />
              <Input
                label="Postal Code"
                placeholder="Enter postal code"
                defaultValue={address.postal_code}
                {...methods.register("postal_code", {
                  required: "Postal code is required",
                })}
                required
              />
              <Input
                label="Phone"
                placeholder="Enter phone number"
                defaultValue={address.phone}
                {...methods.register("phone")}
              />
            </div>
          </FormProvider>
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
              onClick={methods.handleSubmit(onSave)}
            >
              Update
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}
