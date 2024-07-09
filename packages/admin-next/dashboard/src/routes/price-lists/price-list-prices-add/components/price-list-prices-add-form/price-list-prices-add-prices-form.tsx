import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"

import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import { useProducts } from "../../../../../hooks/api/products"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import { PriceListCreateProductVariantsSchema } from "../../../common/schemas"
import { isProductRow } from "../../../common/utils"
import { PriceListPricesAddSchema } from "./schema"

type PriceListPricesAddPricesFormProps = {
  form: UseFormReturn<PriceListPricesAddSchema>
  currencies: HttpTypes.AdminStoreCurrency[]
  regions: HttpTypes.AdminRegion[]
  pricePreferences: HttpTypes.AdminPricePreference[]
}

export const PriceListPricesAddPricesForm = ({
  form,
  currencies,
  regions,
  pricePreferences,
}: PriceListPricesAddPricesFormProps) => {
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
          }, {} as PriceListCreateProductVariantsSchema),
        })
      })
    }
  }, [products, existingProducts, isLoading, setValue])

  const columns = usePriceListGridColumns({
    currencies,
    regions,
    pricePreferences,
  })

  if (isError) {
    throw error
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
