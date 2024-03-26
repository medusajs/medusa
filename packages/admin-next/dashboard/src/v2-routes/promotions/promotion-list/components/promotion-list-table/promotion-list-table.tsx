import { PencilSquare, Trash } from "@medusajs/icons"
import { PromotionDTO } from "@medusajs/types"
import { Button, Container, Heading, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminDeleteDiscount } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLoaderData } from "react-router-dom"
import { useV2Promotions } from "../../../../../lib/api-v2"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { usePromotionTableColumns } from "../../../../../hooks/table/columns-v2/use-promotion-table-columns"
import { usePromotionTableFilters } from "../../../../../hooks/table/filters-v2/use-promotion-table-filters"
import { usePromotionTableQuery } from "../../../../../hooks/table/query-v2/use-promotion-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { promotionsLoader } from "../../loader"

const PAGE_SIZE = 20

export const PromotionListTable = () => {
  const { t } = useTranslation()

  // Question: what is this?
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof promotionsLoader>>
  >

  const { searchParams, raw } = usePromotionTableQuery({ pageSize: PAGE_SIZE })
  const { promotions, count, isLoading, isError, error } = useV2Promotions(
    { ...searchParams },
    {
      initialData,
      // Question: what is this?
      // TODO: reenable this once its figured out
      // keepPreviousData: true,
    }
  )

  const filters = usePromotionTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: (promotions ?? []) as PromotionDTO[],
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
        <Heading level="h2">{t("promotions.domain")}</Heading>

        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>

      <DataTable
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
        orderBy={["code", "created_at", "updated_at"]}
      />
      <Outlet />
    </Container>
  )
}

const PromotionActions = ({ promotion }: { promotion: PromotionDTO }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAdminDeleteDiscount(promotion.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("promotions.deleteWarning", {
        code: promotion.code,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/promotions/${promotion.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<PromotionDTO>()

const useColumns = () => {
  const base = usePromotionTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <PromotionActions promotion={row.original} />
        },
      }),
    ],
    [base]
  )
}
