import { HttpTypes } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataGridCurrencyCell } from "../../../../components/data-grid/data-grid-cells/data-grid-currency-cell"
import { createDataGridHelper } from "../../../../components/data-grid/utils"

const columnHelper = createDataGridHelper<string | HttpTypes.AdminRegion>()

export const useShippingOptionPriceColumns = ({
  currencies = [],
  regions = [],
}: {
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
}) => {
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      ...currencies.map((currency) => {
        return columnHelper.column({
          id: `currency_prices.${currency}`,
          name: t("fields.priceTemplate", {
            regionOrCountry: currency.toUpperCase(),
          }),
          header: t("fields.priceTemplate", {
            regionOrCountry: currency.toUpperCase(),
          }),
          cell: (context) => {
            return (
              <DataGridCurrencyCell
                code={currency}
                context={context}
                field={`currency_prices.${currency}`}
              />
            )
          },
        })
      }),
      ...regions.map((region) => {
        return columnHelper.column({
          id: `region_prices.${region.id}`,
          name: t("fields.priceTemplate", {
            regionOrCountry: region.name,
          }),
          header: t("fields.priceTemplate", {
            regionOrCountry: region.name,
          }),
          cell: (context) => {
            return (
              <DataGridCurrencyCell
                code={region.currency_code}
                context={context}
                field={`region_prices.${region.id}`}
              />
            )
          },
        })
      }),
    ] as ColumnDef<(string | HttpTypes.AdminRegion)[]>[]
  }, [t, currencies, regions])
}
