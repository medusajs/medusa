import BigNumberJS from "bignumber.js"

export type BigNumberRawValue = {
  value: string | number
  [key: string]: unknown
}

export type BigNumberInput = BigNumberRawValue | number | string | BigNumberJS

export type BigNumberValue = BigNumberJS | number | string
