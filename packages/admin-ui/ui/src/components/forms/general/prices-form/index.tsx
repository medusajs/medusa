import { useAdminRegions, useAdminStore } from "medusa-react"
import { useEffect, useMemo } from "react"
import { FieldArrayWithId, useFieldArray } from "react-hook-form"
import { NestedForm } from "../../../../utils/nested-form"
import NestedPrice from "./nested-price"

type PricePayload = {
  id: string | null
  amount: number | null
  currency_code: string
  region_id: string | null
  includes_tax?: boolean
}

type PriceObject = FieldArrayWithId<
  {
    __nested__: PricesFormType
  },
  "__nested__.prices",
  "id"
> & { index: number }

export type PricesFormType = {
  prices: PricePayload[]
}

export type NestedPriceObject = {
  currencyPrice: PriceObject
  regionPrices: (PriceObject & { regionName: string })[]
}

type Props = {
  form: NestedForm<PricesFormType>
  required?: boolean
}

/**
 * Re-usable nested form used to submit pricing information for products and their variants.
 * Fetches store currencies and regions from the backend, and allows the user to specifcy both
 * currency and region specific prices.
 * @example
 * <Pricing form={nestedForm(form, "prices")} />
 */
const PricesForm = ({ form }: Props) => {
  const { store } = useAdminStore()
  const { regions } = useAdminRegions()

  const { control, path } = form

  const { append, update, fields } = useFieldArray({
    control,
    name: path("prices"),
  })

  useEffect(() => {
    if (!regions || !store || !fields) {
      return
    }

    regions.forEach((reg) => {
      if (!fields.some((field) => field.region_id === reg.id)) {
        append({
          id: null,
          region_id: reg.id,
          amount: null,
          currency_code: reg.currency_code,
          includes_tax: reg.includes_tax,
        })
      }
    })

    store.currencies.forEach((cur) => {
      if (!fields.some((field) => field.currency_code === cur.code)) {
        append({
          id: null,
          currency_code: cur.code,
          amount: null,
          region_id: null,
          includes_tax: cur.includes_tax,
        })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions, store, fields])

  // Ensure that prices are up to date with their respective tax inclusion setting
  useEffect(() => {
    if (!regions || !fields || !store) {
      return
    }

    regions.forEach((reg) => {
      const regionPrice = fields.findIndex(
        (field) => !!field && field.region_id === reg.id
      )

      if (
        regionPrice !== -1 &&
        fields[regionPrice].includes_tax !== reg.includes_tax
      ) {
        update(regionPrice, {
          ...fields[regionPrice],
          includes_tax: reg.includes_tax,
        })
      }
    })

    store.currencies.forEach((cur) => {
      const currencyPrice = fields.findIndex(
        (field) =>
          !!field && !field.region_id && field.currency_code === cur.code
      )

      if (
        currencyPrice !== -1 &&
        fields[currencyPrice].includes_tax !== cur.includes_tax
      ) {
        update(currencyPrice, {
          ...fields[currencyPrice],
          includes_tax: cur.includes_tax,
        })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions, store])

  const priceObj = useMemo(() => {
    const obj: Record<string, NestedPriceObject> = {}

    const currencyPrices = fields.filter((field) => field.region_id === null)
    const regionPrices = fields.filter((field) => field.region_id !== null)

    currencyPrices.forEach((price) => {
      obj[price.currency_code!] = {
        currencyPrice: {
          ...price,
          index: fields.indexOf(price),
        },
        regionPrices: regionPrices
          .filter(
            (regionPrice) => regionPrice.currency_code === price.currency_code
          )
          .map((rp) => ({
            ...rp,
            regionName: regions?.find((r) => r.id === rp.region_id)?.name || "",
            index: fields.indexOf(rp),
          })),
      }
    })

    return obj
  }, [fields, regions])

  return (
    <div>
      <div>
        {Object.values(priceObj).map((po) => {
          return (
            <NestedPrice
              form={form}
              nestedPrice={po}
              key={po.currencyPrice.id}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PricesForm
