import { Input } from "@medusajs/ui"
import { ChangeEvent, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { debounce } from "lodash"
import { useSelectedParams } from "../hooks"

type DataTableSearchProps = {
  placeholder?: string
  prefix?: string
}

export const DataTableSearch = ({
  placeholder,
  prefix,
}: DataTableSearchProps) => {
  const { t } = useTranslation()
  const placeholderText = placeholder || t("general.search")
  const selectedParams = useSelectedParams({
    param: "q",
    prefix,
    multiple: false,
  })

  const query = selectedParams.get()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (!value) {
        selectedParams.delete()
      } else {
        selectedParams.add(value)
      }
    }, 500),
    [selectedParams]
  )

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  return (
    <Input
      autoComplete="off"
      name="q"
      type="search"
      size="small"
      defaultValue={query?.[0] || undefined}
      onChange={debouncedOnChange}
      placeholder={placeholderText}
    />
  )
}
