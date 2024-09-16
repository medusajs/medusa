import linkedModels from "virtual:medusa/custom-fields/product/$link"
import { appendLinkableFields } from "../../../extensions/links/utils"

export function getExtendedProductFields(fields?: string) {
  return appendLinkableFields(fields, linkedModels.links)
}
