import { MedusaError, MedusaErrorTypes } from "./errors"
import { isString } from "./is-string"

/**
 * Normalizes `currencyCode` by transforming it to lowercase
 */
export function normalizeCurrencyCode(currencyCode: string) {
    if (!isString(currencyCode)) {
        throw new MedusaError(MedusaErrorTypes.INVALID_ARGUMENT, "Currency code needs to be a string")
    }

    return currencyCode.toLowerCase()
}