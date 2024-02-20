import { Region } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { useAdminShippingOptions } from "medusa-react"
import { useTranslation } from "react-i18next"

import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useShippingOptionColumns } from "./use-shipping-option-table-columns"

type RegionShippingOptionSectionProps = {
  region: Region
}

const PAGE_SIZE = 10

export const RegionShippingOptionSection = ({
  region,
}: RegionShippingOptionSectionProps) => {
  const { shipping_options, count, isError, error, isLoading } =
    useAdminShippingOptions({
      region_id: region.id,
      is_return: false,
    })

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
      <div className="px-6 py-4">
        <Heading level="h2">{t("regions.shippingOptions")}</Heading>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        isLoading={isLoading}
        rowCount={PAGE_SIZE}
        pagination
        search
      />
    </Container>
  )
}
