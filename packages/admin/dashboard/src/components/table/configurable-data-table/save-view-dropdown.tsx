import React from "react"
import { Button, DropdownMenu, usePrompt } from "@medusajs/ui"
import { ChevronDownMini } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

interface SaveViewDropdownProps {
  isDefaultView: boolean
  currentViewId?: string
  currentViewName?: string
  onSaveAsDefault: () => void
  onUpdateExisting: () => void
  onSaveAsNew: () => void
}

export const SaveViewDropdown: React.FC<SaveViewDropdownProps> = ({
  isDefaultView,
  currentViewName,
  onSaveAsDefault,
  onUpdateExisting,
  onSaveAsNew,
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleSaveAsDefault = async () => {
    const result = await prompt({
      title: t("views.prompts.updateDefault.title"),
      description: t("views.prompts.updateDefault.description"),
      confirmText: t("views.prompts.updateDefault.confirmText"),
      cancelText: t("views.prompts.updateDefault.cancelText"),
    })

    if (result) {
      onSaveAsDefault()
    }
  }

  const handleUpdateExisting = async () => {
    const result = await prompt({
      title: t("views.prompts.updateView.title"),
      description: t("views.prompts.updateView.description", {
        name: currentViewName,
      }),
      confirmText: t("views.prompts.updateView.confirmText"),
      cancelText: t("views.prompts.updateView.cancelText"),
    })

    if (result) {
      onUpdateExisting()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="small" type="button">
          {t("views.save")}
          <ChevronDownMini />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {isDefaultView ? (
          <>
            <DropdownMenu.Item onClick={handleSaveAsDefault}>
              {t("views.updateDefaultForEveryone")}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={onSaveAsNew}>
              {t("views.saveAsNew")}
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item onClick={handleUpdateExisting}>
              {t("views.updateViewName")}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={onSaveAsNew}>
              {t("views.saveAsNew")}
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
