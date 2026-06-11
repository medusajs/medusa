export type Currency = {
  symbol: string
  name: string
  symbol_native: string
  decimal_digits: number
  rounding: number
  code: string
  name_plural: string
}

export const defaultCurrencies: Record<string, Currency> = {
  // ... existing currencies ...
  ZWL: {
    symbol: "ZWL$",
    name: "Zimbabwean Dollar",
    symbol_native: "ZWL$",
    decimal_digits: 2,
    rounding: 0,
    code: "ZWL",
    name_plural: "Zimbabwean dollars",
  },
  GMD: {
    code: "GMD",
    name: "Gambian Dalasi",
    symbol: "D",
    symbol_native: "D",
    decimal_digits: 2,
    rounding: 0,
    name_plural: "Gambian Dalasis",
  },
}