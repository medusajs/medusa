import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"

import { useTaxRegion } from "../../../hooks/api"
import {
  getProvinceByIso2,
  isProvinceInCountry,
} from "../../../lib/data/country-states"

type TaxRegionDetailBreadcrumbProps = UIMatch<HttpTypes.AdminTaxRegionResponse>

export const TaxRegionDetailBreadcrumb = (
  props: TaxRegionDetailBreadcrumbProps
) => {
  const { province_id } = props.params || {}

  const { tax_region } = useTaxRegion(province_id!, undefined, {
    initialData: props.data,
    enabled: Boolean(province_id),
  })

  if (!tax_region) {
    return null
  }

  const countryCode = tax_region.country_code?.toUpperCase()
  const provinceCode = tax_region.province_code?.toUpperCase()

  const isValid = isProvinceInCountry(countryCode, provinceCode)

  return <span>{isValid ? getProvinceByIso2(provinceCode) : provinceCode}</span>
}
