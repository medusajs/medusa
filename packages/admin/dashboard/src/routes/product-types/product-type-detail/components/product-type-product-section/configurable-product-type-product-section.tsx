import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { createTableAdapter } from "../../../../../lib/table/table-adapters"

const ALLOWED_FILTERS = [
  "id",
  "title",
  "handle",
  "status",
  "external_id",
  "created_at",
  "updated_at",
  "deleted_at",
  "tags.id",
  "collection.id",
  "sales_channels.id",
]

export const ConfigurableProductTypeProductSection = ({
  productType,
}: {
  productType: HttpTypes.AdminProductType
}) => {
  const { t } = useTranslation()

  const adapter = useMemo(
    () =>
      createTableAdapter<HttpTypes.AdminProduct>({
        entity: "products",
        viewConfigurationKey: "products-type",
        queryPrefix: "typp",
        pageSize: 10,
        emptyState: {
          empty: { heading: t("general.noRecordsMessage") },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        },
        useData: (fields, params) => {
          const { products, count, isError, error, isLoading } = useProducts({
            fields,
            ...params,
            type_id: [productType.id],
          })
          return { data: products, count, isLoading, isError, error }
        },
        getRowHref: (row) => `/products/${row.id}`,
        transformColumns: (columns) =>
          columns.map((column) => ({
            ...column,
            filter: !ALLOWED_FILTERS.includes(column.field)
              ? { ...column.filter, enabled: false }
              : column.filter,
          })),
      }),
    [t, productType.id]
  )

  return (
    <ConfigurableDataTable adapter={adapter} heading={t("products.domain")} />
  )
}
