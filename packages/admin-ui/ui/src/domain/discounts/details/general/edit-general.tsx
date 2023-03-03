import { Discount } from "@medusajs/medusa"
import { useAdminRegions, useAdminUpdateDiscount } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import { NextSelect } from "../../../../components/molecules/select/next-select"
import TextArea from "../../../../components/molecules/textarea"
import CurrencyInput from "../../../../components/organisms/currency-input"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"

type EditGeneralProps = {
  discount: Discount
  onClose: () => void
}

type GeneralForm = {
  regions: Option[]
  code: string
  description: string
  value: number
}

const EditGeneral: React.FC<EditGeneralProps> = ({ discount, onClose }) => {
  const { mutate, isLoading } = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const { control, handleSubmit, reset, register } = useForm<GeneralForm>({
    defaultValues: mapGeneral(discount),
  })

  const onSubmit = (data: GeneralForm) => {
    mutate(
      {
        regions: data.regions.map((r) => r.value),
        code: data.code,
        rule: {
          id: discount.rule.id,
          description: data.description,
          value: data.value,
          allocation: discount.rule.allocation,
        },
      },
      {
        onSuccess: ({ discount }) => {
          notification("Success", "Discount updated successfully", "success")
          reset(mapGeneral(discount))
          onClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  useEffect(() => {
    reset(mapGeneral(discount))
  }, [discount])

  const type = discount.rule.type

  const { regions } = useAdminRegions()

  const regionOptions = useMemo(() => {
    return regions
      ? regions.map((r) => ({
          label: r.name,
          value: r.id,
        }))
      : []
  }, [regions])

  const selectedRegions = useWatch({
    control,
    name: "regions",
  })

  const fixedCurrency = useMemo(() => {
    if (type === "fixed" && selectedRegions?.length) {
      return regions?.find((r) => r.id === selectedRegions[0].value)
        ?.currency_code
    }
  }, [selectedRegions, type, regions])

  return (
    <Modal handleClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <h1 className="inter-xlarge-semibold">Edit general information</h1>
          </Modal.Header>
          <Modal.Content>
            <Controller
              name="regions"
              control={control}
              rules={{
                required: "Atleast one region is required",
                validate: (value) =>
                  Array.isArray(value) ? value.length > 0 : !!value,
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <NextSelect
                    value={value}
                    onChange={(value) => {
                      onChange(type === "fixed" ? [value] : value)
                    }}
                    label="Choose valid regions"
                    isMulti={type !== "fixed"}
                    selectAll={type !== "fixed"}
                    isSearchable
                    required
                    options={regionOptions}
                  />
                )
              }}
            />
            <div className="flex gap-x-base gap-y-base my-base">
              <InputField
                label="Code"
                className="flex-1"
                placeholder="SUMMERSALE10"
                required
                {...register("code", { required: "Code is required" })}
              />

              {type !== "free_shipping" && (
                <>
                  {type === "fixed" ? (
                    <div className="flex-1">
                      <CurrencyInput.Root
                        size="small"
                        currentCurrency={fixedCurrency ?? "USD"}
                        readOnly
                        hideCurrency
                      >
                        <Controller
                          name="value"
                          control={control}
                          rules={{
                            required: "Amount is required",
                            min: 1,
                          }}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <CurrencyInput.Amount
                                label={"Amount"}
                                required
                                amount={value}
                                onChange={onChange}
                              />
                            )
                          }}
                        />
                      </CurrencyInput.Root>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <InputField
                        label="Percentage"
                        min={0}
                        required
                        type="number"
                        placeholder="10"
                        prefix={"%"}
                        {...register("value", {
                          required: "Percentage is required",
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="text-grey-50 inter-small-regular flex flex-col mb-6">
              <span>
                The code your customers will enter during checkout. This will
                appear on your customer’s invoice.
              </span>
              <span>Uppercase letters and numbers only.</span>
            </div>
            <TextArea
              label="Description"
              required
              placeholder="Summer Sale 2022"
              rows={1}
              {...register("description", {
                required: "Description is required",
              })}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex items-center justify-end w-full">
              <Button
                variant="ghost"
                size="small"
                className="min-w-[128px]"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                className="min-w-[128px]"
                type="submit"
                disabled={isLoading}
                loading={isLoading}
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

const mapGeneral = (discount: Discount): GeneralForm => {
  return {
    regions: discount.regions.map((r) => ({ label: r.name, value: r.id })),
    code: discount.code,
    description: discount.rule.description,
    value: discount.rule.value,
  }
}

export default EditGeneral
