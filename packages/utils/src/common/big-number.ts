import { BigNumber as BigNumberJS } from "bignumber.js"
import { isObject } from "./is-object"
import { isString } from "./is-string"

export type BigNumberRawValue = {
  value: string
  precision: number
  multiplier?: number
  [key: string]: unknown
}

export class BigNumber {
  static DEFAUT_PRECISION = 20

  private numeric_: number
  private raw_?: BigNumberRawValue

  constructor(
    rawPrice: BigNumberRawValue | number | string | BigNumberJS,
    precision: number = BigNumber.DEFAUT_PRECISION,
    extraProperties: Record<string, unknown> = {}
  ) {
    if (BigNumberJS.isBigNumber(rawPrice)) {
      this.numeric_ = rawPrice.toNumber()
      this.raw_ = {
        ...extraProperties,
        value: rawPrice.toPrecision(precision),
        precision,
      }
    } else if (isString(rawPrice)) {
      const bigNum = new BigNumberJS(rawPrice)

      this.numeric_ = bigNum.toNumber()
      this.raw_ = this.raw_ = {
        ...extraProperties,
        value: bigNum.toPrecision(precision),
        precision,
      }
    } else if (isObject(rawPrice)) {
      extraProperties.precision ??= precision

      this.numeric_ = BigNumberJS(rawPrice.value).toNumber()
      this.raw_ = {
        ...rawPrice,
        ...extraProperties,
      }
    } else if (!Number.isNaN(+rawPrice)) {
      this.numeric_ = rawPrice as number
      this.raw_ = {
        ...extraProperties,
        value: BigNumberJS(rawPrice as number).toString(),
        precision,
      }
    } else {
      throw new Error("Invalid BigNumber value")
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

  set numeric(value: BigNumberRawValue | number | string | BigNumberJS) {
    const newValue = new BigNumber(value)
    this.numeric_ = newValue.numeric_
    this.raw_ = newValue.raw_
  }

  get raw(): BigNumberRawValue | undefined {
    return this.raw_
  }

  set raw(rawValue: BigNumberRawValue | number | string | BigNumberJS) {
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
