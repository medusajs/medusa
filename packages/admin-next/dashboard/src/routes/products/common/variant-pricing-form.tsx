import { CurrencyDTO, HttpTypes } from "@medusajs/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ReadonlyCell } from "../../../components/grid/grid-cells/common/readonly-cell"
import { useCurrencies } from "../../../hooks/api/currencies"
import { useStore } from "../../../hooks/api/store"
import { ProductCreateSchema } from "../product-create/constants"
import { useRegions } from "../../../hooks/api/regions.tsx"
import { usePricePreferences } from "../../../hooks/api/price-preferences.tsx"
import { getPriceColumns } from "../../../components/data-grid/data-grid-columns/price-columns.tsx"
import { DataGridRoot } from "../../../components/data-grid/data-grid-root/data-grid-root.tsx"

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
      <DataGridRoot
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
