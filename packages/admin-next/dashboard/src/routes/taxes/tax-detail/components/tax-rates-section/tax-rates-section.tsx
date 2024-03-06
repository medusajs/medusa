import { Plus } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { useAdminTaxRates } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useTaxRateTableColumns } from "./use-tax-rate-table-columns"
import { useTaxRateTableFilters } from "./use-tax-rate-table-filters"
import { useTaxRateTableQuery } from "./use-tax-rate-table-query"

type TaxRatesSectionProps = {
  region: Region
}

const PAGE_SIZE = 10

export const TaxRatesSection = ({ region }: TaxRatesSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useTaxRateTableQuery({ pageSize: PAGE_SIZE })
  const { tax_rates, count, isLoading, isError, error } = useAdminTaxRates(
    {
      region_id: region.id,
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const filters = useTaxRateTableFilters()
  const columns = useTaxRateTableColumns()

  const { table } = useDataTable({
    data: tax_rates ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("taxes.taxRate.sectionTitle")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.create"),
                  to: "tax-rates/create",
                  icon: <Plus />,
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        isLoading={isLoading}
        count={count}
        columns={columns}
        pageSize={PAGE_SIZE}
        queryObject={raw}
        filters={filters}
        pagination
        search
        orderBy={["name", "code", "rate", "created_at", "updated_at"]}
      />
    </Container>
  )
}
