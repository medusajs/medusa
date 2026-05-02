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
import { QuantityPriceProvider } from "../../../common/components/quantity-price-provider/quantity-price-provider"
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

  const handleOpenQuantityPricesModal = ({ field }: { field: string }) => {
    const parts = field.split(".")
    const productId = parts[1]
    const variantId = parts[3]
    const type = parts[4]
    const code = parts[5]

    const currencyCode =
      type === "region_prices"
        ? regions.find((r) => r.id === code)?.currency_code
        : code

    setEditingCell({
      variantId,
      currencyCode,
      regionId: type === "region_prices" ? code : undefined,
      productId,
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

  const handlePriceCellClick = () => {}

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
    <QuantityPriceProvider
      onOpenQuantityPricesModal={handleOpenQuantityPricesModal}
      onCloseQuantityPricesModal={handleCloseQuantityModal}
    >
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
                  editingCell.regionId
                    ? "conditional_region_prices"
                    : "conditional_currency_prices"
                ]?.[editingCell.regionId || editingCell.currencyCode] || [],
            }}
            onClose={handleCloseQuantityModal}
            onSave={(prices) => {
              if (editingProduct) {
                const path = editingCell.regionId
                  ? `products.${editingCell.productId}.variants.${editingCell.variantId}.conditional_region_prices.${editingCell.regionId}`
                  : `products.${editingCell.productId}.variants.${editingCell.variantId}.conditional_currency_prices.${editingCell.currencyCode}`
                setValue(path as any, prices)
              }
              handleCloseQuantityModal()
            }}
          />
        )}
      </StackedFocusModal>
    </QuantityPriceProvider>
  )
}
