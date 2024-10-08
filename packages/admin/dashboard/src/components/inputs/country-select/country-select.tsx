import {
  ComponentPropsWithoutRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"

import { TrianglesMini } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { countries } from "../../../lib/data/countries"

export const CountrySelect = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select"> & {
    placeholder?: string
    value?: string
    defaultValue?: string
  }
>(
  (
    { className, disabled, placeholder, value, defaultValue, ...props },
    ref
  ) => {
    const { t } = useTranslation()
    const innerRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle(ref, () => innerRef.current as HTMLSelectElement)

    const isPlaceholder = innerRef.current?.value === ""

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
          value={value !== undefined ? value.toLowerCase() : undefined}
          defaultValue={defaultValue ? defaultValue.toLowerCase() : undefined}
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
          <option value="" disabled className="text-ui-fg-muted">
            {placeholder || t("fields.selectCountry")}
          </option>
          {countries.map((country) => {
            return (
              <option key={country.iso_2} value={country.iso_2.toLowerCase()}>
                {country.display_name}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
)
CountrySelect.displayName = "CountrySelect"
