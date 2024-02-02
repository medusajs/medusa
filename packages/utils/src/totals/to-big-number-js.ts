import { BigNumber as BigNumberJs } from "bignumber.js"
import { isDefined } from "../common"
import { BigNumber } from "./big-number"

type InputEntity<T, V extends string> = { [key in V]?: InputEntityField }
type InputEntityField = number | string | BigNumber
type Output<V extends string> = { [key in V]: BigNumberJs }

export function toBigNumberJs<T, V extends string>(
  entity: InputEntity<T, V>,
  fields: V[]
): Output<V> {
  return fields.reduce((acc, field: string) => {
    if (isDefined(entity[field])) {
      const entityField = entity[field]

      const val = "raw" in entityField ? entityField.raw.value : entityField
      acc[field] = new BigNumberJs(val)
    } else {
      acc[field] = new BigNumberJs(0)
    }
    return acc
  }, {} as Output<V>)
}
