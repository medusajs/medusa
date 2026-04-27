import React from "react"
import { DropdownMenu, Button, usePrompt } from "@medusajs/ui"
import { CloudArrowUp, SquaresPlus } from "@medusajs/icons"

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
}) => {
  const prompt = usePrompt()

  const handleSaveAsDefault = async () => {
    const result = await prompt({
      title: "Save as system default",
      description:
        "This will save the current configuration as the system default. All users will see this configuration by default unless they have their own personal views. Are you sure?",
      confirmText: "Save as default",
      cancelText: "Cancel",
    })

    if (result && onSaveAsDefault) {
      onSaveAsDefault()
    }
  }

  const handleUpdateExisting = async () => {
    const result = await prompt({
      title: "Update existing view",
      description: `Update "${currentViewName}" with the current configuration?`,
      confirmText: "Update",
      cancelText: "Cancel",
    })

    if (result && onUpdateExisting) {
      onUpdateExisting()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="small">
          Save
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isDefaultView && onSaveAsDefault && (
          <DropdownMenu.Item onClick={handleSaveAsDefault}>
            <CloudArrowUp className="h-4 w-4" />
            Save as system default
          </DropdownMenu.Item>
        )}
        {!isDefaultView && currentViewId && onUpdateExisting && (
          <DropdownMenu.Item onClick={handleUpdateExisting}>
            <CloudArrowUp className="h-4 w-4" />
            Update &ldquo;{currentViewName}&rdquo;
          </DropdownMenu.Item>
        )}
        {onSaveAsNew && (
          <DropdownMenu.Item onClick={onSaveAsNew}>
            <SquaresPlus className="h-4 w-4" />
            Save as new view
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
