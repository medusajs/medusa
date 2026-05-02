import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { DataGrid } from "../../../../../components/data-grid"
import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useBatchPriceListPrices } from "../../../../../hooks/api/price-lists"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import { PriceListUpdateProductsSchema } from "../../../common/schemas"
import { QuantityPriceForm } from "../../../common/components/quantity-price-form/quantity-price-form"
import { QuantityPriceProvider } from "../../../common/components/quantity-price-provider/quantity-price-provider"
import { PriceListUpdateCurrencyPrice } from "../../../common/schemas"
import { isProductRow, initRecord, sortPrices } from "../../../common/utils"
import {
  getCurrencyDecimalDigits,
  getCurrencySymbol,
} from "../../../../../lib/data/currencies"

type PriceListPricesEditFormProps = {
  priceList: HttpTypes.AdminPriceList
  products: HttpTypes.AdminProduct[]
  regions: HttpTypes.AdminRegion[]
  currencies: HttpTypes.AdminStoreCurrency[]
  pricePreferences: HttpTypes.AdminPricePreference[]
}

const PricingProductPricesSchema = z.object({
  products: PriceListUpdateProductsSchema,
})

const QUANTITY_PRICE_MODAL_ID = "quantity-price-edit-form"

export const PriceListPricesEditForm = ({
  priceList,
  products,
  regions,
  currencies,
  pricePreferences,
}: PriceListPricesEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess, setCloseOnEscape } = useRouteModal()
  const { getIsOpen, setIsOpen } = useStackedModal()

  const [selectedPriceInfo, setSelectedPriceInfo] = useState<{
    productId: string
    variantId: string
    currencyCode: string
    regionId?: string
    name: string
    prices: PriceListUpdateCurrencyPrice[]
  } | null>(null)

  const initialValue = useRef(initRecord(priceList, products))

  const form = useForm<z.infer<typeof PricingProductPricesSchema>>({
    defaultValues: {
      products: initialValue.current,
    },
    resolver: zodResolver(PricingProductPricesSchema),
  })

  const { mutateAsync, isPending } = useBatchPriceListPrices(priceList.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    const { products } = values

    const { pricesToDelete, pricesToCreate, pricesToUpdate } = sortPrices(
      products,
      initialValue.current,
      regions
    )

    mutateAsync(
      {
        delete: pricesToDelete,
        update: pricesToUpdate,
        create: pricesToCreate,
      },
      {
        onSuccess: () => {
          toast.success(t("priceLists.products.edit.successToast"))

          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const handleOpenQuantityPricesModal = ({ field }: { field: string }) => {
    const parts = field.split(".")
    const productId = parts[1]
    const variantId = parts[3]
    const type = parts[4]
    const code = parts[5]

    const isRegion = type === "region_prices"
    const conditionalField = isRegion
      ? "conditional_region_prices"
      : "conditional_currency_prices"

    const prices = form.getValues(
      `products.${productId}.variants.${variantId}.${conditionalField}.${code}`
    )

    const currencyCode = isRegion
      ? regions.find((r) => r.id === code)?.currency_code ?? code
      : code

    const product = products.find((p) => p.id === productId)

    setSelectedPriceInfo({
      productId,
      variantId,
      currencyCode,
      regionId: isRegion ? code : undefined,
      name: `${product?.title || "Product"} (${code})`,
      prices: Array.isArray(prices) ? prices : prices ? [prices] : [],
    })
    setIsOpen(QUANTITY_PRICE_MODAL_ID, true)
  }

  const handlePriceCellClick = () => {}

  const handleCloseQuantityModal = () => {
    setIsOpen(QUANTITY_PRICE_MODAL_ID, false)
    setSelectedPriceInfo(null)
  }

  const handleSaveQuantityPrices = (prices: PriceListUpdateCurrencyPrice[]) => {
    const info = selectedPriceInfo
    if (!info) {
      return
    }

    const { productId, variantId, currencyCode, regionId } = info

    if (regionId) {
      form.setValue(
        `products.${productId}.variants.${variantId}.conditional_region_prices.${regionId}`,
        prices,
        { shouldDirty: true }
      )
    } else {
      form.setValue(
        `products.${productId}.variants.${variantId}.conditional_currency_prices.${currencyCode}`,
        prices,
        { shouldDirty: true }
      )
    }
    handleCloseQuantityModal()
  }

  const columns = usePriceListGridColumns({
    currencies,
    regions,
    pricePreferences,
    onPriceCellClick: handlePriceCellClick,
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex size-full flex-col">
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <QuantityPriceProvider
            onOpenQuantityPricesModal={handleOpenQuantityPricesModal}
            onCloseQuantityPricesModal={handleCloseQuantityModal}
          >
            <StackedFocusModal
              id={QUANTITY_PRICE_MODAL_ID}
              onOpenChangeCallback={(open) => {
                if (!open) {
                  setSelectedPriceInfo(null)
                }
              }}
            >
              <DataGrid
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
              {selectedPriceInfo && (
                <QuantityPriceForm
                  info={{
                    currency: {
                      code: selectedPriceInfo.currencyCode,
                      name: selectedPriceInfo?.name || "Product",
                      symbol_native: getCurrencySymbol(
                        selectedPriceInfo.currencyCode
                      ),
                      decimal_digits: getCurrencyDecimalDigits(
                        selectedPriceInfo.currencyCode
                      ),
                    },
                    name: selectedPriceInfo.name,
                    prices: selectedPriceInfo.prices,
                  }}
                  onClose={handleCloseQuantityModal}
                  onSave={handleSaveQuantityPrices}
                />
              )}
            </StackedFocusModal>
          </QuantityPriceProvider>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
