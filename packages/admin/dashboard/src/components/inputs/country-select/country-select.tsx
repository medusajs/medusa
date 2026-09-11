import {
  ComponentPropsWithoutRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { useTranslation } from "react-i18next"
import { countries } from "../../../lib/data/countries"
import { getCountryDisplayName } from "../../../lib/display-names"
import { Combobox } from "../combobox"

export const CountrySelect = forwardRef<
  HTMLInputElement,
  Omit<
    ComponentPropsWithoutRef<typeof Combobox>,
    "options" | "multiple" | "value" | "onChange"
  > & {
    placeholder?: string
    defaultValue?: string
    allowClear?: boolean
    value?: string
    onChange?: (value: string | undefined) => void
  }
>(
  (
    { placeholder, defaultValue, allowClear, onChange, value, ...props },
    ref
  ) => {
    const { t, i18n } = useTranslation()
    const innerRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    return (
      <Combobox
        {...props}
        ref={innerRef}
        value={value || ""}
        onChange={(newValue) => onChange?.(newValue || "")}
        options={countries.map((country) => ({
          label: getCountryDisplayName(
            country.iso_2,
            country.display_name,
            i18n.language
          ),
          value: country.iso_2.toLowerCase(),
        }))}
        placeholder={placeholder || t("fields.selectCountry")}
        allowClear={allowClear}
      />
    )
  }
)

CountrySelect.displayName = "CountrySelect"
