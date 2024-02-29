import { BigNumberInput, BigNumberRawValue } from "@medusajs/types"
import { BigNumber as BigNumberJS } from "bignumber.js"
import { isBigNumber, isString } from "../common"

export class BigNumber {
  static DEFAULT_PRECISION = 20

  private numeric_: number
  private raw_?: BigNumberRawValue

  constructor(rawValue: BigNumberInput, options?: { precision?: number }) {
    this.setRawValueOrThrow(rawValue, options)
  }

  setRawValueOrThrow(
    rawValue: BigNumberInput,
    { precision }: { precision?: number } = {}
  ) {
    precision ??= BigNumber.DEFAULT_PRECISION

    if (BigNumberJS.isBigNumber(rawValue)) {
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
    } else if (isBigNumber(rawValue)) {
      /**
       * Example: const unitValue = { value: "1234.1234" }
       */
      const definedPrecision = rawValue.precision ?? precision
      this.numeric_ = BigNumberJS(rawValue.value).toNumber()
      this.raw_ = {
        ...rawValue,
        precision: definedPrecision,
      }
    } else if (typeof rawValue === `number` && !Number.isNaN(rawValue)) {
      /**
       * Example: const unitValue = 1234
       */
      this.numeric_ = rawValue as number

      this.raw_ = {
        value: BigNumberJS(rawValue as number).toPrecision(precision),
        precision,
      }
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
  }

  get raw(): BigNumberRawValue | undefined {
    return this.raw_
  }

  set raw(rawValue: BigNumberInput) {
    const newValue = new BigNumber(rawValue)
    this.numeric_ = newValue.numeric_
    this.raw_ = newValue.raw_
  }

  toJSON() {
    return this.raw_
      ? new BigNumberJS(this.raw_.value).toNumber()
      : this.numeric_
  }

  valueOf() {
    return this.raw_
      ? new BigNumberJS(this.raw_.value).toNumber()
      : this.numeric_
  }
}
