import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { DataTable } from "../../../../../components/table/data-table"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useProductTypeTableColumns } from "../../../../../hooks/table/columns/use-product-type-table-columns"
import { useProductTypeTableFilters } from "../../../../../hooks/table/filters/use-product-type-table-filters"
import { useProductTypeTableQuery } from "../../../../../hooks/table/query/use-product-type-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { ProductTypeRowActions } from "./product-table-row-actions"

const PAGE_SIZE = 20

export const ProductTypeListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductTypeTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { product_types, count, isLoading, isError, error } = useProductTypes(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useProductTypeTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    columns,
    data: product_types,
    count,
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
          <Heading>{t("productTypes.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("productTypes.subtitle")}
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        filters={filters}
        isLoading={isLoading}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        orderBy={["value", "created_at", "updated_at"]}
        navigateTo={({ original }) => original.id}
        queryObject={raw}
        pagination
        search
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProductType>()

const useColumns = () => {
  const base = useProductTypeTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ProductTypeRowActions productType={row.original} />
        },
      }),
    ],
    [base]
  )
}
