import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { PriceListDTO } from "@medusajs/types"
import { Checkbox, Container, Heading, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { ExtendedProductDTO } from "../../../../../types/api-responses"

type PricingProductSectionProps = {
  priceList: PriceListDTO
}

const PAGE_SIZE = 10
const PREFIX = "p"

export const PricingProductSection = ({
  priceList,
}: PricingProductSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { products, count, isLoading, isError, error } = useProducts(
    {
      ...searchParams,
      price_list_id: [priceList.id],
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useProductTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: products || [],
    count,
    columns,
    enablePagination: true,
    enableRowSelection: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    prefix: PREFIX,
  })

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("pricing.products.deleteProductsPricesWarning", {
        count: Object.keys(rowSelection).length,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    // The endpoint to batch remove prices by product ids is not implemented in
    // v2. We either need to implement it or remove the feature.
    console.log("Not implemented yet.")
  }

  const handleEdit = async () => {
    const ids = Object.keys(rowSelection).join(",")

    navigate(`/pricing/${priceList.id}/products/edit?ids[]=${ids}`)
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("products.domain")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("pricing.prices.addPrices"),
                  to: "products/add",
                  icon: <Plus />,
                },
                {
                  label: t("pricing.prices.editPrices"),
                  to: "products/edit",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        filters={filters}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        navigateTo={(row) => `/products/${row.original.id}`}
        orderBy={["title", "created_at", "updated_at"]}
        commands={[
          {
            action: handleEdit,
            label: t("actions.edit"),
            shortcut: "e",
          },
          {
            action: handleDelete,
            label: t("actions.delete"),
            shortcut: "d",
          },
        ]}
        pagination
        search
        prefix={PREFIX}
        queryObject={raw}
      />
    </Container>
  )
}

const ProductRowAction = ({ product }: { product: ExtendedProductDTO }) => {
  const { t } = useTranslation()

  // TODO: The endpoint to remove prices by product id is not implemented in v2.

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.remove"),
              onClick: () => {
                console.log(
                  `Removing prices for ${product.id}. Not implemented yet.`
                )
              },
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<ExtendedProductDTO>()

const useColumns = () => {
  const base = useProductTableColumns()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <ProductRowAction product={row.original} />,
      }),
    ],
    [base]
  )
}
