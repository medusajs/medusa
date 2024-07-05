import { AdminProductCategoryResponse } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type CategoryProductSectionProps = {
  category: AdminProductCategoryResponse["product_category"]
}

const PAGE_SIZE = 10

export const CategoryProductSection = ({
  category,
}: CategoryProductSectionProps) => {
  const { t } = useTranslation()

  const { raw, searchParams } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useProducts(
    {
      ...searchParams,
      category_id: [category.id],
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useProductTableColumns()
  const filters = useProductTableFilters(["categories"])

  const { table } = useDataTable({
    data: products || [],
    columns,
    count,
    getRowId: (original) => original.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    enablePagination: true,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <ActionMenu groups={[]} />
      </div>
      <DataTable
        table={table}
        filters={filters}
        columns={columns}
        orderBy={["title", "created_at", "updated_at"]}
        pageSize={PAGE_SIZE}
        count={count}
        navigateTo={(row) => row.id}
        isLoading={isLoading}
        queryObject={raw}
      />
    </Container>
  )
}
