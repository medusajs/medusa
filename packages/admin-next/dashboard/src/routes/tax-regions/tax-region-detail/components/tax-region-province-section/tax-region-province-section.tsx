import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useTaxRegions } from "../../../../../hooks/api/tax-regions"
import { useTaxRegionTableQuery } from "../../../../../hooks/table/query/use-tax-region-table-query"
import { getCountryProvinceObjectByIso2 } from "../../../../../lib/data/country-states"
import { TaxRegionTable } from "../../../common/components/tax-region-table"
import { useTaxRegionTable } from "../../../common/hooks/use-tax-region-table"

const PAGE_SIZE = 10
const PREFIX = "p"

type TaxRateListProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

export const TaxRegionProvinceSection = ({ taxRegion }: TaxRateListProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useTaxRegionTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { tax_regions, count, isPending, isError, error } = useTaxRegions(
    {
      ...searchParams,
      parent_id: taxRegion.id,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const { table } = useTaxRegionTable({
    count,
    data: tax_regions,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const provinceObject = getCountryProvinceObjectByIso2(taxRegion.country_code!)

  if (!provinceObject) {
    return null
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <TaxRegionTable
        variant="province"
        action={{ to: `provinces/create`, label: t("actions.create") }}
        table={table}
        isPending={isPending}
        queryObject={raw}
        count={count}
      >
        <Heading level="h2">
          {t(`taxRegions.${provinceObject?.type!}.header`)}
        </Heading>
      </TaxRegionTable>
    </Container>
  )
}
