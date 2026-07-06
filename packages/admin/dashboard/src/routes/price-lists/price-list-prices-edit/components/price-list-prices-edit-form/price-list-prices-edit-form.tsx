import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { DataGrid } from "../../../../../components/data-grid"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useBatchPriceListPrices } from "../../../../../hooks/api/price-lists"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import { PriceListUpdateProductsSchema } from "../../../common/schemas"
import { QuantityPriceModal } from "../../../common/components/quantity-price-modal/quantity-price-modal"
import { isProductRow, initRecord, sortPrices } from "../../../common/utils"

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

export const PriceListPricesEditForm = ({
  priceList,
  products,
  regions,
  currencies,
  pricePreferences,
}: PriceListPricesEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess, setCloseOnEscape } = useRouteModal()

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

  const columns = usePriceListGridColumns({
    currencies,
    regions,
    pricePreferences,
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex size-full flex-col">
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <QuantityPriceModal form={form} products={products} regions={regions}>
            {({ isModalOpen }) => (
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
                disableInteractions={isModalOpen}
              />
            )}
          </QuantityPriceModal>
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
