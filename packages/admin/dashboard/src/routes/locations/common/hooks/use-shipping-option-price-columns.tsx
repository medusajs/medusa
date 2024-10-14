import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  createDataGridHelper,
  DataGrid,
} from "../../../../components/data-grid"
import { createDataGridPriceColumns } from "../../../../components/data-grid/helpers/create-data-grid-price-columns"

const columnHelper = createDataGridHelper()

export const useShippingOptionPriceColumns = ({
  name,
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  name: string
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      columnHelper.column({
        id: "name",
        header: t("fields.name"),
        cell: (context) => {
          return (
            <DataGrid.ReadonlyCell context={context}>
              {name}
            </DataGrid.ReadonlyCell>
          )
        },
      }),
      ...createDataGridPriceColumns({
        currencies,
        regions,
        pricePreferences,
        getFieldName: (context, value) => {
          if (context.column.id?.startsWith("currency_prices")) {
            return `currency_prices.${value}`
          }

          return `region_prices.${value}`
        },
        t,
      }),
    ]
  }, [t, currencies, regions, pricePreferences, name])
}
