import { zodResolver } from "@hookform/resolvers/zod"
import { AdminStoreLocale, HttpTypes } from "@medusajs/types"
import { SquareTwoStack } from "@medusajs/icons"
import {
  Button,
  Copy,
  Prompt,
  Select,
  toast,
  Text,
  Textarea,
  Tooltip,
} from "@medusajs/ui"
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

import {
  buildLocaleSnapshot,
  extendSnapshot,
  snapshotToFormValues,
  computeChanges,
  copyTranslationField,
  type LocaleSnapshot,
  type TranslationReference,
} from "./translation-form-utils"

const EntityTranslationsSchema = z.object({
  id: z.string().nullish(),
  fields: z.record(z.string(), z.string().optional()),
})
export type EntityTranslationsSchemaType = z.infer<
  typeof EntityTranslationsSchema
>

export const TranslationsFormSchema = z.object({
  entities: z.record(z.string(), EntityTranslationsSchema),
})
// eslint-disable-next-line no-redeclare
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

const columnHelper = createDataGridHelper<
  TranslationRow,
  TranslationsFormSchema
>()

const FIELD_COLUMN_WIDTH = 350

function buildTranslationRows(
  references: TranslationReference[],
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
  onCopyToAll,
  isLoading,
}: {
  entities: TranslationReference[]
  availableLocales: AdminStoreLocale[]
  selectedLocale: string
  dynamicColumnWidth: number
  onCopyToAll: (row: FieldRow) => void
  isLoading: boolean
}) {
  const { t } = useTranslation()

  return useMemo(() => {
    const entitiesById = new Map(entities.map((entity) => [entity.id, entity]))
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
            const entity = entitiesById.get(row.reference_id)
            const label =
              entity?.title ?? entity?.name ?? entity?.value ?? row.reference_id
            return (
              <DataGrid.ReadonlyCell context={context}>
                <span title={row.reference_id}>{String(label)}</span>
              </DataGrid.ReadonlyCell>
            )
          }

          return (
            <DataGrid.ReadonlyCell context={context} color="normal">
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <Text
                  className="text-ui-fg-subtle min-w-0 flex-1 truncate"
                  weight="plus"
                  size="small"
                >
                  {t(`fields.${row.field_name}`, {
                    defaultValue: row.field_name,
                  })}
                </Text>
                <Tooltip content={t("translations.edit.copyToAll")}>
                  <Button
                    type="button"
                    variant="transparent"
                    size="small"
                    className="shrink-0"
                    disabled={isLoading}
                    aria-label={t("translations.edit.copyToAll")}
                    onClick={(event) => {
                      event.stopPropagation()
                      onCopyToAll(row)
                    }}
                  >
                    <SquareTwoStack />
                  </Button>
                </Tooltip>
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

          const entity = entitiesById.get(row.reference_id)
          if (!entity) {
            return null
          }

          const rawOriginalValue = entity[row.field_name]
          const originalValue =
            typeof rawOriginalValue === "string" ? rawOriginalValue : ""

          return (
            <DataGrid.ReadonlyCell color="normal" context={context} isMultiLine>
              <div className="flex w-full items-start justify-between gap-x-2">
                <Text
                  className="text-ui-fg-subtle min-w-0 flex-1"
                  weight="plus"
                  size="small"
                >
                  {originalValue}
                </Text>
                {originalValue.trim() && (
                  <Copy
                    content={originalValue}
                    variant="mini"
                    className="shrink-0 cursor-pointer"
                  />
                )}
              </div>
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
  }, [
    t,
    availableLocales,
    selectedLocale,
    entities,
    dynamicColumnWidth,
    onCopyToAll,
    isLoading,
  ])
}

type TranslationsEditFormProps = {
  translations: HttpTypes.AdminTranslation[]
  references: TranslationReference[]
  entityType: string
  availableLocales: AdminStoreLocale[]
  translatableFields: string[]
  fetchNextPage: () => void
  fetchAllReferences: () => Promise<{
    references: TranslationReference[]
    translations: HttpTypes.AdminTranslation[]
  }>
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
  fetchAllReferences,
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
  const [isCopying, setIsCopying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [gridVersion, setGridVersion] = useState(0)
  const savingRef = useRef(false)
  const [copyTarget, setCopyTarget] = useState<FieldRow | null>(null)
  const [copyValue, setCopyValue] = useState("")
  const [copyOnlyEmpty, setCopyOnlyEmpty] = useState(false)
  const [lastCopy, setLastCopy] = useState<{
    fieldName: string
    changes: ReturnType<typeof copyTranslationField>
  } | null>(null)

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

  const { mutateAsync, isPending, invalidateQueries } =
    useBatchTranslations(entityType)

  const isLoading = isPending || isSaving || isSwitchingLocale || isCopying

  const handleCopyToAll = useCallback(
    (row: FieldRow) => {
      setCopyTarget(row)
      setCopyValue(
        form.getValues(
          `entities.${row.reference_id}.fields.${row.field_name}`
        ) ?? ""
      )
      setCopyOnlyEmpty(false)
    },
    [form]
  )

  const columns = useTranslationsGridColumns({
    entities: references,
    availableLocales,
    selectedLocale,
    dynamicColumnWidth,
    onCopyToAll: handleCopyToAll,
    isLoading,
  })

  const applyCopyToAll = async () => {
    if (!copyTarget || isLoading) {
      return
    }
    setIsCopying(true)
    try {
      const all = await fetchAllReferences()
      snapshotRef.current = extendSnapshot(
        snapshotRef.current,
        all.translations,
        all.references,
        translatableFields
      )
      // Initialize every page before copying, preserving all unsaved edits.
      for (const reference of all.references) {
        if (!form.getValues(`entities.${reference.id}`)) {
          form.setValue(
            `entities.${reference.id}`,
            structuredClone(snapshotRef.current.entities[reference.id])
          )
        }
      }
      knownEntityIdsRef.current = new Set(
        all.references.map((reference) => reference.id)
      )
      const changes = copyTranslationField(
        form.getValues(),
        copyTarget.field_name,
        copyValue,
        copyOnlyEmpty
      )
      for (const change of changes) {
        form.setValue(
          `entities.${change.referenceId}.fields.${copyTarget.field_name}`,
          change.after,
          { shouldDirty: true }
        )
      }
      setLastCopy({ fieldName: copyTarget.field_name, changes })
      setGridVersion((version) => version + 1)
      setCopyTarget(null)
      toast.success(
        t("translations.edit.copyApplied", { count: changes.length })
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("translations.edit.copyFailed")
      )
    } finally {
      setIsCopying(false)
    }
  }

  const undoCopy = () => {
    if (!lastCopy) {
      return
    }
    for (const change of lastCopy.changes) {
      const path =
        `entities.${change.referenceId}.fields.${lastCopy.fieldName}` as const
      // Keep any subsequent manual edits to the same cell.
      if (form.getValues(path) === change.after) {
        form.setValue(path, change.before, { shouldDirty: true })
      }
    }
    setLastCopy(null)
    setGridVersion((version) => version + 1)
  }

  const saveCurrentLocale = useCallback(async () => {
    if (savingRef.current) {
      return false
    }
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

    savingRef.current = true
    setIsSaving(true)
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

        const response = await mutateAsync(currentBatch)

        if (response.created) {
          for (const created of response.created) {
            form.setValue(`entities.${created.reference_id}.id`, created.id, {
              shouldDirty: false,
            })
            if (snapshotRef.current.entities[created.reference_id]) {
              snapshotRef.current.entities[created.reference_id] = {
                id: created.id,
                fields: {
                  ...currentValues.entities[created.reference_id].fields,
                },
              }
            }
          }
        }
        // Advance the baseline after each successful batch so retries only send
        // unfinished work, including deletes and newly created translations.
        for (const [entityId, entity] of Object.entries(
          currentValues.entities
        )) {
          if (currentBatch.update?.some((update) => update.id === entity.id)) {
            snapshotRef.current.entities[entityId] = structuredClone(entity)
          }
          if (entity.id && currentBatch.delete?.includes(entity.id)) {
            form.setValue(`entities.${entityId}.id`, null, {
              shouldDirty: false,
            })
            snapshotRef.current.entities[entityId] = {
              id: null,
              fields: { ...entity.fields },
            }
          }
        }
      }

      const savedValues = form.getValues()
      for (const entityId of Object.keys(savedValues.entities)) {
        if (snapshotRef.current.entities[entityId]) {
          snapshotRef.current.entities[entityId] = {
            ...savedValues.entities[entityId],
            fields: { ...savedValues.entities[entityId].fields },
          }
        }
      }

      form.reset(savedValues)
      setLastCopy(null)

      return true
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save translations"
      )
      return false
    } finally {
      savingRef.current = false
      setIsSaving(false)
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
        setLastCopy(null)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("translations.edit.loadFailed")
        )
      } finally {
        setIsSwitchingLocale(false)
      }
    },
    [translatableFields, form, invalidateQueries, t]
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
      if (isCopying || isSwitchingLocale || copyTarget) {
        return
      }
      const success = await saveCurrentLocale()
      if (success) {
        toast.success(t("translations.edit.successToast"))
        if (closeOnSuccess) {
          handleSuccess()
        }
      }
    },
    [
      saveCurrentLocale,
      t,
      handleSuccess,
      isCopying,
      isSwitchingLocale,
      copyTarget,
    ]
  )

  const handleClose = useCallback(() => {
    invalidateQueries()
  }, [invalidateQueries])

  return (
    <RouteFocusModal.Form form={form} onClose={handleClose}>
      <KeyboundForm
        onSubmit={() => handleSave(true)}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="size-full overflow-hidden">
          <div
            ref={containerRef}
            className="size-full"
            {...(isLoading ? { inert: "" } : {})}
          >
            <DataGrid
              key={`${selectedLocale}-${gridVersion}`}
              disableInteractions={isLoading || !!copyTarget}
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
              onFetchMore={isLoading ? undefined : fetchNextPage}
              isFetchingMore={isFetchingNextPage}
              hasNextPage={hasNextPage}
              headerContent={
                <div className="flex flex-wrap items-center gap-2">
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
                  <Text size="small" className="text-ui-fg-subtle">
                    {t("translations.edit.loadedRows", {
                      loaded: references.length,
                      total: referenceCount,
                    })}
                  </Text>
                  {!!lastCopy?.changes.length && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={undoCopy}
                      disabled={isLoading}
                    >
                      {t("translations.edit.undoCopy")}
                    </Button>
                  )}
                </div>
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

      <Prompt
        open={!!copyTarget}
        onOpenChange={(open) => {
          if (!open && !isCopying) setCopyTarget(null)
        }}
        variant="confirmation"
      >
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>{t("translations.edit.copyToAll")}</Prompt.Title>
            <Prompt.Description>
              {t("translations.edit.copyDescription", {
                field: copyTarget
                  ? t(`fields.${copyTarget.field_name}`, {
                      defaultValue: copyTarget.field_name,
                    })
                  : "",
                locale: selectedLocaleDisplay,
                count: referenceCount,
              })}
            </Prompt.Description>
          </Prompt.Header>
          <div className="flex flex-col gap-3 px-6 pb-6">
            <Textarea
              aria-label={t("translations.edit.copyValue")}
              value={copyValue}
              onChange={(event) => setCopyValue(event.target.value)}
              disabled={isCopying}
              rows={4}
            />
            <Select
              value={copyOnlyEmpty ? "empty" : "all"}
              onValueChange={(value) => setCopyOnlyEmpty(value === "empty")}
              disabled={isCopying}
            >
              <Select.Trigger aria-label={t("translations.edit.copyMode")}>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">
                  {t("translations.edit.copyAllRows")}
                </Select.Item>
                <Select.Item value="empty">
                  {t("translations.edit.copyEmptyRows")}
                </Select.Item>
              </Select.Content>
            </Select>
            <Text size="small" className="text-ui-fg-subtle">
              {t("translations.edit.copySaveHint")}
            </Text>
          </div>
          <Prompt.Footer>
            <Button
              type="button"
              size="small"
              variant="secondary"
              disabled={isCopying}
              onClick={() => setCopyTarget(null)}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              type="button"
              size="small"
              isLoading={isCopying}
              onClick={applyCopyToAll}
            >
              {t("actions.apply")}
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>

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
