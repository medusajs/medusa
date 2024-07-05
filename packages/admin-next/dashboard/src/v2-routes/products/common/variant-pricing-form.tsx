import { UseFormReturn, useWatch } from "react-hook-form"
import { CreateProductSchemaType } from "../product-create/schema"
import { DataGrid } from "../../../components/grid/data-grid"
import { useCurrencies } from "../../../hooks/api/currencies"
import { useStore } from "../../../hooks/api/store"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { CurrencyDTO, ProductVariantDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"
import { ReadonlyCell } from "../../../components/grid/grid-cells/common/readonly-cell"
import { CurrencyCell } from "../../../components/grid/grid-cells/common/currency-cell"
import { DataGridMeta } from "../../../components/grid/types"

type VariantPricingFormProps = {
  form: UseFormReturn<CreateProductSchemaType>
}

export const VariantPricingForm = ({ form }: VariantPricingFormProps) => {
  const { store, isLoading: isStoreLoading } = useStore()
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies(
    {
      code: store?.supported_currency_codes,
      limit: store?.supported_currency_codes?.length,
    },
    {
      enabled: !!store,
    }
  )

  const columns = useVariantPriceGridColumns({
    currencies,
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

const columnHelper = createColumnHelper<ProductVariantDTO>()

export const useVariantPriceGridColumns = ({
  currencies = [],
}: {
  currencies?: CurrencyDTO[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<ProductVariantDTO>[] = useMemo(() => {
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
        return columnHelper.display({
          header: `Price ${currency.code.toUpperCase()}`,
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
    ]
  }, [t, currencies])

  return colDefs
}
