import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createDataGridPriceColumns } from "../../../../components/data-grid/helpers/create-data-grid-price-columns"

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
    return createDataGridPriceColumns({
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
