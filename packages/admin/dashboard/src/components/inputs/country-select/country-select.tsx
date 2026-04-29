import {
  ComponentPropsWithoutRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { useTranslation } from "react-i18next"
import { countries } from "../../../lib/data/countries"
import { Select } from "@medusajs/ui"

export const CountrySelect = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Select> & {
    placeholder?: string
    defaultValue?: string
    onChange?: (value: string) => void
  }
>(({ disabled, placeholder, defaultValue, onChange, ...field }, ref) => {
  const { t } = useTranslation()
  const innerRef = useRef<HTMLButtonElement>(null)

  useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement)

  return (
    <div className="relative">
      <Select
        {...field}
        value={field.value ? field.value?.toLowerCase() : undefined}
        onValueChange={onChange}
        defaultValue={defaultValue ? defaultValue.toLowerCase() : undefined}
        disabled={disabled}
      >
        <Select.Trigger ref={innerRef} className="w-full">
          <Select.Value
            placeholder={placeholder || t("fields.selectCountry")}
          />
        </Select.Trigger>
        <Select.Content>
          {countries.map((country) => (
            <Select.Item
              key={country.iso_2}
              value={country.iso_2.toLowerCase()}
            >
              {country.display_name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
})

CountrySelect.displayName = "CountrySelect"
