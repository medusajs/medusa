import { Input } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import debounce from "lodash.debounce"
type DataTableSearchProps = {
  placeholder?: string
  prefix?: string
  autofocus?: boolean
}

export const DataTableSearch = ({
  placeholder,
  prefix,
  autofocus,
}: DataTableSearchProps) => {
  const { t } = useTranslation()
  const placeholderText = placeholder || t("general.search")
  const [searchParams, setSearchParams] = useSearchParams()
  const queryKey = prefix ? `${prefix}_q` : "q"
  const offsetKey = prefix ? `${prefix}_offset` : "offset"
  const query = searchParams.get(queryKey) ?? ""
  const [value, setValue] = useState(query)

  const debouncedOnChange = useMemo(
    () =>
      debounce((nextValue: string) => {
        setSearchParams(
          (params) => {
            const next = new URLSearchParams(params)
            if (nextValue) {
              next.set(queryKey, nextValue)
            } else {
              next.delete(queryKey)
            }
            next.delete(offsetKey)
            return next
          },
          { replace: true }
        )
      }, 300),
    [setSearchParams, queryKey, offsetKey]
  )

  // Saved views and browser navigation must also update the visible input.
  useEffect(() => {
    debouncedOnChange.cancel()
    setValue(query)
  }, [query, debouncedOnChange])

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
      autoFocus={autofocus}
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value
        setValue(nextValue)
        debouncedOnChange(nextValue)
      }}
      placeholder={placeholderText}
    />
  )
}
