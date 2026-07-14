import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { HttpTypes } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"

import { RouteFocusModal, useRouteModal } from "../../../components/modals"
import { KeyboundForm } from "../../../components/utilities/keybound-form"
import { useBatchPropertyLabels } from "../../../hooks/api/property-labels"
import { DataGrid, createDataGridHelper } from "../../../components/data-grid"
import { VisuallyHidden } from "../../../components/utilities/visually-hidden"

interface PropertyFieldRow {
  field: string
}

interface PropertyLabelsEditFormProps {
  entity: string
  columns: HttpTypes.AdminColumn[]
  propertyLabels: HttpTypes.AdminPropertyLabel[]
}

const isLeafNode = (obj: any): boolean => {
  if (typeof obj !== "object" || obj === null) return false
  const keys = Object.keys(obj)
  return (
    keys.length > 0 &&
    keys.every((key) => key === "label" || key === "description")
  )
}

const propertyLabelValueSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
})

type PropertyLabelValue = z.infer<typeof propertyLabelValueSchema>

interface PropertyLabelSchema {
  [key: string]: PropertyLabelValue | PropertyLabelSchema
}

const propertyLabelSchema: z.ZodType<PropertyLabelSchema> = z.lazy(() =>
  z.record(z.string(), z.any()).superRefine((obj, ctx) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (isLeafNode(value)) {
        const result = propertyLabelValueSchema.safeParse(value)
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: [key, ...issue.path],
            })
          })
        }

        const typedValue = value as PropertyLabelValue
        if (typedValue.description && typedValue.description.trim() !== "") {
          if (!typedValue.label || typedValue.label.trim() === "") {
            ctx.addIssue({
              code: "custom",
              message: "Label is required when description is provided",
              path: [key, "label"],
            })
          }
        }
      } else if (typeof value === "object" && value !== null) {
        const result = propertyLabelSchema.safeParse(value)
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: [key, ...issue.path],
            })
          })
        }
      }
    })
  })
)

const columnHelper = createDataGridHelper<
  PropertyFieldRow,
  PropertyLabelSchema
>()

export const PropertyLabelsEditForm = ({
  entity,
  columns,
  propertyLabels,
}: PropertyLabelsEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const batchMutation = useBatchPropertyLabels()

  const buildNestedInitialData = (
    labels: HttpTypes.AdminPropertyLabel[]
  ): PropertyLabelSchema => {
    const result: any = {}

    labels.forEach((label) => {
      const parts = label.property.split(".")
      let current = result

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = {
            label: label.label,
            description: label.description || "",
          }
        } else {
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
      })
    })

    return result
  }

  const initialData = buildNestedInitialData(propertyLabels)

  const form = useForm<PropertyLabelSchema>({
    resolver: zodResolver(propertyLabelSchema),
    defaultValues: initialData,
  })

  const rows: PropertyFieldRow[] = useMemo(() => {
    return columns.map((column) => ({
      field: column.field,
    }))
  }, [columns])

  const gridColumns: ColumnDef<PropertyFieldRow>[] = useMemo(() => {
    return [
      columnHelper.column({
        id: "field",
        name: "field",
        header: t("fields.field", "Field"),
        cell: (context) => {
          const row = context.row.original
          return (
            <DataGrid.ReadonlyCell context={context}>
              {row.field}
            </DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
        minSize: 250,
      }),
      columnHelper.column({
        id: "label",
        name: "label",
        header: t("propertyLabels.customLabel", "Custom Label"),
        type: "text",
        field: (context) => {
          const row = context.row.original
          return `${row.field}.label`
        },
        cell: (context) => {
          return <DataGrid.TextCell context={context} />
        },
        disableHiding: true,
        minSize: 250,
      }),
      columnHelper.column({
        id: "description",
        name: "description",
        header: t("fields.description", "Description"),
        type: "multiline-text",
        field: (context) => {
          const row = context.row.original
          return `${row.field}.description`
        },
        cell: (context) => {
          return <DataGrid.MultilineCell context={context} />
        },
        minSize: 400,
      }),
    ]
  }, [t])

  const flattenData = (
    obj: any,
    prefix = ""
  ): Array<[string, PropertyLabelValue]> => {
    const results: Array<[string, PropertyLabelValue]> = []

    Object.entries(obj).forEach(([key, value]) => {
      const fullPath = prefix ? `${prefix}.${key}` : key

      if (value && typeof value === "object") {
        const keys = Object.keys(value)
        const isLeaf = keys.every((k) => k === "label" || k === "description")

        if (isLeaf) {
          results.push([fullPath, value as PropertyLabelValue])
        } else {
          results.push(...flattenData(value, fullPath))
        }
      }
    })

    return results
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const create: HttpTypes.AdminCreatePropertyLabel[] = []
    const update: NonNullable<HttpTypes.AdminBatchPropertyLabels["update"]> = []
    const deleteIds: string[] = []

    const labelMap = new Map<string, HttpTypes.AdminPropertyLabel>()
    propertyLabels?.forEach((label) => {
      labelMap.set(label.property, label)
    })

    const flatEntries = flattenData(data)

    flatEntries.forEach(([property, values]) => {
      const existingLabel = labelMap.get(property)
      const newLabel = values.label?.trim()
      const newDescription = values.description?.trim()

      if (newLabel) {
        if (existingLabel) {
          if (
            existingLabel.label !== newLabel ||
            (existingLabel.description || "") !== (newDescription || "")
          ) {
            update.push({
              id: existingLabel.id,
              label: newLabel,
              description: newDescription ?? null,
            })
          }
        } else {
          create.push({
            entity,
            property,
            label: newLabel,
            description: newDescription || undefined,
          })
        }
      } else if (existingLabel) {
        deleteIds.push(existingLabel.id)
      }
    })

    if (!create.length && !update.length && !deleteIds.length) {
      return
    }

    await batchMutation.mutateAsync(
      {
        create: create.length > 0 ? create : undefined,
        update: update.length > 0 ? update : undefined,
        delete: deleteIds.length > 0 ? deleteIds : undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            t(
              "propertyLabels.updateSuccess",
              "Property labels updated successfully"
            )
          )
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <RouteFocusModal.Title asChild>
            <VisuallyHidden>
              {t("propertyLabels.editTitle", "Edit Property Labels")}
            </VisuallyHidden>
          </RouteFocusModal.Title>
          <RouteFocusModal.Description asChild>
            <VisuallyHidden>
              {t(
                "propertyLabels.editDescription",
                "Customize how property names are displayed for {{entity}}",
                { entity }
              )}
            </VisuallyHidden>
          </RouteFocusModal.Description>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="overflow-hidden">
          <DataGrid columns={gridColumns} data={rows} state={form} />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" type="button">
                {t("actions.cancel", "Cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              isLoading={batchMutation.isPending}
              disabled={!form.formState.isDirty}
            >
              {t("actions.save", "Save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
