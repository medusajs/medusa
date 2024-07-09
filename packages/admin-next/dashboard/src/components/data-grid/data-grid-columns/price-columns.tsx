import { HttpTypes } from "@medusajs/types"
import { DataGridCurrencyCell } from "../data-grid-cells/data-grid-currency-cell"
import { createDataGridHelper } from "../utils"
import { IncludesTaxTooltip } from "../../../components/common/tax-badge/tax-badge"
import { TFunction } from "i18next"
import { CellContext } from "@tanstack/react-table"
import { DataGridReadOnlyCell } from "../data-grid-cells/data-grid-readonly-cell"

const columnHelper = createDataGridHelper<string | HttpTypes.AdminRegion>()

export const getPriceColumns = ({
  currencies,
  regions,
  pricePreferences,
  isReadyOnly,
  getFieldName,
  t,
}: {
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
  isReadyOnly?: (
    context: CellContext<string | HttpTypes.AdminRegion, unknown>
  ) => boolean
  getFieldName: (
    context: CellContext<string | HttpTypes.AdminRegion, unknown>,
    value: string
  ) => string
  t: TFunction
}) => {
  return [
    ...(currencies?.map((currency) => {
      const preference = pricePreferences?.find(
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
          if (isReadyOnly?.(context)) {
            return <DataGridReadOnlyCell />
          }

          return (
            <DataGridCurrencyCell
              code={currency}
              context={context}
              field={getFieldName(context, currency)}
            />
          )
        },
      })
    }) ?? []),
    ...(regions?.map((region) => {
      const preference = pricePreferences?.find(
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
          if (isReadyOnly?.(context)) {
            return <DataGridReadOnlyCell />
          }

          const currency = currencies?.find((c) => c === region.currency_code)
          if (!currency) {
            return null
          }

          return (
            <DataGridCurrencyCell
              code={region.currency_code}
              context={context}
              field={getFieldName(context, region.id)}
            />
          )
        },
      })
    }) ?? []),
  ]
}
