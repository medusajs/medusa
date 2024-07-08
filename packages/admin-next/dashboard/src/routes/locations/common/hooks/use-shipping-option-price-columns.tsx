import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { getPriceColumns } from "../../../../components/data-grid/data-grid-columns/price-columns"

export const useShippingOptionPriceColumns = ({
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  return useMemo(() => {
    return getPriceColumns({
      currencies,
      regions,
      pricePreferences,
      getFieldName: (context, value) => {
        if (context.column.id.startsWith("currency_prices")) {
          return `currency_prices.${value}`
        }

        return `region_prices.${value}`
      },
      t,
    })
  }, [t, currencies, regions, pricePreferences])
}
