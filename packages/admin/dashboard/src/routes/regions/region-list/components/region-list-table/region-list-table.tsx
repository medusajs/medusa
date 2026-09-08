import type { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { _DataTable } from "../../../../../components/table/data-table"
import { useRegions } from "../../../../../hooks/api/regions"
import { useRegionTableColumns } from "../../../../../hooks/table/columns/use-region-table-columns"
import { useRegionTableFilters } from "../../../../../hooks/table/filters/use-region-table-filters"
import { useRegionTableQuery } from "../../../../../hooks/table/query/use-region-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { RegionListTableActions } from "./region-list-table-actions"

const PAGE_SIZE = 20

export const RegionListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useRegionTableQuery({ pageSize: PAGE_SIZE })
  const {
    regions,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useRegions(
    {
      ...searchParams,
      fields: "*payment_providers",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useRegionTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: (regions ?? []) as HttpTypes.AdminRegion[],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("regions.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("regions.subtitle")}
          </Text>
        </div>
        <Link to="/settings/regions/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>

      <_DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        filters={filters}
        orderBy={[
          { key: "name", label: t("fields.name") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        navigateTo={(row) => `${row.original.id}`}
        pagination
        search
        queryObject={raw}
        noRecords={{
          message: t("regions.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminRegion>()

const useColumns = () => {
  const base = useRegionTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <RegionListTableActions region={row.original} />
        },
      }),
    ],
    [base]
  )
}
