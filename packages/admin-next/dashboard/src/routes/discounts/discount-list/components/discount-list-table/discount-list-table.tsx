import { PencilSquare, Trash } from "@medusajs/icons"
import type { Discount } from "@medusajs/medusa"
import { Button, Container, Heading, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminDeleteDiscount, useAdminDiscounts } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLoaderData } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useDiscountTableFilters } from "../../../../../hooks/table/filters/use-discount-table-filters"
import { useDiscountTableColumns } from "../../../../../hooks/table/columns/use-discount-table-columns"
import { useDiscountTableQuery } from "../../../../../hooks/table/query/use-discount-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { discountsLoader } from "../../loader"

const PAGE_SIZE = 20

export const DiscountListTable = () => {
  const { t } = useTranslation()

  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof discountsLoader>>
  >

  const { searchParams, raw } = useDiscountTableQuery({ pageSize: PAGE_SIZE })
  const { discounts, count, isLoading, isError, error } = useAdminDiscounts(
    {
      ...searchParams,
    },
    {
      initialData,
      keepPreviousData: true,
    }
  )

  const filters = useDiscountTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: (discounts ?? []) as Discount[],
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
        <Heading level="h2">{t("discounts.domain")}</Heading>
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

const DiscountActions = ({ discount }: { discount: Discount }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAdminDeleteDiscount(discount.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("discounts.deleteWarning", {
        code: discount.code,
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
              to: `/discounts/${discount.id}/edit`,
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

const columnHelper = createColumnHelper<Discount>()

const useColumns = () => {
  const base = useDiscountTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <DiscountActions discount={row.original} />
        },
      }),
    ],
    [base]
  )
}
