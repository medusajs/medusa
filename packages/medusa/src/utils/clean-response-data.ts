import { pick } from "lodash"

// TODO: once the legacy totals decoration will be removed.
// We will be able to only compute the totals if one of the total fields is present
// and therefore avoid totals computation if the user don't want them to appear in the response
// and therefore the below const will be removed
const EXCLUDED_FIELDS = [
  "shipping_total",
  "discount_total",
  "tax_total",
  "refunded_total",
  "total",
  "subtotal",
  "paid_total",
  "refundable_amount",
  "gift_card_total",
  "gift_card_tax_total",
  "item_tax_total",
  "shipping_tax_total",
  "refundable",
  "original_total",
  "original_tax_total",
]

/**
 * Filter response data to contain props specified in the `storeAllowedProperties` or `adminAllowedProperties`.
 * You can read more in the transformQuery middleware utility methods.
 *
 * @param data - record or an array of records in the response
 * @param fields - record props allowed in the response
 */
function cleanResponseData<T extends unknown | unknown[]>(
  data: T,
  fields: string[]
): T extends [] ? Partial<T>[] : Partial<T> {
  if (!fields.length) {
    return data as T extends [] ? Partial<T>[] : Partial<T>
  }

  const isDataArray = Array.isArray(data)
  const fieldsSet = new Set([...fields, ...EXCLUDED_FIELDS])

  fields = [...fieldsSet]

  let arrayData: Partial<T>[] = isDataArray ? data : [data]
  arrayData = arrayData.map((record) => pick(record, fields))

  return (isDataArray ? arrayData : arrayData[0]) as T extends []
    ? Partial<T>[]
    : Partial<T>
}

export { cleanResponseData }
