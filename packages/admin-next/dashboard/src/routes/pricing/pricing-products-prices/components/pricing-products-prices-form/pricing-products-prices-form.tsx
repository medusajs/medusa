import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { UseFormReturn, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useBatchPriceListPrices } from "../../../../../hooks/api/price-lists"
import { useRegions } from "../../../../../hooks/api/regions"
import { useStore } from "../../../../../hooks/api/store"
import { castNumber } from "../../../../../lib/cast-number"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import {
  PricingProductsRecordSchema,
  PricingVariantsRecord,
} from "../../../common/schemas"
import { isProductRow } from "../../../common/utils"

type PricingProductPricesFormProps = {
  priceList: HttpTypes.AdminPriceList
  products: HttpTypes.AdminProduct[]
}

const PricingProductPricesSchema = z.object({
  products: PricingProductsRecordSchema,
})

type VariantsPriceRecord = Record<
  string,
  { currency_code: string; amount: number; id: string }[]
>

const initRecord = (
  priceList: HttpTypes.AdminPriceList
): VariantsPriceRecord => {
  const prices = priceList.prices
  const sortedPrices: VariantsPriceRecord = {}

  if (!prices) {
    return sortedPrices
  }

  prices.forEach((price) => {
    const { variant_id, currency_code, amount, id } = price

    if (!currency_code || !amount || !variant_id) {
      return
    }

    if (!sortedPrices[variant_id]) {
      sortedPrices[variant_id] = []
    }

    sortedPrices[variant_id] = [
      ...sortedPrices[variant_id],
      { currency_code, amount, id },
    ]
  })

  return sortedPrices
}

export const PricingProductPricesForm = ({
  priceList,
  products,
}: PricingProductPricesFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const record = useMemo(() => initRecord(priceList), [priceList])

  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const currencies = store?.supported_currency_codes || []

  const {
    regions,
    isPending: isRegionsLoading,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({
    fields: "id,name,currency_code",
    limit: 999,
  })

  const form = useForm<z.infer<typeof PricingProductPricesSchema>>({
    defaultValues: {
      products: {},
    },
    resolver: zodResolver(PricingProductPricesSchema),
  })

  const existingProducts = useWatch({
    control: form.control,
    name: "products",
  })

  useEffect(() => {
    initDefaultValues(products, existingProducts, form, record)
  }, [existingProducts, form, products, record])

  const { mutateAsync, isPending } = useBatchPriceListPrices(priceList.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    const { products } = values

    const { pricesToDelete, pricesToCreate, pricesToUpdate } = sortPrices(
      products,
      record
    )

    const failed = false

    // TODO: Currently not working, need to fix the API
    // await updateAsync(
    //   {
    //     // @ts-expect-error - type is wrong
    //     prices: pricesToUpdate,
    //   },
    //   {
    //     onError(error) {
    //       console.error(error)
    //       failed = true
    //     },
    //   }
    // )

    // if (failed) {
    //   return
    // }

    mutateAsync(
      {
        delete: pricesToDelete,
        update: pricesToUpdate,
        create: pricesToCreate,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissable: true,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  const columns = usePriceListGridColumns({ currencies, regions })

  const initializing = isStoreLoading || !products || !store || !currencies

  if (isStoreError) {
    throw storeError
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex size-full flex-col">
        <RouteFocusModal.Header>
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
        </RouteFocusModal.Header>
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
      </form>
    </RouteFocusModal.Form>
  )
}

function initDefaultValues(
  products: HttpTypes.AdminProduct[],
  existingProducts: any,
  form: UseFormReturn<z.infer<typeof PricingProductPricesSchema>>,
  record: VariantsPriceRecord
) {
  products.forEach((product) => {
    if (existingProducts[product.id] || !product.variants) {
      return
    }

    form.setValue(
      `products.${product.id}.variants`,
      {
        ...product.variants.reduce((variants, variant) => {
          const currencyPrices = record[variant.id] || []

          variants[variant.id] = {
            currency_prices: currencyPrices.reduce(
              (prices, { currency_code, amount, id }) => {
                prices[currency_code] = {
                  amount: amount.toString(),
                  id,
                }
                return prices
              },
              {} as Record<
                string,
                {
                  amount: string
                  id: string
                }
              >
            ),
            region_prices: {},
          }

          return variants
        }, {} as PricingVariantsRecord),
      },
      {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      }
    )
  })
}

function sortPrices(
  products: Record<
    string,
    {
      variants: Record<
        string,
        {
          currency_prices: Record<
            string,
            | { amount?: string | undefined; id?: string | null | undefined }
            | undefined
          >
          region_prices: Record<
            string,
            | { amount?: string | undefined; id?: string | null | undefined }
            | undefined
          >
        }
      >
    }
  >,
  record: VariantsPriceRecord
) {
  const pricesToUpdate: HttpTypes.AdminUpdatePriceListPrice[] = []
  const pricesToCreate: HttpTypes.AdminCreatePriceListPrice[] = []
  const pricesToDelete: string[] = []

  for (const [_productId, product] of Object.entries(products)) {
    const { variants } = product

    for (const [variantId, variant] of Object.entries(variants)) {
      const { currency_prices } = variant

      for (const [currencyCode, currencyPrice] of Object.entries(
        currency_prices
      )) {
        if (!currencyPrice) {
          continue
        }

        if (currencyPrice.id && currencyPrice.amount) {
          const originalPrice = record[variantId].find(
            (p) => p.id === currencyPrice.id
          )

          // If the price has not changed, we don't need to update it
          if (
            originalPrice &&
            originalPrice.amount === castNumber(currencyPrice.amount)
          ) {
            continue
          }

          pricesToUpdate.push({
            id: currencyPrice.id,
            amount: castNumber(currencyPrice.amount),
            currency_code: currencyCode,
            variant_id: variantId,
          })

          continue
        }

        if (currencyPrice.id && !currencyPrice.amount) {
          pricesToDelete.push(currencyPrice.id)
          continue
        }

        if (!currencyPrice.id && currencyPrice.amount) {
          pricesToCreate.push({
            amount: castNumber(currencyPrice.amount),
            currency_code: currencyCode,
            variant_id: variantId,
          })
          continue
        }
      }
    }
  }
  return { pricesToDelete, pricesToCreate, pricesToUpdate }
}
