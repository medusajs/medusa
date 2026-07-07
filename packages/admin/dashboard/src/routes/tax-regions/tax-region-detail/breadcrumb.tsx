import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useTaxRegion } from "../../../hooks/api"
import { getCountryByIso2 } from "../../../lib/data/countries"

type TaxRegionDetailBreadcrumbProps = UIMatch<HttpTypes.AdminTaxRegionResponse>

export const TaxRegionDetailBreadcrumb = (
  props: TaxRegionDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { tax_region } = useTaxRegion(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!tax_region) {
    return null
  }

  return (
    <span>
      {getCountryByIso2(tax_region.country_code)?.display_name ||
        tax_region.country_code?.toUpperCase()}
    </span>
  )
}

export const seo = (match: UIMatch<HttpTypes.AdminTaxRegionResponse>) => {
  const taxRegion = match.data?.tax_region

  return {
    title: taxRegion
      ? getCountryByIso2(taxRegion.country_code)?.display_name ||
        taxRegion.country_code?.toUpperCase()
      : undefined,
  }
}
