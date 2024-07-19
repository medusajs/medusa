import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useBatchPriceListPrices } from "../../../../../hooks/api/price-lists"
import { castNumber } from "../../../../../lib/cast-number"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import {
  PriceListUpdateProductVariantsSchema,
  PriceListUpdateProductsSchema,
} from "../../../common/schemas"
import { isProductRow } from "../../../common/utils"

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
  const { handleSuccess } = useRouteModal()

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
      <form onSubmit={handleSubmit} className="flex size-full flex-col">
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
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
      </form>
    </RouteFocusModal.Form>
  )
}

function initRecord(
  priceList: HttpTypes.AdminPriceList,
  products: HttpTypes.AdminProduct[]
): PriceListUpdateProductsSchema {
  const record: PriceListUpdateProductsSchema = {}

  const variantPrices = priceList.prices?.reduce((variants, price) => {
    const variantObject = variants[price.variant_id] || {}

    const isRegionPrice = !!price.rules?.region_id

    if (isRegionPrice) {
      const regionId = price.rules.region_id as string

      variantObject.region_prices = {
        ...variantObject.region_prices,
        [regionId]: {
          amount: price.amount.toString(),
          id: price.id,
        },
      }
    } else {
      variantObject.currency_prices = {
        ...variantObject.currency_prices,
        [price.currency_code]: {
          amount: price.amount.toString(),
          id: price.id,
        },
      }
    }

    variants[price.variant_id] = variantObject
    return variants
  }, {} as PriceListUpdateProductVariantsSchema)

  for (const product of products) {
    record[product.id] = {
      variants:
        product.variants?.reduce((variants, variant) => {
          const prices = variantPrices[variant.id] || {}
          variants[variant.id] = prices

          return variants
        }, {} as PriceListUpdateProductVariantsSchema) || {},
    }
  }

  return record
}

type PriceObject = {
  variantId: string
  currencyCode: string
  regionId?: string
  amount: number
  id?: string | null
}

function convertToPriceArray(
  data: PriceListUpdateProductsSchema,
  regions: HttpTypes.AdminRegion[]
) {
  const prices: PriceObject[] = []

  const regionCurrencyMap = regions.reduce((map, region) => {
    map[region.id] = region.currency_code
    return map
  }, {} as Record<string, string>)

  for (const [_productId, product] of Object.entries(data || {})) {
    const { variants } = product || {}

    for (const [variantId, variant] of Object.entries(variants || {})) {
      const { currency_prices: currencyPrices, region_prices: regionPrices } =
        variant || {}

      for (const [currencyCode, currencyPrice] of Object.entries(
        currencyPrices || {}
      )) {
        if (currencyPrice?.amount) {
          prices.push({
            variantId,
            currencyCode,
            amount: castNumber(currencyPrice.amount),
            id: currencyPrice.id,
          })
        }
      }

      for (const [regionId, regionPrice] of Object.entries(
        regionPrices || {}
      )) {
        if (regionPrice?.amount) {
          prices.push({
            variantId,
            regionId,
            currencyCode: regionCurrencyMap[regionId],
            amount: castNumber(regionPrice.amount),
            id: regionPrice.id,
          })
        }
      }
    }
  }

  return prices
}

function createMapKey(obj: PriceObject) {
  return `${obj.variantId}-${obj.currencyCode}-${obj.regionId || "none"}-${
    obj.id || "none"
  }`
}

function comparePrices(initialPrices: PriceObject[], newPrices: PriceObject[]) {
  const pricesToUpdate: HttpTypes.AdminUpdatePriceListPrice[] = []
  const pricesToCreate: HttpTypes.AdminCreatePriceListPrice[] = []
  const pricesToDelete: string[] = []

  const initialPriceMap = initialPrices.reduce((map, price) => {
    map[createMapKey(price)] = price
    return map
  }, {} as Record<string, (typeof initialPrices)[0]>)

  const newPriceMap = newPrices.reduce((map, price) => {
    map[createMapKey(price)] = price
    return map
  }, {} as Record<string, (typeof newPrices)[0]>)

  const keys = new Set([
    ...Object.keys(initialPriceMap),
    ...Object.keys(newPriceMap),
  ])

  for (const key of keys) {
    const initialPrice = initialPriceMap[key]
    const newPrice = newPriceMap[key]

    if (initialPrice && newPrice) {
      if (isNaN(newPrice.amount) && newPrice.id) {
        pricesToDelete.push(newPrice.id)
      }

      if (initialPrice.amount !== newPrice.amount && newPrice.id) {
        pricesToUpdate.push({
          id: newPrice.id,
          variant_id: newPrice.variantId,
          currency_code: newPrice.currencyCode,
          rules: newPrice.regionId
            ? { region_id: newPrice.regionId }
            : undefined,
          amount: newPrice.amount,
        })
      }
    }

    if (!initialPrice && newPrice) {
      pricesToCreate.push({
        variant_id: newPrice.variantId,
        currency_code: newPrice.currencyCode,
        rules: newPrice.regionId ? { region_id: newPrice.regionId } : undefined,
        amount: newPrice.amount,
      })
    }

    if (initialPrice && !newPrice && initialPrice.id) {
      pricesToDelete.push(initialPrice.id)
    }
  }

  return { pricesToDelete, pricesToCreate, pricesToUpdate }
}

function sortPrices(
  data: PriceListUpdateProductsSchema,
  initialValue: PriceListUpdateProductsSchema,
  regions: HttpTypes.AdminRegion[]
) {
  const initialPrices = convertToPriceArray(initialValue, regions)
  const newPrices = convertToPriceArray(data, regions)

  return comparePrices(initialPrices, newPrices)
}
