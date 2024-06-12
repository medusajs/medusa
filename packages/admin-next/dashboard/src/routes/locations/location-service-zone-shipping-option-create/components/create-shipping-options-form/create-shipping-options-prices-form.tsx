import { CurrencyDTO, HttpTypes, ProductVariantDTO } from "@medusajs/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { createDataGridHelper } from "../../../../../components/data-grid/utils"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { CurrencyCell } from "../../../../../components/grid/grid-cells/common/currency-cell"
import { DataGridMeta } from "../../../../../components/grid/types"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import { useRegions } from "../../../../../hooks/api/regions"
import { useStore } from "../../../../../hooks/api/store"
import { ExtendedProductDTO } from "../../../../../types/api-responses"

const PricingCreateSchemaType = zod.record(
  zod.object({
    currency_prices: zod.record(zod.string().optional()),
    region_prices: zod.record(zod.string().optional()),
  })
)

type PricingPricesFormProps = {
  form: UseFormReturn<typeof PricingCreateSchemaType>
}

enum ColumnType {
  REGION = "region",
  CURRENCY = "currency",
}

type EnabledColumnRecord = Record<string, ColumnType>

export const CreateShippingOptionsPricesForm = ({
  form,
}: PricingPricesFormProps) => {
  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies(
    {
      code: store?.supported_currency_codes,
    },
    {
      enabled: !!store,
    }
  )

  const { regions } = useRegions()

  const [enabledColumns, setEnabledColumns] = useState<EnabledColumnRecord>({})

  useEffect(() => {
    if (
      store?.default_currency_code &&
      Object.keys(enabledColumns).length === 0
    ) {
      setEnabledColumns({
        ...enabledColumns,
        [store.default_currency_code]: ColumnType.CURRENCY,
      })
    }
  }, [store, enabledColumns])

  const columns = useColumns({
    currencies,
    regions,
  })

  const initializing =
    isStoreLoading || isCurrenciesLoading || !store || !currencies

  if (isStoreError) {
    throw storeError
  }

  const data = useMemo(
    () => [[...(currencies || []), ...(regions || [])]],
    [currencies, regions]
  )

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        columns={columns}
        data={data}
        isLoading={initializing}
        state={form}
      />
    </div>
  )
}

const helper = createDataGridHelper()

const columnHelper = createColumnHelper<
  ExtendedProductDTO | ProductVariantDTO
>()

const useColumns = ({
  currencies = [],
  regions = [],
}: {
  currencies?: CurrencyDTO[]
  regions?: HttpTypes.AdminRegion[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<ExtendedProductDTO | ProductVariantDTO>[] =
    useMemo(() => {
      return [
        ...currencies.map((currency) => {
          return columnHelper.display({
            header: t("fields.priceTemplate", {
              regionOrCountry: currency.code.toUpperCase(),
            }),
            cell: ({ row, table }) => {
              return (
                <CurrencyCell
                  currency={currency}
                  meta={table.options.meta as DataGridMeta<any>}
                  field={`currency_prices.${currency.code}`}
                />
              )
            },
          })
        }),
        ...regions.map((region) => {
          return columnHelper.display({
            header: t("fields.priceTemplate", {
              regionOrCountry: region.name,
            }),
            cell: ({ row, table }) => {
              return (
                <CurrencyCell
                  currency={
                    currencies.find((c) => c.code === region.currency_code) || {
                      code: "USD",
                      symbol: "$",
                      name: "US Dollar",
                      symbol_native: "$",
                    }
                  }
                  meta={table.options.meta as DataGridMeta<any>}
                  field={`region_prices.${region.id}`}
                />
              )
            },
          })
        }),
      ]
    }, [t, currencies, regions])

  return colDefs
}
