import { Input } from "@medusajs/ui"
import { debounce } from "lodash"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

type DataTableSearch = {
  placeholder?: string
  prefix?: string
}

export const DataTableSearch = ({ placeholder, prefix }: DataTableSearch) => {
  const { t } = useTranslation()
  const placeholderText = placeholder || t("general.search")
  const key = prefix ? `${prefix}_q` : "q"

  const [searchParams, setSearchParams] = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get(key) || "")

  const updateSearchParams = (newValue: string) => {
    if (!newValue) {
      setSearchParams((prev) => {
        prev.delete(key)
        return prev
      })

      return
    }

    setSearchParams((prev) => ({ ...prev, [key]: newValue || "" }))
  }

  const debouncedUpdate = useCallback(
    debounce((newValue: string) => updateSearchParams(newValue), 500),
    []
  )

  useEffect(() => {
    debouncedUpdate(inputValue)

    return () => {
      debouncedUpdate.cancel()
    }
  }, [inputValue, debouncedUpdate])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <Input
      type="search"
      size="small"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholderText}
    />
  )
}
