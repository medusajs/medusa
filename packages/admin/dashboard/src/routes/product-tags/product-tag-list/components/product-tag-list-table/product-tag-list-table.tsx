import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLoaderData } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTags } from "../../../../../hooks/api"
import { useProductTagTableColumns } from "../../../../../hooks/table/columns"
import { useProductTagTableFilters } from "../../../../../hooks/table/filters"
import { useProductTagTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDeleteProductTagAction } from "../../../common/hooks/use-delete-product-tag-action"
import { productTagListLoader } from "../../loader"

const PAGE_SIZE = 20

export const ProductTagListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useProductTagTableQuery({
    pageSize: PAGE_SIZE,
  })

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productTagListLoader>
  >

  const { product_tags, count, isPending, isError, error } = useProductTags(
    searchParams,
    {
      initialData,
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useProductTagTableFilters()

  const { table } = useDataTable({
    data: product_tags,
    count,
    columns,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("productTags.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        filters={filters}
        queryObject={raw}
        isLoading={isPending}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        navigateTo={(row) => row.original.id}
        search
        pagination
        orderBy={["value", "created_at", "updated_at"]}
      />
    </Container>
  )
}

const ProductTagRowActions = ({
  productTag,
}: {
  productTag: HttpTypes.AdminProductTag
}) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTagAction({ productTag })

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `${productTag.id}/edit`,
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

const columnHelper = createColumnHelper<HttpTypes.AdminProductTag>()

const useColumns = () => {
  const base = useProductTagTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <ProductTagRowActions productTag={row.original} />,
      }),
    ],
    [base]
  )
}
