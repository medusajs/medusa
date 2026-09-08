import { HttpTypes } from "@medusajs/types"
import { DataTableCommand, toast, usePrompt } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { usePriceListLinkProducts } from "../../../../../hooks/api/price-lists"
import { useProducts } from "../../../../../hooks/api/products"
import { createTableAdapter } from "../../../../../lib/table/table-adapters"
import { ProductRowAction } from "./price-list-product-section"

const ALLOWED_FILTERS = [
  "id",
  "title",
  "handle",
  "status",
  "external_id",
  "created_at",
  "updated_at",
  "deleted_at",
  "type.id",
  "tags.id",
  "collection.id",
  "sales_channels.id",
]

export const ConfigurablePriceListProductSection = ({
  priceList,
}: {
  priceList: HttpTypes.AdminPriceList
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const { mutateAsync } = usePriceListLinkProducts(priceList.id)

  const commands = useMemo<DataTableCommand[]>(
    () => [
      {
        label: t("actions.edit"),
        shortcut: "e",
        action: (selection) => {
          const ids = Object.keys(selection).join(",")
          navigate(`products/edit?ids[]=${ids}`)
        },
      },
      {
        label: t("actions.delete"),
        shortcut: "d",
        action: async (selection) => {
          const ids = Object.keys(selection)
          const res = await prompt({
            title: t("general.areYouSure"),
            description: t("priceLists.products.delete.confirmation", {
              count: ids.length,
            }),
            confirmText: t("actions.delete"),
            cancelText: t("actions.cancel"),
          })
          if (!res) {
            return
          }
          await mutateAsync(
            { remove: ids },
            {
              onSuccess: () => {
                toast.success(
                  t("priceLists.products.delete.successToast", {
                    count: ids.length,
                  })
                )
              },
              onError: (e) => toast.error(e.message),
            }
          )
        },
      },
    ],
    [t, prompt, navigate, mutateAsync]
  )

  const adapter = useMemo(
    () =>
      createTableAdapter<HttpTypes.AdminProduct>({
        entity: "products",
        viewConfigurationKey: "products-price-list",
        queryPrefix: "plp",
        pageSize: 10,
        enableRowSelection: true,
        commands,
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
            price_list_id: [priceList.id],
          })
          return { data: products, count, isLoading, isError, error }
        },
        getRowHref: (row) => `/products/${row.id}`,
        renderRowActions: (row) => (
          <ProductRowAction product={row} priceList={priceList} />
        ),
        transformColumns: (columns) =>
          columns.map((column) => ({
            ...column,
            filter: !ALLOWED_FILTERS.includes(column.field)
              ? { ...column.filter, enabled: false }
              : column.filter,
          })),
      }),
    [t, priceList, commands]
  )

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("priceLists.products.header")}
      actions={[
        {
          label: t("priceLists.products.actions.addProducts"),
          to: "products/add",
        },
        {
          label: t("priceLists.products.actions.editPrices"),
          to: "products/edit",
        },
      ]}
    />
  )
}
