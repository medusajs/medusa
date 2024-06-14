import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type ProductTypeProductSectionProps = {
  productType: HttpTypes.AdminProductType
}

const PAGE_SIZE = 10

export const ProductTypeProductSection = ({
  productType,
}: ProductTypeProductSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { products, count, isPending, isError, error } = useProducts({
    ...searchParams,
    type_id: [productType.id],
  })

  const filters = useProductTableFilters(["product_types"])
  const columns = useProductTableColumns()

  const { table } = useDataTable({
    columns,
    data: products,
    count: products?.length || 0,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
      </div>
      <DataTable
        table={table}
        filters={filters}
        isLoading={isPending}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        navigateTo={({ original }) => `/products/${original.id}`}
        orderBy={["title", "created_at", "updated_at"]}
        queryObject={raw}
        search
        pagination
      />
    </Container>
  )
}
