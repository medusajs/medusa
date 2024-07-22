import { BigNumberInput, BigNumberRawValue, IBigNumber } from "@medusajs/types"
import { BigNumber as BigNumberJS } from "bignumber.js"
import { isBigNumber, isString } from "../common"

export class BigNumber implements IBigNumber {
  static DEFAULT_PRECISION = 20

  private numeric_: number
  private raw_?: BigNumberRawValue
  private bignumber_?: BigNumberJS

  constructor(
    rawValue: BigNumberInput | BigNumber,
    options?: { precision?: number }
  ) {
    this.setRawValueOrThrow(rawValue, options)
  }

  setRawValueOrThrow(
    rawValue: BigNumberInput | BigNumber,
    { precision }: { precision?: number } = {}
  ) {
    precision ??= BigNumber.DEFAULT_PRECISION

    if (rawValue instanceof BigNumber) {
      Object.assign(this, rawValue)
    } else if (BigNumberJS.isBigNumber(rawValue)) {
      /**
       * Example:
       *  const bnUnitValue = new BigNumberJS("10.99")
       *  const unitValue = new BigNumber(bnUnitValue)
       */
      this.numeric_ = rawValue.toNumber()
      this.raw_ = {
        value: rawValue.toPrecision(precision),
        precision,
      }
      this.bignumber_ = rawValue
    } else if (isString(rawValue)) {
      /**
       * Example: const unitValue = "1234.1234"
       */
      const bigNum = new BigNumberJS(rawValue)

      this.numeric_ = bigNum.toNumber()
      this.raw_ = this.raw_ = {
        value: bigNum.toPrecision(precision),
        precision,
      }
      this.bignumber_ = bigNum
    } else if (isBigNumber(rawValue)) {
      /**
       * Example: const unitValue = { value: "1234.1234" }
       */
      const definedPrecision = rawValue.precision ?? precision
      const bigNum = new BigNumberJS(rawValue.value)
      this.numeric_ = bigNum.toNumber()
      this.raw_ = {
        ...rawValue,
        precision: definedPrecision,
      }
      this.bignumber_ = bigNum
    } else if (typeof rawValue === `number` && !Number.isNaN(rawValue)) {
      /**
       * Example: const unitValue = 1234
       */
      this.numeric_ = rawValue as number

      const bigNum = new BigNumberJS(rawValue as number)
      this.raw_ = {
        value: bigNum.toPrecision(precision),
        precision,
      }
      this.bignumber_ = bigNum
    } else {
      throw new Error(
        `Invalid BigNumber value: ${rawValue}. Should be one of: string, number, BigNumber (bignumber.js), BigNumberRawValue`
      )
    }
  }

  get numeric(): number {
    let raw = this.raw_ as BigNumberRawValue
    if (raw) {
      return new BigNumberJS(raw.value).toNumber()
    } else {
      return this.numeric_
    }
  }

  set numeric(value: BigNumberInput) {
    const newValue = new BigNumber(value)
    this.numeric_ = newValue.numeric_
    this.raw_ = newValue.raw_
    this.bignumber_ = newValue.bignumber_
  }

  get raw(): BigNumberRawValue | undefined {
    return this.raw_
  }

  get bigNumber(): BigNumberJS | undefined {
    return this.bignumber_
  }

  set raw(rawValue: BigNumberInput) {
    const newValue = new BigNumber(rawValue)
    this.numeric_ = newValue.numeric_
    this.raw_ = newValue.raw_
    this.bignumber_ = newValue.bignumber_
  }

  toJSON(): number {
    return this.bignumber_
      ? this.bignumber_?.toNumber()
      : this.raw_
      ? new BigNumberJS(this.raw_.value).toNumber()
      : this.numeric_
  }

  valueOf(): number {
    return this.numeric_
  }
}
