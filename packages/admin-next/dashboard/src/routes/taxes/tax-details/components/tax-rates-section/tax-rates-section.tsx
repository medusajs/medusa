import { Plus } from "@medusajs/icons"
import { Region, TaxRate } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminTaxRates } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type TaxRatesSectionProps = {
  region: Region
}

export const TaxRatesSection = ({ region }: TaxRatesSectionProps) => {
  const { tax_rates, isLoading } = useAdminTaxRates(
    {
      region_id: region.id,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()

  const table = useReactTable({
    data: tax_rates ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    ],
    [t]
  )
}
