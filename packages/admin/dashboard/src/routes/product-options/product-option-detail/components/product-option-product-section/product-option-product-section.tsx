import { Container } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/data-table"
import { useProducts } from "../../../../../hooks/api"
import { useProductTableColumns } from "../../../../../hooks/table/columns"
import { useProductTableQuery } from "../../../../../hooks/table/query"

type ProductOptionProductSectionProps = {
  productOptionId: string
}

const PAGE_SIZE = 10

export const ProductOptionProductSection = ({
  productOptionId,
}: ProductOptionProductSectionProps) => {
  const { t } = useTranslation()

  const { searchParams } = useProductTableQuery({ pageSize: PAGE_SIZE })

  const { products, count, isLoading, isError, error } = useProducts(
    {
      limit: PAGE_SIZE,
      ...searchParams,
      fields:
        "id,title,handle,thumbnail,status,*collection,*sales_channels,*product_options,variants.id",
      option_id: productOptionId,
    },
    {
      placeholderData: keepPreviousData,
      enabled: !!productOptionId,
    }
  )

  const columns = useColumns()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={products}
        columns={columns}
        rowCount={count}
        pageSize={PAGE_SIZE}
        getRowId={(row) => row.id}
        heading={t("products.domain")}
        emptyState={{
          empty: {
            heading: t("general.noRecordsMessage"),
            description: t("productOptions.products.list.noRecords"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        }}
        isLoading={isLoading}
        enableSearch={true}
        rowHref={(row) => `/products/${row.id}`}
      />
    </Container>
  )
}

const useColumns = () => {
  const columns = useProductTableColumns()

  return useMemo(() => [...columns], [columns])
}
