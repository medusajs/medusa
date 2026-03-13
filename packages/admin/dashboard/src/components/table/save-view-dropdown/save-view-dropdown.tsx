import React, { useState, useEffect } from "react"
import {
  DropdownMenu,
  Button,
  toast,
  usePrompt,
} from "@medusajs/ui"
import {
  Plus,
  CloudArrowUp,
  SquarePlusMicro,
} from "@medusajs/icons"
import { useTranslation } from "react-i18next"

interface SaveViewDropdownProps {
  isDefaultView: boolean
  currentViewId?: string | null
  currentViewName?: string | null
  onSaveAsDefault?: () => void
  onUpdateExisting?: () => void
  onSaveAsNew?: () => void
}

export const SaveViewDropdown: React.FC<SaveViewDropdownProps> = ({
  isDefaultView,
  currentViewId,
  currentViewName,
  onSaveAsDefault,
  onUpdateExisting,
  onSaveAsNew,
} ) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleSaveAsDefault = async () => {
    const result = await prompt({
      title: t("views.prompts.saveAsSystemDefault.title"),
      description: t("views.prompts.saveAsSystemDefault.description"),
      confirmText: t("views.prompts.saveAsSystemDefault.confirmText"),
      cancelText: t("actions.cancel"),
    })

    if (result && onSaveAsDefault) {
      onSaveAsDefault()
    }
  }

  const handleUpdateExisting = async () => {
    const result = await prompt({
      title: t("views.prompts.updateView.existingView.title"),
      description: t("views.prompts.updateView.existingView.description", { view: currentViewName }),
      confirmText: t("views.prompts.updateView.confirmText"),
      cancelText: t("actions.cancel"),
    })

    if (result && onUpdateExisting) {
      onUpdateExisting()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="small">
          {t("actions.save")}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isDefaultView && onSaveAsDefault && (
          <DropdownMenu.Item onClick={handleSaveAsDefault}>
            <CloudArrowUp className="h-4 w-4" />
            {t("views.prompts.saveAsSystemDefault.title")}
          </DropdownMenu.Item>
        )}
        {!isDefaultView && currentViewId && onUpdateExisting && (
          <DropdownMenu.Item onClick={handleUpdateExisting}>
            <CloudArrowUp className="h-4 w-4" />
            {t("views.updateViewName", { view: currentViewName })}
          </DropdownMenu.Item>
        )}
        {onSaveAsNew && (
          <DropdownMenu.Item onClick={onSaveAsNew}>
            <SquarePlusMicro className="h-4 w-4" />
            {t("views.saveAsNew")}
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
