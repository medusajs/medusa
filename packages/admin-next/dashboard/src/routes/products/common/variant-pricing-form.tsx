import { CurrencyDTO, HttpTypes } from "@medusajs/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { DataGrid } from "../../../components/grid/data-grid"
import { CurrencyCell } from "../../../components/grid/grid-cells/common/currency-cell"
import { ReadonlyCell } from "../../../components/grid/grid-cells/common/readonly-cell"
import { DataGridMeta } from "../../../components/grid/types"
import { useCurrencies } from "../../../hooks/api/currencies"
import { useStore } from "../../../hooks/api/store"
import { ProductCreateSchema } from "../product-create/constants"
import { useRegions } from "../../../hooks/api/regions.tsx"
import { IncludesTaxTooltip } from "../../../components/common/tax-badge/tax-badge.tsx"
import { usePricePreferences } from "../../../hooks/api/price-preferences.tsx"

type VariantPricingFormProps = {
  form: UseFormReturn<ProductCreateSchema>
}

export const VariantPricingForm = ({ form }: VariantPricingFormProps) => {
  const { store, isLoading: isStoreLoading } = useStore()
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies(
    {
      code: store?.supported_currencies?.map((c) => c.currency_code),
      limit: store?.supported_currencies?.length,
    },
    {
      enabled: !!store,
    }
  )

  const { regions } = useRegions({ limit: 9999 })

  const { price_preferences: pricePreferences } = usePricePreferences({})

  const columns = useVariantPriceGridColumns({
    currencies,
    regions,
    pricePreferences,
  })

  const variants = useWatch({
    control: form.control,
    name: "variants",
  }) as any

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        columns={columns}
        data={variants}
        isLoading={isStoreLoading || isCurrenciesLoading}
        state={form}
      />
    </div>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProductVariant>()

export const useVariantPriceGridColumns = ({
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  currencies?: CurrencyDTO[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<HttpTypes.AdminProductVariant>[] = useMemo(() => {
    return [
      columnHelper.display({
        id: t("fields.title"),
        header: t("fields.title"),
        cell: ({ row }) => {
          const entity = row.original
          return (
            <ReadonlyCell>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </ReadonlyCell>
          )
        },
      }),
      ...currencies.map((currency) => {
        const preference = pricePreferences.find(
          (p) => p.attribute === "currency_code" && p.value === currency.code
        )

        return columnHelper.display({
          id: currency.code,
          header: () => (
            <div className="flex w-full items-center justify-between gap-3">
              {t("fields.priceTemplate", {
                regionOrCurrency: currency.code.toUpperCase(),
              })}
              <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
            </div>
          ),
          cell: ({ row, table }) => {
            return (
              <CurrencyCell
                currency={currency}
                meta={table.options.meta as DataGridMeta}
                field={`variants.${row.index}.prices.${currency.code}`}
              />
            )
          },
        })
      }),
      ...regions.map((region) => {
        const preference = pricePreferences.find(
          (p) => p.attribute === "region_id" && p.value === region.id
        )

        return columnHelper.display({
          id: region.id,
          header: () => (
            <div className="flex w-full items-center justify-between gap-3">
              {t("fields.priceTemplate", {
                regionOrCurrency: region.name,
              })}
              <IncludesTaxTooltip includesTax={preference?.is_tax_inclusive} />
            </div>
          ),
          cell: ({ row, table }) => {
            const currency = currencies.find(
              (c) => c.code === region.currency_code
            )

            if (!currency) {
              return null
            }

            return (
              <CurrencyCell
                currency={currency}
                meta={table.options.meta as DataGridMeta}
                field={`variants.${row.index}.prices.${region.id}`}
              />
            )
          },
        })
      }),
    ]
  }, [t, currencies, regions, pricePreferences])

  return colDefs
}
