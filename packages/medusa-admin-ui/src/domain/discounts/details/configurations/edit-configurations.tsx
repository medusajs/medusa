import { Discount } from "@medusajs/medusa"
import { useAdminUpdateDiscount } from "medusa-react"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Button from "../../../../components/fundamentals/button"
import AvailabilityDuration from "../../../../components/molecules/availability-duration"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import SwitchableItem from "../../../../components/molecules/switchable-item"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

type EditConfigurationsProps = {
  discount: Discount
  onClose: () => void
}

type ConfigurationsForm = {
  starts_at: Date | null
  ends_at: Date | null
  usage_limit: number | null
  valid_duration: string | null
}

const EditConfigurations: React.FC<EditConfigurationsProps> = ({
  discount,
  onClose,
}) => {
  const { mutate, isLoading } = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const { control, handleSubmit, reset } = useForm<ConfigurationsForm>({
    defaultValues: mapConfigurations(discount),
  })

  const onSubmit = (data: ConfigurationsForm) => {
    mutate(
      {
        starts_at: data.starts_at ?? new Date(),
        ends_at: data.ends_at,
        usage_limit:
          data.usage_limit && data.usage_limit > 0 ? data.usage_limit : null,
        valid_duration: data.valid_duration,
      },
      {
        onSuccess: ({ discount }) => {
          notification("Success", "Discount updated successfully", "success")
          reset(mapConfigurations(discount))
          onClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  useEffect(() => {
    reset(mapConfigurations(discount))
  }, [discount])

  return (
    <Modal handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Edit configurations</h1>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content>
            <div className="flex flex-col gap-y-xlarge">
              <Controller
                name="starts_at"
                defaultValue={discount.starts_at}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <SwitchableItem
                      open={!!value}
                      onSwitch={() => {
                        if (value) {
                          onChange(null)
                        } else {
                          onChange(new Date(discount.starts_at))
                        }
                      }}
                      title="Discount has a start date?"
                      description="Schedule the discount to activate in the future."
                    >
                      <div className="flex gap-x-xsmall items-center">
                        <DatePicker
                          date={value!}
                          label="Start date"
                          onSubmitDate={onChange}
                        />
                        <TimePicker
                          label="Start time"
                          date={value!}
                          onSubmitDate={onChange}
                        />
                      </div>
                    </SwitchableItem>
                  )
                }}
              />
              <Controller
                name="ends_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <SwitchableItem
                      open={!!value}
                      onSwitch={() => {
                        if (value) {
                          onChange(null)
                        } else {
                          onChange(
                            new Date(
                              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                            )
                          )
                        }
                      }}
                      title="Discount has an expiry date?"
                      description="Schedule the discount to deactivate in the future."
                    >
                      <div className="flex gap-x-xsmall items-center">
                        <DatePicker
                          date={value!}
                          label="Expiry date"
                          onSubmitDate={onChange}
                        />
                        <TimePicker
                          label="Expiry time"
                          date={value!}
                          onSubmitDate={onChange}
                        />
                      </div>
                    </SwitchableItem>
                  )
                }}
              />
              <Controller
                name="usage_limit"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <SwitchableItem
                      open={!!value}
                      onSwitch={() => {
                        if (value) {
                          onChange(null)
                        } else {
                          onChange(10)
                        }
                      }}
                      title="Limit the number of redemtions?"
                      description="Limit applies across all customers, not per customer."
                    >
                      <InputField
                        label="Number of redemptions"
                        type="number"
                        placeholder="5"
                        min={1}
                        defaultValue={value ?? undefined}
                        onChange={(value) =>
                          onChange(value.target.valueAsNumber)
                        }
                      />
                    </SwitchableItem>
                  )
                }}
              />
              {discount.is_dynamic && (
                <Controller
                  name="valid_duration"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <SwitchableItem
                        open={!!value}
                        onSwitch={() => {
                          if (value) {
                            onChange(null)
                          } else {
                            onChange("P0Y0M0DT00H00M")
                          }
                        }}
                        title="Availability duration?"
                        description="Set the duration of the discount."
                      >
                        <AvailabilityDuration
                          value={value ?? undefined}
                          onChange={onChange}
                        />
                      </SwitchableItem>
                    )
                  }}
                />
              )}
            </div>
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
                loading={isLoading}
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const mapConfigurations = (discount: Discount): ConfigurationsForm => {
  return {
    starts_at: new Date(discount.starts_at),
    ends_at: discount.ends_at ? new Date(discount.ends_at) : null,
    usage_limit: discount.usage_limit,
    valid_duration: discount.valid_duration,
  }
}

export default EditConfigurations
