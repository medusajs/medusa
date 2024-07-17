import { CurrencyDTO, HttpTypes } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { getPriceColumns } from "../../../components/data-grid/data-grid-columns/price-columns.tsx"
import { DataGridRoot } from "../../../components/data-grid/data-grid-root/data-grid-root.tsx"
import { createDataGridHelper } from "../../../components/data-grid/utils.ts"
import { ReadonlyCell } from "../../../components/grid/grid-cells/common/readonly-cell"
import { useCurrencies } from "../../../hooks/api/currencies"
import { usePricePreferences } from "../../../hooks/api/price-preferences.tsx"
import { useRegions } from "../../../hooks/api/regions.tsx"
import { useStore } from "../../../hooks/api/store"

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
      <DataGridRoot columns={columns} data={variants} state={form} />
    </div>
  )
}

const columnHelper = createDataGridHelper<HttpTypes.AdminProductVariant>()

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
      columnHelper.column({
        id: t("fields.title"),
        header: t("fields.title"),
        cell: ({ row }) => {
          const entity = row.original
          return (
            <ReadonlyCell>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span title={entity.title} className="truncate">
                  {entity.title}
                </span>
              </div>
            </ReadonlyCell>
          )
        },
        disableHiding: true,
      }),
      ...getPriceColumns({
        currencies: currencies.map((c) => c.code),
        regions,
        pricePreferences,
        getFieldName: (context, value) => {
          if (context.column.id.startsWith("currency_prices")) {
            return `variants.${context.row.index}.prices.${value}`
          }
          return `variants.${context.row.index}.prices.${value}`
        },
        t,
      }),
    ]
  }, [t, currencies, regions, pricePreferences])

  return colDefs
}
