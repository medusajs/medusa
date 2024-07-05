import { BigNumberRawValue } from "@medusajs/types"
import { isObject } from "./is-object"

export function isBigNumber(obj: any): obj is BigNumberRawValue {
  return isObject(obj) && "value" in obj
}
