import React, { useEffect } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import {
  CarrierType,
  PackageCategoryType,
  PackageType,
  useAdminCreatePackage,
  useAdminUpdatePackage,
  Package,
} from "../../../hooks/admin/packages"
import Button from "../../fundamentals/button"
import { Option } from "../../../types/shared"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Select from "../../molecules/select"
import Checkbox from "../../atoms/checkbox"
import useNotification from "../../../hooks/use-notification"
import { Vendor } from "@medusajs/medusa"
import {
  PackageOption,
  useGetCarrierPackageOptions,
} from "../../../hooks/admin/fulfillment-providers/queries"
import RadioGroup from "../../../components/organisms/radio-group"
import { getErrorMessage } from "../../../utils/error-messages"

type PackageModalProps = {
  onClose: () => void
  onSuccess?: (values: Package) => void
  pack?: Package | null
  vendor: Vendor
}

interface PackageForm {
  package_name: string
  length: number
  width: number
  height: number
  empty_weight: number
  use_in_estimates: boolean
  package_type: Option
  carrier: Option
  package_category?: PackageCategoryType
  package_code: Option
}

export const packageTypeOptions: Option[] = [
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

export const carrierOptions: Option[] = [
  {
    label: "Fedex",
    value: CarrierType.FEDEX,
  },
  {
    label: "USPS",
    value: CarrierType.USPS,
  },
  {
    label: "UPS",
    value: CarrierType.UPS,
  },
]

const selectPackageOptionOption = (po: PackageOption) => ({
  label: po.name,
  value: po.package_code,
})

const defaultValues: Partial<PackageForm> = {
  use_in_estimates: true,
  package_category: PackageCategoryType.CUSTOM,
}

export const PackageModal: React.FC<PackageModalProps> = ({
  onClose,
  onSuccess,
  pack,
  vendor,
}) => {
  const notification = useNotification()
  const updatePackage = useAdminUpdatePackage(vendor.id, pack?.id)
  const createPackage = useAdminCreatePackage(vendor.id)
  const { data: carrierPackageData } = useGetCarrierPackageOptions()
  const form = useForm<PackageForm>({ defaultValues })
  const { register, setValue, handleSubmit, reset, control, watch } = form

  const packageType = watch("package_type")
  const carrier = watch("carrier")
  const packageCategory = watch("package_category")

  const carrierPackages = carrierPackageData?.packagesByCarrier ?? {}
  const allCarrierPackages = Object.entries(carrierPackages)
    .map(([carrier_code, options]) =>
      options.map((o) => ({ ...o, carrier_code }))
    )
    .flat()
  const carrierPackageOptions = allCarrierPackages
    .filter((cp) => cp.carrier_code === carrier?.value || "")
    .map((cp) => ({ label: cp.name, value: cp.package_code }))

  const submitForm = (formData: PackageForm) => {
    const carrierPackage = allCarrierPackages.find(
      (cp) =>
        cp.package_code === formData.package_code?.value &&
        packageCategory === PackageCategoryType.CARRIER
    )

    const data = {
      carrier_code:
        packageCategory === PackageCategoryType.CARRIER ? carrier?.value : null,
      package_code: carrierPackage?.package_code,
      package_type:
        carrierPackage?.package_type ?? (packageType?.value as PackageType),
      package_name: formData.package_name,
      use_in_estimates: formData.use_in_estimates,
      length: carrierPackage?.length ?? formData.length,
      width: carrierPackage?.width ?? formData.width,
      height: carrierPackage?.height ?? formData.height,
      empty_weight: formData.empty_weight,
      vendor_id: vendor.id,
      inventory_managed: false,
    }

    if (!pack?.id) {
      return createPackage.mutate(data, {
        onSuccess: ({ data }) => {
          notification("Success", "Package Created", "success")
          if (onSuccess) onSuccess(data)
          onClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      })
    }

    return updatePackage.mutate(data, {
      onSuccess: ({ data }) => {
        notification("Success", "Package Updated", "success")
        if (onSuccess) onSuccess(data)
        onClose()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  useEffect(() => {
    if (!pack || !carrierPackageData) return

    const package_category = pack.carrier_code
      ? PackageCategoryType.CARRIER
      : PackageCategoryType.CUSTOM

    const packageCode = pack.package_code
      ? allCarrierPackages.find((cp) => cp.package_code === pack.package_code)
      : undefined

    const package_code = packageCode
      ? selectPackageOptionOption(packageCode)
      : undefined

    const package_type = packageTypeOptions.find(
      (type) => type.value === pack?.package_type
    )

    const carrier =
      carrierOptions.find((type) => type.value == pack?.carrier_code) ??
      carrierOptions[0]

    reset({
      ...pack,
      package_code,
      package_category,
      package_type,
      carrier,
    })
  }, [pack, carrierPackageData])

  const onPackageCodeChange = (option: Option) => {
    if (!carrier) return

    const packageOption = allCarrierPackages.find(
      (cp) => option.value === cp.package_code
    )

    if (!packageOption) return

    setValue("package_name", `${carrier.label} ${packageOption?.name}`)
  }

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
              {pack
                ? `Edit ${
                    packageCategory === PackageCategoryType.CARRIER
                      ? "Carrier"
                      : "Custom"
                  } Package `
                : "Add Package"}
            </h1>
          </div>
        </Modal.Header>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(submitForm)}>
            <Modal.Content>
              <div>
                {!pack?.id && (
                  <div>
                    <Controller
                      name="package_category"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <RadioGroup.Root
                            className="grid grid-cols-2 gap-2 mb-4"
                            value={value}
                            onValueChange={onChange}
                          >
                            <RadioGroup.Item
                              value={PackageCategoryType.CUSTOM}
                              className="flex-1"
                              label="Custom Package"
                            />
                            <RadioGroup.Item
                              value={PackageCategoryType.CARRIER}
                              className="flex-1"
                              label="Carrier Package"
                            />
                          </RadioGroup.Root>
                        )
                      }}
                    />
                  </div>
                )}

                {packageCategory === PackageCategoryType.CARRIER && (
                  <>
                    <h2 className="inter-base-semibold mb">Carrier Info</h2>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <Controller
                        name="carrier"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <Select
                              label="Carrier"
                              onChange={onChange}
                              options={carrierOptions}
                              value={value}
                            />
                          )
                        }}
                      />

                      {carrierPackageData && (
                        <div className="col-span-2">
                          <Controller
                            name="package_code"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                label="Package"
                                options={carrierPackageOptions}
                                value={value}
                                onChange={(value) => {
                                  onChange(value)
                                  onPackageCodeChange(value)
                                }}
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <h2 className="inter-base-semibold mb">Details</h2>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <InputField
                    label="Name"
                    placeholder="Big ol' Box"
                    required
                    {...register("package_name", {
                      required: "Name is required",
                    })}
                  />
                  {packageCategory === PackageCategoryType.CUSTOM && (
                    <Controller
                      name="package_type"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          label="Type"
                          required
                          options={packageTypeOptions}
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  )}
                </div>
                {packageCategory === PackageCategoryType.CUSTOM && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <InputField
                      label="Length (in)"
                      required
                      type="number"
                      step={0.001}
                      min={0}
                      placeholder="Length"
                      {...register("length", { valueAsNumber: true })}
                    />
                    <InputField
                      label="Width (in)"
                      required
                      type="number"
                      step={0.001}
                      min={0}
                      placeholder="Width"
                      {...register("width", { valueAsNumber: true })}
                    />

                    {packageType?.value === "box" && (
                      <InputField
                        label="Height (in)"
                        required={packageType.value === "box"}
                        type="number"
                        step={0.001}
                        min={0}
                        placeholder="Height..."
                        {...register("height", { valueAsNumber: true })}
                      />
                    )}

                    <InputField
                      label="Empty Weight (oz)"
                      type="number"
                      min="0"
                      placeholder="0"
                      step={0.001}
                      {...register("empty_weight", { valueAsNumber: true })}
                    />
                  </div>
                )}
                <div>
                  <Checkbox
                    className="mb-2"
                    label="Include this package when calculating shipping costs during checkout"
                    {...register("use_in_estimates")}
                  />
                </div>
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
                  {pack ? "Edit Package" : "Create Package"}
                </Button>
              </div>
            </Modal.Footer>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
