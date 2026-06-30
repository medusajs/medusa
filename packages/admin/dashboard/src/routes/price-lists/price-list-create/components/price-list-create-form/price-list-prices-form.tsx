import { HttpTypes } from "@medusajs/types"
import { useEffect, useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { DataGrid } from "../../../../../components/data-grid"
import { useRouteModal } from "../../../../../components/modals"
import { useProducts } from "../../../../../hooks/api/products"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import { PriceListCreateProductVariantsSchema } from "../../../common/schemas"
import { isProductRow } from "../../../common/utils"
import { PricingCreateSchemaType } from "./schema"
import { QuantityPriceModal } from "../../../common/components/quantity-price-modal/quantity-price-modal"

type PriceListPricesFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
  currencies: HttpTypes.AdminStoreCurrency[]
  regions: HttpTypes.AdminRegion[]
  pricePreferences: HttpTypes.AdminPricePreference[]
}

export const PriceListPricesForm = ({
  form,
  currencies,
  regions,
  pricePreferences,
}: PriceListPricesFormProps) => {
  const ids = useWatch({
    control: form.control,
    name: "product_ids",
  })

  const existingProducts = useWatch({
    control: form.control,
    name: "products",
  })

  const productIds = useMemo(() => ids.map((id) => id.id), [ids])

  const { products, isLoading, isError, error } = useProducts({
    id: productIds,
    limit: productIds.length,
    fields:
      "title,thumbnail,*variants,-type,-collection,-options,-tags,-images,-sales_channels",
  })

  const { setCloseOnEscape } = useRouteModal()

  const { setValue } = form

  useEffect(() => {
    if (!isLoading && products) {
      products.forEach((product) => {
        /**
         * If the product already exists in the form, we don't want to overwrite it.
         */
        if (existingProducts?.[product.id] || !product.variants) {
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
    <QuantityPriceModal form={form} products={products} regions={regions}>
      {({ isModalOpen }) => (
        <div className="flex size-full flex-col divide-y overflow-hidden">
          <DataGrid
            isLoading={isLoading}
            columns={columns}
            data={products}
            getSubRows={(row) => {
              if (isProductRow(row) && row.variants) {
                return row.variants
              }
            }}
            state={form}
            onEditingChange={(editing) => setCloseOnEscape(!editing)}
            disableInteractions={isModalOpen}
          />
        </div>
      )}
    </QuantityPriceModal>
  )
}
