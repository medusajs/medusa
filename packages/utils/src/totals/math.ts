import { BigNumberInput, BigNumberRawValue } from "@medusajs/types"
import { BigNumber as BigNumberJS } from "bignumber.js"
import { isDefined } from "../common"
import { BigNumber } from "./big-number"

type BNInput = BigNumberInput | BigNumber
export class MathBN {
  static convert(num: BNInput): BigNumberJS {
    if (num == null) {
      return new BigNumberJS(0)
    }

    if (num instanceof BigNumber) {
      return num.bigNumber!
    } else if (num instanceof BigNumberJS) {
      return num
    } else if (isDefined((num as BigNumberRawValue)?.value)) {
      return new BigNumberJS((num as BigNumberRawValue).value)
    }

    return new BigNumberJS(num as BigNumberJS | number)
  }

  static add(...nums: BNInput[]): BigNumberJS {
    let sum = new BigNumberJS(0)
    for (const num of nums) {
      const n = MathBN.convert(num)
      sum = sum.plus(n)
    }
    return sum
  }

  static sum(...nums: BNInput[]): BigNumberJS {
    return MathBN.add(0, ...(nums ?? [0]))
  }

  static sub(...nums: BNInput[]): BigNumberJS {
    let agg = MathBN.convert(nums[0])
    for (let i = 1; i < nums.length; i++) {
      const n = MathBN.convert(nums[i])
      agg = agg.minus(n)
    }
    return agg
  }

  static mult(n1: BNInput, n2: BNInput): BigNumberJS {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.times(num2)
  }

  static div(n1: BNInput, n2: BNInput): BigNumberJS {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.dividedBy(num2)
  }

  static abs(n: BNInput): BigNumberJS {
    const num = MathBN.convert(n)
    return num.absoluteValue()
  }

  static mod(n1: BNInput, n2: BNInput): BigNumberJS {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.modulo(num2)
  }

  static exp(n: BNInput, exp = 2): BigNumberJS {
    const num = MathBN.convert(n)
    const expBy = MathBN.convert(exp)
    return num.exponentiatedBy(expBy)
  }

  static min(...nums: BNInput[]): BigNumberJS {
    return BigNumberJS.minimum(...nums.map((num) => MathBN.convert(num)))
  }

  static max(...nums: BNInput[]): BigNumberJS {
    return BigNumberJS.maximum(...nums.map((num) => MathBN.convert(num)))
  }

  static gt(n1: BNInput, n2: BNInput): boolean {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.isGreaterThan(num2)
  }

  static gte(n1: BNInput, n2: BNInput): boolean {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.isGreaterThanOrEqualTo(num2)
  }

  static lt(n1: BNInput, n2: BNInput): boolean {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.isLessThan(num2)
  }

  static lte(n1: BNInput, n2: BNInput): boolean {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.isLessThanOrEqualTo(num2)
  }

  static eq(n1: BNInput, n2: BNInput): boolean {
    const num1 = MathBN.convert(n1)
    const num2 = MathBN.convert(n2)
    return num1.isEqualTo(num2)
  }
}
