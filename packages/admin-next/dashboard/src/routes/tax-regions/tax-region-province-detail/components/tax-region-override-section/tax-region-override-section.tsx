import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useTaxRates } from "../../../../../hooks/api/tax-rates"
import { useTaxRateTableQuery } from "../../../../../hooks/table/query/use-tax-rate-table-query"
import { TaxOverrideTable } from "../../../common/components/tax-override-table"
import { useTaxOverrideTable } from "../../../common/hooks/use-tax-override-table"

type TaxRegionOverrideSectionProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

const PAGE_SIZE = 10
const PREFIX = "o"

export const TaxRegionOverrideSection = ({
  taxRegion,
}: TaxRegionOverrideSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useTaxRateTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { tax_rates, count, isPending, isError, error } = useTaxRates(
    {
      ...searchParams,
      tax_region_id: taxRegion.id,
      is_default: false,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const { table } = useTaxOverrideTable({
    count,
    data: tax_rates,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0">
      <TaxOverrideTable
        isPending={isPending}
        table={table}
        count={count}
        action={{
          label: t("actions.create"),
          to: "overrides/create",
        }}
        queryObject={raw}
        prefix={PREFIX}
      >
        <Heading level="h2">{t("taxRegions.taxOverrides.header")}</Heading>
      </TaxOverrideTable>
    </Container>
  )
}
