/**
 * Pick keys for a new object by regex.
 * @param data - Initial data object
 * @param regex - A regex used to pick which keys are going to be copied in the new object
 */
import { TParsedRowData } from "./types"

export function pickObjectPropsByRegex(
  data: TParsedRowData,
  regex: RegExp
): TParsedRowData {
  const variantKeyPredicate = (key: string): boolean => regex.test(key)
  const ret = {}

  for (const k in data) {
    if (variantKeyPredicate(k)) {
      ret[k] = data[k]
    }
  }

  return ret
}

/**
 * Pick data from parsed CSV object relevant for product create/update and remove prefixes from keys.
 */
export function transformProductData(data: TParsedRowData): TParsedRowData {
  const ret = {}
  const productData = pickObjectPropsByRegex(data, /product\./)

  Object.keys(productData).forEach((k) => {
    const key = k.split("product.")[1]
    ret[key] = productData[k]
  })

  return ret
}

/**
 * Pick data from parsed CSV object relevant for variant create/update and remove prefixes from keys.
 */
export function transformVariantData(data: TParsedRowData): TParsedRowData {
  const ret = {}
  const productData = pickObjectPropsByRegex(data, /variant\./)

  Object.keys(productData).forEach((k) => {
    const key = k.split("variant.")[1]
    ret[key] = productData[k]
  })

  // include product handle to keep track of associated product
  ret["product.handle"] = data["product.handle"]
  ret["product.options"] = data["product.options"]

  return ret
}
