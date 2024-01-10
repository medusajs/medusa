import { TaxRate } from "@medusajs/medusa"
import { Button, Container, Heading } from "@medusajs/ui"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminTaxRates } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { DebouncedSearch } from "../../../../components/common/debounced-search"

export const TaxRatesSection = () => {
  const { id } = useParams()
  const [query, setQuery] = useState("")

  const { tax_rates, isLoading } = useAdminTaxRates(
    {
      region_id: id,
    },
    {
      enabled: !!id,
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
      <div className="flex items-center justify-between px-8 pb-4 pt-6">
        <Heading level="h2">Tax Rates</Heading>
        <div className="flex items-center gap-x-2">
          <DebouncedSearch size="small" value={query} onChange={setQuery} />
          <Button variant="secondary">Add Tax Rate</Button>
        </div>
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
