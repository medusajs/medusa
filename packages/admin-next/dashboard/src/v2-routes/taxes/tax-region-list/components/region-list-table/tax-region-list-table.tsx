import { PencilSquare } from "@medusajs/icons"
import { AdminTaxRegionResponse } from "@medusajs/types"
import { Button, Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { useTaxRegions } from "../../../../../hooks/api/tax-regions"
import { useRegionTableFilters } from "../../../../../hooks/table/filters/use-region-table-filters"
import { useTaxRegionTableQuery } from "../../../../../hooks/table/query/use-tax-region-table-query copy"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const TaxRegionListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useTaxRegionTableQuery({ pageSize: PAGE_SIZE })
  const { tax_regions, count, isLoading, isError, error } = useTaxRegions({
    ...searchParams,
  })

  const filters = useRegionTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: tax_regions ?? [],
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
        <Heading level="h2">{t("taxes.domain")}</Heading>
        <Link to="/settings/taxes/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        filters={filters}
        orderBy={["name", "created_at", "updated_at"]}
        navigateTo={(row) => `${row.original.id}`}
        pagination
        search
        queryObject={raw}
      />
    </Container>
  )
}

const TaxRegionActions = ({
  taxRegion,
}: {
  taxRegion: AdminTaxRegionResponse["tax_region"]
}) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `/settings/taxes/${taxRegion.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<AdminTaxRegionResponse["tax_region"]>()

const useColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("country_code", {
        header: t("fields.country"),
        cell: ({ getValue }) => (
          <div className="flex size-full items-center">
            <span className="truncate">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("province_code", {
        header: t("fields.province"),
        cell: ({ getValue }) => (
          <div className="flex size-full items-center">
            <span className="truncate">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.created"),
        cell: ({ getValue }) => {
          const date = getValue()

          return <DateCell date={date} />
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <TaxRegionActions taxRegion={row.original as any} />
        },
      }),
    ],
    [t]
  )
}
