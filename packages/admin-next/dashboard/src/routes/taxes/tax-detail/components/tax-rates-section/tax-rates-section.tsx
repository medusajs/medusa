import { Plus } from "@medusajs/icons"
import { Region, TaxRate } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminTaxRates } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"

type TaxRatesSectionProps = {
  region: Region
}

const PAGE_SIZE = 20

export const TaxRatesSection = ({ region }: TaxRatesSectionProps) => {
  const { tax_rates, count, isLoading, isError, error } = useAdminTaxRates(
    {
      region_id: region.id,
      limit: PAGE_SIZE,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()

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
        <Heading level="h2">Tax Rates</Heading>
        <ActionMenu
          groups={[
            { actions: [{ label: "Create", to: "create", icon: <Plus /> }] },
          ]}
        />
      </div>
      <DataTable
        table={table}
        isLoading={isLoading}
        count={count}
        columns={columns}
        pageSize={PAGE_SIZE}
        queryObject={{}}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<TaxRate>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => {
          return <span>{getValue()}</span>
        },
      }),
      columnHelper.accessor("code", {
        header: "Code",
        cell: ({ getValue }) => {
          return <span>{getValue()}</span>
        },
      }),
      columnHelper.accessor("rate", {
        header: "Rate",
        cell: ({ getValue }) => {
          return <span>{getValue()}</span>
        },
      }),
    ],
    [t]
  )
}
