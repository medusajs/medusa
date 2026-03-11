import { useState, ReactNode } from "react"
import { Container, Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../data-table"
import { SaveViewDialog } from "../save-view-dialog"
import { SaveViewDropdown } from "./save-view-dropdown"
import { useTableConfiguration } from "../../../hooks/table/use-table-configuration"
import { useConfigurableTableColumns } from "../../../hooks/table/columns/use-configurable-table-columns"
import { getEntityAdapter } from "../../../lib/table/entity-adapters"
import { TableAdapter } from "../../../lib/table/table-adapters"

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

  const entity = adapter.entity
  const entityName = adapter.entityName
  const rawFilters = adapter.filters || []
  const filters = rawFilters.map((filter) => {
    // If filter has 'key' but no 'id', use 'key' as 'id' for compatibility
    if ((filter as any).key && !(filter as any).id) {
      return { ...filter, id: (filter as any).key as string }
    }
    return filter
  })
  const pageSize = pageSizeProp || adapter.pageSize || 20
  const queryPrefix = queryPrefixProp || adapter.queryPrefix || ""

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
    apiColumns,
    requiredFields,
    queryParams,
  } = useTableConfiguration({
    entity,
    pageSize,
    queryPrefix,
    filters,
  })

  const parsedQueryParams = { ...queryParams }
  filters.forEach((filter) => {
    const filterKey = filter.id
    if (filterKey && parsedQueryParams[filterKey] !== undefined) {
      try {
        parsedQueryParams[filterKey] = JSON.parse(parsedQueryParams[filterKey])
      } catch {
        // If parsing fails, keep the original value
      }
    }
  })

  const searchParams = {
    ...parsedQueryParams,
    fields: requiredFields,
    limit: pageSize,
    offset: parsedQueryParams.offset ? Number(parsedQueryParams.offset) : 0,
  }

  const fetchResult = adapter.useData(requiredFields, searchParams)

  const columnAdapter = adapter.columnAdapter || getEntityAdapter(entity)
  const generatedColumns = useConfigurableTableColumns(entity, apiColumns || [], columnAdapter)
  const columns = (adapter.getColumns && apiColumns)
    ? adapter.getColumns(apiColumns)
    : generatedColumns

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
          }
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
          }
        })
      }
    } catch (_) {
      // Error is handled by the hook
    }
  }

  const handleUpdateExisting = async () => {
    if (!activeView) return

    try {
      await updateView.mutateAsync({
        name: activeView.name,
        configuration: {
          visible_columns: currentColumns.visible,
          column_order: currentColumns.order,
          filters: currentConfiguration.filters || {},
          sorting: currentConfiguration.sorting || null,
          search: currentConfiguration.search || "",
        }
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
        isLoading={fetchResult.isLoading || isLoadingColumns}
        layout={layout}
        heading={heading || entityName || (entity ? t(`${entity}.domain` as any) : "")}
        subHeading={subHeading}
        enableColumnVisibility={isViewConfigEnabled}
        initialColumnVisibility={visibleColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        columnOrder={columnOrder}
        onColumnOrderChange={setColumnOrder}
        enableViewSelector={isViewConfigEnabled}
        entity={entity}
        currentColumns={currentColumns}
        filterBarContent={filterBarContent}
        rowHref={adapter.getRowHref as ((row: any) => string) | undefined}
        emptyState={adapter.emptyState || {
          empty: {
            heading: t(`${entity}.list.noRecordsMessage` as any),
          }
        }}
        prefix={queryPrefix}
        actions={actions}
        enableFilterMenu={false}
      />

      {saveDialogOpen && (
        <SaveViewDialog
          entity={entity}
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
