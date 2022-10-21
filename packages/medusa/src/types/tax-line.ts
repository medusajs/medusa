import { TaxLine } from "../models/tax-line"

export function isTaxLine(object: any): object is TaxLine {
  return object.object === "tax-line"
}
