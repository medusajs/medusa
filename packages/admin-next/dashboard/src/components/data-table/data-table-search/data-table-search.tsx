import { Input } from "@medusajs/ui"
import { debounce } from "lodash"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelectedParams } from "../hooks"

type DataTableSearch = {
  placeholder?: string
  prefix?: string
}

export const DataTableSearch = ({ placeholder, prefix }: DataTableSearch) => {
  const { t } = useTranslation()
  const placeholderText = placeholder || t("general.search")
  const selectedParams = useSelectedParams({
    param: "q",
    prefix,
    multiple: false,
  })

  const initialQuery = selectedParams.get()
  const [inputValue, setInputValue] = useState(initialQuery?.[0] || "")

  const updateSearchParams = (newValue: string) => {
    if (!newValue) {
      selectedParams.delete()
      return
    }

    selectedParams.add(newValue)
  }

  const debouncedUpdate = useCallback(
    debounce((newValue: string) => updateSearchParams(newValue), 500),
    [updateSearchParams]
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
