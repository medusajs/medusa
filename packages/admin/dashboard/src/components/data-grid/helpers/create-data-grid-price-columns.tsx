import { HttpTypes } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { TFunction } from "i18next"
import { FieldPath, FieldValues } from "react-hook-form"
import { IncludesTaxTooltip } from "../../common/tax-badge/tax-badge"
import { DataGridCurrencyCell } from "../components/data-grid-currency-cell"
import { DataGridReadonlyCell } from "../components/data-grid-readonly-cell"
import { FieldContext } from "../types"
import { createDataGridHelper } from "./create-data-grid-column-helper"

type CreateDataGridPriceColumnsProps<
  TData,
  TFieldValues extends FieldValues
> = {
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
  isReadyOnly?: (context: FieldContext<TData>) => boolean
  getFieldName: (
    context: FieldContext<TData>,
    value: string
  ) => FieldPath<TFieldValues> | null
  t: TFunction
}

export const createDataGridPriceColumns = <
  TData,
  TFieldValues extends FieldValues
>({
  currencies,
  regions,
  pricePreferences,
  isReadyOnly,
  getFieldName,
  t,
}: CreateDataGridPriceColumnsProps<TData, TFieldValues>): ColumnDef<
  TData,
  unknown
>[] => {
  const columnHelper = createDataGridHelper<TData, TFieldValues>()

  return [
    ...(currencies?.map((currency) => {
      const preference = pricePreferences?.find(
        (p) => p.attribute === "currency_code" && p.value === currency
      )

      const translatedCurrencyName = t("fields.priceTemplate", {
        regionOrCurrency: currency.toUpperCase(),
      })

      return columnHelper.column({
        id: `currency_prices.${currency}`,
        name: t("fields.priceTemplate", {
          regionOrCurrency: currency.toUpperCase(),
        }),
        field: (context) => {
          const isReadyOnlyValue = isReadyOnly?.(context)

          if (isReadyOnlyValue) {
            return null
          }

          return getFieldName(context, currency)
        },
        type: "number",
        header: () => (
          <div className="flex w-full items-center justify-between gap-3">
            <span className="truncate" title={translatedCurrencyName}>
              {translatedCurrencyName}
            </span>
            <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
          </div>
        ),
        cell: (context) => {
          if (isReadyOnly?.(context)) {
            return <DataGridReadonlyCell context={context} />
          }

          return <DataGridCurrencyCell code={currency} context={context} />
        },
      })
    }) ?? []),
    ...(regions?.map((region) => {
      const preference = pricePreferences?.find(
        (p) => p.attribute === "region_id" && p.value === region.id
      )

      const translatedRegionName = t("fields.priceTemplate", {
        regionOrCurrency: region.name,
      })

      return columnHelper.column({
        id: `region_prices.${region.id}`,
        name: t("fields.priceTemplate", {
          regionOrCurrency: region.name,
        }),
        field: (context) => {
          const isReadyOnlyValue = isReadyOnly?.(context)

          if (isReadyOnlyValue) {
            return null
          }

          return getFieldName(context, region.id)
        },
        type: "number",
        header: () => (
          <div className="flex w-full items-center justify-between gap-3">
            <span className="truncate" title={translatedRegionName}>
              {translatedRegionName}
            </span>
            <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
          </div>
        ),
        cell: (context) => {
          if (isReadyOnly?.(context)) {
            return <DataGridReadonlyCell context={context} />
          }

          const currency = currencies?.find((c) => c === region.currency_code)
          if (!currency) {
            return null
          }

          return (
            <DataGridCurrencyCell
              code={region.currency_code}
              context={context}
            />
          )
        },
      })
    }) ?? []),
  ]
}
