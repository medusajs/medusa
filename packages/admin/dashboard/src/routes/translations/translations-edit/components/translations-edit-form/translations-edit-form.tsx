import { zodResolver } from "@hookform/resolvers/zod"
import { AdminStoreLocale, HttpTypes } from "@medusajs/types"
import { Button, Prompt, Select, toast, Text } from "@medusajs/ui"
import { ColumnDef } from "@tanstack/react-table"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import {
  createDataGridHelper,
  DataGrid,
} from "../../../../../components/data-grid"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useBatchTranslations } from "../../../../../hooks/api/translations"

const EntityTranslationsSchema = z.object({
  id: z.string().nullish(),
  fields: z.record(z.string().optional()),
})
export type EntityTranslationsSchema = z.infer<typeof EntityTranslationsSchema>

export const TranslationsFormSchema = z.object({
  entities: z.record(EntityTranslationsSchema),
})
export type TranslationsFormSchema = z.infer<typeof TranslationsFormSchema>

export type TranslationRow = EntityRow | FieldRow

export type EntityRow = {
  _type: "entity"
  reference_id: string
  subRows: FieldRow[]
}

export type FieldRow = {
  _type: "field"
  reference_id: string
  field_name: string
}

export function isEntityRow(row: TranslationRow): row is EntityRow {
  return row._type === "entity"
}

export function isFieldRow(row: TranslationRow): row is FieldRow {
  return row._type === "field"
}

type LocaleSnapshot = {
  localeCode: string
  entities: Record<string, EntityTranslationsSchema>
}

function buildLocaleSnapshot(
  translations: HttpTypes.AdminTranslation[],
  references: { id: string; [key: string]: string }[],
  localeCode: string,
  translatableFields: string[]
): LocaleSnapshot {
  const referenceTranslations = new Map<string, HttpTypes.AdminTranslation>()
  for (const t of translations) {
    if (t.locale_code === localeCode) {
      referenceTranslations.set(t.reference_id, t)
    }
  }

  const entities: Record<string, EntityTranslationsSchema> = {}
  for (const ref of references) {
    const existing = referenceTranslations.get(ref.id)
    const fields: Record<string, string> = {}

    for (const fieldName of translatableFields) {
      fields[fieldName] = (existing?.translations?.[fieldName] as string) ?? ""
    }

    entities[ref.id] = {
      id: existing?.id ?? null,
      fields,
    }
  }

  return { localeCode, entities }
}

function extendSnapshot(
  snapshot: LocaleSnapshot,
  translations: HttpTypes.AdminTranslation[],
  newReferences: { id: string; [key: string]: string }[],
  translatableFields: string[]
): LocaleSnapshot {
  const referenceTranslations = new Map<string, HttpTypes.AdminTranslation>()
  for (const t of translations) {
    if (t.locale_code === snapshot.localeCode) {
      referenceTranslations.set(t.reference_id, t)
    }
  }

  const extendedEntities = { ...snapshot.entities }

  for (const ref of newReferences) {
    if (!extendedEntities[ref.id]) {
      const existing = referenceTranslations.get(ref.id)
      const fields: Record<string, string> = {}

      for (const fieldName of translatableFields) {
        fields[fieldName] =
          (existing?.translations?.[fieldName] as string) ?? ""
      }

      extendedEntities[ref.id] = {
        id: existing?.id ?? null,
        fields,
      }
    }
  }

  return { ...snapshot, entities: extendedEntities }
}

function snapshotToFormValues(
  snapshot: LocaleSnapshot
): TranslationsFormSchema {
  return { entities: snapshot.entities }
}

type ChangeDetectionResult = {
  hasChanges: boolean
  payload: Required<HttpTypes.AdminBatchTranslations>
}

function computeChanges(
  currentState: TranslationsFormSchema,
  snapshot: LocaleSnapshot,
  entityType: string,
  localeCode: string
): ChangeDetectionResult {
  const payload: Required<HttpTypes.AdminBatchTranslations> = {
    create: [],
    update: [],
    delete: [],
  }

  for (const [entityId, entityData] of Object.entries(currentState.entities)) {
    const baseline = snapshot.entities[entityId]
    if (!baseline) {
      continue
    }

    const hasContent = Object.values(entityData.fields).some(
      (v) => v !== undefined && v.trim() !== ""
    )
    const hadContent = Object.values(baseline.fields).some(
      (v) => v !== undefined && v.trim() !== ""
    )
    const hasChanged =
      JSON.stringify(entityData.fields) !== JSON.stringify(baseline.fields)

    if (!entityData.id && hasContent) {
      payload.create.push({
        reference_id: entityId,
        reference: entityType,
        locale_code: localeCode,
        translations: entityData.fields,
      })
    } else if (entityData.id && hasContent && hasChanged) {
      payload.update.push({
        id: entityData.id,
        translations: entityData.fields,
      })
    } else if (entityData.id && !hasContent && hadContent) {
      payload.delete.push(entityData.id)
    }
  }

  const hasChanges =
    payload.create.length > 0 ||
    payload.update.length > 0 ||
    payload.delete.length > 0

  return { hasChanges, payload }
}

const columnHelper = createDataGridHelper<
  TranslationRow,
  TranslationsFormSchema
>()

const FIELD_COLUMN_WIDTH = 350

function buildTranslationRows(
  references: { id: string; [key: string]: string }[],
  translatableFields: string[]
): TranslationRow[] {
  return references.map((reference) => ({
    _type: "entity" as const,
    reference_id: reference.id,
    subRows: translatableFields.map((fieldName) => ({
      _type: "field" as const,
      reference_id: reference.id,
      field_name: fieldName,
    })),
  }))
}

function useTranslationsGridColumns({
  entities,
  availableLocales,
  selectedLocale,
  dynamicColumnWidth,
}: {
  entities: { id: string; [key: string]: string }[]
  availableLocales: AdminStoreLocale[]
  selectedLocale: string
  dynamicColumnWidth: number
}) {
  const { t } = useTranslation()

  return useMemo(() => {
    const selectedLocaleData = availableLocales.find(
      (l) => l.locale_code === selectedLocale
    )

    const columns: ColumnDef<TranslationRow>[] = [
      columnHelper.column({
        id: "field",
        name: "field",
        size: FIELD_COLUMN_WIDTH,
        header: undefined,
        cell: (context) => {
          const row = context.row.original

          if (isEntityRow(row)) {
            return <DataGrid.ReadonlyCell context={context} />
          }

          return (
            <DataGrid.ReadonlyCell context={context} color="normal">
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <Text
                  className="text-ui-fg-subtle truncate"
                  weight="plus"
                  size="small"
                >
                  {t(`fields.${row.field_name}`, {
                    defaultValue: row.field_name,
                  })}
                </Text>
              </div>
            </DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
      }),
      columnHelper.column({
        id: "original",
        name: "original",
        size: dynamicColumnWidth,
        header: () => (
          <Text className="text-ui-fg-base" weight="plus" size="small">
            {t("general.original")}
          </Text>
        ),
        disableHiding: true,
        cell: (context) => {
          const row = context.row.original

          if (isEntityRow(row)) {
            return <DataGrid.ReadonlyCell context={context} />
          }

          const entity = entities.find((e) => e.id === row.reference_id)
          if (!entity) {
            return null
          }

          return (
            <DataGrid.ReadonlyCell color="normal" context={context} isMultiLine>
              <Text className="text-ui-fg-subtle" weight="plus" size="small">
                {entity[row.field_name]}
              </Text>
            </DataGrid.ReadonlyCell>
          )
        },
      }),
    ]

    if (selectedLocaleData) {
      columns.push(
        columnHelper.column({
          id: selectedLocaleData.locale_code,
          name: selectedLocaleData.locale.name,
          size: dynamicColumnWidth,
          header: () => (
            <Text className="text-ui-fg-base" weight="plus" size="small">
              {selectedLocaleData.locale.name}
            </Text>
          ),
          cell: (context) => {
            const row = context.row.original

            if (isEntityRow(row)) {
              return <DataGrid.ReadonlyCell context={context} isMultiLine />
            }

            return <DataGrid.MultilineCell context={context} />
          },
          field: (context) => {
            const row = context.row.original

            if (isEntityRow(row)) {
              return null
            }

            return `entities.${row.reference_id}.fields.${row.field_name}`
          },
          type: "multiline-text",
        })
      )
    }

    return columns
  }, [t, availableLocales, selectedLocale, entities, dynamicColumnWidth])
}

type TranslationsEditFormProps = {
  translations: HttpTypes.AdminTranslation[]
  references: { id: string; [key: string]: string }[]
  entityType: string
  availableLocales: AdminStoreLocale[]
  translatableFields: string[]
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  referenceCount: number
}

export const TranslationsEditForm = ({
  translations,
  references,
  entityType,
  availableLocales,
  translatableFields,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  referenceCount,
}: TranslationsEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess, setCloseOnEscape } = useRouteModal()

  const containerRef = useRef<HTMLDivElement>(null)
  const [dynamicColumnWidth, setDynamicColumnWidth] = useState(400)

  useEffect(() => {
    const calculateColumnWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const availableWidth = containerWidth - FIELD_COLUMN_WIDTH - 16
        const columnWidth = Math.max(300, Math.floor(availableWidth / 2))
        setDynamicColumnWidth(columnWidth)
      }
    }

    calculateColumnWidth()

    const resizeObserver = new ResizeObserver(calculateColumnWidth)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  const [selectedLocale, setSelectedLocale] = useState<string>(
    availableLocales[0]?.locale_code ?? ""
  )
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false)
  const [pendingLocale, setPendingLocale] = useState<string | null>(null)
  const [isSwitchingLocale, setIsSwitchingLocale] = useState(false)

  const snapshotRef = useRef<LocaleSnapshot>(
    buildLocaleSnapshot(
      translations,
      references,
      selectedLocale,
      translatableFields
    )
  )

  const knownEntityIdsRef = useRef<Set<string>>(
    new Set(references.map((r) => r.id))
  )

  const latestPropsRef = useRef({ translations, references })
  useEffect(() => {
    latestPropsRef.current = { translations, references }
  }, [translations, references])

  const form = useForm<TranslationsFormSchema>({
    resolver: zodResolver(TranslationsFormSchema),
    defaultValues: snapshotToFormValues(snapshotRef.current),
  })

  useEffect(() => {
    const currentIds = new Set(references.map((r) => r.id))
    const newReferences = references.filter(
      (r) => !knownEntityIdsRef.current.has(r.id)
    )

    if (newReferences.length === 0) {
      return
    }

    knownEntityIdsRef.current = currentIds
    snapshotRef.current = extendSnapshot(
      snapshotRef.current,
      translations,
      newReferences,
      translatableFields
    )

    const currentValues = form.getValues()
    const newFormValues: TranslationsFormSchema = {
      entities: { ...currentValues.entities },
    }

    for (const ref of newReferences) {
      if (!newFormValues.entities[ref.id]) {
        newFormValues.entities[ref.id] = snapshotRef.current.entities[ref.id]
      }
    }

    form.reset(newFormValues, {
      keepDirty: true,
      keepDirtyValues: true,
    })
  }, [references, translations, translatableFields, form])

  const rows = useMemo(
    () => buildTranslationRows(references, translatableFields),
    [references, translatableFields]
  )

  const totalRowCount = useMemo(
    () => referenceCount * (translatableFields.length + 1),
    [referenceCount, translatableFields]
  )

  const selectedLocaleDisplay = useMemo(
    () =>
      availableLocales.find((l) => l.locale_code === selectedLocale)?.locale
        .name,
    [availableLocales, selectedLocale]
  )

  const columns = useTranslationsGridColumns({
    entities: references,
    availableLocales,
    selectedLocale,
    dynamicColumnWidth,
  })

  const { mutateAsync, isPending, invalidateQueries } =
    useBatchTranslations(entityType)

  const saveCurrentLocale = useCallback(async () => {
    const currentValues = form.getValues()
    const { hasChanges, payload } = computeChanges(
      currentValues,
      snapshotRef.current,
      entityType,
      selectedLocale
    )

    if (!hasChanges) {
      return true
    }

    try {
      const BATCH_SIZE = 150
      const totalItems =
        payload.create.length + payload.update.length + payload.delete.length
      const batchCount = Math.ceil(totalItems / BATCH_SIZE)

      for (let i = 0; i < batchCount; i++) {
        let currentBatchAvailable = BATCH_SIZE

        const currentBatch: HttpTypes.AdminBatchTranslations = {
          create: [],
          update: [],
          delete: [],
        }

        if (payload.create.length > 0) {
          currentBatch.create = payload.create.splice(0, currentBatchAvailable)
          currentBatchAvailable -= currentBatch.create.length
        }
        if (payload.update.length > 0) {
          currentBatch.update = payload.update.splice(0, currentBatchAvailable)
          currentBatchAvailable -= currentBatch.update.length
        }
        if (payload.delete.length > 0) {
          currentBatch.delete = payload.delete.splice(0, currentBatchAvailable)
        }

        const response = await mutateAsync(currentBatch, {
          onError: (error) => {
            toast.error(error.message)
          },
        })

        if (response.created) {
          for (const created of response.created) {
            form.setValue(`entities.${created.reference_id}.id`, created.id, {
              shouldDirty: false,
            })
            if (snapshotRef.current.entities[created.reference_id]) {
              snapshotRef.current.entities[created.reference_id].id = created.id
            }
          }
        }
      }

      const savedValues = form.getValues()
      for (const entityId of Object.keys(savedValues.entities)) {
        if (snapshotRef.current.entities[entityId]) {
          snapshotRef.current.entities[entityId] = {
            ...savedValues.entities[entityId],
          }
        }
      }

      form.reset(savedValues)

      return true
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save translations"
      )
      return false
    }
  }, [form, entityType, selectedLocale, mutateAsync])

  const switchToLocale = useCallback(
    async (newLocale: string) => {
      setIsSwitchingLocale(true)

      try {
        await invalidateQueries()

        await new Promise((resolve) => requestAnimationFrame(resolve))

        const { translations, references } = latestPropsRef.current

        const newSnapshot = buildLocaleSnapshot(
          translations,
          references,
          newLocale,
          translatableFields
        )

        snapshotRef.current = newSnapshot
        knownEntityIdsRef.current = new Set(references.map((r) => r.id))

        form.reset(snapshotToFormValues(newSnapshot))

        setSelectedLocale(newLocale)
      } finally {
        setIsSwitchingLocale(false)
      }
    },
    [translatableFields, form, invalidateQueries]
  )

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      if (newLocale === selectedLocale) {
        return
      }

      const currentValues = form.getValues()
      const { hasChanges } = computeChanges(
        currentValues,
        snapshotRef.current,
        entityType,
        selectedLocale
      )

      if (hasChanges) {
        setPendingLocale(newLocale)
        setShowUnsavedPrompt(true)
      } else {
        switchToLocale(newLocale)
      }
    },
    [selectedLocale, form, entityType, switchToLocale]
  )

  const handleSaveAndSwitch = useCallback(async () => {
    const success = await saveCurrentLocale()
    if (success && pendingLocale) {
      toast.success(t("translations.edit.successToast"))
      await switchToLocale(pendingLocale)
    }
    setShowUnsavedPrompt(false)
    setPendingLocale(null)
  }, [saveCurrentLocale, pendingLocale, t, switchToLocale])

  const handleCancelSwitch = useCallback(() => {
    setShowUnsavedPrompt(false)
    setPendingLocale(null)
  }, [])

  const handleSave = useCallback(
    async (closeOnSuccess: boolean = false) => {
      const success = await saveCurrentLocale()
      if (success) {
        toast.success(t("translations.edit.successToast"))
        if (closeOnSuccess) {
          handleSuccess()
        }
      }
    },
    [saveCurrentLocale, t, handleSuccess]
  )

  const handleClose = useCallback(() => {
    invalidateQueries()
  }, [invalidateQueries])

  const isLoading = isPending || isSwitchingLocale

  return (
    <RouteFocusModal.Form form={form} onClose={handleClose}>
      <KeyboundForm
        onSubmit={() => handleSave(true)}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="size-full overflow-hidden">
          <div ref={containerRef} className="size-full">
            <DataGrid
              showColumnsDropdown={false}
              columns={columns}
              data={rows}
              getSubRows={(row) => {
                if (isEntityRow(row)) {
                  return row.subRows
                }
              }}
              state={form}
              onEditingChange={(editing) => setCloseOnEscape(!editing)}
              totalRowCount={totalRowCount}
              onFetchMore={fetchNextPage}
              isFetchingMore={isFetchingNextPage}
              hasNextPage={hasNextPage}
              headerContent={
                <Select
                  disabled={isLoading}
                  value={selectedLocale}
                  onValueChange={handleLocaleChange}
                  size="small"
                >
                  <Select.Trigger className="bg-ui-bg-base w-[200px]">
                    <Select.Value>{selectedLocaleDisplay}</Select.Value>
                  </Select.Trigger>
                  <Select.Content>
                    {availableLocales.map((locale) => (
                      <Select.Item
                        key={locale.locale_code}
                        value={locale.locale_code}
                      >
                        {locale.locale.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              }
            />
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button
                type="button"
                size="small"
                variant="secondary"
                isLoading={isLoading}
              >
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              type="button"
              variant="secondary"
              onClick={() => handleSave(false)}
              isLoading={isLoading}
            >
              {t("actions.saveChanges")}
            </Button>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.saveAndClose")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>

      <Prompt open={showUnsavedPrompt} variant="confirmation">
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>
              {t("translations.edit.unsavedChanges.title")}
            </Prompt.Title>
            <Prompt.Description>
              {t("translations.edit.unsavedChanges.description")}
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Button
              size="small"
              variant="secondary"
              onClick={handleCancelSwitch}
              type="button"
            >
              {t("actions.close")}
            </Button>
            <Button
              size="small"
              onClick={handleSaveAndSwitch}
              type="button"
              isLoading={isLoading}
            >
              {t("actions.saveChanges")}
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </RouteFocusModal.Form>
  )
}
