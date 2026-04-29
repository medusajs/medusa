import React from "react"
import { Button, DropdownMenu, usePrompt } from "@medusajs/ui"
import { ChevronDownMini } from "@medusajs/icons"

interface SaveViewDropdownProps {
  isDefaultView: boolean
  currentViewId?: string | null
  currentViewName?: string | null
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
  const prompt = usePrompt()

  const handleSaveAsDefault = async () => {
    const result = await prompt({
      title: "Update default view",
      description:
        "This will update the default view for all users. Are you sure?",
      confirmText: "Update for everyone",
      cancelText: "Cancel",
    })

    if (result) {
      onSaveAsDefault()
    }
  }

  const handleUpdateExisting = async () => {
    const result = await prompt({
      title: "Update view",
      description: `Are you sure you want to update "${currentViewName}"?`,
      confirmText: "Update",
      cancelText: "Cancel",
    })

    if (result) {
      onUpdateExisting()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="small">
          Save
          <ChevronDownMini />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {isDefaultView ? (
          <>
            <DropdownMenu.Item onClick={handleSaveAsDefault}>
              Update default for everyone
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={onSaveAsNew}>
              Save as new view
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item onClick={handleUpdateExisting}>
              Update &ldquo;{currentViewName}&rdquo;
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={onSaveAsNew}>
              Save as new view
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
