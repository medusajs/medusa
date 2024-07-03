import {
  ComponentPropsWithoutRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"

import { TrianglesMini } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { getCountryProvinceObjectByIso2 } from "../../../lib/data/country-states"

interface ProvinceSelectProps extends ComponentPropsWithoutRef<"select"> {
  /**
   * ISO 3166-1 alpha-2 country code
   */
  country_code: string
  /**
   * Whether to use the ISO 3166-1 alpha-2 code or the name of the province as the value
   *
   * @default "iso_2"
   */
  valueAs?: "iso_2" | "name"
  placeholder?: string
}

export const ProvinceSelect = forwardRef<
  HTMLSelectElement,
  ProvinceSelectProps
>(
  (
    {
      className,
      disabled,
      placeholder,
      country_code,
      valueAs = "iso_2",
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const innerRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle(ref, () => innerRef.current as HTMLSelectElement)

    const isPlaceholder = innerRef.current?.value === ""

    const provinceObject = getCountryProvinceObjectByIso2(country_code)

    if (!provinceObject) {
      disabled = true
    }

    const options = Object.entries(provinceObject?.options ?? {}).map(
      ([iso2, name]) => {
        return (
          <option key={iso2} value={valueAs === "iso_2" ? iso2 : name}>
            {name}
          </option>
        )
      }
    )

    const placeholderText = provinceObject
      ? t(`provinces.placeholders.${provinceObject.type}`)
      : ""

    const placeholderOption = provinceObject ? (
      <option value="" disabled className="text-ui-fg-muted">
        {placeholder || placeholderText}
      </option>
    ) : null

    return (
      <div className="relative">
        <TrianglesMini
          className={clx(
            "text-ui-fg-muted transition-fg pointer-events-none absolute right-2 top-1/2 -translate-y-1/2",
            {
              "text-ui-fg-disabled": disabled,
            }
          )}
        />
        <select
          disabled={disabled}
          className={clx(
            "bg-ui-bg-field shadow-buttons-neutral transition-fg txt-compact-small flex w-full select-none appearance-none items-center justify-between rounded-md px-2 py-1.5 outline-none",
            "placeholder:text-ui-fg-muted text-ui-fg-base",
            "hover:bg-ui-bg-field-hover",
            "focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active",
            "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error",
            "invalid::border-ui-border-error invalid:shadow-borders-error",
            "disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled",
            {
              "text-ui-fg-muted": isPlaceholder,
            },
            className
          )}
          {...props}
          ref={innerRef}
        >
          {/* Add an empty option so the first option is preselected */}
          {placeholderOption}
          {options}
        </select>
      </div>
    )
  }
)
ProvinceSelect.displayName = "CountrySelect"
