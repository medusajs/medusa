import { BigNumberInput, BigNumberRawValue } from "@medusajs/types"
import { BigNumber as BigNumberJS } from "bignumber.js"
import { isBigNumber, isString } from "../common"

export class BigNumber {
  static DEFAULT_PRECISION = 20

  private numeric_: number
  private raw_?: BigNumberRawValue

  constructor(rawPrice: BigNumberInput, options?: { precision?: number }) {
    this.setRawPriceOrThrow(rawPrice, options)
  }

  setRawPriceOrThrow(
    rawPrice: BigNumberInput,
    { precision }: { precision?: number } = {}
  ) {
    precision ??= BigNumber.DEFAULT_PRECISION

    if (BigNumberJS.isBigNumber(rawPrice)) {
      /**
       * Example:
       *  const bnUnitPrice = new BigNumberJS("10.99")
       *  const unitPrice = new BigNumber(bnUnitPrice)
       */
      this.numeric_ = rawPrice.toNumber()
      this.raw_ = {
        value: rawPrice.toPrecision(precision),
        precision,
      }
    } else if (isString(rawPrice)) {
      /**
       * Example: const unitPrice = "1234.1234"
       */
      const bigNum = new BigNumberJS(rawPrice)

      this.numeric_ = bigNum.toNumber()
      this.raw_ = this.raw_ = {
        value: bigNum.toPrecision(precision),
      }
    } else if (isBigNumber(rawPrice)) {
      /**
       * Example: const unitPrice = { value: "1234.1234" }
       */
      this.numeric_ = BigNumberJS(rawPrice.value).toNumber()

      this.raw_ = {
        ...rawPrice,
        precision,
      }
    } else if (typeof rawPrice === `number` && !Number.isNaN(rawPrice)) {
      /**
       * Example: const unitPrice = 1234
       */
      this.numeric_ = rawPrice as number

      this.raw_ = {
        value: BigNumberJS(rawPrice as number).toPrecision(precision),
        precision,
      }
    } else {
      throw new Error(
        "Invalid BigNumber value. Should be one of: string, number, BigNumber (bignumber.js), BigNumberRawValue"
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
