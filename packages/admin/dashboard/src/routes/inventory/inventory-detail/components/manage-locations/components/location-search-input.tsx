import { Input } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"

type LocationSearchInputProps = {
  onSearchChange: (search: string) => void
  placeholder?: string
}

export const LocationSearchInput = ({
  onSearchChange,
  placeholder,
}: LocationSearchInputProps) => {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, onSearchChange])

  return (
    <Input
      type="text"
      placeholder={placeholder || t("general.search")}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      className="w-full"
    />
  )
}
