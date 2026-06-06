import { BigNumberRawValue } from "@zjedene-medusa/types"
import { isObject } from "./is-object"

export function isBigNumber(obj: any): obj is BigNumberRawValue {
  return isObject(obj) && "value" in obj
}
