import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  const isINR = currency_code.toLowerCase() === "inr"
  const targetLocale = isINR ? "en-IN" : locale

  return new Intl.NumberFormat(targetLocale, {
    style: "currency",
    currency: currency_code.toUpperCase(),
    minimumFractionDigits: isINR && Number.isInteger(amount) ? 0 : minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}
