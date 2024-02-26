import { Region } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { useAdminShippingOptions } from "medusa-react"
import { useTranslation } from "react-i18next"

import { PlusMini } from "@medusajs/icons"
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useShippingOptionColumns } from "./use-shipping-option-table-columns"
import { useShippingOptionTableFilters } from "./use-shipping-option-table-filters"
import { useShippingOptionTableQuery } from "./use-shipping-option-table-query"

type RegionShippingOptionSectionProps = {
  region: Region
}

const PAGE_SIZE = 10

export const RegionShippingOptionSection = ({
  region,
}: RegionShippingOptionSectionProps) => {
  const { searchParams, raw } = useShippingOptionTableQuery({
    pageSize: PAGE_SIZE,
    regionId: region.id,
  })
  const { shipping_options, count, isError, error, isLoading } =
    useAdminShippingOptions(
      {
        ...searchParams,
      },
      {
        keepPreviousData: true,
      }
    )

  const filters = useShippingOptionTableFilters()
  const columns = useShippingOptionColumns()

  const { table } = useDataTable({
    data: (shipping_options ?? []) as unknown as PricedShippingOption[],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id!,
    pageSize: PAGE_SIZE,
  })

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("regions.shippingOptions")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.create"),
                  icon: <PlusMini />,
                  to: "shipping_options/create",
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        filters={filters}
        orderBy={[
          "name",
          "price_type",
          "price_incl_tax",
          "is_return",
          "admin_only",
          "created_at",
          "updated_at",
        ]}
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        pagination
        search
        queryObject={raw}
      />
    </Container>
  )
}
