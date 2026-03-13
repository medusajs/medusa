import React, { useState } from "react"
import {
  Button,
  Input,
  Label,
  Drawer,
  Heading,
  Text,
} from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useViewConfigurations, useViewConfiguration } from "../../../hooks/use-view-configurations"
import type { ViewConfiguration } from "../../../hooks/use-view-configurations"
import { useTranslation } from "react-i18next"


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
  const { t } = useTranslation()
  const { createView } = useViewConfigurations(entity)
  const { updateView } = useViewConfiguration(entity, editingView?.id || '')
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
            visible_columns: currentColumns?.visible || editingView.configuration.visible_columns,
            column_order: currentColumns?.order || editingView.configuration.column_order,
            filters: currentConfiguration?.filters || editingView.configuration.filters || {},
            sorting: currentConfiguration?.sorting || editingView.configuration.sorting || null,
            search: currentConfiguration?.search || editingView.configuration.search || "",
          },
        })
        onSaved(result.view_configuration)
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
        onSaved(result.view_configuration)
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
              {editingView ? t("views.editViewNameTitle") : t("views.createNewViewTitle")}
            </Heading>
          </Drawer.Title>
          <Drawer.Description asChild>
            <Text>
              {editingView
                ? t("views.editViewNameDescription")
                : t("views.createNewViewDescription")}
            </Text>
          </Drawer.Description>
        </Drawer.Header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <Drawer.Body className="flex-1">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="name" weight="plus">
                {t("views.viewName")}
              </Label>
              <Input
                {...register("name", {
                  required: t("views.errors.nameRequired"),
                  validate: value => value.trim().length > 0 || t("views.errors.emptyName")
                })}
                type="text"
                placeholder={t("views.enterViewNamePlaceholder")}
                autoFocus
              />
              {errors.name && (
                <span className="text-sm text-ui-fg-error">
                  {errors.name.message}
                </span>
              )}
            </div>
          </Drawer.Body>

          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button
                variant="secondary"
                size="small"
                type="button"
              >
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button
              variant="primary"
              size="small"
              type="submit"
              isLoading={isLoading}
            >
              {editingView
                ? t("views.prompts.updateView.confirmText")
                : t("actions.save")}
            </Button>
          </Drawer.Footer>
        </form>
      </Drawer.Content>
    </Drawer>
  )
}
