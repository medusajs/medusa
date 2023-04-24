import { ChangeEvent, FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import Input from "../../../../../../../../../../components/molecules/input"
import Select from "../../../../../../../../../../components/molecules/select/next-select/select"
import { ColorOptionLabel, useDefaultCustomColor } from "../helpers"

export interface ColorSelectProps {
  name: string
  label?: string
  placeholder?: string
  options: { value: string; label: JSX.Element }[]
}

export const ColorSelect: FC<ColorSelectProps> = ({
  label,
  name,
  placeholder,
  options,
}) => {
  const { control, setValue, watch } = useFormContext()
  const defaultCustomColor = useDefaultCustomColor()
  const watchedValue = watch(name)

  const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setValue(name, value, { shouldDirty: true })
  }

  const getSelectedOption = (value: string) =>
    options.find((option) => option.value === value)

  const isValueCustom = (value: string) => {
    if (!value) return false

    const selectedOption = getSelectedOption(value)

    if (value && !selectedOption) return true

    return false
  }

  const getCustomOption = (value: string) => {
    const isCustom = isValueCustom(value)
    const customColorValue = isCustom ? value : defaultCustomColor

    return {
      value: customColorValue,
      label: (
        <ColorOptionLabel color={customColorValue} isCustom={!isCustom}>
          Custom
        </ColorOptionLabel>
      ),
    }
  }

  const getComputedOptions = (value) => [...options, getCustomOption(value)]

  const getComputedValue = (value: string) => {
    if (!value) return

    const selectedOption = getSelectedOption(value)

    if (value && !selectedOption) return getCustomOption(value)

    return selectedOption
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { name, value } }) => (
        <div className="flex flex-col gap-2">
          <Select
            label={label}
            placeholder={placeholder}
            isMulti={false}
            isClearable={true}
            options={getComputedOptions(value)}
            value={getComputedValue(value)}
            onChange={(newValue) => {
              setValue(name, newValue?.value || "", { shouldDirty: true })
            }}
          />

          {isValueCustom(watchedValue) && (
            <Input
              type="color"
              placeholder="Custom"
              name={`${name}_custom`}
              value={watchedValue}
              onChange={handleCustomColorChange}
            />
          )}
        </div>
      )}
    />
  )
}
