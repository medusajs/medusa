import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { getPriceColumns } from "../../../components/data-grid/data-grid-columns/price-columns"
import { DataGridRoot } from "../../../components/data-grid/data-grid-root/data-grid-root"
import { createDataGridHelper } from "../../../components/data-grid/utils.ts"
import { ReadonlyCell } from "../../../components/grid/grid-cells/common/readonly-cell"
import { usePricePreferences } from "../../../hooks/api/price-preferences"
import { useRegions } from "../../../hooks/api/regions.tsx"
import { useStore } from "../../../hooks/api/store"
import { ProductCreateSchemaType } from "../product-create/types.ts"

type VariantPricingFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const VariantPricingForm = ({ form }: VariantPricingFormProps) => {
  const { store } = useStore()
  const { regions } = useRegions({ limit: 9999 })

  const { price_preferences: pricePreferences } = usePricePreferences({})

  const columns = useVariantPriceGridColumns({
    currencies: store?.supported_currencies,
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
  currencies?: HttpTypes.AdminStore["supported_currencies"]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      columnHelper.column({
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
        disableHiding: true,
      }),
      ...getPriceColumns({
        currencies: currencies.map((c) => c.currency_code),
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
}
