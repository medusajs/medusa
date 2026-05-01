import { HttpTypes } from "@medusajs/types"
import { useEffect, useState, useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { DataGrid } from "../../../../../components/data-grid"
import {
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../../components/modals"
import { useProducts } from "../../../../../hooks/api/products"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import { PriceListCreateProductVariantsSchema } from "../../../common/schemas"
import { isProductRow } from "../../../common/utils"
import { PricingCreateSchemaType } from "./schema"
import { QuantityPriceForm } from "../../../common/components/quantity-price-form/quantity-price-form"
import {
  getCurrencyDecimalDigits,
  getCurrencySymbol,
} from "../../../../../lib/data/currencies"

const QUANTITY_PRICE_MODAL_ID = "quantity-price-form"

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
  const [editingCell, setEditingCell] = useState<{
    variantId: string
    currencyCode: string
    regionId?: string
    productId: string
  } | null>(null)

  const { getIsOpen, setIsOpen } = useStackedModal()

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

  const editingProduct = editingCell
    ? products?.find((p) =>
        p.variants?.some((v) => v.id === editingCell.variantId)
      )
    : null

  const editingCurrency = editingCell
    ? currencies.find((c) => c.currency_code === editingCell.currencyCode)
    : null

  const { setCloseOnEscape } = useRouteModal()

  const { setValue } = form

  const handlePriceCellClick = (context: any, currencyCode: string) => {
    const entity = context.row.original
    if (isProductRow(entity)) {
      return
    }

    const isRegionPrice = context.column.id?.startsWith("region_prices")
    const regionId = isRegionPrice
      ? context.column.id?.split(".")[1]
      : undefined

    setEditingCell({
      variantId: entity.id,
      currencyCode,
      regionId,
      productId: entity.product_id,
    })
    setIsOpen(QUANTITY_PRICE_MODAL_ID, true)
  }

  const handleCloseQuantityModal = () => {
    setIsOpen(QUANTITY_PRICE_MODAL_ID, false)
    setEditingCell(null)
  }

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
    onPriceCellClick: handlePriceCellClick,
  })

  if (isError) {
    throw error
  }

  return (
    <StackedFocusModal
      id={QUANTITY_PRICE_MODAL_ID}
      onOpenChangeCallback={(open) => {
        if (!open) {
          setEditingCell(null)
        }
      }}
    >
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
          disableInteractions={getIsOpen(QUANTITY_PRICE_MODAL_ID)}
        />
      </div>

      {editingCell && editingCurrency && editingProduct && (
        <QuantityPriceForm
          info={{
            currency: {
              code: editingCurrency.currency_code,
              name: editingProduct?.title || "Product",
              symbol_native: getCurrencySymbol(editingCurrency.currency_code),
              decimal_digits: getCurrencyDecimalDigits(
                editingCurrency.currency_code
              ),
            },
            name: editingProduct?.title || "Product",
            prices:
              (form.getValues("products") as any)?.[editingCell.productId]
                ?.variants?.[editingCell.variantId]?.[
                editingCell.regionId ? "region_prices" : "currency_prices"
              ]?.[editingCell.regionId || editingCell.currencyCode] || [],
          }}
          onClose={handleCloseQuantityModal}
          onSave={(prices) => {
            if (editingProduct) {
              const path = editingCell.regionId
                ? `products.${editingCell.productId}.variants.${editingCell.variantId}.region_prices.${editingCell.regionId}`
                : `products.${editingCell.productId}.variants.${editingCell.variantId}.currency_prices.${editingCell.currencyCode}`
              setValue(path as any, prices)
            }
            handleCloseQuantityModal()
          }}
        />
      )}
    </StackedFocusModal>
  )
}
