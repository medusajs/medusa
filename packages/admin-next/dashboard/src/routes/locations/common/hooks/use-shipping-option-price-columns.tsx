import { HttpTypes } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataGridCurrencyCell } from "../../../../components/data-grid/data-grid-cells/data-grid-currency-cell"
import { createDataGridHelper } from "../../../../components/data-grid/utils"
import { IncludesTaxTooltip } from "../../../../components/common/tax-badge/tax-badge"

const columnHelper = createDataGridHelper<string | HttpTypes.AdminRegion>()

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
    return [
      ...currencies.map((currency) => {
        const preference = pricePreferences.find(
          (p) => p.attribute === "currency_code" && p.value === currency
        )

        return columnHelper.column({
          id: `currency_prices.${currency}`,
          name: t("fields.priceTemplate", {
            regionOrCurrency: currency.toUpperCase(),
          }),
          header: () => (
            <div className="flex w-full items-center justify-between gap-3">
              {t("fields.priceTemplate", {
                regionOrCurrency: currency.toUpperCase(),
              })}
              <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
            </div>
          ),
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
        const preference = pricePreferences.find(
          (p) => p.attribute === "region_id" && p.value === region.id
        )

        return columnHelper.column({
          id: `region_prices.${region.id}`,
          name: t("fields.priceTemplate", {
            regionOrCurrency: region.name,
          }),
          header: () => (
            <div className="flex w-full items-center justify-between gap-3">
              {t("fields.priceTemplate", {
                regionOrCurrency: region.name,
              })}
              <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
            </div>
          ),
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
  }, [t, currencies, regions, pricePreferences])
}
