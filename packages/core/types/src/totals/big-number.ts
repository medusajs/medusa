import BigNumberJS from "bignumber.js"

export interface IBigNumber {
  numeric: number
  raw?: BigNumberRawValue
  bigNumber?: BigNumberJS

  toJSON(): number
  valueOf(): number
}

export type BigNumberRawValue = {
  value: string | number
  [key: string]: unknown
}

export type BigNumberInput =
  | BigNumberRawValue
  | number
  | string
  | BigNumberJS
  | IBigNumber

export type BigNumberValue = BigNumberJS | number | string | IBigNumber
