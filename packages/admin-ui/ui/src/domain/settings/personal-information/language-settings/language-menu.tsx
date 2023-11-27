import React from "react"
import { useTranslation } from "react-i18next"
import { Select } from "@medusajs/ui"
import { supportedLanguages } from "../../../../i18n"

const LanguageMenu: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="w-[200px]">
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {supportedLanguages.map((lng) => (
            <Select.Item key={lng.locale} value={lng.locale}>
              {lng.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default LanguageMenu
