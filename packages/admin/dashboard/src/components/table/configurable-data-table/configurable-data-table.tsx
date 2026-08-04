import { useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Container, Button, DataTableRowSelectionState } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../data-table"
import { SaveViewDialog } from "../save-view-dialog"
import { SaveViewDropdown } from "./save-view-dropdown"
import { useTableConfiguration } from "../../../hooks/table/use-table-configuration"
import { useConfigurableTableColumns } from "../../../hooks/table/columns/use-configurable-table-columns"
import { parseFilterParam } from "../../../hooks/table/query"
import {
  createActionsColumn,
  createSelectColumn,
  TableAdapter,
} from "../../../lib/table/table-adapters"

type DataTableActionProps = {
  label: string
  disabled?: boolean
} & (
  | {
      to: string
    }
  | {
      onClick: () => void
    }
)

/**
 * Expand dotted param keys into nested objects so the SDK's qs serializer emits
 * bracket notation the endpoint's nested filter schema expects, e.g.
 * `{ "location_levels.location_id": ["x"] }` -> `{ location_levels: { location_id: ["x"] } }`
 * -> `location_levels[location_id][0]=x`. Keys without a dot pass through.
 */
function expandDottedKeys(params: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(params)) {
    if (!key.includes(".")) {
      result[key] = value
      continue
    }
    const parts = key.split(".")
    let node = result
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof node[parts[i]] !== "object" || node[parts[i]] === null) {
        node[parts[i]] = {}
      }
      node = node[parts[i]]
    }
    node[parts[parts.length - 1]] = value
  }
  return result
}

export interface ConfigurableDataTableProps<TData> {
  adapter: TableAdapter<TData>
  heading?: string
  subHeading?: string
  pageSize?: number
  queryPrefix?: string
  layout?: "fill" | "auto"
  actions?: DataTableActionProps[]
}

export function ConfigurableDataTable<TData>({
  adapter,
  heading,
  subHeading,
  pageSize: pageSizeProp,
  queryPrefix: queryPrefixProp,
  layout = "fill",
  actions,
}: ConfigurableDataTableProps<TData>) {
  const { t } = useTranslation()
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [editingView, setEditingView] = useState<any>(null)
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {}
  )

  const entity = adapter.entity
  const viewConfigKey = adapter.viewConfigurationKey ?? adapter.entity
  const entityName = adapter.entityName
  const pageSize = pageSizeProp || adapter.pageSize || 20
  const queryPrefix = queryPrefixProp || adapter.queryPrefix || ""

  // Inject virtual columns (selection + actions) as API-shaped columns so they
  // flow through column ordering/visibility state. Their default_order keeps
  // selection first and actions last.
  const extraColumns = useMemo(() => {
    const cols = [
      adapter.enableRowSelection ? createSelectColumn() : null,
      adapter.renderRowActions
        ? createActionsColumn(t("fields.actions"))
        : null,
    ].filter((c): c is HttpTypes.AdminColumn => c !== null)
    return cols.length ? cols : undefined
  }, [adapter, t])

  const {
    activeView,
    createView,
    updateView,
    isViewConfigEnabled,
    visibleColumns,
    columnOrder,
    currentColumns,
    setColumnOrder,
    handleColumnVisibilityChange,
    currentConfiguration,
    hasConfigurationChanged,
    handleClearConfiguration,
    isLoadingColumns,
    isLoadingFilterOptions,
    apiColumns,
    filters,
    requiredFields,
    queryParams,
  } = useTableConfiguration({
    entity,
    pageSize,
    queryPrefix,
    transformColumns: adapter.transformColumns,
    extraColumns,
    defaultFilters: adapter.defaultFilters,
    viewConfigurationKey: viewConfigKey,
  })

  const parsedQueryParams: Record<string, any> = { ...queryParams }
  filters.forEach((filter) => {
    const filterKey = filter.id
    if (!filterKey || parsedQueryParams[filterKey] === undefined) {
      return
    }
    const value = parseFilterParam(parsedQueryParams[filterKey])

    const paramKey = adapter.filterParamMap?.[filterKey] ?? filterKey
    if (paramKey !== filterKey) {
      delete parsedQueryParams[filterKey]
    }
    if (value === undefined) {
      delete parsedQueryParams[paramKey]
    } else {
      parsedQueryParams[paramKey] = value
    }
  })

  const searchParams = {
    ...expandDottedKeys(parsedQueryParams),
    fields: requiredFields,
    limit: pageSize,
    offset: parsedQueryParams.offset ? Number(parsedQueryParams.offset) : 0,
  }

  const fetchResult = adapter.useData(requiredFields, searchParams)

  const generatedColumns = useConfigurableTableColumns(
    apiColumns || [],
    adapter
  )
  const columns = generatedColumns

  if (fetchResult.isError) {
    throw fetchResult.error
  }

  const handleSaveAsDefault = async () => {
    try {
      if (activeView?.is_system_default) {
        await updateView.mutateAsync({
          name: activeView.name || null,
          configuration: {
            visible_columns: currentColumns.visible,
            column_order: currentColumns.order,
            filters: currentConfiguration.filters || {},
            sorting: currentConfiguration.sorting || null,
            search: currentConfiguration.search || "",
          },
        })
      } else {
        await createView.mutateAsync({
          name: "Default",
          is_system_default: true,
          set_active: true,
          configuration: {
            visible_columns: currentColumns.visible,
            column_order: currentColumns.order,
            filters: currentConfiguration.filters || {},
            sorting: currentConfiguration.sorting || null,
            search: currentConfiguration.search || "",
          },
        })
      }
    } catch (_) {
      // Error is handled by the hook
    }
  }

  const handleUpdateExisting = async () => {
    if (!activeView) {
      return
    }

    try {
      await updateView.mutateAsync({
        name: activeView.name,
        configuration: {
          visible_columns: currentColumns.visible,
          column_order: currentColumns.order,
          filters: currentConfiguration.filters || {},
          sorting: currentConfiguration.sorting || null,
          search: currentConfiguration.search || "",
        },
      })
    } catch (_) {
      // Error is handled by the hook
    }
  }

  const handleSaveAsNew = () => {
    setSaveDialogOpen(true)
    setEditingView(null)
  }

  // Filter bar content with save controls
  const filterBarContent = hasConfigurationChanged ? (
    <>
      <Button
        variant="secondary"
        size="small"
        type="button"
        onClick={handleClearConfiguration}
      >
        {t("actions.clear")}
      </Button>
      <SaveViewDropdown
        isDefaultView={activeView?.is_system_default || !activeView}
        currentViewId={activeView?.id}
        currentViewName={activeView?.name}
        onSaveAsDefault={handleSaveAsDefault}
        onUpdateExisting={handleUpdateExisting}
        onSaveAsNew={handleSaveAsNew}
      />
    </>
  ) : null

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={fetchResult.data || []}
        columns={columns}
        filters={filters}
        getRowId={adapter.getRowId || ((row: any) => row.id)}
        rowCount={fetchResult.count}
        enablePagination
        enableSearch
        pageSize={pageSize}
        isLoading={
          fetchResult.isLoading || isLoadingColumns || isLoadingFilterOptions
        }
        layout={layout}
        heading={
          heading || entityName || (entity ? t(`${entity}.domain` as any) : "")
        }
        subHeading={subHeading}
        enableColumnVisibility={isViewConfigEnabled}
        initialColumnVisibility={visibleColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        columnOrder={columnOrder}
        onColumnOrderChange={setColumnOrder}
        enableViewSelector={isViewConfigEnabled}
        entity={viewConfigKey}
        currentColumns={currentColumns}
        filterBarContent={filterBarContent}
        rowHref={adapter.getRowHref as ((row: any) => string) | undefined}
        emptyState={
          adapter.emptyState || {
            empty: {
              heading: t(
                `${entity}.list.noRecordsMessage` as any,
                "There are no records to show"
              ),
            },
          }
        }
        prefix={queryPrefix}
        actions={actions}
        commands={adapter.commands}
        rowSelection={
          adapter.enableRowSelection
            ? {
                state: rowSelection,
                onRowSelectionChange: setRowSelection,
                enableRowSelection: true,
              }
            : undefined
        }
      />

      {saveDialogOpen && (
        <SaveViewDialog
          entity={viewConfigKey}
          currentColumns={currentColumns}
          currentConfiguration={currentConfiguration}
          editingView={editingView}
          onClose={() => {
            setSaveDialogOpen(false)
            setEditingView(null)
          }}
          onSaved={() => {
            setSaveDialogOpen(false)
            setEditingView(null)
          }}
        />
      )}
    </Container>
  )
}
