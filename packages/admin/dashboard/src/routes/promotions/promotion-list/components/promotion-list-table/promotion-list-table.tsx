import { AdminPromotion } from "@medusajs/types"
import { Button, Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLoaderData } from "react-router-dom"

import { keepPreviousData } from "@tanstack/react-query"
import { _DataTable } from "../../../../../components/table/data-table"
import { usePromotions } from "../../../../../hooks/api/promotions"
import { usePromotionTableColumns } from "../../../../../hooks/table/columns/use-promotion-table-columns"
import { usePromotionTableFilters } from "../../../../../hooks/table/filters/use-promotion-table-filters"
import { usePromotionTableQuery } from "../../../../../hooks/table/query/use-promotion-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { promotionsLoader } from "../../loader"
import { PromotionListTableActions } from "./promotion-list-table-actions"

const PAGE_SIZE = 20

export const PromotionListTable = () => {
  const { t } = useTranslation()
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof promotionsLoader>>
  >

  const { searchParams, raw } = usePromotionTableQuery({ pageSize: PAGE_SIZE })
  const { promotions, count, isLoading, isError, error } = usePromotions(
    { ...searchParams },
    {
      initialData,
      placeholderData: keepPreviousData,
    }
  )

  const filters = usePromotionTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: (promotions ?? []) as AdminPromotion[],
    columns,
    count,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">{t("promotions.domain")}</Heading>

        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>

      <_DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        filters={filters}
        search
        pagination
        isLoading={isLoading}
        queryObject={raw}
        navigateTo={(row) => `${row.original.id}`}
        orderBy={[
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
      />
      <Outlet />
    </Container>
  )
}

const columnHelper = createColumnHelper<AdminPromotion>()

const useColumns = () => {
  const base = usePromotionTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <PromotionListTableActions promotion={row.original} />
        },
      }),
    ],
    [base]
  )
}
