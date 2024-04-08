import { useEffect } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import { useProducts } from "../../../../../hooks/api/products"
import { useStore } from "../../../../../hooks/api/store"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import { PricingVariantsRecordType } from "../../../common/schemas"
import { isProductRow } from "../../../common/utils"
import { PricingCreateSchemaType } from "./schema"

type PricingPricesFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

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
      limit: store?.supported_currency_codes?.length,
    },
    {
      enabled: !!store,
    }
  )

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
        if (existingProducts[product.id] || !product.variants) {
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

  const columns = usePriceListGridColumns({
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

  if (isCurrencyError) {
    throw currencyError
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        columns={columns}
        data={products}
        getSubRows={(row) => {
          if (isProductRow(row)) {
            return row.variants
          }
        }}
        isLoading={initializing}
        state={form}
      />
    </div>
  )
}
