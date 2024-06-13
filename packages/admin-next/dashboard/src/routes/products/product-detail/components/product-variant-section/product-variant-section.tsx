import { PencilSquare, Plus } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { keepPreviousData } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useProductVariantTableColumns } from "./use-variant-table-columns"
import { useProductVariantTableFilters } from "./use-variant-table-filters"
import { useProductVariantTableQuery } from "./use-variant-table-query"
import { useProductVariants } from "../../../../../hooks/api/products"

type ProductVariantSectionProps = {
  product: HttpTypes.AdminProduct
}

const PAGE_SIZE = 10

export const ProductVariantSection = ({
  product,
}: ProductVariantSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductVariantTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { variants, count, isLoading, isError, error } = useProductVariants(
    product.id,
    {
      ...searchParams,
      fields: "*inventory_items.inventory.location_levels,+inventory_quantity",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useProductVariantTableFilters()
  const columns = useProductVariantTableColumns(product)

  const { table } = useDataTable({
    data: variants ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    meta: {
      product,
    },
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.variants")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.create"),
                  to: `variants/create`,
                  icon: <Plus />,
                },
                {
                  label: t("products.editPrices"),
                  to: `prices`,
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        filters={filters}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        orderBy={["title", "created_at", "updated_at"]}
        pagination
        search
        queryObject={raw}
      />
    </Container>
  )
}
