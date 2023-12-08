import { Order } from "@medusajs/medusa"
import { useAdminRegion } from "medusa-react"
import React, { useContext, useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/fundamentals/button"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import Select from "../../../../components/molecules/select"
import { Option } from "../../../../types/shared"
import { AddressPayload } from "../claim/create"

type RMAEditAddressSubModalProps = {
  onSubmit: (address: AddressPayload) => void
  address: AddressPayload
  order: Omit<Order, "beforeInsert">
}

type RMAEditAddressSubModalFormData = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: Option
  phone: string
}

const RMAEditAddressSubModal: React.FC<RMAEditAddressSubModalProps> = ({
  onSubmit,
  address,
  order,
}) => {
  const { t } = useTranslation()
  const { pop } = useContext(LayeredModalContext)

  const { register, handleSubmit, control, reset } =
    useForm<RMAEditAddressSubModalFormData>()

  const { region } = useAdminRegion(order.region_id)

  const countryOptions = useMemo(() => {
    return (
      region?.countries.map((country) => ({
        label: country.display_name,
        value: country.iso_2,
      })) || []
    )
  }, [region])

  useEffect(() => {
    if (address && countryOptions) {
      const option = countryOptions.find(
        (o) => o.value === address.country_code
      )

      reset({
        ...address,
        country_code: option,
      })
    }
  }, [countryOptions, address])

  const submit = (data: RMAEditAddressSubModalFormData) => {
    onSubmit({
      ...data,
      country_code: data.country_code.value,
    })
    pop()
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Modal.Content>
          <div className="h-full">
            <h2 className="inter-base-semibold mb-4">
              {t(
                "rma-sub-modals-search-for-additional",
                "Search for additional"
              )}{" "}
            </h2>
          </div>
          <div>
            <div>
              <div>
                <span className="inter-base-semibold">
                  {t("rma-sub-modals-general", "General")}
                </span>

                <div className="gap-x-base gap-y-base grid grid-cols-2">
                  <Input
                    {...register("first_name", {
                      required: true,
                    })}
                    placeholder={t("rma-sub-modals-first-name", "First Name")}
                    label={t("rma-sub-modals-first-name", "First Name")}
                    required
                  />
                  <Input
                    {...register("last_name", {
                      required: true,
                    })}
                    placeholder={t("rma-sub-modals-last-name", "Last Name")}
                    label={t("rma-sub-modals-last-name", "Last Name")}
                    required
                  />
                  <Input
                    {...register("phone")}
                    placeholder={t("rma-sub-modals-phone", "Phone")}
                    label={t("rma-sub-modals-phone", "Phone")}
                  />
                </div>
              </div>
              <div className="mt-8">
                <span className="inter-base-semibold">
                  {t("rma-sub-modals-shipping-address", "Shipping Address")}
                </span>
                <div className="gap-y-base my-4 grid">
                  <Input
                    {...register("address_1", {
                      required: true,
                    })}
                    placeholder={t("rma-sub-modals-address-1", "Address 1")}
                    label={t("rma-sub-modals-address-1", "Address 1")}
                    required
                  />
                  <Input
                    {...register("address_2")}
                    placeholder={t("rma-sub-modals-address-2", "Address 2")}
                    label={t("rma-sub-modals-address-2", "Address 2")}
                  />
                </div>
                <div className="gap-x-base gap-y-base grid grid-cols-2">
                  <Input
                    {...register("province")}
                    placeholder={t("rma-sub-modals-province", "Province")}
                    label={t("rma-sub-modals-province", "Province")}
                  />
                  <Input
                    {...register("postal_code", {
                      required: true,
                    })}
                    placeholder={t("rma-sub-modals-postal-code", "Postal code")}
                    label={t("rma-sub-modals-postal-code", "Postal code")}
                    required
                  />
                  <Input
                    placeholder={t("rma-sub-modals-city", "City")}
                    label={t("rma-sub-modals-city", "City")}
                    {...register("city", {
                      required: true,
                    })}
                    required
                  />
                  <Controller
                    control={control}
                    name={"country_code"}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          label={t("rma-sub-modals-country", "Country")}
                          options={countryOptions}
                          required
                        />
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="gap-x-xsmall flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              className="w-[112px]"
              onClick={() => pop()}
              type="button"
            >
              {t("rma-sub-modals-back", "Back")}
            </Button>
            <Button
              variant="primary"
              className="w-[112px]"
              size="small"
              type="submit"
            >
              {t("rma-sub-modals-add", "Add")}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </>
  )
}

export default RMAEditAddressSubModal
