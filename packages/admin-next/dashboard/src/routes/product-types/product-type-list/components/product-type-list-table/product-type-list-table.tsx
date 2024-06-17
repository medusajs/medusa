import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useProductTypeTableColumns } from "./use-product-type-table-columns"
import { useProductTypeTableFilters } from "./use-product-type-table-filters"
import { useProductTypeTableQuery } from "./use-product-type-table-query"

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
  const columns = useProductTypeTableColumns()

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
        <Heading>{t("productTypes.domain")}</Heading>
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
