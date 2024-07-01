import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"

import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals/index"
import { useRegions } from "../../../../../hooks/api/regions"
import { useUpdateShippingOptions } from "../../../../../hooks/api/shipping-options"
import { useStore } from "../../../../../hooks/api/store"
import { castNumber } from "../../../../../lib/cast-number"
import { useShippingOptionPriceColumns } from "../../../common/hooks/use-shipping-option-price-columns"

const getInitialCurrencyPrices = (
  prices: HttpTypes.AdminShippingOptionPrice[]
) => {
  const ret: Record<string, number> = {}
  prices.forEach((p) => {
    if (p.price_rules!.length) {
      // this is a region price
      return
    }
    ret[p.currency_code!] = p.amount
  })
  return ret
}

const getInitialRegionPrices = (
  prices: HttpTypes.AdminShippingOptionPrice[]
) => {
  const ret: Record<string, number> = {}
  prices.forEach((p) => {
    if (p.price_rules!.length) {
      const regionId = p.price_rules![0].value
      ret[regionId] = p.amount
    }
  })

  return ret
}

type PriceRecord = {
  id?: string
  currency_code?: string
  region_id?: string
  amount: number
}

const EditShippingOptionPricingSchema = zod.object({
  region_prices: zod.record(
    zod.string(),
    zod.string().or(zod.number()).optional()
  ),
  currency_prices: zod.record(
    zod.string(),
    zod.string().or(zod.number()).optional()
  ),
})

type EditShippingOptionPricingFormProps = {
  shippingOption: HttpTypes.AdminShippingOption
}

export function EditShippingOptionsPricingForm({
  shippingOption,
}: EditShippingOptionPricingFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditShippingOptionPricingSchema>>({
    defaultValues: {
      region_prices: getInitialRegionPrices(shippingOption.prices),
      currency_prices: getInitialCurrencyPrices(shippingOption.prices),
    },
    resolver: zodResolver(EditShippingOptionPricingSchema),
  })

  const { mutateAsync, isPending: isLoading } = useUpdateShippingOptions(
    shippingOption.id
  )

  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const currencies = useMemo(
    () => store?.supported_currencies?.map((c) => c.currency_code) || [],
    [store]
  )

  const {
    regions,
    isLoading: isRegionsLoading,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({
    fields: "id,name,currency_code",
    limit: 999,
  })

  const columns = useShippingOptionPriceColumns({
    currencies,
    regions,
  })

  const data = useMemo(
    () => [[...(currencies || []), ...(regions || [])]],
    [currencies, regions]
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    const currencyPrices = Object.entries(data.currency_prices)
      .map(([code, value]) => {
        if (value === "" || value === undefined) {
          return undefined
        }

        const amount = castNumber(value)

        const priceRecord: PriceRecord = {
          currency_code: code,
          amount: amount,
        }

        const price = shippingOption.prices.find(
          (p) => p.currency_code === code && !p.price_rules!.length
        )

        // if that currency price is already defined for the SO, we will do an update
        if (price) {
          priceRecord["id"] = price.id
        }

        return priceRecord
      })
      .filter((p) => !!p) as PriceRecord[]

    const regionPrices = Object.entries(data.region_prices)
      .map(([region_id, value]) => {
        if (value === "" || value === undefined) {
          return undefined
        }

        const amount = castNumber(value)

        const priceRecord: PriceRecord = {
          region_id,
          amount: amount,
        }

        /**
         * HACK - when trying to update prices which already have a region price
         * we get error: `Price rule with price_id: , rule_type_id:  already exist`,
         * so for now, we recreate region prices.
         */

        // const price = shippingOption.prices.find(
        //   (p) => p.price_rules?.[0]?.value === region_id
        // )

        // if (price) {
        //   priceRecord["id"] = price.id
        // }

        return priceRecord
      })
      .filter((p) => !!p) as PriceRecord[]

    await mutateAsync(
      {
        prices: [...currencyPrices, ...regionPrices],
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            dismissLabel: t("general.close"),
          })
          handleSuccess()
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("general.close"),
          })
        },
      }
    )
  })

  const initializing =
    isStoreLoading || isRegionsLoading || !currencies || !regions

  if (isStoreError) {
    throw storeError
  }

  if (isRegionsError) {
    throw regionsError
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              className="whitespace-nowrap"
              isLoading={isLoading}
              onClick={handleSubmit}
              type="button"
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body>
          <div className="flex size-full flex-col divide-y overflow-hidden">
            <DataGridRoot data={data} columns={columns} state={form} />
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
