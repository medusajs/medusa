import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Divider, toast } from "@medusajs/ui"
import { useState, useRef, useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { HttpTypes } from "@medusajs/types"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useBatchTranslationSettings } from "../../../../../hooks/api/translations"
import {
  EntitySelectorTree,
  type Entity,
  type EntityField,
  type EntitySelectorTreeRef,
} from "../entity-selector-tree/entity-selector-tree"
import { SelectorTreeFilter } from "../selector-tree-filter/selector-tree-filter"

type ViewMode = "full" | "selected"
type SortOrder = "asc" | "desc"

const BatchTranslationSettingsSchema = zod.object({
  selectedFields: zod.array(zod.string()),
})

/**
 * Formats a snake_case string to Title Case
 * @example "product_variant" -> "Product Variant"
 */
const format = (value: string): string => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Transforms the API response into the Entity[] format expected by the component
 */
const transformSettingsToEntities = (
  translationSettings: HttpTypes.AdminTranslationSettingsResponse["translation_settings"]
): Entity[] => {
  return Object.entries(translationSettings).map(([entityType, settings]) => {
    const allFields = [
      ...new Set([...settings.fields, ...settings.inactive_fields]),
    ]

    const fields: EntityField[] = allFields.map((fieldName) => ({
      id: fieldName,
      name: format(fieldName),
      selected: settings.fields.includes(fieldName),
    }))

    return {
      id: entityType,
      name: format(entityType),
      fields: fields.length > 0 ? fields : undefined,
      selected: settings.is_active,
    }
  })
}

/**
 * Transforms selectedIds into the batch request format
 */
const transformSelectedFieldsToBatchRequest = (
  selectedFields: string[],
  translationSettings: HttpTypes.AdminTranslationSettingsResponse["translation_settings"]
) => {
  const create: HttpTypes.AdminBatchTranslationSettings["create"] = []
  const update: HttpTypes.AdminBatchTranslationSettings["update"] = []

  const entitySelections = new Map<string, Set<string>>()

  selectedFields.forEach((field) => {
    const [entityType, fieldName] = field.split(".", 2)
    if (!entitySelections.has(entityType)) {
      entitySelections.set(entityType, new Set())
    }
    entitySelections.get(entityType)!.add(fieldName)
  })

  Object.entries(translationSettings).forEach(([entityType, settings]) => {
    const selectedFields = entitySelections.get(entityType) || new Set<string>()
    const selectedFieldsArray = Array.from(selectedFields)

    const hasSelectedFields = selectedFields.size > 0
    const exists = !!settings.id

    if (exists) {
      update.push({
        id: settings.id,
        fields: selectedFieldsArray,
        is_active: hasSelectedFields ? true : false,
      })
    } else {
      if (hasSelectedFields) {
        create.push({
          entity_type: entityType,
          fields: selectedFieldsArray,
        })
      }
    }
  })

  return {
    create: create.length > 0 ? create : undefined,
    update: update.length > 0 ? update : undefined,
  }
}

type BatchTranslationSettingsFormProps = {
  translation_settings: HttpTypes.AdminTranslationSettingsResponse["translation_settings"]
}

export const BatchTranslationSettingsForm = ({
  translation_settings,
}: BatchTranslationSettingsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("full")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const treeRef = useRef<EntitySelectorTreeRef>(null)

  const { mutateAsync, isPending: isMutating } = useBatchTranslationSettings()

  const entities = useMemo(() => {
    if (!translation_settings) {
      return []
    }
    return transformSettingsToEntities(translation_settings)
  }, [translation_settings])

  const initialSelectedIds = useMemo(() => {
    if (!translation_settings) {
      return []
    }

    const selected: string[] = []
    Object.entries(translation_settings).forEach(([entityType, settings]) => {
      settings.fields.forEach((fieldName: string) => {
        selected.push(`${entityType}.${fieldName}`)
      })
    })
    return selected
  }, [translation_settings])

  const inactiveEntities = useMemo(() => {
    return entities.filter((entity) => !entity.selected)
  }, [entities])

  const form = useForm<zod.infer<typeof BatchTranslationSettingsSchema>>({
    defaultValues: {
      selectedFields: initialSelectedIds,
    },
    resolver: zodResolver(BatchTranslationSettingsSchema),
  })

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    form.setValue("selectedFields", Array.from(newSelectedIds), {
      shouldDirty: true,
    })
  }

  const handleSelectAllToggle = (selected: boolean) => {
    treeRef.current?.selectAllToggle(selected)
  }

  const handleCollapseAll = () => {
    treeRef.current?.collapseAll()
  }

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const batchRequest = transformSelectedFieldsToBatchRequest(
      data.selectedFields,
      translation_settings
    )

    if (batchRequest.create || batchRequest.update) {
      await mutateAsync(batchRequest, {
        onSuccess: () => {
          toast.success(t("translations.settings.successToast"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    } else {
      handleSuccess()
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="p-0">
          <div className="px-6 py-4">
            <SelectorTreeFilter
              sortOrder={sortOrder}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSelectAllToggle={handleSelectAllToggle}
              initialAllSelected={inactiveEntities.length === 0}
              onSortToggle={handleSortToggle}
              onCollapseAll={handleCollapseAll}
            />
          </div>
          <Divider />
          <div className="bg-ui-bg-component h-full px-6 pb-6 pt-4">
            <EntitySelectorTree
              ref={treeRef}
              entities={entities}
              onSelectionChange={handleSelectionChange}
              searchQuery={searchQuery}
              viewMode={viewMode}
              sortOrder={sortOrder}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
