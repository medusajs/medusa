import { CurrencyDTO, ProductVariantDTO } from "@medusajs/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { CurrencyCell } from "../../../../../components/grid/grid-cells/common/currency-cell"
import { ReadonlyCell } from "../../../../../components/grid/grid-cells/common/readonly-cell"
import { VoidCell } from "../../../../../components/grid/grid-cells/common/void-cell"
import { DataGridMeta } from "../../../../../components/grid/types"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import { useProducts } from "../../../../../hooks/api/products"
import { useStore } from "../../../../../hooks/api/store"
import { ExtendedProductDTO } from "../../../../../types/api-responses"
import { PricingCreateSchemaType, PricingVariantsRecordType } from "./schema"

type PricingPricesFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

enum ColumnType {
  REGION = "region",
  CURRENCY = "currency",
}

type EnabledColumnRecord = Record<string, ColumnType>

export const PricingPricesForm = ({ form }: PricingPricesFormProps) => {
  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()
  const {
    currencies,
    isLoading: isCurrenciesLoading,
    isError: isCurrencyError,
    error: currencyError,
  } = useCurrencies(
    {
      code: store?.supported_currency_codes,
    },
    {
      enabled: !!store,
    }
  )

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

  const ids = useWatch({
    control: form.control,
    name: "product_ids",
  })

  const existingProducts = useWatch({
    control: form.control,
    name: "products",
  })

  const { products, isLoading, isError, error } = useProducts({
    id: ids.map((id) => id.id),
    limit: ids.length,
    fields: "title,thumbnail,*variants",
  })

  const { setValue } = form

  useEffect(() => {
    if (!isLoading && products) {
      products.forEach((product) => {
        /**
         * If the product already exists in the form, we don't want to overwrite it.
         */
        if (existingProducts[product.id]) {
          return
        }

        setValue(`products.${product.id}.variants`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id] = {
              currency_prices: {},
              region_prices: {},
            }
            return variants
          }, {} as PricingVariantsRecordType),
        })
      })
    }
  }, [products, existingProducts, isLoading, setValue])

  const columns = useColumns({
    currencies,
  })

  const initializing =
    isLoading ||
    isStoreLoading ||
    isCurrenciesLoading ||
    !products ||
    !store ||
    !currencies

  if (isError) {
    throw error
  }

  if (isStoreError) {
    throw storeError
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        columns={columns}
        data={products}
        getSubRows={(row) => {
          if (isProduct(row)) {
            return row.variants
          }
        }}
        isLoading={initializing}
        state={form}
      />
    </div>
  )
}

const isProduct = (
  row: ExtendedProductDTO | ProductVariantDTO
): row is ExtendedProductDTO => {
  return "variants" in row
}

const columnHelper = createColumnHelper<
  ExtendedProductDTO | ProductVariantDTO
>()

const useColumns = ({ currencies = [] }: { currencies?: CurrencyDTO[] }) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<ExtendedProductDTO | ProductVariantDTO>[] =
    useMemo(() => {
      return [
        columnHelper.display({
          id: t("fields.title"),
          header: t("fields.title"),
          cell: ({ row }) => {
            const entity = row.original

            if (isProduct(entity)) {
              return (
                <VoidCell>
                  <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                    <Thumbnail src={entity.thumbnail} />
                    <span className="truncate">{entity.title}</span>
                  </div>
                </VoidCell>
              )
            }

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
              const entity = row.original

              if (isProduct(entity)) {
                return <VoidCell />
              }

              return (
                <CurrencyCell
                  currency={currency}
                  meta={
                    table.options.meta as DataGridMeta<PricingCreateSchemaType>
                  }
                  field={`products.${entity.product_id}.variants.${entity.id}.currency_prices.${currency.code}`}
                />
              )
            },
          })
        }),
      ]
    }, [t, currencies])

  return colDefs
}
