import { HttpTypes } from "@medusajs/types"
import { Container, createDataTableColumnHelper } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/data-table"
import { useProductOptionValues } from "../../../../../hooks/api"
import { useProductOptionValueTableQuery } from "../../../../../hooks/table/query/use-product-option-value-table-query"
import { ProductOptionValueRowActions } from "./product-option-value-row-actions"

type ProductOptionValuesSectionProps = {
  productOption: HttpTypes.AdminProductOption
}

const PAGE_SIZE = 10
const PREFIX = "optval"

export const ProductOptionValuesSection = ({
  productOption,
}: ProductOptionValuesSectionProps) => {
  const { t } = useTranslation()

  const { searchParams } = useProductOptionValueTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const { product_option_values, count, isLoading, isError, error } =
    useProductOptionValues(
      productOption.id,
      { ...searchParams, order: searchParams.order ?? "rank" },
      {
        placeholderData: keepPreviousData,
      }
    )

  const columns = useColumns(productOption.id)

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={product_option_values}
        columns={columns}
        rowCount={count}
        pageSize={PAGE_SIZE}
        prefix={PREFIX}
        getRowId={(row) => row.id}
        heading={t("productOptions.values.header")}
        emptyState={{
          empty: {
            heading: t("general.noRecordsMessage"),
            description: t("productOptions.values.list.noRecords"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        }}
        isLoading={isLoading}
        enableSearch
        autoFocusSearch={false}
        rowHref={(row) =>
          `/product-options/${productOption.id}/values/${row.id}`
        }
      />
    </Container>
  )
}

const columnHelper =
  createDataTableColumnHelper<HttpTypes.AdminProductOptionValue>()

const useColumns = (optionId: string) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("value", {
        header: t("productOptions.values.header"),
      }),
      columnHelper.display({
        id: "action",
        cell: ({ row }) => (
          <ProductOptionValueRowActions
            optionId={optionId}
            value={row.original}
          />
        ),
      }),
    ],
    [t, optionId]
  )
}
