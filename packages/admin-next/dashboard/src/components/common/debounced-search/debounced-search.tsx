import { Input } from "@medusajs/ui"
import { ComponentProps, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

type DebouncedSearchProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  debounce?: number
  value: string
  onChange: (value: string) => void
}

export const DebouncedSearch = ({
  value: initialValue,
  onChange,
  debounce = 500,
  size = "small",
  placeholder,
  ...props
}: DebouncedSearchProps) => {
  const [value, setValue] = useState<string>(initialValue)
  const { t } = useTranslation()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      {...props}
      placeholder={placeholder || t("general.search")}
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
