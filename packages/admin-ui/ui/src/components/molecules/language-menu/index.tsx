import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React from "react"

import { useTranslation } from "react-i18next"

import Button from "../../fundamentals/button"

const LanguageMenu: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="w-16">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="small" variant="ghost" className="mr-3 h-8 w-16">
            {i18n.language}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={12}
          side="bottom"
          className="ml-large rounded-rounded border-grey-20 bg-grey-0 p-xsmall shadow-dropdown z-30 min-w-[200px] border"
        >
          {i18n.languages.map((item) => (
            <DropdownMenu.Item
              key={item}
              className="mb-1 outline-none"
              onClick={(e) => changeLanguage(item)}
            >
              <Button
                variant="ghost"
                size="small"
                className={"w-full justify-start"}
              >
                {item}
              </Button>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default LanguageMenu
