import { HttpTypes } from "@medusajs/types"
import { ReactNode, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import {
  StackedFocusModal,
  useStackedModal,
} from "../../../../../components/modals"
import {
  getCurrencyDecimalDigits,
  getCurrencySymbol,
} from "../../../../../lib/data/currencies"
import { PriceListUpdateCurrencyPrice } from "../../schemas"
import { QuantityPriceForm } from "../quantity-price-form/quantity-price-form"
import { QuantityPriceProvider } from "../quantity-price-provider/quantity-price-provider"

const QUANTITY_PRICE_MODAL_ID = "quantity-price-modal"

type EditingCell = {
  productId: string
  variantId: string
  currencyCode: string
  regionId?: string
}

type QuantityPriceModalProps = {
  form: UseFormReturn<any>
  products?: HttpTypes.AdminProduct[]
  regions: HttpTypes.AdminRegion[]
  children: (api: { isModalOpen: boolean }) => ReactNode
}

/**
 * Wraps the price grid with everything required to edit quantity-based
 * (tiered) prices for a cell: the provider the grid cells resolve, the stacked
 * modal, and the quantity price form.
 */
export const QuantityPriceModal = ({
  form,
  products = [],
  regions,
  children,
}: QuantityPriceModalProps) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const { getIsOpen, setIsOpen } = useStackedModal()

  const isModalOpen = getIsOpen(QUANTITY_PRICE_MODAL_ID)

  const handleOpen = ({ field }: { field: string }) => {
    const parts = field.split(".")

    if (parts.length < 6) {
      return
    }

    const productId = parts[1]
    const variantId = parts[3]
    const type = parts[4]
    const code = parts[5]

    const isRegion = type === "region_prices"
    const currencyCode = isRegion
      ? regions.find((r) => r.id === code)?.currency_code ?? code
      : code

    setEditingCell({
      productId,
      variantId,
      currencyCode,
      regionId: isRegion ? code : undefined,
    })
    setIsOpen(QUANTITY_PRICE_MODAL_ID, true)
  }

  const handleClose = () => {
    setIsOpen(QUANTITY_PRICE_MODAL_ID, false)
    setEditingCell(null)
  }

  const editingProduct = editingCell
    ? products.find((p) =>
        p.variants?.some((v) => v.id === editingCell.variantId)
      )
    : undefined

  const editingVariant = editingProduct?.variants?.find(
    (v) => v.id === editingCell?.variantId
  )

  const conditionalPath = editingCell
    ? `products.${editingCell.productId}.variants.${editingCell.variantId}.${
        editingCell.regionId
          ? "conditional_region_prices"
          : "conditional_currency_prices"
      }.${editingCell.regionId ?? editingCell.currencyCode}`
    : null

  const columnLabel = editingCell
    ? editingCell.regionId
      ? regions.find((r) => r.id === editingCell.regionId)?.name ??
        editingCell.regionId
      : editingCell.currencyCode.toUpperCase()
    : ""

  const entityLabel =
    [editingProduct?.title, editingVariant?.title]
      .filter(Boolean)
      .join(" - ") || "Product"

  const name = editingCell ? `${entityLabel} (${columnLabel})` : "Product"

  return (
    <QuantityPriceProvider
      onOpenQuantityPricesModal={handleOpen}
      onCloseQuantityPricesModal={handleClose}
    >
      <StackedFocusModal
        id={QUANTITY_PRICE_MODAL_ID}
        onOpenChangeCallback={(open) => {
          if (!open) {
            setEditingCell(null)
          }
        }}
      >
        {children({ isModalOpen })}

        {editingCell && conditionalPath && (
          <QuantityPriceForm
            info={{
              currency: {
                code: editingCell.currencyCode,
                name,
                symbol_native: getCurrencySymbol(editingCell.currencyCode),
                decimal_digits: getCurrencyDecimalDigits(
                  editingCell.currencyCode
                ),
              },
              name,
              prices:
                (form.getValues(
                  conditionalPath
                ) as PriceListUpdateCurrencyPrice[]) || [],
            }}
            onClose={handleClose}
            onSave={(prices) => {
              form.setValue(conditionalPath, prices, { shouldDirty: true })
              handleClose()
            }}
          />
        )}
      </StackedFocusModal>
    </QuantityPriceProvider>
  )
}
