import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { useTaxRegions } from "../../../../../hooks/api/tax-regions"
import { useTaxRegionTableQuery } from "../../../../../hooks/table/query/use-tax-region-table-query"
import { TaxRegionCard } from "../../../common/components/tax-region-card"

const PAGE_SIZE = 20

export const TaxRegionListView = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useTaxRegionTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { tax_regions, count, isLoading, isError, error } = useTaxRegions(
    {
      ...searchParams,
      order: "country_code",
      parent_id: "null",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("taxes.domain")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("taxRegions.list.hint")}
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="/settings/taxes/create">{t("actions.create")}</Link>
        </Button>
      </div>
      {tax_regions?.map((taxRegion) => (
        <TaxRegionCard key={taxRegion.id} taxRegion={taxRegion} />
      ))}
    </Container>
  )
}
