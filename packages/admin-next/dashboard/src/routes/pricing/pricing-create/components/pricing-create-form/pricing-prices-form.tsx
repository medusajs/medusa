import { useEffect } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import { useProducts } from "../../../../../hooks/api/products"
import { useRegions } from "../../../../../hooks/api/regions"
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
    isPending: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const currencies = store?.supported_currency_codes || []

  const {
    regions,
    isPending: isRegionsPending,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({
    fields: "id,name,currency_code",
    limit: 999,
  })

  console.log(regions)

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
    regions,
  })

  const initializing =
    isLoading ||
    isStoreLoading ||
    isRegionsPending ||
    !products ||
    !store ||
    !regions ||
    !currencies

  if (isError) {
    throw error
  }

  if (isStoreError) {
    throw storeError
  }

  if (isRegionsError) {
    throw regionsError
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGridRoot
        columns={columns}
        data={products}
        getSubRows={(row) => {
          if (isProductRow(row) && row.variants) {
            return row.variants
          }
        }}
        state={form}
      />
    </div>
  )
}
