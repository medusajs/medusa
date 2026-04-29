import React, { useState } from "react"
import { Button, Input, Label, Drawer, Heading, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import {
  useViewConfigurations,
  useViewConfiguration,
} from "../../../hooks/use-view-configurations"
import type { ViewConfiguration } from "../../../hooks/use-view-configurations"

type SaveViewFormData = {
  name: string
}

interface SaveViewDialogProps {
  entity: string
  currentColumns?: {
    visible: string[]
    order: string[]
  }
  currentConfiguration?: {
    filters?: Record<string, unknown>
    sorting?: { id: string; desc: boolean } | null
    search?: string
  }
  editingView?: ViewConfiguration | null
  onClose: () => void
  onSaved: (view: ViewConfiguration) => void
}

export const SaveViewDialog: React.FC<SaveViewDialogProps> = ({
  entity,
  currentColumns,
  currentConfiguration,
  editingView,
  onClose,
  onSaved,
}) => {
  const { createView } = useViewConfigurations(entity)
  const { updateView } = useViewConfiguration(entity, editingView?.id || "")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveViewFormData>({
    defaultValues: {
      name: editingView?.name || "",
    },
  })

  const onSubmit = async (data: SaveViewFormData) => {
    if (!data.name.trim()) {
      return
    }

    setIsLoading(true)
    try {
      if (editingView) {
        // Update existing view
        const result = await updateView.mutateAsync({
          name: data.name.trim(),
          configuration: {
            visible_columns:
              currentColumns?.visible ||
              editingView.configuration.visible_columns,
            column_order:
              currentColumns?.order || editingView.configuration.column_order,
            filters:
              currentConfiguration?.filters ||
              editingView.configuration.filters ||
              {},
            sorting:
              currentConfiguration?.sorting ||
              editingView.configuration.sorting ||
              null,
            search:
              currentConfiguration?.search ||
              editingView.configuration.search ||
              "",
          },
        })
        if (result.view_configuration) {
          onSaved(result.view_configuration)
        }
      } else {
        // Create new view
        const result = await createView.mutateAsync({
          name: data.name.trim(),
          set_active: true,
          configuration: {
            visible_columns: currentColumns?.visible || [],
            column_order: currentColumns?.order || [],
            filters: currentConfiguration?.filters || {},
            sorting: currentConfiguration?.sorting || null,
            search: currentConfiguration?.search || "",
          },
        })
        if (result.view_configuration) {
          onSaved(result.view_configuration)
        }
      }
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Drawer open onOpenChange={onClose}>
      <Drawer.Content className="flex flex-col">
        <Drawer.Header>
          <Drawer.Title asChild>
            <Heading>
              {editingView ? "Edit View Name" : "Save as New View"}
            </Heading>
          </Drawer.Title>
          <Drawer.Description asChild>
            <Text>
              {editingView
                ? "Change the name of your saved view"
                : "Save your current configuration as a new view"}
            </Text>
          </Drawer.Description>
        </Drawer.Header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
        >
          <Drawer.Body className="flex-1">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="name" weight="plus">
                View Name
              </Label>
              <Input
                {...register("name", {
                  required: "Name is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Name cannot be empty",
                })}
                type="text"
                placeholder="Enter view name"
                autoFocus
              />
              {errors.name && (
                <span className="text-ui-fg-error text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
          </Drawer.Body>

          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary" size="small" type="button">
                Cancel
              </Button>
            </Drawer.Close>
            <Button
              variant="primary"
              size="small"
              type="submit"
              isLoading={isLoading}
            >
              {editingView ? "Update" : "Save"}
            </Button>
          </Drawer.Footer>
        </form>
      </Drawer.Content>
    </Drawer>
  )
}
