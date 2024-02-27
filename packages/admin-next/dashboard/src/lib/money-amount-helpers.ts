import { currencies } from "./currencies"

export const getPresentationalAmount = (amount: number, currency: string) => {
  const decimalDigits = currencies[currency.toUpperCase()].decimal_digits

  if (decimalDigits === 0) {
    throw new Error("Currency has no decimal digits")
  }

  return amount / 10 ** decimalDigits
}

export const getDbAmount = (amount: number, currency: string) => {
  const decimalDigits = currencies[currency.toUpperCase()].decimal_digits

  if (decimalDigits === 0) {
    throw new Error("Currency has no decimal digits")
  }

  return amount * 10 ** decimalDigits
}
