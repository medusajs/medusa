import { BigNumberRawPriceInput } from "@medusajs/types"
import { BigNumber as BigNumberJs } from "bignumber.js"
import { isDefined, toCamelCase } from "../common"
import { BigNumber } from "./big-number"

type InputEntity<T, V extends string> = { [key in V]?: InputEntityField }
type InputEntityField = number | string | BigNumber

type Camelize<V extends string> = V extends `${infer A}_${infer B}`
  ? `${A}${Camelize<Capitalize<B>>}`
  : V

type Output<V extends string> = { [key in Camelize<V>]: BigNumberJs }

export function toBigNumberJs<T, V extends string>(
  entity: InputEntity<T, V>,
  fields: V[]
): Output<V> {
  return fields.reduce((acc, field: string) => {
    const camelCased = toCamelCase(field)
    let val: BigNumberRawPriceInput = 0

    if (isDefined(entity[field])) {
      const entityField = entity[field]
      val = (entityField?.raw?.value ?? entityField) as number | string
    }

    acc[camelCased] = new BigNumberJs(val)
    return acc
  }, {} as Output<V>)
}
