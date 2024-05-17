import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useMemo, useState } from "react"
import * as zod from "zod"

import { Button, toast } from "@medusajs/ui"
import {
  CurrencyDTO,
  PriceDTO,
  ProductVariantDTO,
  RegionDTO,
  ShippingOptionDTO,
} from "@medusajs/types"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import {
  getDbAmount,
  getPresentationalAmount,
} from "../../../../../lib/money-amount-helpers"
import { useRegions } from "../../../../../hooks/api/regions"
import { useStore } from "../../../../../hooks/api/store.tsx"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ExtendedProductDTO } from "../../../../../types/api-responses"
import { CurrencyCell } from "../../../../../components/grid/grid-cells/common/currency-cell"
import { DataGridMeta } from "../../../../../components/grid/types"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { useUpdateShippingOptions } from "../../../../../hooks/api/shipping-options.ts"

const getInitialCurrencyPrices = (prices: PriceDTO[]) => {
  const ret: Record<string, number> = {}
  prices.forEach((p) => {
    if (p.price_rules!.length) {
      // this is a region price
      return
    }
    ret[p.currency_code!] = getPresentationalAmount(
      p.amount as number,
      p.currency_code!
    )
  })
  return ret
}

const getInitialRegionPrices = (prices: PriceDTO[]) => {
  const ret: Record<string, number> = {}
  prices.forEach((p) => {
    if (p.price_rules!.length) {
      const regionId = p.price_rules![0].value
      ret[regionId] = getPresentationalAmount(
        p.amount as number,
        p.currency_code!
      )
    }
  })

  return ret
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

enum ColumnType {
  REGION = "region",
  CURRENCY = "currency",
}

type EnabledColumnRecord = Record<string, ColumnType>

type EditShippingOptionPricingFormProps = {
  shippingOption: ShippingOptionDTO & { prices: PriceDTO[] }
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

  const { regions } = useRegions()

  const { store, isLoading: isStoreLoading } = useStore()

  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies(
    {
      code: store?.supported_currency_codes,
    },
    {
      enabled: !!store,
    }
  )

  const [enabledColumns, setEnabledColumns] = useState<EnabledColumnRecord>({})

  useEffect(() => {
    if (
      store?.default_currency_code &&
      Object.keys(enabledColumns).length === 0
    ) {
      setEnabledColumns({
        ...enabledColumns,
        [store.default_currency_code]: ColumnType.CURRENCY,
      })
    }
  }, [store, enabledColumns])

  const columns = useColumns({
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
        if (value === "") {
          return undefined
        }

        const amount = getDbAmount(Number(value), code)

        const priceRecord = {
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
      .filter((p) => !!p)

    const regionsMap = new Map(regions.map((r) => [r.id, r.currency_code]))

    const regionPrices = Object.entries(data.region_prices)
      .map(([region_id, value]) => {
        if (value === "") {
          return undefined
        }

        const code = regionsMap.get(region_id)!

        const amount = getDbAmount(Number(value), code)

        const priceRecord = {
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
        //
        // if (price) {
        //   priceRecord["id"] = price.id
        // }

        return priceRecord
      })
      .filter((p) => !!p)

    try {
      await mutateAsync({
        prices: [...currencyPrices, ...regionPrices],
      })
      toast.error(t("general.success"), {
        dismissLabel: t("general.close"),
      })
      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("general.close"),
      })
    }
  })

  const initializing =
    isStoreLoading || isCurrenciesLoading || !store || !currencies

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

        <RouteFocusModal.Body className="flex h-full w-fit overflow-auto">
          <div
            style={{ width: "100vw" }}
            className="flex size-full flex-col divide-y"
          >
            <DataGrid
              columns={columns}
              data={data}
              isLoading={initializing}
              state={form}
            />
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<
  ExtendedProductDTO | ProductVariantDTO
>()

const useColumns = ({
  currencies = [],
  regions = [],
}: {
  currencies?: CurrencyDTO[]
  regions?: RegionDTO[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<ExtendedProductDTO | ProductVariantDTO>[] =
    useMemo(() => {
      return [
        ...currencies.map((currency) => {
          return columnHelper.display({
            header: t("fields.priceTemplate", {
              regionOrCountry: currency.code.toUpperCase(),
            }),
            cell: ({ row, table }) => {
              return (
                <CurrencyCell
                  currency={currency}
                  meta={table.options.meta as DataGridMeta<any>}
                  field={`currency_prices.${currency.code}`}
                />
              )
            },
          })
        }),
        ...regions.map((region) => {
          return columnHelper.display({
            header: t("fields.priceTemplate", {
              regionOrCountry: region.name,
            }),
            cell: ({ row, table }) => {
              return (
                <CurrencyCell
                  currency={currencies.find(
                    (c) => c.code === region.currency_code
                  )}
                  meta={table.options.meta as DataGridMeta<any>}
                  field={`region_prices.${region.id}`}
                />
              )
            },
          })
        }),
      ]
    }, [t, currencies, regions])

  return colDefs
}
