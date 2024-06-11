import {
  CreatePriceListPriceDTO,
  PriceListDTO,
  UpdatePriceListPriceDTO,
  HttpTypes,
} from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { UseFormReturn, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { DataGrid } from "../../../../../components/grid/data-grid"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import {
  usePriceListAddPrices,
  usePriceListRemovePrices,
  useUpdatePriceList,
} from "../../../../../hooks/api/price-lists"
import { useStore } from "../../../../../hooks/api/store"
import { castNumber } from "../../../../../lib/cast-number"
import { usePriceListGridColumns } from "../../../common/hooks/use-price-list-grid-columns"
import {
  PricingProductsRecordSchema,
  PricingVariantsRecordType,
} from "../../../common/schemas"
import { isProductRow } from "../../../common/utils"

type PricingProductPricesFormProps = {
  priceList: PriceListDTO
  products: HttpTypes.AdminProduct[]
}

const PricingProductPricesSchema = z.object({
  products: PricingProductsRecordSchema,
})

type VariantsPriceRecord = Record<
  string,
  { currency_code: string; amount: number; id: string }[]
>

const initRecord = (priceList: PriceListDTO): VariantsPriceRecord => {
  const prices = priceList.prices
  const sortedPrices: VariantsPriceRecord = {}

  if (!prices) {
    return sortedPrices
  }

  prices.forEach((price) => {
    // @ts-ignore - Type is wrong
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

  const {
    currencies,
    isLoading: isCurrenciesLoading,
    isError: isCurrencyError,
    error: currencyError,
  } = useCurrencies(
    {
      code: store?.supported_currency_codes,
    },
    {
      enabled: !!store,
    }
  )
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

  const { mutateAsync: updateAsync, isPending: isUpdatePending } =
    useUpdatePriceList(priceList.id)

  const { mutateAsync: deleteAsync, isPending: isDeletePending } =
    usePriceListRemovePrices(priceList.id)

  const { mutateAsync: addAsync, isPending: isAddPending } =
    usePriceListAddPrices(priceList.id)

  const isPending = isUpdatePending || isDeletePending || isAddPending

  const handleSubmit = form.handleSubmit(async (values) => {
    const { products } = values

    const { pricesToDelete, pricesToCreate, pricesToUpdate } = sortPrices(
      products,
      record
    )

    let failed = false

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

    if (pricesToDelete.length) {
      await deleteAsync(
        {
          ids: pricesToDelete,
        },
        {
          onError(error) {
            console.error(error)
            failed = true
          },
        }
      )
    }

    if (failed) {
      return
    }

    if (pricesToCreate.length) {
      await addAsync(
        {
          // @ts-expect-error - type is wrong
          prices: pricesToCreate,
        },
        {
          onError(error) {
            console.error(error)
            failed = true
          },
        }
      )
    }

    if (failed) {
      return
    }

    handleSuccess()
  })

  const columns = usePriceListGridColumns({ currencies })

  const initializing =
    isStoreLoading || isCurrenciesLoading || !products || !store || !currencies

  if (isStoreError) {
    throw storeError
  }

  if (isCurrencyError) {
    throw currencyError
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
          <DataGrid
            columns={columns}
            data={products}
            getSubRows={(row) => {
              if (isProductRow(row)) {
                return row.variants
              }
            }}
            isLoading={initializing}
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
        }, {} as PricingVariantsRecordType),
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
  const pricesToUpdate: UpdatePriceListPriceDTO[] = []
  const pricesToCreate: CreatePriceListPriceDTO[] = []
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
            // @ts-expect-error type is wrong
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
            // @ts-expect-error type is wrong
            variant_id: variantId,
          })
          continue
        }
      }
    }
  }
  return { pricesToDelete, pricesToCreate, pricesToUpdate }
}
