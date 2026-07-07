import { Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Container,
  createDataTableColumnHelper,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/data-table"
import {
  useDeleteProductOptionValueLazy,
  useProductOptionValues,
} from "../../../../../hooks/api"
import { useProductOptionValueTableQuery } from "../../../../../hooks/table/query/use-product-option-value-table-query"

type ProductOptionValuesSectionProps = {
  productOption: HttpTypes.AdminProductOption
}

const PAGE_SIZE = 10
const PREFIX = "optval"

export const ProductOptionValuesSection = ({
  productOption,
}: ProductOptionValuesSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

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

  const { mutateAsync } = useDeleteProductOptionValueLazy(productOption.id)

  const handleDelete = async (value: HttpTypes.AdminProductOptionValue) => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("productOptions.values.delete.confirmation", {
        value: value.value,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(value.id, {
      onSuccess: () => {
        toast.success(t("productOptions.values.delete.successToast"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  const columns = useColumns(handleDelete)

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

const useColumns = (
  handleDelete: (value: HttpTypes.AdminProductOptionValue) => void
) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("value", {
        header: t("productOptions.values.header"),
      }),
      columnHelper.action({
        actions: [
          {
            icon: <Trash />,
            label: t("actions.delete"),
            onClick: (ctx) => handleDelete(ctx.row.original),
          },
        ],
      }),
    ],
    [t, handleDelete]
  )
}
