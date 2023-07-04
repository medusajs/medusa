import { Controller } from "react-hook-form"
import { NestedForm } from "../../../../utils/nested-form"
import DatePicker from "../../../atoms/date-picker/date-picker"
import TimePicker from "../../../atoms/date-picker/time-picker"
import AvailabilityDuration from "../../../molecules/availability-duration"
import InputField from "../../../molecules/input"
import SwitchableItem from "../../../molecules/switchable-item"

export type DiscountConfigurationFormType = {
  starts_at: Date
  ends_at: Date | null
  usage_limit: number | null
  valid_duration: string | null
}

type DiscountConfigurationFormProps = {
  form: NestedForm<DiscountConfigurationFormType>
  isDynamic?: boolean
}

const DiscountConfigurationForm = ({
  form,
  isDynamic,
}: DiscountConfigurationFormProps) => {
  const { control, path } = form

  return (
    <div>
      <div className="gap-y-large flex flex-col">
        <Controller
          name={path("starts_at")}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <SwitchableItem
                open={!!value}
                onSwitch={() => {
                  if (value) {
                    onChange(null)
                  } else {
                    onChange(new Date())
                  }
                }}
                title="Discount has a start date?"
                description="Schedule the discount to activate in the future."
              >
                <div className="gap-x-xsmall flex items-center">
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
          name={path("ends_at")}
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
                      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    )
                  }
                }}
                title="Discount has an expiry date?"
                description="Schedule the discount to deactivate in the future."
              >
                <div className="gap-x-xsmall flex items-center">
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
          name={path("usage_limit")}
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
                  onChange={(value) => onChange(value.target.valueAsNumber)}
                />
              </SwitchableItem>
            )
          }}
        />
        {isDynamic && (
          <Controller
            name={path("valid_duration")}
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
    </div>
  )
}

export default DiscountConfigurationForm
