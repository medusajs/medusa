import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { RouteDrawer } from "../../../components/modals"
import { useTaxRate } from "../../../hooks/api/tax-rates"
import { RuleReferenceType } from "../common/constants"
import { Target } from "../common/schemas"
import { TaxRegionTaxOverrideEditForm } from "./components/tax-region-tax-override-edit-form"

export const TaxRegionTaxOverrideEdit = () => {
  const { t } = useTranslation()
  const { tax_rate_id } = useParams()

  const { tax_rate, isPending, isError, error } = useTaxRate(tax_rate_id!)

  const ready = !isPending && !!tax_rate

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("taxRegions.taxOverrides.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("taxRegions.taxOverrides.edit.hint")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && (
        <TaxRegionTaxOverrideEditForm taxRate={tax_rate} isCombinable={true} />
      )}
    </RouteDrawer>
  )
}

const useDefaultRulesValues = (taxRate: HttpTypes.AdminTaxRate): Target[] => {
  const rules = taxRate.rules || []

  return rules.map((rule) => {
    return {
      reference_type: rule.reference as RuleReferenceType,
      references: [{ label: "Value", value: rule.reference_id }],
    }
  })
}
