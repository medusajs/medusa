import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createDataTableFilterHelper } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useProductTags } from "../../../../../hooks/api"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"

const filterHelper = createDataTableFilterHelper<HttpTypes.AdminProduct>()

/**
 * Hook to create filters in the format expected by @medusajs/ui DataTable
 */
export const useProductTableFilters = () => {
  const { t } = useTranslation()
  const dateFilters = useDataTableDateFilters()

  const { product_types } = useProductTypes({
    limit: 1000,
    offset: 0,
  })

  const { product_tags } = useProductTags({
    limit: 1000,
    offset: 0,
  })

  const { sales_channels } = useSalesChannels({
    limit: 1000,
    fields: "id,name",
  })

  return useMemo(() => {
    const filters = [...dateFilters]

    if (product_types?.length) {
      filters.push(
        filterHelper.accessor("type_id", {
          label: t("fields.type"),
          type: "multiselect",
          options: product_types.map((t) => ({
            label: t.value,
            value: t.id,
          })),
        })
      )
    }

    if (product_tags?.length) {
      filters.push(
        filterHelper.accessor("tag_id" as any, {
          label: t("fields.tag"),
          type: "multiselect",
          options: product_tags.map((t) => ({
            label: t.value,
            value: t.id,
          })),
        })
      )
    }

    if (sales_channels?.length) {
      filters.push(
        filterHelper.accessor("sales_channel_id" as any, {
          label: t("fields.salesChannel"),
          type: "multiselect",
          options: sales_channels.map((s) => ({
            label: s.name,
            value: s.id,
          })),
        })
      )
    }

    // Status filter
    filters.push(
      filterHelper.accessor("status", {
        label: t("fields.status"),
        type: "multiselect",
        options: [
          {
            label: t("products.productStatus.draft"),
            value: "draft",
          },
          {
            label: t("products.productStatus.proposed"),
            value: "proposed",
          },
          {
            label: t("products.productStatus.published"),
            value: "published",
          },
          {
            label: t("products.productStatus.rejected"),
            value: "rejected",
          },
        ],
      })
    )

    return filters
  }, [product_types, product_tags, sales_channels, dateFilters, t])
}
